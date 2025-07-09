import { useEffect, useState } from "react";

// Detect user preferences
export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersLargeFonts: false,
    prefersColorScheme: "light" as "light" | "dark",
  });

  useEffect(() => {
    const updatePreferences = () => {
      setPreferences({
        prefersReducedMotion: window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches,
        prefersHighContrast: window.matchMedia(
          "(prefers-contrast: high)",
        ).matches,
        prefersLargeFonts: window.matchMedia(
          "(prefers-reduced-data: reduce)",
        ).matches,
        prefersColorScheme: window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light",
      });
    };

    updatePreferences();

    // Listen for changes
    const mediaQueries = [
      "(prefers-reduced-motion: reduce)",
      "(prefers-contrast: high)",
      "(prefers-reduced-data: reduce)",
      "(prefers-color-scheme: dark)",
    ];

    const listeners = mediaQueries.map((query) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", updatePreferences);
      return { mq, updatePreferences };
    });

    return () => {
      listeners.forEach(({ mq, updatePreferences }) => {
        mq.removeEventListener("change", updatePreferences);
      });
    };
  }, []);

  return preferences;
}

// Keyboard navigation utilities
export function useKeyboardNavigation(
  itemCount: number,
  onSelect: (index: number) => void,
  isEnabled: boolean = true,
) {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % itemCount);
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + itemCount) % itemCount);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedIndex >= 0) {
            onSelect(focusedIndex);
          }
          break;
        case "Home":
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIndex(itemCount - 1);
          break;
        case "Escape":
          setFocusedIndex(-1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [itemCount, onSelect, focusedIndex, isEnabled]);

  return { focusedIndex, setFocusedIndex };
}

// Screen reader utilities
export function announceToScreenReader(message: string, priority: "polite" | "assertive" = "polite") {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Focus management
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  ) as NodeListOf<HTMLElement>;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  element.addEventListener("keydown", handleTabKey);

  // Focus first element
  firstElement?.focus();

  return () => {
    element.removeEventListener("keydown", handleTabKey);
  };
}

// Color contrast utilities
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string) => {
    const rgb = color.match(/\d+/g);
    if (!rgb || rgb.length < 3) return 0;

    const [r, g, b] = rgb.map((c) => {
      const val = parseInt(c) / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export function meetsWCAGContrast(
  color1: string,
  color2: string,
  level: "AA" | "AAA" = "AA",
): boolean {
  const ratio = getContrastRatio(color1, color2);
  return level === "AAA" ? ratio >= 7 : ratio >= 4.5;
}

// Alternative text generation
export function generateAltText(
  type: "project" | "photo" | "document",
  metadata: any,
): string {
  switch (type) {
    case "project":
      return `Project: ${metadata.name}${metadata.status ? `, Status: ${metadata.status}` : ""}${metadata.location ? `, Location: ${metadata.location}` : ""}`;

    case "photo":
      return `Photo${metadata.tags ? ` tagged with ${metadata.tags.slice(0, 3).join(", ")}` : ""}${metadata.date ? ` from ${new Date(metadata.date).toLocaleDateString()}` : ""}`;

    case "document":
      return `Document: ${metadata.name}${metadata.type ? ` (${metadata.type})` : ""}${metadata.size ? `, Size: ${formatFileSize(metadata.size)}` : ""}`;

    default:
      return "";
  }
}

function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// Skip links
export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="absolute top-0 left-0 bg-primary text-primary-foreground p-2 z-50 focus:relative"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="absolute top-0 left-0 bg-primary text-primary-foreground p-2 z-50 focus:relative"
      >
        Skip to navigation
      </a>
    </div>
  );
}

// Accessible modal
export function useAccessibleModal(isOpen: boolean) {
  const [previousActiveElement, setPreviousActiveElement] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      setPreviousActiveElement(document.activeElement as HTMLElement);

      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Announce modal opening
      announceToScreenReader("Modal opened");
    } else {
      // Restore body scroll
      document.body.style.overflow = "";

      // Restore focus
      if (previousActiveElement) {
        previousActiveElement.focus();
      }

      // Announce modal closing
      announceToScreenReader("Modal closed");
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, previousActiveElement]);

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) {
      // This should be handled by the modal component
      announceToScreenReader("Press Escape to close modal");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);
}

// ARIA live region
export function LiveRegion({
  message,
  level = "polite",
}: {
  message: string;
  level?: "polite" | "assertive";
}) {
  return (
    <div
      aria-live={level}
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {message}
    </div>
  );
}

// High contrast mode utilities
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-contrast: high)");
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isHighContrast;
}