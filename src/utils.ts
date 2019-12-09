export function mapRequestInfoToUrlString(requestInfo: RequestInfo): string {
  if (requestInfo instanceof Request) {
    return requestInfo.url;
  } else {
    return requestInfo;
  }
}

export const canUseWindow = typeof window !== 'undefined';