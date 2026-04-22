/**
 * XJ3395 — Domain Layer
 * What this file handles: Entity for attachments.
 */
class Attachment {
  constructor(id, fileName, filePath, documentType, uploadedAt) {
    this.id = id;
    this.fileName = fileName;
    this.filePath = filePath;
    this.documentType = documentType;
    this.uploadedAt = uploadedAt || new Date();
  }
}
module.exports = { Attachment };
