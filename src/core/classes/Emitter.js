const VALUES = {
  first: -999,
  last: 999,
};

class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  get size() {
    return this.events.size;
  }

  on(name, fn, options = {}) {
    const eventNames = [name].flat(); // support for arrays

    eventNames.forEach((event) => {
      const handlers = this.events.get(event) || new Map();
      this.events.set(
        event,
        handlers.set(fn, { return: true, throw: true, ...options })
      );
    });

    return () => eventNames.forEach((event) => this.off(event, fn));
  }

  once(name, fn, options = {}) {
    this.on(name, fn, { ...options, once: true });
  }

  off(name, fn) {
    this.events.get(name).delete(fn);

    return this;
  }

  delete(name) {
    this.events.delete(name);

    return this;
  }

  clear() {
    this.events.clear();

    return this;
  }

  emit(name, ...payload) {
    Array.from(this.events.entries())
      .filter(([event]) =>
        event instanceof RegExp ? event.test(name) : event === name
      )
      .flatMap(([, handler]) => Array.from(handler.entries()))
      .sort((a, b) => {
        const x = a[1].order;
        const y = b[1].order;
        const aValue = Number.isInteger(x) ? x : VALUES[x] || 0;
        const bValue = Number.isInteger(y) ? y : VALUES[y] || 0;

        return aValue - bValue;
      })
      .forEach(([fn, options]) => {
        try {
          const result = fn.apply(options.context, payload);

          if (options.return && result) this.emit(`${name}.success`, result);
          if (options.once) this.off(name, fn);
        } catch (e) {
          console.error(e);
          // if (options.throw) this.emit(`${name}.error`, e);
          if (options.dontCatch) throw e;
        }
      });

    return this;
  }
}

export default EventEmitter;
