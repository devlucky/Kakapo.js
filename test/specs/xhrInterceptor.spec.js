import test from 'tape';
import _ from 'lodash';

import { fakeService } from '../../src/interceptors/xhrInterceptor';
import { nativeXHR } from '../../src/helpers/nativeServices';

export const xhrInterceptorSpec = () => {
  test('xhrInterceptor . constructor', (assert) => {
    const XMLHttpRequestInterceptor = fakeService({});
    const xhrInterceptor = new XMLHttpRequestInterceptor();

    const xhrInterceptorOwnProps = ['xhr', 'getHandler', 'getParams'];

    assert.ok(
      xhrInterceptorOwnProps.every(_.partial(_.has, xhrInterceptor)),
      'Defines own properties to xhrInterceptor.'
    );

    assert.ok(
      _.keysIn(new nativeXHR()).every(_.partial(_.has, xhrInterceptor)),
      'Inherits properties from native XHR object.'
    );

    assert.end();
  });
};
