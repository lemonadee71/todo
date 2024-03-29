const VALUES = {
  first: -999,
  last: 999,
};

class EventEmitter {
  constructor(options = {}) {
    this.events = new Map();
    this.globalOptions = {
      emitSuccess: true,
      emitError: true,
      rethrow: false,
    };

    Object.assign(this.globalOptions, options);
  }

  get size() {
    return this.events.size;
  }

  getTopic(topic) {
    return [...(this.events.get(topic) || [])];
  }

  on(topic, fn, options = {}) {
    const topics = [topic].flat(); // support for arrays

    topics.forEach((name) => {
      const handlers = this.events.get(name) || [];
      this.events.set(name, [...handlers, { fn, options }]);
    });

    return () => topics.forEach((name) => this.off(name, fn));
  }

  onSuccess(topic, fn, options = {}) {
    const topics = [topic].flat().map((str) => `${str}.success`);

    return this.on(topics, fn, options);
  }

  onError(topic, fn, options = {}) {
    const topics = [topic].flat().map((str) => `${str}.error`);

    return this.on(topics, fn, options);
  }

  once(topic, fn, options = {}) {
    return this.on(topic, fn, { ...options, once: true });
  }

  off(topic, fn) {
    this.events.set(
      topic,
      this.events.get(topic)?.filter((handler) => handler.fn !== fn)
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

  emit(topic, payload, options = {}) {
    this.getTopic(topic)
      .sort((a, b) => {
        const x = a.options.order;
        const y = b.options.order;
        const aValue = Number.isInteger(x) ? x : VALUES[x] || 0;
        const bValue = Number.isInteger(y) ? y : VALUES[y] || 0;

        return aValue - bValue;
      })
      .forEach(async (handler) => {
        const { emitSuccess, emitError, rethrow } = this.globalOptions;
        const isPlain =
          !topic.endsWith('.success') && !topic.endsWith('.error');

        try {
          const result = await handler.fn.call(
            handler.options.context,
            payload
          );

          options.onSuccess?.(result, payload);

          if (handler.options.once) this.off(topic, handler.fn);
          if (isPlain && (handler.options.emitSuccess || emitSuccess)) {
            // TODO: pass payload too
            this.emit(`${topic}.success`, result);
          }
        } catch (e) {
          console.error(e);

          options.onError?.(e, payload);

          if (isPlain && (handler.options.emitError || emitError)) {
            this.emit(`${topic}.error`, { e, payload });
          }

          if (handler.options.rethrow || rethrow) throw e;
        }
      });

    return this;
  }
}

export default EventEmitter;
