# Enhanced File Uploader

A modern, native file upload interface that replaces the operating system's default file dialog with a comprehensive drag-and-drop system and inline metadata editing.

## Features

- **Native Interface**: No more operating system file dialogs
- **Drag & Drop**: Intuitive drag-and-drop functionality
- **Inline Editing**: Edit titles, tags, and descriptions before upload
- **File Validation**: Type and size validation with clear error messages
- **Smart Previews**: Image thumbnails and video previews
- **Metadata Integration**: Uses the SmartDropdownInput for consistent tag management
- **Progress Tracking**: Visual feedback for file processing states
- **Bulk Operations**: Handle multiple files with batch actions

## Usage

### Basic Implementation

```tsx
import { EnhancedFileUploader } from "@/components/EnhancedFileUploader";

function MyUploadComponent() {
  const handleFilesReady = (files) => {
    // Process uploaded files
    console.log("Files ready for upload:", files);
  };

  return (
    <EnhancedFileUploader
      onFilesReady={handleFilesReady}
      acceptedTypes={["image/*", "video/*"]}
      maxFiles={10}
      maxFileSize={50} // 50MB
      projectInfo={{
        name: "My Project",
        keywords: ["renovation", "kitchen"],
      }}
    />
  );
}
```

### Using ModernPhotoCapture (Drop-in Replacement)

```tsx
import { ModernPhotoCapture } from "@/components/ModernPhotoCapture";

function ProjectPhotos() {
  const [photos, setPhotos] = useState([]);

  return (
    <ModernPhotoCapture
      photos={photos}
      onPhotosChange={setPhotos}
      projectInfo={{
        id: "project-123",
        name: "Kitchen Renovation",
        address: "123 Main St",
        customerName: "John Doe",
        keywords: ["kitchen", "renovation", "cabinets"],
      }}
    />
  );
}
```

## Props

### EnhancedFileUploader

| Prop            | Type                                  | Default                  | Description                              |
| --------------- | ------------------------------------- | ------------------------ | ---------------------------------------- |
| `onFilesReady`  | `(files: FileWithMetadata[]) => void` | Required                 | Callback when files are ready for upload |
| `acceptedTypes` | `string[]`                            | `["image/*", "video/*"]` | Accepted MIME types                      |
| `maxFiles`      | `number`                              | `20`                     | Maximum number of files                  |
| `maxFileSize`   | `number`                              | `100`                    | Maximum file size in MB                  |
| `projectInfo`   | `object`                              | `undefined`              | Project context for metadata             |
| `className`     | `string`                              | `undefined`              | Additional CSS classes                   |

### FileWithMetadata Object

```typescript
interface FileWithMetadata {
  id: string; // Unique identifier
  file: File; // Original File object
  preview?: string; // Generated preview URL
  title: string; // User-defined title
  tags: string; // Comma-separated tags
  description: string; // Detailed description
  status: "pending" | "processing" | "ready" | "error";
  error?: string; // Error message if status is "error"
}
```

## Benefits

1. **Better UX**: Native interface feels more integrated than OS dialogs
2. **Metadata Before Upload**: Add context while files are fresh in memory
3. **Error Prevention**: Validate files before processing
4. **Consistent Tagging**: Uses system-wide dropdown state management
5. **Responsive Design**: Works seamlessly on all device sizes
6. **Accessibility**: Proper ARIA labels and keyboard navigation

## Migration

To replace existing PhotoCapture usage:

```tsx
// Old way
import { PhotoCapture } from "@/components/PhotoCapture";

// New way
import { ModernPhotoCapture } from "@/components/ModernPhotoCapture";

// Usage remains identical - it's a drop-in replacement
```
