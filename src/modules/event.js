class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(eventName, fn) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    this.events.get(eventName).push(fn);
  }

  off(eventName) {
    this.events.delete(eventName);
  }

  clear() {
    this.events.clear();
  }

  emit(eventName, payload = null) {
    console.log(`${eventName} event emitted... `);
    const handlers = this.events.get(eventName) || [];
    handlers.forEach((fn) => fn.call(null, payload));
  }
}

const event = new EventEmitter();

export default event;
