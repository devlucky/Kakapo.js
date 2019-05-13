import { KakapoResponse } from '../Response';
import { KakapoRequest } from '../Request';
import {
  Interceptor,
  InterceptorConfig,
  interceptorHelper
} from './interceptorHelper';
import { canUseWindow } from '../utils';

type ProgressEventType = keyof XMLHttpRequestEventTargetEventMap;
type ProgressEventHandler<K extends ProgressEventType> = (
    event: XMLHttpRequestEventTargetEventMap[K]
) => any;
type ProgressEventListener<K extends ProgressEventType> =
  | { handleEvent: ProgressEventHandler<K> }
  | ProgressEventHandler<K>;

const hasHandleEvent = <K extends ProgressEventType>(
  listener: ProgressEventListener<K>
): listener is { handleEvent: ProgressEventHandler<K> } =>
    'handleEvent' in listener;

if (!canUseWindow) {
  throw new Error(
    `You're trying to use XHR intercepter in non-browser environment`
  );
}

const NativeXMLHttpRequest = XMLHttpRequest;
const NativeXMLHttpRequestEventTarget = XMLHttpRequestEventTarget;

class FakeXMLHttpRequest {
    static interceptors: Interceptor[] = [];
    static use(interceptor: Interceptor): void {
      FakeXMLHttpRequest.interceptors.push(interceptor);
    }
    static shouldIntercept(method: string, url: string): boolean {
      return FakeXMLHttpRequest.interceptors.some(
        interceptor => !!interceptor.getHandler(url, method)
      );
    }

    static UNSENT = 0;
    static OPENED = 1;
    static HEADERS_RECEIVED = 2;
    static LOADING = 3;
    static DONE = 4;

    timeout: number | undefined;
    // withCredentials: boolean;
    // msCaching: string;

    _method: string | undefined;
    _url: string | undefined;

    open(
      method: string,
      url: string,
      async?: boolean,
      user?: string,
      password?: string
    ): void {
      this._method = method;
      this._url = url;
      this._readyState = FakeXMLHttpRequest.OPENED;
    }

    // responseBody: any;

    _status: number = 0;
    get status(): number {
      return this._status;
    }

    _readyState: number = FakeXMLHttpRequest.UNSENT;
    get readyState(): number {
      return this._readyState;
    }
    // responseXML: any;
    // responseURL: string;
    // statusText: string;

    _setReadyState(readyState: number): void {
      this._readyState = readyState;
      if (this.onreadystatechange) {
        this.onreadystatechange(new Event('readystatechange'));
      }
    }

    _response: any;
    get response(): any {
      return this._response;
    }

    get responseText(): string {
      return this.response;
    }

    responseType:
    | undefined
    | void
    | ''
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text';

    _requestHeaders: { [header: string]: string } = {};
    setRequestHeader(header: string, value: string): void {
      this._requestHeaders[header] = value;
    }

    _responseHeaders: { [header: string]: string } = {};
    // getAllResponseHeaders(): string;
    getResponseHeader(header: string): string {
      return this._responseHeaders[header];
    }

    send(data?: any): void {
      const { _method: method, _url: url } = this;
      const interceptors = FakeXMLHttpRequest.interceptors.filter(
        interceptor => url && method && !!interceptor.getHandler(url, method)
      );

      if (interceptors.length > 0) {
        interceptors.forEach(interceptor => {
          if (url && method) {
            const handler = interceptor.getHandler(url, method);

            if (handler) {
              const db = interceptor.getDB();
              const delay = interceptor.getDelay();

              const request = new KakapoRequest({
                params: interceptor.getParams(url, method),
                query: interceptor.getQuery(url),
                body: data,
                headers: this._requestHeaders
              });
              // Wrapping handler into a promise to add promise support for free
              const responsePromise = Promise.resolve(handler(request, db));

              responsePromise.then(result => {
                const response = KakapoResponse.wrap(result);
                if (delay) {
                  setTimeout(() => this._handleResponse(response), delay);
                } else {
                  this._handleResponse(response);
                }
              });
            }
          }
        });
      } else {
        this.nativeSend(data);
      }
    }

