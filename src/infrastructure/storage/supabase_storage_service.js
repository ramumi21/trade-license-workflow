/**
 * XJ3395 — Infrastructure Layer
 * What this file handles: File storage implementation using Supabase Storage.
 */
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const { IStorageService } = require('../../application/interfaces/i_storage_service');

class SupabaseStorageService extends IStorageService {
  constructor() {
    super();
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    this.bucketName = process.env.SUPABASE_BUCKET_NAME;
  }

  /**
   * Uploads a file to Supabase Storage.
   * @param {Buffer} fileBuffer - The file content.
   * @param {string} originalFilename - The original name of the file.
   * @param {string} mimeType - The MIME type of the file.
   * @returns {Promise<string>} The public URL of the uploaded file.
   */
  async uploadFile(fileBuffer, originalFilename, mimeType) {
    const key = `${Date.now()}-${uuidv4()}-${originalFilename}`;

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(key, fileBuffer, {
        contentType: mimeType,
      });

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(key);

    return publicUrlData.publicUrl;
  }
}

module.exports = { SupabaseStorageService };
