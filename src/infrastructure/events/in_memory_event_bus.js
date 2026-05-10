/**
 * XJ3395 — Infrastructure Layer
 * What this file handles: Implementation of DomainEventPublisher using an in-memory event bus.
 */
const { DomainEventPublisher } = require('../../domain/events/domain_event_publisher');

class InMemoryEventBus extends DomainEventPublisher {
  constructor() {
    super();
    this.handlers = new Map();
  }

  subscribe(eventName, handlerFn) {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName).push(handlerFn);
  }

  publish(events) {
    if (!Array.isArray(events)) {
      events = [events];
    }
    for (const event of events) {
      console.log(`[InMemoryEventBus] Published event: ${event.constructor.name}`);
      const eventHandlers = this.handlers.get(event.constructor.name) || [];
      for (const handler of eventHandlers) {
        // Fire and forget, catch errors
        Promise.resolve(handler(event)).catch(err => {
          console.error(`[InMemoryEventBus] Error in handler for event ${event.constructor.name}:`, err);
        });
      }
    }
  }
}

module.exports = { InMemoryEventBus };
