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

// Get sub account ID from business settings
function getSubAccountId(): string {
  try {
    const saved = localStorage.getItem("business_settings");
    if (saved) {
      const settings = JSON.parse(saved);
      return settings.subAccountId || "DEFAULT";
    }
  } catch {
    // Ignore parsing errors
  }
  return "DEFAULT";
}

// Generate backend-style timestamp (microseconds precision simulation)
function getBackendTimestamp(): string {
  const now = Date.now();
  // Add microsecond precision simulation (3 additional digits)
  const microseconds = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${now}${microseconds}`;
}

// Generate project IDs based on sub account ID + backend timestamp
export function generateProjectId(): string {
  const subAccountId = getSubAccountId();
  const backendTimestamp = getBackendTimestamp();

  // Format: SUBACCOUNT_TIMESTAMP (mimicking backend structure)
  return `${subAccountId}_${backendTimestamp}`;
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
    /^[A-Z0-9_]+_\d{16}$/.test(id) || // New format: SUBACCOUNT_TIMESTAMP
    /^proj-[a-z0-9]+-[a-z0-9]+$/.test(id) || // Legacy format
    /^proj-[a-z0-9]{16}$/.test(id) || // Legacy format
    /^demo-\d+$/.test(id) || // Demo format
    /^\d{13}$/.test(id) // Simple timestamp format (for existing projects)
  );
}

// Extract creation timestamp from ID (if possible)
export function getIdTimestamp(id: string): Date | null {
  try {
    // Handle new format: SUBACCOUNT_TIMESTAMP
    if (id.includes("_") && /^[A-Z0-9_]+_\d{16}$/.test(id)) {
      const parts = id.split("_");
      const timestampStr = parts[parts.length - 1]; // Last part is timestamp
      const timestamp = parseInt(timestampStr.substring(0, 13)); // Extract milliseconds (first 13 digits)
      if (!isNaN(timestamp)) {
        return new Date(timestamp);
      }
    }

    // Handle legacy formats
    const parts = id.split("-");
    if (parts.length >= 2) {
      const timestamp = parseInt(parts[1], 36);
      if (!isNaN(timestamp)) {
        return new Date(timestamp);
      }
    }

    // Handle simple timestamp format
    if (/^\d{13}$/.test(id)) {
      const timestamp = parseInt(id);
      if (!isNaN(timestamp)) {
        return new Date(timestamp);
      }
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
}

// Extract sub account ID from project ID (for new format)
export function getSubAccountIdFromProjectId(id: string): string | null {
  try {
    // Handle new format: SUBACCOUNT_TIMESTAMP
    if (id.includes("_") && /^[A-Z0-9_]+_\d{16}$/.test(id)) {
      const parts = id.split("_");
      // Join all parts except the last one (which is the timestamp)
      return parts.slice(0, -1).join("_");
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
}
