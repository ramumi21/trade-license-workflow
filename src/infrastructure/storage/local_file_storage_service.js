/**
 * XJ3395 — Infrastructure Layer
 * What this file handles: File storage implementation.
 */
class LocalFileStorageService {
  async save(file) {
    return file.path;
  }
}

module.exports = { LocalFileStorageService };
