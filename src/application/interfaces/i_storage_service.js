/**
 * XJ3395 — Application Layer
 * What this file handles: Interface for file storage services.
 */

/**
 * @interface IStorageService
 */
class IStorageService {
  /**
   * Uploads a file to the storage provider.
   * @param {Buffer} fileBuffer - The file content.
   * @param {string} originalFilename - The original name of the file.
   * @param {string} mimeType - The MIME type of the file.
   * @returns {Promise<string>} The public URL of the uploaded file.
   */
  async uploadFile(fileBuffer, originalFilename, mimeType) {
    throw new Error('Method not implemented.');
  }
}

module.exports = { IStorageService };
