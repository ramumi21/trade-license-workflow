/**
 * XJ3395 — Infrastructure Layer
 * What this file handles: Event publisher for domain events.
 */
class DomainEventPublisher {
  publish(events) {
    for (const event of events) {
      console.log(`[DomainEventPublisher] Published event: ${event.name} for Application ${event.applicationId}`);
    }
  }
}

module.exports = { DomainEventPublisher };
