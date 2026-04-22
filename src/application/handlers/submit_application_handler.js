/**
 * XJ3395 — Application Layer
 * What this file handles: Handler for submitting an application.
 */
const { Result } = require('../dto/result');
const { toApplicationDetailDto } = require('../mapper/application_mapper');
const { TradeLicenseApplication } = require('../../domain/model/trade_license_application');
const { v4: uuidv4 } = require('uuid');

class SubmitApplicationHandler {
  constructor(repository, applicationNumberGenerator, domainEventPublisher) {
    this.repository = repository;
    this.applicationNumberGenerator = applicationNumberGenerator;
    this.domainEventPublisher = domainEventPublisher;
  }

  async handle(command) {
    let application;
    if (command.applicationId) {
      application = await this.repository.findById(command.applicationId);
      if (!application) throw new Error('Application not found');
      application.submit();
      await this.repository.save(application);
    } else {
      const applicationNumber = await this.applicationNumberGenerator.generate();
      application = new TradeLicenseApplication({
        id: uuidv4(),
        applicationNumber,
        licenseType: command.licenseType,
        applicantId: command.applicantId,
        commodityId: command.commodityId
      });
      await this.repository.save(application);
    }

    const events = application.getDomainEvents();
    if (events.length > 0) {
      this.domainEventPublisher.publish(events);
      application.clearEvents();
    }

    return Result.success(toApplicationDetailDto(application), 'Application created/submitted successfully');
  }
}

module.exports = { SubmitApplicationHandler };
