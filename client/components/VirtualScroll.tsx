import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAnalytics } from "@/lib/analytics";

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number, scrollDirection: "up" | "down") => void;
  loadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  gap?: number;
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = "",
  onScroll,
  loadMore,
  hasMore = false,
  loading = false,
  gap = 0,
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const lastScrollTopRef = useRef(0);
  const { trackPerformance } = useAnalytics();

  const totalHeight = items.length * (itemHeight + gap);
  const visibleItemCount = Math.ceil(containerHeight / (itemHeight + gap));
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / (itemHeight + gap)) - overscan,
  );
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleItemCount + overscan * 2,
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * (itemHeight + gap);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = e.currentTarget.scrollTop;
      const scrollDirection =
        newScrollTop > lastScrollTopRef.current ? "down" : "up";

      setScrollTop(newScrollTop);
      setIsScrolling(true);
      lastScrollTopRef.current = newScrollTop;

      onScroll?.(newScrollTop, scrollDirection);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set new timeout
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      // Infinite loading trigger
      if (
        loadMore &&
        hasMore &&
        !loading &&
        newScrollTop + containerHeight >= totalHeight - itemHeight * 3
      ) {
        loadMore();
        trackPerformance("virtual_scroll_load_more", Date.now());
      }
    },
    [
      onScroll,
      loadMore,
      hasMore,
      loading,
      totalHeight,
      containerHeight,
      itemHeight,
      trackPerformance,
    ],
  );

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Performance monitoring
  useEffect(() => {
    if (items.length > 0) {
      trackPerformance(
        "virtual_scroll_render_count",
        endIndex - startIndex + 1,
      );
    }
  }, [startIndex, endIndex, items.length, trackPerformance]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{
                height: itemHeight,
                marginBottom: gap,
              }}
              className={isScrolling ? "will-change-transform" : ""}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>

        {/* Loading indicator for infinite scroll */}
        {loading && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="spinner" />
              Loading more items...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook for managing virtual scroll state
export function useVirtualScroll<T>(
  allItems: T[],
  pageSize: number = 50,
  initialLoad: number = 100,
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Initial load
    const initial = allItems.slice(0, initialLoad);
    setItems(initial);
    setHasMore(allItems.length > initialLoad);
  }, [allItems, initialLoad]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Simulate async loading
    setTimeout(() => {
      const currentLength = items.length;
      const nextItems = allItems.slice(currentLength, currentLength + pageSize);

      setItems((prev) => [...prev, ...nextItems]);
      setHasMore(currentLength + nextItems.length < allItems.length);
      setLoading(false);
    }, 100);
  }, [allItems, items.length, pageSize, loading, hasMore]);

  return {
    items,
    loading,
    hasMore,
    loadMore,
    reset: () => {
      const initial = allItems.slice(0, initialLoad);
      setItems(initial);
      setHasMore(allItems.length > initialLoad);
      setLoading(false);
    },
  };
}

// Optimized list component for projects
interface VirtualProjectListProps {
  projects: any[];
  renderProject: (project: any, index: number) => React.ReactNode;
  className?: string;
  onScroll?: (scrollTop: number, direction: "up" | "down") => void;
}

export function VirtualProjectList({
  projects,
  renderProject,
  className = "",
  onScroll,
}: VirtualProjectListProps) {
  const { items, loading, hasMore, loadMore } = useVirtualScroll(
    projects,
    20,
    50,
  );

  return (
    <VirtualScroll
      items={items}
      itemHeight={280} // Approximate height of project card
      containerHeight={600}
      renderItem={renderProject}
      overscan={3}
      className={className}
      onScroll={onScroll}
      loadMore={loadMore}
      hasMore={hasMore}
      loading={loading}
      gap={24} // Gap between project cards
    />
  );
}

// Optimized grid component
interface VirtualGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemWidth: number;
  itemHeight: number;
  containerWidth: number;
  containerHeight: number;
  gap?: number;
  className?: string;
}

export function VirtualGrid<T>({
  items,
  renderItem,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  gap = 16,
  className = "",
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const columnsPerRow = Math.floor((containerWidth + gap) / (itemWidth + gap));
  const rowHeight = itemHeight + gap;
  const totalRows = Math.ceil(items.length / columnsPerRow);
  const totalHeight = totalRows * rowHeight;

  const startRow = Math.floor(scrollTop / rowHeight);
  const endRow = Math.min(
    totalRows - 1,
    startRow + Math.ceil(containerHeight / rowHeight) + 1,
  );

  const visibleItems: Array<{
    item: T;
    index: number;
    row: number;
    col: number;
  }> = [];

  for (let row = startRow; row <= endRow; row++) {
    for (let col = 0; col < columnsPerRow; col++) {
      const index = row * columnsPerRow + col;
      if (index < items.length) {
        visibleItems.push({
          item: items[index],
          index,
          row,
          col,
        });
      }
    }
  }

  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map(({ item, index, row, col }) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: col * (itemWidth + gap),
              top: row * rowHeight,
              width: itemWidth,
              height: itemHeight,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
