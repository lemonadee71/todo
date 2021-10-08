const VALUES = {
  first: -999,
  last: 999,
};

class EventEmitter {
  constructor() {
    this.events = new Map();
    this.globalOptions = {
      return: true,
      throw: true,
      dontCatch: false,
    };
  }

  get size() {
    return this.events.size;
  }

  getTopic(topic) {
    return [...(this.events.get(topic) || [])];
  }

  on(topic, fn, options = {}) {
    const topicNames = [topic].flat(); // support for arrays

    topicNames.forEach((name) => {
      const handlers = this.events.get(name) || [];
      this.events.set(name, [...handlers, { fn, options }]);
    });

    return () => topicNames.forEach((name) => this.off(name, fn));
  }

  once(topic, fn, options = {}) {
    this.on(topic, fn, { ...options, once: true });
  }

  off(topic, fn) {
    this.events.set(
      topic,
      this.events.get(topic).filter((handler) => handler.fn !== fn)
    );

    return this;
  }

  delete(topic) {
    this.events.delete(topic);

    return this;
  }

  clear() {
    this.events.clear();

    return this;
  }

  emit(topic, ...payload) {
    this.getTopic(topic)
      .sort((a, b) => {
        const x = a.options.order;
        const y = b.options.order;
        const aValue = Number.isInteger(x) ? x : VALUES[x] || 0;
        const bValue = Number.isInteger(y) ? y : VALUES[y] || 0;

        return aValue - bValue;
      })
      .forEach((handler) => {
        const { fn, options } = handler;
        const {
          dontCatch,
          return: willReturn,
          throw: willThrow,
        } = this.globalOptions;
        const isNotSuccessOrError =
          !topic.endsWith('.success') && !topic.endsWith('.error');

        try {
          const result = fn.apply(options.context, payload);

          if (options.once) this.off(topic, fn);
          if (isNotSuccessOrError && (options.return || willReturn))
            this.emit(`${topic}.success`, result);
        } catch (e) {
          console.error(e);
          if (isNotSuccessOrError && (options.throw || willThrow))
            this.emit(`${topic}.error`, e);
          if (options.dontCatch || dontCatch) throw e;
        }
      });

    return this;
  }
}

export default EventEmitter;
