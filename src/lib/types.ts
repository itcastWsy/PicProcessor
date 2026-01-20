import { OutputFormat } from './image-processor';

export interface ProcessingSettings {
  format: OutputFormat;
  quality: number;
  width: number | '';
  height: number | '';
  maintainAspectRatio: boolean;
}

export type FileStatus = 'pending' | 'processing' | 'done' | 'error';

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: FileStatus;
  originalSize: number;
  originalWidth?: number;
  originalHeight?: number;
  processedSize?: number;
  processedWidth?: number;
  processedHeight?: number;
  processedFormat?: string;
  processedBlob?: Blob;
  error?: string;
}
