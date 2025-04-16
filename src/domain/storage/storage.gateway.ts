export interface StorageGateway {
  save(resourcePath: string, resourceName: string, data: Buffer): Promise<void>;
  delete(resourcePath: string, resourceName: string): Promise<void>;
}