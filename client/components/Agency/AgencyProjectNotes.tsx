import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  MoreHorizontal,
  Pin,
  Edit,
  Trash,
  Eye,
  EyeOff,
  MessageSquare,
  User,
  Clock,
  Tag,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AgencyProjectNote } from "@/types/agency";

interface AgencyProjectNotesProps {
  projectId: string;
  notes: AgencyProjectNote[];
  onNotesChange: (notes: AgencyProjectNote[]) => void;
}

export function AgencyProjectNotes({
  projectId,
  notes,
  onNotesChange,
}: AgencyProjectNotesProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<AgencyProjectNote | null>(
    null,
  );
  const [filter, setFilter] = useState<{
    type?: "internal" | "client-facing";
    pinned?: boolean;
  }>({});

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    type: "internal" as "internal" | "client-facing",
    isPinned: false,
    tags: [] as string[],
    newTag: "",
  });

  const handleCreateNote = async () => {
    try {
      if (!newNote.content.trim()) {
        throw new Error("Note content is required");
      }

      const note: AgencyProjectNote = {
        id: `note-${Date.now()}`,
        projectId,
        title: newNote.title.trim() || undefined,
        content: newNote.content.trim(),
        type: newNote.type,
        authorId: "current-user",
        authorName: "Current User", // Replace with actual user name
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: newNote.isPinned,
        tags: newNote.tags.filter((tag) => tag.trim() !== ""),
      };

      onNotesChange([note, ...notes]);

      // Reset form
      setNewNote({
        title: "",
        content: "",
        type: "internal",
        isPinned: false,
        tags: [],
        newTag: "",
      });

      setIsCreateDialogOpen(false);
      toast.success("Note created successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create note",
      );
    }
  };

  const handleEditNote = async () => {
    if (!editingNote) return;

    try {
      if (!newNote.content.trim()) {
        throw new Error("Note content is required");
      }

      const updatedNote: AgencyProjectNote = {
        ...editingNote,
        title: newNote.title.trim() || undefined,
        content: newNote.content.trim(),
        type: newNote.type,
        updatedAt: new Date().toISOString(),
        isPinned: newNote.isPinned,
        tags: newNote.tags.filter((tag) => tag.trim() !== ""),
      };

      const updatedNotes = notes.map((note) =>
        note.id === editingNote.id ? updatedNote : note,
      );

      onNotesChange(updatedNotes);

      // Reset form
      setNewNote({
        title: "",
        content: "",
        type: "internal",
        isPinned: false,
        tags: [],
        newTag: "",
      });

      setEditingNote(null);
      toast.success("Note updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update note",
      );
    }
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    onNotesChange(updatedNotes);
    toast.success("Note deleted");
  };

  const handleTogglePin = (noteId: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId
        ? {
            ...note,
            isPinned: !note.isPinned,
            updatedAt: new Date().toISOString(),
          }
        : note,
    );
    onNotesChange(updatedNotes);
  };

  const handleAddTag = () => {
    if (
      newNote.newTag.trim() &&
      !newNote.tags.includes(newNote.newTag.trim())
    ) {
      setNewNote((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewNote((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const openEditDialog = (note: AgencyProjectNote) => {
    setNewNote({
      title: note.title || "",
      content: note.content,
      type: note.type,
      isPinned: note.isPinned || false,
      tags: note.tags || [],
      newTag: "",
    });
    setEditingNote(note);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return formatDate(dateString);
  };

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    if (filter.type && note.type !== filter.type) return false;
    if (filter.pinned !== undefined && !!note.isPinned !== filter.pinned)
      return false;
    return true;
  });

  // Sort notes (pinned first, then by creation date)
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-4">
      {/* Header with filters and create button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-2">
          <Select
            value={filter.type || ""}
            onValueChange={(value: "internal" | "client-facing" | "") =>
              setFilter((prev) => ({
                ...prev,
                type: value || undefined,
              }))
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Notes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Notes</SelectItem>
              <SelectItem value="internal">Internal Only</SelectItem>
              <SelectItem value="client-facing">Client-Facing</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={
              filter.pinned === undefined
                ? ""
                : filter.pinned
                  ? "pinned"
                  : "unpinned"
            }
            onValueChange={(value) =>
              setFilter((prev) => ({
                ...prev,
                pinned:
                  value === "pinned"
                    ? true
                    : value === "unpinned"
                      ? false
                      : undefined,
              }))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="pinned">Pinned</SelectItem>
              <SelectItem value="unpinned">Unpinned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog
          open={isCreateDialogOpen || !!editingNote}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              setEditingNote(null);
              setNewNote({
                title: "",
                content: "",
                type: "internal",
                isPinned: false,
                tags: [],
                newTag: "",
              });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? "Edit Note" : "Create New Note"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="note-title">Title (optional)</Label>
                <Input
                  id="note-title"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter note title..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note-content">Content *</Label>
                <Textarea
                  id="note-content"
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Enter note content..."
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select
                  value={newNote.type}
                  onValueChange={(value: "internal" | "client-facing") =>
                    setNewNote((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4" />
                        Internal Only
                      </div>
                    </SelectItem>
                    <SelectItem value="client-facing">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Client-Facing
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {newNote.type === "internal"
                    ? "Only visible to your team members"
                    : "Visible to both team and client"}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="pin-note"
                  checked={newNote.isPinned}
                  onCheckedChange={(checked) =>
                    setNewNote((prev) => ({ ...prev, isPinned: checked }))
                  }
                />
                <Label htmlFor="pin-note">Pin this note</Label>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newNote.newTag}
                    onChange={(e) =>
                      setNewNote((prev) => ({
                        ...prev,
                        newTag: e.target.value,
                      }))
                    }
                    placeholder="Add a tag..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={!newNote.newTag.trim()}
                  >
                    Add
                  </Button>
                </div>
                {newNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newNote.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-2 py-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setEditingNote(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingNote ? handleEditNote : handleCreateNote}
                >
                  {editingNote ? "Update Note" : "Create Note"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notes Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Notes</p>
                <p className="text-2xl font-bold">{notes.length}</p>
              </div>
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Internal</p>
                <p className="text-2xl font-bold">
                  {notes.filter((n) => n.type === "internal").length}
                </p>
              </div>
              <EyeOff className="h-5 w-5 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Client-Facing</p>
                <p className="text-2xl font-bold">
                  {notes.filter((n) => n.type === "client-facing").length}
                </p>
              </div>
              <Eye className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pinned</p>
                <p className="text-2xl font-bold">
                  {notes.filter((n) => n.isPinned).length}
                </p>
              </div>
              <Pin className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {sortedNotes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No notes found</p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first note
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedNotes.map((note) => (
            <Card
              key={note.id}
              className={`${note.isPinned ? "border-yellow-200 bg-yellow-50/50" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {note.isPinned && (
                        <Pin className="h-4 w-4 text-yellow-600" />
                      )}
                      {note.title && (
                        <h4 className="font-medium">{note.title}</h4>
                      )}
                      <Badge
                        variant={
                          note.type === "internal" ? "secondary" : "default"
                        }
                      >
                        {note.type === "internal" ? (
                          <div className="flex items-center gap-1">
                            <EyeOff className="h-3 w-3" />
                            Internal
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Client-Facing
                          </div>
                        )}
                      </Badge>
                    </div>

                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>

                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{note.authorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatRelativeTime(note.createdAt)}</span>
                      </div>
                      {note.updatedAt !== note.createdAt && (
                        <span className="italic">
                          (edited {formatRelativeTime(note.updatedAt)})
                        </span>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(note)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Note
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleTogglePin(note.id)}
                      >
                        <Pin className="h-4 w-4 mr-2" />
                        {note.isPinned ? "Unpin" : "Pin"} Note
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-600"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete Note
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
