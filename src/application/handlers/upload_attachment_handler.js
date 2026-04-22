/**
 * XJ3395 — Application Layer
 * What this file handles: Handler for uploading an attachment.
 */
const { Result } = require('../dto/result');
const { toApplicationDetailDto } = require('../mapper/application_mapper');
const { Attachment } = require('../../domain/model/attachment');

class UploadAttachmentHandler {
  constructor(repository, fileStorageService) {
    this.repository = repository;
    this.fileStorageService = fileStorageService;
  }
  async handle(command) {
    const app = await this.repository.findById(command.applicationId);
    if (!app) throw new Error('Application not found');
    
    const filePath = await this.fileStorageService.save(command.file);
    app.attachments.push(new Attachment(null, command.file.originalname, filePath, command.documentType));
    await this.repository.save(app);
    return Result.success(toApplicationDetailDto(app), 'Attachment uploaded');
  }
}
module.exports = { UploadAttachmentHandler };
