const VALUES = {
  first: -999,
  last: 999,
};

class EventEmitter {
  constructor() {
    this.events = [];
  }

  on(name, fn, options = {}) {
    this.events.push({ name, fn, options });
  }

  once(name, fn, options = {}) {
    this.on(name, fn, { ...options, once: true });
  }

  off(name, fn) {
    this.events = this.events.filter((event) => {
      if (event.name.toString() === name.toString() && event.fn === fn)
        return false;
      return true;
    });
  }

  delete(name) {
    this.events = this.events.filter(
      (event) => event.name.toString() !== name.toString()
    );
  }

  clear() {
    this.events = [];
  }

  emit(name, ...payload) {
    this.events
      .filter((event) =>
        event.name instanceof RegExp
          ? event.name.test(name)
          : event.name === name
      )
      .sort((a, b) => {
        const x = a.options.order;
        const y = b.options.order;
        const aValue = Number.isInteger(x) ? x : VALUES[x] || 0;
        const bValue = Number.isInteger(y) ? y : VALUES[y] || 0;

        return aValue - bValue;
      })
      .forEach((handler) => {
        try {
          const result = handler.fn.apply(handler.options.context, payload);

          if (result) this.emit(`${name}.success`, result);
          if (handler.options.once) this.off(name, handler.fn);
        } catch (e) {
          console.error(e);
          this.emit(`${name}.error`, e);
        }
      });
  }
}

export default EventEmitter;
