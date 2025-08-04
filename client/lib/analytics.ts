interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

interface UserEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
  url: string;
}

interface ErrorEvent {
  message: string;
  stack?: string;
  url: string;
  timestamp: number;
  userAgent: string;
  userId?: string;
  sessionId: string;
}

class AnalyticsService {
  private sessionId: string;
  private userId?: string;
  private isEnabled: boolean = true;
  private eventQueue: UserEvent[] = [];
  private performanceQueue: PerformanceMetric[] = [];
  private errorQueue: ErrorEvent[] = [];
  private flushInterval: number = 10000; // 10 seconds

  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.init();
  }

  private init() {
    try {
      // Check if we're in a browser environment
      if (typeof window === "undefined" || typeof document === "undefined") {
        this.isEnabled = false;
        return;
      }

      // Check if analytics is enabled (GDPR compliance)
      this.isEnabled =
        localStorage.getItem("analytics-enabled") !== "false";

      if (!this.isEnabled) return;

      // Set up automatic flushing
      setInterval(() => this.flush(), this.flushInterval);

      // Track page views automatically
      this.trackPageView();

      // Set up performance monitoring
      this.setupPerformanceMonitoring();

      // Set up error tracking
      this.setupErrorTracking();

      // Track core web vitals
      this.trackCoreWebVitals();

      // Flush on page unload
      window.addEventListener("beforeunload", () => this.flush());
    } catch (error) {
      console.error("Analytics initialization failed:", error);
      this.isEnabled = false;
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserId(): string | undefined {
    try {
      if (typeof window === "undefined") return undefined;
      const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
      return profile.id || profile.email;
    } catch {
      return undefined;
    }
  }

  // Public API
  track(event: string, properties: Record<string, any> = {}) {
    try {
      if (!this.isEnabled) return;

      const userEvent: UserEvent = {
        event,
        properties,
        timestamp: Date.now(),
        userId: this.userId,
        sessionId: this.sessionId,
        url: window.location.href,
      };

      this.eventQueue.push(userEvent);
      console.log("Analytics event:", userEvent);
    } catch (error) {
      console.error("Analytics tracking error:", error);
    }
  }

  trackPageView(url?: string) {
    this.track("page_view", {
      url: url || window.location.href,
      title: document.title,
      referrer: document.referrer,
    });
  }

  trackFileUpload(fileType: string, fileSize: number, success: boolean) {
    this.track("file_upload", {
      fileType,
      fileSize,
      success,
      compressionEnabled: true,
    });
  }

  trackProjectAction(action: string, projectId?: string) {
    this.track("project_action", {
      action,
      projectId,
    });
  }

  trackFeatureUsage(feature: string, context?: Record<string, any>) {
    this.track("feature_usage", {
      feature,
      ...context,
    });
  }

  trackPerformance(name: string, value: number) {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.performanceQueue.push(metric);
  }

  trackError(error: Error | string, context?: Record<string, any>) {
    try {
      if (!this.isEnabled) return;

      const errorEvent: ErrorEvent = {
        message: typeof error === "string" ? error : error.message,
        stack: typeof error === "string" ? undefined : error.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        userId: this.userId,
        sessionId: this.sessionId,
      };

      this.errorQueue.push(errorEvent);
      console.error("Analytics error:", errorEvent);
    } catch (analyticsError) {
      console.error("Failed to track error in analytics:", analyticsError);
    }
  }

  // Performance monitoring
  private setupPerformanceMonitoring() {
    try {
      // Check if performance APIs are available
      if (typeof window === "undefined" || !window.performance || !performance.getEntriesByType) {
        return;
      }

      // Track navigation timing
      window.addEventListener("load", () => {
        setTimeout(() => {
          try {
            const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

            if (navigation && navigation.loadEventEnd && navigation.fetchStart) {
              this.trackPerformance(
                "page_load_time",
                navigation.loadEventEnd - navigation.fetchStart,
              );
              if (navigation.domContentLoadedEventEnd) {
                this.trackPerformance(
                  "dom_content_loaded",
                  navigation.domContentLoadedEventEnd - navigation.fetchStart,
                );
              }
              if (navigation.responseStart) {
                this.trackPerformance(
                  "first_byte",
                  navigation.responseStart - navigation.fetchStart,
                );
              }
            }
          } catch (error) {
            // Silently fail - don't log to prevent error loops
          }
        }, 0);
      });

      // Track resource loading only if PerformanceObserver is supported
      if (typeof PerformanceObserver !== "undefined" && typeof window !== "undefined") {
        try {
          const observer = new PerformanceObserver((list) => {
            try {
              for (const entry of list.getEntries()) {
                if (entry.entryType === "resource") {
                  const resource = entry as PerformanceResourceTiming;
                    `resource_${resource.initiatorType}`,
                    resource.duration,
                  );
                }
              }
            } catch (error) {
              // Silently fail resource tracking
            }
          });

          observer.observe({ entryTypes: ["resource"] });
        } catch (error) {
          // PerformanceObserver not supported, skip
        }
      }
    } catch (error) {
      // Silently fail performance monitoring setup
    }
  }

  private setupErrorTracking() {
    // Global error handler
    window.addEventListener("error", (event) => {
      this.trackError(event.error || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.trackError(event.reason, {
        type: "unhandled_promise_rejection",
      });
    });
  }

  private trackCoreWebVitals() {
    try {
      // Check if PerformanceObserver is supported
      if (typeof PerformanceObserver === "undefined") {
        console.log("PerformanceObserver not supported, skipping core web vitals tracking");
        return;
      }

      // First Contentful Paint
      try {
        const observer = new PerformanceObserver((list) => {
          try {
            for (const entry of list.getEntries()) {
              if (entry.name === "first-contentful-paint") {
                this.trackPerformance("first_contentful_paint", entry.startTime);
              }
            }
          } catch (error) {
            console.error("FCP tracking error:", error);
          }
        });

        observer.observe({ entryTypes: ["paint"] });
      } catch (error) {
        console.error("FCP observer setup failed:", error);
      }

      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          try {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.trackPerformance("largest_contentful_paint", lastEntry.startTime);
          } catch (error) {
            console.error("LCP tracking error:", error);
          }
        });

        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (error) {
        console.error("LCP observer setup failed:", error);
      }

      // Cumulative Layout Shift
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          try {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
          } catch (error) {
            console.error("CLS tracking error:", error);
          }
        });

        clsObserver.observe({ entryTypes: ["layout-shift"] });

        // Track CLS on page unload
        window.addEventListener("beforeunload", () => {
          try {
            this.trackPerformance("cumulative_layout_shift", clsValue);
          } catch (error) {
            console.error("CLS final tracking error:", error);
          }
        });
      } catch (error) {
        console.error("CLS observer setup failed:", error);
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          try {
            for (const entry of list.getEntries()) {
              this.trackPerformance(
                "first_input_delay",
                (entry as any).processingStart - entry.startTime,
              );
            }
          } catch (error) {
            console.error("FID tracking error:", error);
          }
        });

        fidObserver.observe({ entryTypes: ["first-input"] });
      } catch (error) {
        console.error("FID observer setup failed:", error);
      }
    } catch (error) {
      console.error("Core web vitals tracking setup failed:", error);
    }
  }

  // Data flushing
  private async flush() {
    if (!this.isEnabled) return;

    try {
      const data = {
        events: this.eventQueue.splice(0),
        performance: this.performanceQueue.splice(0),
        errors: this.errorQueue.splice(0),
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId,
      };

      if (
        data.events.length === 0 &&
        data.performance.length === 0 &&
        data.errors.length === 0
      ) {
        return;
      }

      // In a real implementation, send to analytics service
      console.log("Analytics data flush:", data);

      // Store locally as backup
      this.storeLocally(data);
    } catch (error) {
      console.error("Failed to flush analytics data:", error);
    }
  }

  private storeLocally(data: any) {
    try {
      if (typeof window === "undefined") return;

      const existing = JSON.parse(
        localStorage.getItem("analytics-backup") || "[]",
      );
      existing.push(data);

      // Keep only last 10 entries to prevent storage bloat
      const trimmed = existing.slice(-10);
      localStorage.setItem("analytics-backup", JSON.stringify(trimmed));
    } catch (error) {
      console.error("Failed to store analytics backup:", error);
    }
  }

  // Privacy controls
  enableAnalytics() {
    this.isEnabled = true;
    if (typeof window !== "undefined") {
      localStorage.setItem("analytics-enabled", "true");
    }
    this.init();
  }

  disableAnalytics() {
    this.isEnabled = false;
    if (typeof window !== "undefined") {
      localStorage.setItem("analytics-enabled", "false");
    }
    this.eventQueue = [];
    this.performanceQueue = [];
    this.errorQueue = [];
  }

  // Debugging
  getDebugInfo() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      isEnabled: this.isEnabled,
      queuedEvents: this.eventQueue.length,
      queuedPerformance: this.performanceQueue.length,
      queuedErrors: this.errorQueue.length,
    };
  }
}

