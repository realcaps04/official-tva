const activeRequests = new Map<string, Promise<any>>();

export async function dedupeRequest<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  if (activeRequests.has(key)) {
    return activeRequests.get(key) as Promise<T>;
  }

  const requestPromise = fetchFn().finally(() => {
    activeRequests.delete(key);
  });

  activeRequests.set(key, requestPromise);
  return requestPromise;
}
