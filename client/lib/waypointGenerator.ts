import type { GeographicWaypoint } from "./dataForSEO";

export interface WaypointGenerationOptions {
  centerLat: number;
  centerLng: number;
  radiusKm: number;
  pattern: "grid" | "circular" | "radial" | "custom";
  density: "low" | "medium" | "high" | "ultra";
  excludeWater?: boolean;
  minDistanceBetweenPoints?: number;
}

export interface WaypointPattern {
  name: string;
  description: string;
  icon: string;
  generate: (options: WaypointGenerationOptions) => GeographicWaypoint[];
}

export class WaypointGenerator {
  private static readonly EARTH_RADIUS_KM = 6371;

  static getDensityConfig(density: WaypointGenerationOptions["density"]) {
    switch (density) {
      case "low":
        return { gridSize: 3, circularPoints: 6, radialRings: 2 };
      case "medium":
        return { gridSize: 5, circularPoints: 12, radialRings: 3 };
      case "high":
        return { gridSize: 7, circularPoints: 18, radialRings: 4 };
      case "ultra":
        return { gridSize: 10, circularPoints: 24, radialRings: 5 };
      default:
        return { gridSize: 5, circularPoints: 12, radialRings: 3 };
    }
  }

  static generateGrid(
    options: WaypointGenerationOptions,
  ): GeographicWaypoint[] {
    const { centerLat, centerLng, radiusKm, density } = options;
    const config = this.getDensityConfig(density);
    const waypoints: GeographicWaypoint[] = [];

    // Convert radius from km to degrees
    const latDegreePerKm = 1 / 111;
    const lngDegreePerKm = 1 / (111 * Math.cos((centerLat * Math.PI) / 180));

    const latRadius = radiusKm * latDegreePerKm;
    const lngRadius = radiusKm * lngDegreePerKm;

    const gridSize = config.gridSize;
    const step = 2 / (gridSize - 1);

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const latOffset = (i * step - 1) * latRadius;
        const lngOffset = (j * step - 1) * lngRadius;

        const lat = centerLat + latOffset;
        const lng = centerLng + lngOffset;

        // Check if point is within circular boundary
        const distance = this.calculateDistance(centerLat, centerLng, lat, lng);
        if (distance <= radiusKm) {
          waypoints.push({
            id: `grid-${i}-${j}`,
            lat,
            lng,
            name: `Grid ${String.fromCharCode(65 + i)}${j + 1}`,
            address: `Grid Point ${i + 1}-${j + 1}`,
          });
        }
      }
    }

    return waypoints;
  }

  static generateCircular(
    options: WaypointGenerationOptions,
  ): GeographicWaypoint[] {
    const { centerLat, centerLng, radiusKm, density } = options;
    const config = this.getDensityConfig(density);
    const waypoints: GeographicWaypoint[] = [];

    // Add center point
    waypoints.push({
      id: "center",
      lat: centerLat,
      lng: centerLng,
      name: "Center",
      address: "Center Point",
    });

    // Convert radius from km to degrees
    const latDegreePerKm = 1 / 111;
    const lngDegreePerKm = 1 / (111 * Math.cos((centerLat * Math.PI) / 180));

    const latRadius = radiusKm * latDegreePerKm;
    const lngRadius = radiusKm * lngDegreePerKm;

    const numberOfPoints = config.circularPoints;

    // Generate points in a circle
    for (let i = 0; i < numberOfPoints; i++) {
      const angle = (2 * Math.PI * i) / numberOfPoints;
      const lat = centerLat + latRadius * Math.cos(angle);
      const lng = centerLng + lngRadius * Math.sin(angle);

      const direction = this.getCardinalDirection(angle);

      waypoints.push({
        id: `circle-${i}`,
        lat,
        lng,
        name: `${direction} ${i + 1}`,
        address: `Circular Point ${i + 1} (${direction})`,
      });
    }

    return waypoints;
  }

  static generateRadial(
    options: WaypointGenerationOptions,
  ): GeographicWaypoint[] {
    const { centerLat, centerLng, radiusKm, density } = options;
    const config = this.getDensityConfig(density);
    const waypoints: GeographicWaypoint[] = [];

    // Add center point
    waypoints.push({
      id: "center",
      lat: centerLat,
      lng: centerLng,
      name: "Center",
      address: "Center Point",
    });

    const numberOfRings = config.radialRings;
    const pointsPerRing = Math.max(
      6,
      Math.floor(config.circularPoints / numberOfRings),
    );

    // Convert radius from km to degrees
    const latDegreePerKm = 1 / 111;
    const lngDegreePerKm = 1 / (111 * Math.cos((centerLat * Math.PI) / 180));

    for (let ring = 1; ring <= numberOfRings; ring++) {
      const ringRadius = (radiusKm * ring) / numberOfRings;
      const latRadius = ringRadius * latDegreePerKm;
      const lngRadius = ringRadius * lngDegreePerKm;

      const pointsInThisRing = pointsPerRing * ring; // More points in outer rings

      for (let i = 0; i < pointsInThisRing; i++) {
        const angle = (2 * Math.PI * i) / pointsInThisRing;
        const lat = centerLat + latRadius * Math.cos(angle);
        const lng = centerLng + lngRadius * Math.sin(angle);

        const direction = this.getCardinalDirection(angle);

        waypoints.push({
          id: `radial-${ring}-${i}`,
          lat,
          lng,
          name: `Ring ${ring} ${direction}`,
          address: `Radial Point R${ring}-${i + 1}`,
        });
      }
    }

    return waypoints;
  }

  static generateCustomPattern(
    options: WaypointGenerationOptions,
    customPoints?: { lat: number; lng: number; name?: string }[],
  ): GeographicWaypoint[] {
    if (!customPoints || customPoints.length === 0) {
      return this.generateGrid(options); // Fallback to grid
    }

    return customPoints.map((point, index) => ({
      id: `custom-${index}`,
      lat: point.lat,
      lng: point.lng,
      name: point.name || `Custom ${index + 1}`,
      address: `Custom Point ${index + 1}`,
    }));
  }

  static optimizeWaypoints(
    waypoints: GeographicWaypoint[],
    options: WaypointGenerationOptions,
  ): GeographicWaypoint[] {
    let optimized = [...waypoints];

    // Remove points that are too close together
    if (
      options.minDistanceBetweenPoints &&
      options.minDistanceBetweenPoints > 0
    ) {
      optimized = this.removeTooClosePoints(
        optimized,
        options.minDistanceBetweenPoints,
      );
    }

    // Sort by distance from center for better processing order
    optimized = optimized.sort((a, b) => {
      const distA = this.calculateDistance(
        options.centerLat,
        options.centerLng,
        a.lat,
        a.lng,
      );
      const distB = this.calculateDistance(
        options.centerLat,
        options.centerLng,
        b.lat,
        b.lng,
      );
      return distA - distB;
    });

    return optimized;
  }

  private static removeTooClosePoints(
    waypoints: GeographicWaypoint[],
    minDistanceKm: number,
  ): GeographicWaypoint[] {
    const filtered: GeographicWaypoint[] = [];

    for (const waypoint of waypoints) {
      const isTooClose = filtered.some((existing) => {
        const distance = this.calculateDistance(
          waypoint.lat,
          waypoint.lng,
          existing.lat,
          existing.lng,
        );
        return distance < minDistanceKm;
      });

      if (!isTooClose) {
        filtered.push(waypoint);
      }
    }

    return filtered;
  }

  static calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.EARTH_RADIUS_KM * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private static getCardinalDirection(angleRadians: number): string {
    const degrees = (angleRadians * 180) / Math.PI;
    const normalized = ((degrees % 360) + 360) % 360;

    if (normalized < 22.5 || normalized >= 337.5) return "N";
    if (normalized < 67.5) return "NE";
    if (normalized < 112.5) return "E";
    if (normalized < 157.5) return "SE";
    if (normalized < 202.5) return "S";
    if (normalized < 247.5) return "SW";
    if (normalized < 292.5) return "W";
    return "NW";
  }

  static estimateProcessingTime(waypointCount: number): {
    minutes: number;
    seconds: number;
    total: string;
  } {
    // Estimate ~2-3 seconds per waypoint including API delays
    const totalSeconds = waypointCount * 2.5;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return {
      minutes,
      seconds,
      total: minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`,
    };
  }

  static getBoundingBox(waypoints: GeographicWaypoint[]): {
    north: number;
    south: number;
    east: number;
    west: number;
    center: { lat: number; lng: number };
  } {
    if (waypoints.length === 0) {
      return {
        north: 0,
        south: 0,
        east: 0,
        west: 0,
        center: { lat: 0, lng: 0 },
      };
    }

    let north = waypoints[0].lat;
    let south = waypoints[0].lat;
    let east = waypoints[0].lng;
    let west = waypoints[0].lng;

    waypoints.forEach((point) => {
      north = Math.max(north, point.lat);
      south = Math.min(south, point.lat);
      east = Math.max(east, point.lng);
      west = Math.min(west, point.lng);
    });

    return {
      north,
      south,
      east,
      west,
      center: {
        lat: (north + south) / 2,
        lng: (east + west) / 2,
      },
    };
  }
}

// Export predefined patterns
export const WAYPOINT_PATTERNS: WaypointPattern[] = [
  {
    name: "Grid Pattern",
    description: "Evenly spaced grid covering the entire area",
    icon: "grid-3x3",
    generate: (options) => WaypointGenerator.generateGrid(options),
  },
  {
    name: "Circular Pattern",
    description: "Points arranged in a circle around the center",
    icon: "circle",
    generate: (options) => WaypointGenerator.generateCircular(options),
  },
  {
    name: "Radial Pattern",
    description: "Multiple rings expanding outward from center",
    icon: "target",
    generate: (options) => WaypointGenerator.generateRadial(options),
  },
  {
    name: "Custom Points",
    description: "Manually placed waypoints",
    icon: "map-pin",
    generate: (options) => WaypointGenerator.generateCustomPattern(options),
  },
];