// Create singleton instance with better error handling and lazy loading
let analytics: AnalyticsService | null = null;

// Dummy analytics service that does nothing
const dummyAnalytics = {
  track: () => {},
  trackPageView: () => {},
  trackFileUpload: () => {},
  trackProjectAction: () => {},
  trackFeatureUsage: () => {},
  trackError: () => {},
  trackPerformance: () => {},
  enableAnalytics: () => {},
  disableAnalytics: () => {},
  getDebugInfo: () => ({
    sessionId: "disabled",
    userId: undefined,
    isEnabled: false,
    queuedEvents: 0,
    queuedPerformance: 0,
    queuedErrors: 0,
  }),
} as any;

// Lazy initialization function
function getAnalytics(): AnalyticsService {
  if (analytics) {
    return analytics;
  }

  try {
    // Only initialize if we're in a browser environment
    if (typeof window === "undefined") {
      return dummyAnalytics;
    }

    analytics = new AnalyticsService();
    return analytics;
  } catch (error) {
    console.error("Analytics service initialization failed:", error);
    return dummyAnalytics;
  }
}

// Export a proxy object that lazily initializes analytics
const analyticsProxy = {
  track: (...args: any[]) => {
    try {
      return getAnalytics().track(...args);
    } catch (error) {
      console.error("Analytics track error:", error);
    }
  },
  trackPageView: (...args: any[]) => {
    try {
      return getAnalytics().trackPageView(...args);
    } catch (error) {
      console.error("Analytics trackPageView error:", error);
    }
  },
  trackFileUpload: (...args: any[]) => {
    try {
      return getAnalytics().trackFileUpload(...args);
    } catch (error) {
      console.error("Analytics trackFileUpload error:", error);
    }
  },
  trackProjectAction: (...args: any[]) => {
    try {
      return getAnalytics().trackProjectAction(...args);
    } catch (error) {
      console.error("Analytics trackProjectAction error:", error);
    }
  },
  trackFeatureUsage: (...args: any[]) => {
    try {
      return getAnalytics().trackFeatureUsage(...args);
    } catch (error) {
      console.error("Analytics trackFeatureUsage error:", error);
    }
  },
  trackError: (...args: any[]) => {
    try {
      return getAnalytics().trackError(...args);
    } catch (error) {
      console.error("Analytics trackError error:", error);
    }
  },
  trackPerformance: (...args: any[]) => {
    try {
      return getAnalytics().trackPerformance(...args);
    } catch (error) {
      console.error("Analytics trackPerformance error:", error);
    }
  },
  enableAnalytics: (...args: any[]) => {
    try {
      return getAnalytics().enableAnalytics(...args);
    } catch (error) {
      console.error("Analytics enableAnalytics error:", error);
    }
  },
  disableAnalytics: (...args: any[]) => {
    try {
      return getAnalytics().disableAnalytics(...args);
    } catch (error) {
      console.error("Analytics disableAnalytics error:", error);
    }
  },
  getDebugInfo: (...args: any[]) => {
    try {
      return getAnalytics().getDebugInfo(...args);
    } catch (error) {
      console.error("Analytics getDebugInfo error:", error);
      return dummyAnalytics.getDebugInfo();
    }
  },
};

export { analyticsProxy as analytics };

// React hook for easy usage
export function useAnalytics() {
  return {
    track: analyticsProxy.track,
    trackPageView: analyticsProxy.trackPageView,
    trackFileUpload: analyticsProxy.trackFileUpload,
    trackProjectAction: analyticsProxy.trackProjectAction,
    trackFeatureUsage: analyticsProxy.trackFeatureUsage,
    trackError: analyticsProxy.trackError,
  };
}

// Performance utilities
export function measurePerformance<T>(fn: () => T, name: string): T {
  try {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    analyticsProxy.trackPerformance(name, end - start);
    return result;
  } catch (error) {
    console.error("Performance measurement error:", error);
    return fn();
  }
}

export function measureAsyncPerformance<T>(
  fn: () => Promise<T>,
  name: string,
): Promise<T> {
  try {
    const start = performance.now();
    return fn().then(
      (result) => {
        const end = performance.now();
        analyticsProxy.trackPerformance(name, end - start);
        return result;
      },
      (error) => {
        const end = performance.now();
        analyticsProxy.trackPerformance(`${name}_error`, end - start);
        throw error;
      },
    );
  } catch (error) {
    console.error("Async performance measurement error:", error);
    return fn();
  }
}