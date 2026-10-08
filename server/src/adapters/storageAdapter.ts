import fs from 'fs';
import path from 'path';

export interface StorageAdapter {
  uploadFile(filename: string, buffer: Buffer, mimeType: string): Promise<string>;
  getFile(fileKey: string): Promise<Buffer | null>;
  getPublicUrl(fileKey: string): string;
}

export class LocalStorageAdapter implements StorageAdapter {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), process.env.LOCAL_STORAGE_PATH || './uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(filename: string, buffer: Buffer, _mimeType: string): Promise<string> {
    const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(this.uploadDir, safeName);
    await fs.promises.writeFile(filePath, buffer);
    return safeName;
  }

  async getFile(fileKey: string): Promise<Buffer | null> {
    const filePath = path.join(this.uploadDir, path.basename(fileKey));
    if (!fs.existsSync(filePath)) return null;
    return await fs.promises.readFile(filePath);
  }

  getPublicUrl(fileKey: string): string {
    const apiUrl = process.env.API_URL || 'http://localhost:5000';
    return `${apiUrl}/api/v1/storage/${path.basename(fileKey)}`;
  }
}

export const storageAdapter: StorageAdapter = new LocalStorageAdapter();
