/**
 * XJ3395 — Domain Layer
 * What this file handles: Interface for domain event publisher.
 */

/**
 * @interface DomainEventPublisher
 */
class DomainEventPublisher {
  publish(events) {
    throw new Error('Method not implemented');
  }

  subscribe(eventName, handler) {
    throw new Error('Method not implemented');
  }
}

module.exports = { DomainEventPublisher };
