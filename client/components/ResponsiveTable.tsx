import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn("w-full overflow-x-auto border rounded-lg", className)}>
      <div className="min-w-full inline-block align-middle">{children}</div>
    </div>
  );
}

// Hook for responsive breakpoints
export function useResponsive() {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
}

// Utility component for mobile-friendly card layouts
interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileCard({ children, className }: MobileCardProps) {
  return (
    <div
      className={cn(
        "p-4 border rounded-lg bg-white space-y-3 sm:hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

// Responsive grid utility
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export function ResponsiveGrid({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
}: ResponsiveGridProps) {
  const gridClasses = cn(
    "grid gap-4",
    cols.mobile === 1 ? "grid-cols-1" : `grid-cols-${cols.mobile}`,
    cols.tablet && `sm:grid-cols-${cols.tablet}`,
    cols.desktop && `lg:grid-cols-${cols.desktop}`,
    className,
  );

  return <div className={gridClasses}>{children}</div>;
}
