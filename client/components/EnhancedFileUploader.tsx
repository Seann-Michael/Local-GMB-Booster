import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SmartDropdownInput } from "@/components/SmartDropdownInput";
import { DROPDOWN_FIELDS } from "@/hooks/useDropdownState";
import {
  Upload,
  X,
  Tag,
  Edit3,
  Image,
  Video,
  File,
  Check,
  AlertCircle,
  Plus,
  FolderOpen,
  Eye,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileWithMetadata {
  id: string;
  file: File;
  preview?: string;
  title: string;
  tags: string;
  description: string;
  status: "pending" | "processing" | "ready" | "error";
  error?: string;
  processed?: boolean;
}

interface EnhancedFileUploaderProps {
  onFilesReady: (files: FileWithMetadata[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxFileSize?: number; // in MB
  projectInfo?: {
    name: string;
    keywords: string[];
  };
  className?: string;
}

export function EnhancedFileUploader({
  onFilesReady,
  acceptedTypes = ["image/*", "video/*"],
  maxFiles = 20,
  maxFileSize = 100, // 100MB default
  projectInfo,
  className,
}: EnhancedFileUploaderProps) {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  // Generate preview for files
  const generatePreview = useCallback((file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        video.addEventListener("loadedmetadata", () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          video.currentTime = 1; // Seek to 1 second for thumbnail
        });

        video.addEventListener("seeked", () => {
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            resolve(canvas.toDataURL());
          } else {
            resolve(null);
          }
        });

        video.src = URL.createObjectURL(file);
      } else {
        resolve(null);
      }
    });
  }, []);

  // Validate file
  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      // Check file type
      const isValidType = acceptedTypes.some((type) => {
        if (type.endsWith("/*")) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isValidType) {
        return {
          valid: false,
          error: `File type not supported. Accepted: ${acceptedTypes.join(", ")}`,
        };
      }

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxFileSize) {
        return {
          valid: false,
          error: `File too large. Maximum size: ${maxFileSize}MB`,
        };
      }

      return { valid: true };
    },
    [acceptedTypes, maxFileSize],
  );

  // Process files
  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const newFiles: FileWithMetadata[] = [];
      const filesArray = Array.from(fileList);

      // Check total file limit
      if (files.length + filesArray.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      for (const file of filesArray) {
        const validation = validateFile(file);
        const id = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        if (!validation.valid) {
          newFiles.push({
            id,
            file,
            title: file.name,
            tags: projectInfo?.keywords.join(", ") || "",
            description: "",
            status: "error",
            error: validation.error,
          });
          continue;
        }

        // Generate initial title from filename
        const title = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");

        const fileData: FileWithMetadata = {
          id,
          file,
          title,
          tags: projectInfo?.keywords.join(", ") || "",
          description: "",
          status: "processing",
        };

        newFiles.push(fileData);

        // Generate preview asynchronously
        generatePreview(file).then((preview) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? { ...f, preview: preview || undefined, status: "ready" }
                : f,
            ),
          );
        });
      }

      setFiles((prev) => [...prev, ...newFiles]);
      toast.success(`Added ${filesArray.length} file(s)`);
    },
    [files.length, maxFiles, validateFile, generatePreview, projectInfo],
  );

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounterRef.current = 0;

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles);
      }
    },
    [processFiles],
  );

  // File input handler
  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        processFiles(selectedFiles);
      }
      // Reset input value
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [processFiles],
  );

  // Update file metadata
  const updateFile = useCallback(
    (
      id: string,
      updates: Partial<
        Pick<FileWithMetadata, "title" | "tags" | "description">
      >,
    ) => {
      setFiles((prev) =>
        prev.map((file) => (file.id === id ? { ...file, ...updates } : file)),
      );
    },
    [],
  );

  // Remove file
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  }, []);

  // Get file icon
  const getFileIcon = useCallback((file: File) => {
    if (file.type.startsWith("image/")) {
      return <Image className="h-4 w-4" />;
    } else if (file.type.startsWith("video/")) {
      return <Video className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  }, []);

  // Get file type color
  const getFileTypeColor = useCallback((file: File) => {
    if (file.type.startsWith("image/")) return "bg-blue-100 text-blue-800";
    if (file.type.startsWith("video/")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  // Handle upload completion
  const handleUpload = useCallback(() => {
    const readyFiles = files.filter((f) => f.status === "ready");
    if (readyFiles.length === 0) {
      toast.error("No files ready for upload");
      return;
    }

    onFilesReady(readyFiles);
    setFiles([]);
    setIsModalOpen(false);
  }, [files, onFilesReady]);

  // Selected file for editing
  const selectedFileData = selectedFile
    ? files.find((f) => f.id === selectedFile)
    : null;

  const readyFilesCount = files.filter((f) => f.status === "ready").length;
  const errorFilesCount = files.filter((f) => f.status === "error").length;

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {/* Drop Zone */}
        <Card
          className={cn(
            "border-2 border-dashed transition-all duration-200 cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
            files.length > 0 && "border-solid border-border",
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-8 text-center">
            {isDragging ? (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-primary animate-bounce" />
                <p className="text-lg font-medium text-primary">
                  Drop files here to upload
                </p>
              </div>
            ) : files.length === 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Upload Files</h3>
                  <p className="text-muted-foreground">
                    Drag and drop files here or click to browse
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                  <span>Supported: {acceptedTypes.join(", ")}</span>
                  <span>•</span>
                  <span>Max {maxFiles} files</span>
                  <span>•</span>
                  <span>Up to {maxFileSize}MB each</span>
                </div>
                <Button className="gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Choose Files
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="font-medium">
                    {files.length} file{files.length !== 1 ? "s" : ""} selected
                  </span>
                </div>
                <div className="flex justify-center gap-4 text-sm">
                  {readyFilesCount > 0 && (
                    <span className="text-green-600 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      {readyFilesCount} ready
                    </span>
                  )}
                  {errorFilesCount > 0 && (
                    <span className="text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errorFilesCount} error{errorFilesCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add More Files
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          className="hidden"
        />

        {/* File List */}
        {files.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  File Details & Metadata
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFiles([])}
                    className="gap-2"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Clear All
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleUpload}
                    disabled={readyFilesCount === 0}
                    className="gap-2"
                  >
                    <Upload className="h-3 w-3" />
                    Upload {readyFilesCount} File
                    {readyFilesCount !== 1 ? "s" : ""}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {files.map((file) => (
                  <Card
                    key={file.id}
                    className={cn(
                      "border-l-4",
                      file.status === "ready" && "border-l-green-500",
                      file.status === "error" && "border-l-red-500",
                      file.status === "processing" && "border-l-yellow-500",
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {/* Preview */}
                        <div className="flex-shrink-0">
                          {file.preview ? (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                              <img
                                src={file.preview}
                                alt={file.title}
                                className="w-full h-full object-cover"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/50 text-white"
                                onClick={() => {
                                  setSelectedFile(file.id);
                                  setIsModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div
                              className={cn(
                                "w-16 h-16 rounded-lg flex items-center justify-center",
                                getFileTypeColor(file.file),
                              )}
                            >
                              {getFileIcon(file.file)}
                            </div>
                          )}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-medium truncate">
                                {file.title || file.file.name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{formatFileSize(file.file.size)}</span>
                                <span>•</span>
                                <span>{file.file.type}</span>
                                {file.status === "processing" && (
                                  <>
                                    <span>•</span>
                                    <span className="text-yellow-600">
                                      Processing...
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedFile(file.id);
                                  setIsModalOpen(true);
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file.id)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {file.status === "error" && file.error && (
                            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                              {file.error}
                            </div>
                          )}

                          {/* Quick edit fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <Label className="text-xs">Title</Label>
                              <Input
                                value={file.title}
                                onChange={(e) =>
                                  updateFile(file.id, { title: e.target.value })
                                }
                                placeholder="Enter file title..."
                                className="h-7 text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Tags</Label>
                              <SmartDropdownInput
                                fieldName={DROPDOWN_FIELDS.PROJECT_KEYWORDS}
                                value={file.tags}
                                onChange={(value) =>
                                  updateFile(file.id, { tags: value })
                                }
                                placeholder="Add tags..."
                                allowMultiple={true}
                                separator=","
                                className="h-7 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* File Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit File Details</DialogTitle>
          </DialogHeader>
          {selectedFileData && (
            <div className="space-y-4">
              {/* Preview */}
              {selectedFileData.preview && (
                <div className="flex justify-center">
                  <div className="max-w-xs max-h-48 rounded-lg overflow-hidden">
                    <img
                      src={selectedFileData.preview}
                      alt={selectedFileData.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Edit form */}
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={selectedFileData.title}
                    onChange={(e) =>
                      updateFile(selectedFileData.id, { title: e.target.value })
                    }
                    placeholder="Enter descriptive title..."
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <SmartDropdownInput
                    fieldName={DROPDOWN_FIELDS.PROJECT_KEYWORDS}
                    value={selectedFileData.tags}
                    onChange={(value) =>
                      updateFile(selectedFileData.id, { tags: value })
                    }
                    placeholder="kitchen, renovation, before, after..."
                    allowMultiple={true}
                    separator=","
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={selectedFileData.description}
                    onChange={(e) =>
                      updateFile(selectedFileData.id, {
                        description: e.target.value,
                      })
                    }
                    placeholder="Add detailed description..."
                    rows={3}
                  />
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>
                    <strong>File:</strong> {selectedFileData.file.name}
                  </p>
                  <p>
                    <strong>Size:</strong>{" "}
                    {formatFileSize(selectedFileData.file.size)}
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedFileData.file.type}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
