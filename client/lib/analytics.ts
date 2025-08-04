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
      // Check if analytics is enabled (GDPR compliance)
      this.isEnabled =
        typeof window !== "undefined" &&
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
      // Track navigation timing
      window.addEventListener("load", () => {
        setTimeout(() => {
          try {
            const navigation = performance.getEntriesByType(
              "navigation",
            )[0] as PerformanceNavigationTiming;

            if (navigation) {
              this.trackPerformance(
                "page_load_time",
                navigation.loadEventEnd - navigation.fetchStart,
              );
              this.trackPerformance(
                "dom_content_loaded",
                navigation.domContentLoadedEventEnd - navigation.fetchStart,
              );
              this.trackPerformance(
                "first_byte",
                navigation.responseStart - navigation.fetchStart,
              );
            }
          } catch (error) {
            console.error("Performance tracking error:", error);
          }
        }, 0);
      });

      // Track resource loading
      if (typeof PerformanceObserver !== "undefined") {
        const observer = new PerformanceObserver((list) => {
          try {
            for (const entry of list.getEntries()) {
              if (entry.entryType === "resource") {
                const resource = entry as PerformanceResourceTiming;
                this.trackPerformance(
                  `resource_${resource.initiatorType}`,
                  resource.duration,
                );
              }
            }
          } catch (error) {
            console.error("Resource tracking error:", error);
          }
        });

        observer.observe({ entryTypes: ["resource"] });
      }
    } catch (error) {
      console.error("Performance monitoring setup failed:", error);
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
    // First Contentful Paint
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          this.trackPerformance("first_contentful_paint", entry.startTime);
        }
      }
    });

    observer.observe({ entryTypes: ["paint"] });

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.trackPerformance("largest_contentful_paint", lastEntry.startTime);
    });

    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
    });

    clsObserver.observe({ entryTypes: ["layout-shift"] });

    // Track CLS on page unload
    window.addEventListener("beforeunload", () => {
      this.trackPerformance("cumulative_layout_shift", clsValue);
    });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.trackPerformance(
          "first_input_delay",
          (entry as any).processingStart - entry.startTime,
        );
      }
    });

    fidObserver.observe({ entryTypes: ["first-input"] });
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
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackFileUpload: analytics.trackFileUpload.bind(analytics),
    trackProjectAction: analytics.trackProjectAction.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
  };
}

// Performance utilities
export function measurePerformance<T>(fn: () => T, name: string): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  analytics.trackPerformance(name, end - start);
  return result;
}

export function measureAsyncPerformance<T>(
  fn: () => Promise<T>,
  name: string,
): Promise<T> {
  const start = performance.now();
  return fn().then(
    (result) => {
      const end = performance.now();
      analytics.trackPerformance(name, end - start);
      return result;
    },
    (error) => {
      const end = performance.now();
      analytics.trackPerformance(`${name}_error`, end - start);
      throw error;
    },
  );
}
