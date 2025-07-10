// Simple UUID v4 implementation for browser environments
export function generateUniqueId(): string {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation
  return "proj-" + generateRandomString(16);
}

function generateRandomString(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  // Use crypto.getRandomValues if available
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
  } else {
    // Fallback to Math.random (less secure but works everywhere)
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  return result;
}

// Generate short, human-readable project IDs
export function generateProjectId(): string {
  const timestamp = Date.now().toString(36); // Base36 timestamp
  const random = generateRandomString(4); // 4 random chars
  return `proj-${timestamp}-${random}`;
}

// Generic ID generator with prefix support
export function generateId(prefix?: string): string {
  const timestamp = Date.now().toString(36);
  const random = generateRandomString(4);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

// Generate IDs for other entities
export function generateTaskId(): string {
  return `task-${Date.now().toString(36)}-${generateRandomString(3)}`;
}

export function generateNoteId(): string {
  return `note-${Date.now().toString(36)}-${generateRandomString(3)}`;
}

export function generateChecklistId(): string {
  return `check-${Date.now().toString(36)}-${generateRandomString(3)}`;
}

export function generateNotificationId(): string {
  return `notif-${Date.now().toString(36)}-${generateRandomString(3)}`;
}

// Validate if an ID matches expected format
export function isValidProjectId(id: string): boolean {
  return (
    /^proj-[a-z0-9]+-[a-z0-9]+$/.test(id) ||
    /^proj-[a-z0-9]{16}$/.test(id) ||
    /^demo-\d+$/.test(id)
  );
}

// Extract creation timestamp from ID (if possible)
export function getIdTimestamp(id: string): Date | null {
  try {
    const parts = id.split("-");
    if (parts.length >= 2) {
      const timestamp = parseInt(parts[1], 36);
      if (!isNaN(timestamp)) {
        return new Date(timestamp);
      }
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
}
