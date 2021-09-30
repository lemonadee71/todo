const VALUES = {
  first: -999,
  last: 999,
};

class EventEmitter {
  constructor() {
    this.events = new Set();
  }

  on(name, fn, options = {}) {
    const handlers = this.events.get(name) || [];
    this.events.set(name, [
      ...handlers,
      { fn, options: { return: true, throw: true, ...options } },
    ]);

    return () => this.off(name, fn);
  }

  once(name, fn, options = {}) {
    this.on(name, fn, { ...options, once: true });
  }

  off(name, fn) {
    this.events.set(
      name,
      this.events.get(name).filter((handler) => handler.fn !== fn)
    );

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
      .map(([, handler]) => handler)
      .sort((a, b) => {
        const x = a.options.order;
        const y = b.options.order;
        const aValue = Number.isInteger(x) ? x : VALUES[x] || 0;
        const bValue = Number.isInteger(y) ? y : VALUES[y] || 0;

        return aValue - bValue;
      })
      .forEach((handler) => {
        const { fn, options } = handler;

        try {
          const result = fn.apply(options.context, payload);

          if (options.return) this.emit(`${name}.success`, result);
          if (options.once) this.off(name, fn);
        } catch (e) {
          console.error(e);
          if (options.throw) this.emit(`${name}.error`, e);
          if (options.dontCatch) throw e;
        }
      });
  }
}

export default EventEmitter;
