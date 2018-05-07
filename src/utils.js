// @flow

export function mapRequestInfoToUrlString(requestInfo: RequestInfo): string {
  if (requestInfo instanceof Request) {
    return requestInfo.url;
  } else if (requestInfo instanceof URL) {
    return requestInfo.href;
  } else {
    return requestInfo;
  }
}
