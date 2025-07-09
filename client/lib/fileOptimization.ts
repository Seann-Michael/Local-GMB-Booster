interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "webp" | "jpeg" | "png" | "avif";
  progressive?: boolean;
  generateThumbnail?: boolean;
  thumbnailSize?: number;
}

interface VideoOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  bitrate?: number;
  fps?: number;
  format?: "mp4" | "webm";
  generateThumbnail?: boolean;
  compressionLevel?: "low" | "medium" | "high";
}

interface DocumentOptimizationOptions {
  compressImages?: boolean;
  quality?: number;
  removeMetadata?: boolean;
  optimizeText?: boolean;
}

interface OptimizedFile {
  original: File;
  optimized: Blob;
  thumbnail?: Blob;
  compressionRatio: number;
  originalSize: number;
  optimizedSize: number;
  format: string;
  dimensions?: {
    width: number;
    height: number;
  };
  metadata: any;
}

interface ArchiveOptions {
  compressionLevel: "standard" | "aggressive";
  generateThumbnailsOnly: boolean;
  removeOriginals: boolean;
  archiveDate: string;
}

export class FileOptimizer {
  private static canvas: HTMLCanvasElement | null = null;
  private static context: CanvasRenderingContext2D | null = null;

  /**
   * Initialize canvas for image processing
   */
  private static initCanvas(): void {
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      this.context = this.canvas.getContext("2d");
    }
  }

  /**
   * Detect optimal format based on image content and browser support
   */
  static detectOptimalImageFormat(): "avif" | "webp" | "jpeg" {
    // Check browser support for modern formats
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;

    // Test AVIF support
    if (canvas.toDataURL("image/avif").includes("data:image/avif")) {
      return "avif";
    }

    // Test WebP support
    if (canvas.toDataURL("image/webp").includes("data:image/webp")) {
      return "webp";
    }

    return "jpeg";
  }

  /**
   * Optimize image files with smart compression
   */
  static async optimizeImage(
    file: File,
    options: OptimizationOptions = {},
  ): Promise<OptimizedFile> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.85,
      format = this.detectOptimalImageFormat(),
      progressive = true,
      generateThumbnail = true,
      thumbnailSize = 300,
    } = options;

    this.initCanvas();

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        try {
          // Calculate optimal dimensions
          const { width, height } = this.calculateOptimalDimensions(
            img.width,
            img.height,
            maxWidth,
            maxHeight,
          );

          // Resize and optimize main image
          this.canvas!.width = width;
          this.canvas!.height = height;

          this.context!.imageSmoothingEnabled = true;
          this.context!.imageSmoothingQuality = "high";
          this.context!.drawImage(img, 0, 0, width, height);

          // Generate optimized image
          this.canvas!.toBlob(
            async (optimizedBlob) => {
              if (!optimizedBlob) {
                reject(new Error("Failed to optimize image"));
                return;
              }

              let thumbnail: Blob | undefined;

              // Generate thumbnail if requested
              if (generateThumbnail) {
                thumbnail = await this.generateThumbnail(img, thumbnailSize);
              }

              const result: OptimizedFile = {
                original: file,
                optimized: optimizedBlob,
                thumbnail,
                compressionRatio: file.size / optimizedBlob.size,
                originalSize: file.size,
                optimizedSize: optimizedBlob.size,
                format,
                dimensions: { width, height },
                metadata: await this.extractImageMetadata(file),
              };

              resolve(result);
            },
            `image/${format}`,
            quality,
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Optimize video files
   */
  static async optimizeVideo(
    file: File,
    options: VideoOptimizationOptions = {},
  ): Promise<OptimizedFile> {
    const {
      maxWidth = 1280,
      maxHeight = 720,
      bitrate = 1000000, // 1Mbps
      fps = 30,
      format = "mp4",
      generateThumbnail = true,
      compressionLevel = "medium",
    } = options;

    // For browser-based video optimization, we'll use MediaRecorder API
    // In a production environment, this would typically be done server-side

    return new Promise(async (resolve, reject) => {
      try {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.muted = true;

        video.onloadedmetadata = async () => {
          const { width, height } = this.calculateOptimalDimensions(
            video.videoWidth,
            video.videoHeight,
            maxWidth,
            maxHeight,
          );

          // Create canvas for video processing
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d")!;

          // Generate thumbnail from first frame
          let thumbnail: Blob | undefined;
          if (generateThumbnail) {
            video.currentTime = 0;
            video.onseeked = () => {
              ctx.drawImage(video, 0, 0, width, height);
              canvas.toBlob(
                (blob) => {
                  thumbnail = blob || undefined;
                },
                "image/webp",
                0.8,
              );
            };
          }

          // For demo purposes, we'll compress using MediaRecorder
          const stream = canvas.captureStream(fps);
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: `video/${format}`,
            videoBitsPerSecond: bitrate,
          });

          const chunks: BlobPart[] = [];
          mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

          mediaRecorder.onstop = () => {
            const optimizedBlob = new Blob(chunks, { type: `video/${format}` });

            const result: OptimizedFile = {
              original: file,
              optimized: optimizedBlob,
              thumbnail,
              compressionRatio: file.size / optimizedBlob.size,
              originalSize: file.size,
              optimizedSize: optimizedBlob.size,
              format,
              dimensions: { width, height },
              metadata: {
                duration: video.duration,
                originalDimensions: {
                  width: video.videoWidth,
                  height: video.videoHeight,
                },
              },
            };

            resolve(result);
          };

          // Start recording (this is a simplified approach)
          mediaRecorder.start();

          // For demo, stop after a short time
          setTimeout(() => mediaRecorder.stop(), 100);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Optimize document files (PDFs, etc.)
   */
  static async optimizeDocument(
    file: File,
    options: DocumentOptimizationOptions = {},
  ): Promise<OptimizedFile> {
    const {
      compressImages = true,
      quality = 0.8,
      removeMetadata = true,
      optimizeText = true,
    } = options;

    // For PDF optimization, in a real implementation you'd use PDF-lib or similar
    // For now, we'll provide a placeholder that maintains the file

    return new Promise((resolve) => {
      // Simulate PDF optimization
      const optimizedBlob = new Blob([file], { type: file.type });

      const result: OptimizedFile = {
        original: file,
        optimized: optimizedBlob,
        compressionRatio: 1, // No compression in this demo
        originalSize: file.size,
        optimizedSize: file.size,
        format: file.type,
        metadata: {
          pageCount: "unknown",
          hasImages: true,
          hasText: true,
        },
      };

      resolve(result);
    });
  }

  /**
   * Generate thumbnail for any media type
   */
  private static async generateThumbnail(
    source: HTMLImageElement | HTMLVideoElement,
    size: number,
  ): Promise<Blob> {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Calculate dimensions to maintain aspect ratio
    const sourceWidth =
      source instanceof HTMLImageElement ? source.width : source.videoWidth;
    const sourceHeight =
      source instanceof HTMLImageElement ? source.height : source.videoHeight;

    const aspectRatio = sourceWidth / sourceHeight;
    let drawWidth = size;
    let drawHeight = size;
    let offsetX = 0;
    let offsetY = 0;

    if (aspectRatio > 1) {
      drawHeight = size / aspectRatio;
      offsetY = (size - drawHeight) / 2;
    } else {
      drawWidth = size * aspectRatio;
      offsetX = (size - drawWidth) / 2;
    }

    // Fill background
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, size, size);

    // Draw image/video frame
    ctx.drawImage(source, offsetX, offsetY, drawWidth, drawHeight);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to generate thumbnail"));
        },
        "image/webp",
        0.8,
      );
    });
  }

  /**
   * Calculate optimal dimensions while maintaining aspect ratio
   */
  private static calculateOptimalDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number,
  ): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight;

    let width = originalWidth;
    let height = originalHeight;

    // Scale down if necessary
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return {
      width: Math.round(width),
      height: Math.round(height),
    };
  }

  /**
   * Extract metadata from image files
   */
  private static async extractImageMetadata(file: File): Promise<any> {
    // In a real implementation, you'd use exif-js or similar
    return {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      lastModified: new Date(file.lastModified).toISOString(),
    };
  }

  /**
   * Archive old project files with aggressive compression
   */
  static async archiveProjectFiles(
    files: File[],
    options: ArchiveOptions,
  ): Promise<OptimizedFile[]> {
    const {
      compressionLevel = "aggressive",
      generateThumbnailsOnly = false,
      removeOriginals = false,
      archiveDate = new Date().toISOString(),
    } = options;

    const optimizedFiles: OptimizedFile[] = [];

    for (const file of files) {
      let optimized: OptimizedFile;

      if (file.type.startsWith("image/")) {
        const imageOptions: OptimizationOptions = {
          maxWidth: compressionLevel === "aggressive" ? 1280 : 1920,
          maxHeight: compressionLevel === "aggressive" ? 720 : 1080,
          quality: compressionLevel === "aggressive" ? 0.7 : 0.85,
          generateThumbnail: true,
          thumbnailSize: 200,
        };

        if (generateThumbnailsOnly) {
          imageOptions.maxWidth = 400;
          imageOptions.maxHeight = 400;
          imageOptions.quality = 0.6;
        }

        optimized = await this.optimizeImage(file, imageOptions);
      } else if (file.type.startsWith("video/")) {
        const videoOptions: VideoOptimizationOptions = {
          maxWidth: compressionLevel === "aggressive" ? 854 : 1280,
          maxHeight: compressionLevel === "aggressive" ? 480 : 720,
          compressionLevel,
          generateThumbnail: true,
        };

        optimized = await this.optimizeVideo(file, videoOptions);
      } else {
        optimized = await this.optimizeDocument(file, {
          compressImages: true,
          quality: compressionLevel === "aggressive" ? 0.6 : 0.8,
        });
      }

      // Add archive metadata
      optimized.metadata = {
        ...optimized.metadata,
        archived: true,
        archiveDate,
        compressionLevel,
        thumbnailOnly: generateThumbnailsOnly,
      };

      optimizedFiles.push(optimized);
    }

    return optimizedFiles;
  }

  /**
   * Batch optimize multiple files
   */
  static async batchOptimize(
    files: File[],
    progressCallback?: (progress: number) => void,
  ): Promise<OptimizedFile[]> {
    const optimizedFiles: OptimizedFile[] = [];
    const total = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let optimized: OptimizedFile;

      if (file.type.startsWith("image/")) {
        optimized = await this.optimizeImage(file);
      } else if (file.type.startsWith("video/")) {
        optimized = await this.optimizeVideo(file);
      } else {
        optimized = await this.optimizeDocument(file);
      }

      optimizedFiles.push(optimized);

      if (progressCallback) {
        progressCallback(((i + 1) / total) * 100);
      }
    }

    return optimizedFiles;
  }

  /**
   * Get storage savings summary
   */
  static getStorageSavings(optimizedFiles: OptimizedFile[]): {
    originalSize: number;
    optimizedSize: number;
    savings: number;
    savingsPercentage: number;
  } {
    const originalSize = optimizedFiles.reduce(
      (sum, file) => sum + file.originalSize,
      0,
    );
    const optimizedSize = optimizedFiles.reduce(
      (sum, file) => sum + file.optimizedSize,
      0,
    );
    const savings = originalSize - optimizedSize;
    const savingsPercentage = (savings / originalSize) * 100;

    return {
      originalSize,
      optimizedSize,
      savings,
      savingsPercentage,
    };
  }
}

// Utility functions for file size formatting
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function calculateCompressionRatio(
  original: number,
  optimized: number,
): string {
  const ratio = (1 - optimized / original) * 100;
  return `${ratio.toFixed(1)}%`;
}
