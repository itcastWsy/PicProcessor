export type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export interface ProcessOptions {
  quality: number; // 0 to 1
  format: OutputFormat;
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
}

export interface ProcessedImageResult {
  blob: Blob;
  width: number;
  height: number;
}

export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export async function processImage(file: File, options: ProcessOptions): Promise<ProcessedImageResult> {
  // 1. If format conversion or compression is needed, use imageCompression
  // Note: browser-image-compression handles resizing via maxWidthOrHeight (maintaining aspect ratio)
  // If we need to force exact width/height (ignoring aspect ratio), we need custom canvas logic.
  
  // For this implementation, we will use a custom Canvas approach for maximum control 
  // over resizing (including fixed w/h) and format conversion, 
  // and use imageCompression only if we want its specific algorithm, 
  // but standard Canvas toBlob is usually sufficient for simple frontend apps.
  // However, browser-image-compression is better at handling large files and orientation.
  
  // Let's use a hybrid approach:
  // Use a helper to load image to Image object, then draw to Canvas with desired dimensions, then export.
  
  const imageBitmap = await createImageBitmap(file);
  
  let targetWidth = imageBitmap.width;
  let targetHeight = imageBitmap.height;

  if (options.width && options.height && !options.maintainAspectRatio) {
    targetWidth = options.width;
    targetHeight = options.height;
  } else if (options.width || options.height) {
    // Maintain aspect ratio
    const ratio = imageBitmap.width / imageBitmap.height;
    if (options.width) {
      targetWidth = options.width;
      targetHeight = targetWidth / ratio;
    } else if (options.height) {
      targetHeight = options.height;
      targetWidth = targetHeight * ratio;
    }
  }
  
  // Ensure integers
  targetWidth = Math.round(targetWidth);
  targetHeight = Math.round(targetHeight);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');

  // Draw image to canvas (this handles resizing)
  ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

  // Export to blob
  // quality is 0-1 for jpeg/webp. PNG ignores quality in standard toBlob.
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve({
            blob,
            width: targetWidth,
            height: targetHeight
          });
        } else {
          reject(new Error('Canvas to Blob failed'));
        }
      },
      options.format,
      options.quality
    );
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

export function getFilenameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}
