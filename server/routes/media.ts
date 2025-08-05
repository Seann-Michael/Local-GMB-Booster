import { RequestHandler } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";

/**
 * Interface for media file metadata stored on server
 */
interface ServerMediaFile {
  id: string;
  originalName: string;
  storedPath: string;
  mimeType: string;
  size: number;
  accountId: string;
  projectId?: string;
  mediaType: string;
  isPublic: boolean;
  uploadedAt: Date;
  uploadedBy: string;
  thumbnails?: {
    small: string;
    medium: string;
    large: string;
  };
}

/**
 * In-memory storage for demo purposes
 * In production, this would be a database
 */
const mediaFiles = new Map<string, ServerMediaFile>();
const publicUrlMappings = new Map<string, string>(); // Maps public URLs to media IDs

/**
 * Serve secure media files (authenticated access)
 */
export const handleSecureMedia: RequestHandler = async (req, res) => {
  try {
    const { mediaId, filename } = req.params;
    
    if (!mediaId || !filename) {
      return res.status(400).json({ error: "Missing media ID or filename" });
    }

    // Get media file record
    const mediaFile = mediaFiles.get(mediaId);
    if (!mediaFile) {
      return res.status(404).json({ error: "Media file not found" });
    }

    // Validate access permissions
    // In a real app, you'd check user authentication and permissions here
    const userAccountId = req.headers['x-account-id'] as string || 'default';
    if (mediaFile.accountId !== userAccountId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if file exists on disk
    const filePath = path.join(process.cwd(), 'uploads', mediaFile.storedPath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Physical file not found" });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', mediaFile.mimeType);
    res.setHeader('Content-Length', mediaFile.size);
    
    // Handle download requests
    if (req.query.download === 'true') {
      const downloadFilename = req.query.filename as string || mediaFile.originalName;
      res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
    } else {
      res.setHeader('Content-Disposition', 'inline');
    }

    // Cache headers for performance
    res.setHeader('Cache-Control', 'private, max-age=3600');
    res.setHeader('ETag', `"${mediaFile.id}"`);

    // Stream file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error serving secure media:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Serve public media files (no authentication required)
 */
export const handlePublicMedia: RequestHandler = async (req, res) => {
  try {
    const { publicId, filename } = req.params;
    
    if (!publicId || !filename) {
      return res.status(400).json({ error: "Missing public ID or filename" });
    }

    // Get media ID from public URL mapping
    const mediaId = publicUrlMappings.get(`${publicId}/${filename}`);
    if (!mediaId) {
      return res.status(404).json({ error: "Media file not found" });
    }

    const mediaFile = mediaFiles.get(mediaId);
    if (!mediaFile || !mediaFile.isPublic) {
      return res.status(404).json({ error: "Media file not found or not public" });
    }

    // Validate expiration if present
    const expiration = req.query.exp as string;
    if (expiration) {
      const expirationTime = parseInt(expiration);
      if (Date.now() > expirationTime) {
        return res.status(410).json({ error: "URL has expired" });
      }
    }

    // Check if file exists on disk
    const filePath = path.join(process.cwd(), 'uploads', mediaFile.storedPath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Physical file not found" });
    }

    // Set appropriate headers for public access
    res.setHeader('Content-Type', mediaFile.mimeType);
    res.setHeader('Content-Length', mediaFile.size);
    res.setHeader('Content-Disposition', 'inline');
    
    // More aggressive caching for public files
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('ETag', `"${mediaFile.id}"`);

    // CORS headers for RSS/API access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Stream file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error serving public media:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Serve thumbnail images
 */
export const handleThumbnails: RequestHandler = async (req, res) => {
  try {
    const { size, mediaId, filename } = req.params;
    const isPublic = req.path.includes('/public/');
    
    if (!size || !mediaId || !filename) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    // Validate size parameter
    const validSizes = ['150x150', '300x300', '600x600'];
    if (!validSizes.includes(size)) {
      return res.status(400).json({ error: "Invalid thumbnail size" });
    }

    let mediaFile: ServerMediaFile | undefined;

    if (isPublic) {
      // For public thumbnails, get media ID from mapping
      const realMediaId = publicUrlMappings.get(`${mediaId}/${filename}`);
      if (realMediaId) {
        mediaFile = mediaFiles.get(realMediaId);
      }
    } else {
      // For secure thumbnails, use media ID directly
      mediaFile = mediaFiles.get(mediaId);
    }

    if (!mediaFile) {
      return res.status(404).json({ error: "Media file not found" });
    }

    // Check permissions for secure thumbnails
    if (!isPublic) {
      const userAccountId = req.headers['x-account-id'] as string || 'default';
      if (mediaFile.accountId !== userAccountId) {
        return res.status(403).json({ error: "Access denied" });
      }
    }

    // Get thumbnail path
    const sizeKey = size.replace('x', '_') as keyof typeof mediaFile.thumbnails;
    const thumbnailPath = mediaFile.thumbnails?.[sizeKey as any];
    
    if (!thumbnailPath) {
      // Generate thumbnail on-demand (simplified for demo)
      return res.status(404).json({ error: "Thumbnail not available" });
    }

    const fullThumbnailPath = path.join(process.cwd(), 'uploads', 'thumbnails', thumbnailPath);
    
    if (!fs.existsSync(fullThumbnailPath)) {
      return res.status(404).json({ error: "Thumbnail file not found" });
    }

    // Set headers
    res.setHeader('Content-Type', 'image/jpeg'); // Thumbnails are typically JPEG
    res.setHeader('Cache-Control', isPublic ? 'public, max-age=86400' : 'private, max-age=3600');
    
    if (isPublic) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    // Stream thumbnail
    const thumbnailStream = fs.createReadStream(fullThumbnailPath);
    thumbnailStream.pipe(res);

  } catch (error) {
    console.error('Error serving thumbnail:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Handle media file upload
 */
export const handleMediaUpload: RequestHandler = async (req, res) => {
  try {
    // This would typically use multer or similar for file upload handling
    // For now, just return a mock response showing the expected behavior
    
    const { accountId, projectId, mediaType, isPublic } = req.body;
    
    if (!accountId || !mediaType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate unique media ID
    const timestamp = Date.now();
    const randomToken = crypto.randomBytes(16).toString('hex');
    const projectPart = projectId ? `_p${projectId}` : '';
    const mediaId = `acc${accountId}${projectPart}_${mediaType}_${timestamp}_${randomToken}`;

    // Mock file data (in real implementation, this comes from multer)
    const mockFile = {
      originalname: 'example.jpg',
      mimetype: 'image/jpeg',
      size: 1024000,
      buffer: Buffer.from('mock file content')
    };

    // Create storage paths
    const fileExtension = path.extname(mockFile.originalname);
    const storedFilename = `${mediaId}${fileExtension}`;
    const storedPath = path.join('media', storedFilename);
    
    // Generate public URL identifier if needed
    let publicUrlId = '';
    if (isPublic) {
      const accountHash = hashString(accountId);
      const projectHash = projectId ? hashString(projectId) : '';
      const randomId = crypto.randomBytes(12).toString('hex');
      const timestampBase36 = timestamp.toString(36);
      
      publicUrlId = `${accountHash}_${projectHash}_${timestampBase36}_${randomId}`.replace(/__/g, '_');
      
      // Store mapping
      publicUrlMappings.set(`${publicUrlId}/${mockFile.originalname}`, mediaId);
    }

    // Create media file record
    const mediaFile: ServerMediaFile = {
      id: mediaId,
      originalName: mockFile.originalname,
      storedPath,
      mimeType: mockFile.mimetype,
      size: mockFile.size,
      accountId,
      projectId,
      mediaType,
      isPublic: Boolean(isPublic),
      uploadedAt: new Date(),
      uploadedBy: req.headers['x-user-name'] as string || 'Unknown',
      thumbnails: {
        small: `${mediaId}_150x150.jpg`,
        medium: `${mediaId}_300x300.jpg`,
        large: `${mediaId}_600x600.jpg`
      }
    };

    // Store in memory (in production, save to database)
    mediaFiles.set(mediaId, mediaFile);

    // Generate URLs
    const secureUrl = `/api/media/${mediaId}/${encodeURIComponent(mockFile.originalname)}`;
    const publicUrl = isPublic ? `/public/media/${publicUrlId}/${mockFile.originalname}` : '';
    const thumbnailUrl = `/api/media/thumbs/300x300/${mediaId}/${encodeURIComponent(mockFile.originalname)}`;

    res.json({
      success: true,
      mediaFile: {
        id: mediaId,
        originalName: mockFile.originalname,
        mimeType: mockFile.mimetype,
        size: mockFile.size,
        secureUrl,
        publicUrl,
        thumbnailUrl,
        uploadedAt: mediaFile.uploadedAt,
        uploadedBy: mediaFile.uploadedBy
      }
    });

  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: "Upload failed" });
  }
};

/**
 * Get media file metadata
 */
export const handleMediaMetadata: RequestHandler = async (req, res) => {
  try {
    const { mediaId } = req.params;
    
    const mediaFile = mediaFiles.get(mediaId);
    if (!mediaFile) {
      return res.status(404).json({ error: "Media file not found" });
    }

    // Check permissions
    const userAccountId = req.headers['x-account-id'] as string || 'default';
    if (mediaFile.accountId !== userAccountId) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({
      id: mediaFile.id,
      originalName: mediaFile.originalName,
      mimeType: mediaFile.mimeType,
      size: mediaFile.size,
      mediaType: mediaFile.mediaType,
      isPublic: mediaFile.isPublic,
      uploadedAt: mediaFile.uploadedAt,
      uploadedBy: mediaFile.uploadedBy,
      projectId: mediaFile.projectId
    });

  } catch (error) {
    console.error('Error getting media metadata:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Helper function to hash strings
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Functions are already exported individually above