    _handleResponse({ code, headers, body }: KakapoResponse): void {
      const { 'content-type': contentType } = headers;

      this._status = code;
      this._responseHeaders = headers;

      if (this.responseType === 'blob') {
        if (body instanceof Blob) {
          this._response = body;
        } else {
          this._response = new Blob([body]);
        }
      } else {
        this._response = JSON.stringify(body);
      }

      this._setReadyState(FakeXMLHttpRequest.DONE);

      const loadEvent = new ProgressEvent('load');
      if (this.onload) {
        this.onload(loadEvent);
      }
      this._listeners['load'].forEach(listener => {
        if (hasHandleEvent(listener)) {
          listener.handleEvent(loadEvent);
        } else {
          listener(loadEvent);
        }
      });
    }

    // abort(): void;

    // msCachingEnabled(): boolean;
    // overrideMimeType(mime: string): void;

    _listeners: { [type in ProgressEventType]: ProgressEventListener<type>[] } = {
      abort: [],
      error: [],
      load: [],
      loadend: [],
      loadstart: [],
      progress: [],
      timeout: []
    };

    addEventListener<K extends ProgressEventType>(
      type: ProgressEventType,
      listener: ProgressEventListener<K>
    ): void {
      this._listeners[type].push(listener);
    }

    removeEventListener<K extends ProgressEventType>(
      type: ProgressEventType,
      listener: ProgressEventListener<K>
    ): void {
      const index = this._listeners[type].indexOf(listener);
      if (index >= 0) {
        this._listeners[type].splice(index, 1);
      }
    }

    upload: XMLHttpRequestEventTarget = new (window as any).XMLHttpRequestEventTarget();

    onabort: ProgressEventHandler<'abort'> | undefined;
    onerror: ProgressEventHandler<'error'> | undefined;
    onload: ProgressEventHandler<'load'> | undefined;
    onloadend: ProgressEventHandler<'loadend'> | undefined;
    onloadstart: ProgressEventHandler<'loadstart'> | undefined;
    onprogress: ProgressEventHandler<'progress'> | undefined;
    ontimeout: ProgressEventHandler<'timeout'> | undefined;

    onreadystatechange: ((ev: Event) => any) | undefined;

    nativeSend(data?: any): void {
      const request = new NativeXMLHttpRequest();

      if (this.timeout) {
        request.timeout = this.timeout;
      }
      request.onload = () => {
        const headers = request
          .getAllResponseHeaders()
          .split('\r\n')
          .reduce((previous, current) => {
            const [header, value] = current.split(': ');
            return {
              ...previous,
              [header]: value
            };
          }, {});
        const response = new KakapoResponse(
          request.status,
          request.response,
          headers
        );
        this._handleResponse(response);
      };

      if (this._method && this._url) {
        request.open(this._method, this._url);
        request.send(data);
      }
    }
}

interface AddEventListenerOptions {
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
}

class FakeXMLHttpRequestEventTarget {
  addEventListener(
    type: string,
    listener: Function,
    useCaptureOrOptions: boolean | AddEventListenerOptions = false
  ) {
    // do nothing for now
  }
}

export const enable = (config: InterceptorConfig) => {
  const interceptor = interceptorHelper(config);
  FakeXMLHttpRequest.use(interceptor);
  (window as any).XMLHttpRequest = FakeXMLHttpRequest;
  (window as any).XMLHttpRequestEventTarget = FakeXMLHttpRequestEventTarget;
};
export const disable = () => {
  (window as any).XMLHttpRequest = NativeXMLHttpRequest;
  (window as any).XMLHttpRequestEventTarget = NativeXMLHttpRequestEventTarget;
};
