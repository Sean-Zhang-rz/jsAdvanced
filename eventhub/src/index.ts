interface cacheProps {
  [key: string]: ((data: unknown) => void)[];
}

class EventHub {
  cache: cacheProps = {};
  on(eventName: string, fn: (data: unknown) => void) {
    this.cache[eventName] = this.cache[eventName] || [];
    this.cache[eventName].push(fn);
  }
  off(eventName: string, fn: () => void) {
    const index = this.cache[eventName].findIndex((f) => f === fn);
    if (index === -1) return;
    this.cache[eventName].splice(index, 1);
  }
  emit(eventName: string, data?: unknown) {
    (this.cache[eventName] || []).forEach((fn) => fn(data));
  }
}
export default EventHub;
