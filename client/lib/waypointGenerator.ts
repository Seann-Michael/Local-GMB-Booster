// Waypoint Generation and Management
export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Waypoint {
  id: string;
  coordinates: Coordinate;
  enabled: boolean;
  isCenter?: boolean;
  distance?: number; // Distance from center in selected unit
  bearing?: number; // Bearing from center in degrees
}

export interface WaypointGenerationOptions {
  center: Coordinate;
  count: number;
  distanceBetween: number; // Distance between waypoints
  unit: "miles" | "kilometers";
  pattern: "circle" | "grid" | "line";
}

// Convert miles to kilometers
export function milesToKilometers(miles: number): number {
  return miles * 1.60934;
}

// Convert kilometers to miles
export function kilometersToMiles(kilometers: number): number {
  return kilometers / 1.60934;
}

// Convert distance to meters for calculations
export function convertToMeters(
  distance: number,
  unit: "miles" | "kilometers",
): number {
  if (unit === "miles") {
    return milesToKilometers(distance) * 1000;
  }
  return distance * 1000;
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  coord1: Coordinate,
  coord2: Coordinate,
  unit: "miles" | "kilometers" = "kilometers",
): number {
  const R = unit === "miles" ? 3959 : 6371; // Earth's radius in miles or kilometers
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLng = toRadians(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) *
      Math.cos(toRadians(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Convert degrees to radians
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Convert radians to degrees
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

// Calculate bearing between two coordinates
export function calculateBearing(from: Coordinate, to: Coordinate): number {
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  let bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360; // Normalize to 0-360
}

// Generate waypoints based on options
export function generateWaypoints(
  options: WaypointGenerationOptions,
): Waypoint[] {
  const { center, count, distanceBetween, unit, pattern } = options;
  const waypoints: Waypoint[] = [];

  // Always add center point first
  waypoints.push({
    id: "center",
    coordinates: center,
    enabled: true,
    isCenter: true,
    distance: 0,
    bearing: 0,
  });

  switch (pattern) {
    case "circle":
      return [
        ...waypoints,
        ...generateCircularWaypoints(center, count - 1, distanceBetween, unit),
      ];
    case "grid":
      return [
        ...waypoints,
        ...generateGridWaypoints(center, count - 1, distanceBetween, unit),
      ];
    case "line":
      return [
        ...waypoints,
        ...generateLinearWaypoints(center, count - 1, distanceBetween, unit),
      ];
    default:
      return waypoints;
  }
}

// Generate waypoints in a circular pattern
function generateCircularWaypoints(
  center: Coordinate,
  count: number,
  radius: number,
  unit: "miles" | "kilometers",
): Waypoint[] {
  const waypoints: Waypoint[] = [];
  const radiusInMeters = convertToMeters(radius, unit);

  // Calculate how many rings we need
  const ringsCount = Math.ceil(Math.sqrt(count));
  let waypointIndex = 0;

  for (let ring = 1; ring <= ringsCount && waypointIndex < count; ring++) {
    const ringRadius = (radiusInMeters * ring) / ringsCount;
    const pointsInRing =
      ring === 1
        ? Math.min(6, count - waypointIndex)
        : Math.min(8 * ring, count - waypointIndex);

    for (let i = 0; i < pointsInRing && waypointIndex < count; i++) {
      const bearing = (360 / pointsInRing) * i;
      const coordinates = destinationPoint(center, ringRadius, bearing);

      waypoints.push({
        id: `waypoint-${waypointIndex + 1}`,
        coordinates,
        enabled: true,
        distance: unit === "miles" ? ringRadius / 1609.34 : ringRadius / 1000,
        bearing,
      });

      waypointIndex++;
    }
  }

  return waypoints;
}

// Generate waypoints in a grid pattern
function generateGridWaypoints(
  center: Coordinate,
  count: number,
  spacing: number,
  unit: "miles" | "kilometers",
): Waypoint[] {
  const waypoints: Waypoint[] = [];
  const spacingInMeters = convertToMeters(spacing, unit);

  // Calculate grid dimensions
  const gridSize = Math.ceil(Math.sqrt(count));
  const halfGrid = Math.floor(gridSize / 2);

  let waypointIndex = 0;

  for (let row = -halfGrid; row <= halfGrid && waypointIndex < count; row++) {
    for (let col = -halfGrid; col <= halfGrid && waypointIndex < count; col++) {
      if (row === 0 && col === 0) continue; // Skip center

      const latOffset = (row * spacingInMeters) / 111320; // Approximate meters to degrees
      const lngOffset =
        (col * spacingInMeters) / (111320 * Math.cos(toRadians(center.lat)));

      const coordinates: Coordinate = {
        lat: center.lat + latOffset,
        lng: center.lng + lngOffset,
      };

      const distance = calculateDistance(center, coordinates, unit);
      const bearing = calculateBearing(center, coordinates);

      waypoints.push({
        id: `waypoint-${waypointIndex + 1}`,
        coordinates,
        enabled: true,
        distance,
        bearing,
      });

      waypointIndex++;
    }
  }

  return waypoints;
}

// Generate waypoints in a linear pattern
function generateLinearWaypoints(
  center: Coordinate,
  count: number,
  spacing: number,
  unit: "miles" | "kilometers",
): Waypoint[] {
  const waypoints: Waypoint[] = [];
  const spacingInMeters = convertToMeters(spacing, unit);

  // Create points along N-S and E-W axes
  const directions = [0, 90, 180, 270]; // N, E, S, W
  let waypointIndex = 0;

  for (
    let distance = spacingInMeters;
    waypointIndex < count;
    distance += spacingInMeters
  ) {
    for (const bearing of directions) {
      if (waypointIndex >= count) break;

      const coordinates = destinationPoint(center, distance, bearing);

      waypoints.push({
        id: `waypoint-${waypointIndex + 1}`,
        coordinates,
        enabled: true,
        distance: unit === "miles" ? distance / 1609.34 : distance / 1000,
        bearing,
      });

      waypointIndex++;
    }
  }

  return waypoints;
}

// Calculate destination point given start point, distance, and bearing
function destinationPoint(
  start: Coordinate,
  distance: number,
  bearing: number,
): Coordinate {
  const R = 6371000; // Earth's radius in meters
  const bearingRad = toRadians(bearing);
  const lat1 = toRadians(start.lat);
  const lng1 = toRadians(start.lng);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distance / R) +
      Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearingRad),
  );

  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(distance / R) * Math.cos(lat1),
      Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2),
    );

  return {
    lat: toDegrees(lat2),
    lng: toDegrees(lng2),
  };
}

// Update waypoint enabled status
export function toggleWaypoint(
  waypoints: Waypoint[],
  waypointId: string,
): Waypoint[] {
  return waypoints.map((waypoint) =>
    waypoint.id === waypointId
      ? { ...waypoint, enabled: !waypoint.enabled }
      : waypoint,
  );
}

// Get enabled waypoints count
export function getEnabledWaypointsCount(waypoints: Waypoint[]): number {
  return waypoints.filter((waypoint) => waypoint.enabled).length;
}

// Get waypoints bounds for map view
export function getWaypointsBounds(waypoints: Waypoint[]): {
  north: number;
  south: number;
  east: number;
  west: number;
} {
  if (waypoints.length === 0) {
    return { north: 0, south: 0, east: 0, west: 0 };
  }

  let north = waypoints[0].coordinates.lat;
  let south = waypoints[0].coordinates.lat;
  let east = waypoints[0].coordinates.lng;
  let west = waypoints[0].coordinates.lng;

  waypoints.forEach((waypoint) => {
    const { lat, lng } = waypoint.coordinates;
    north = Math.max(north, lat);
    south = Math.min(south, lat);
    east = Math.max(east, lng);
    west = Math.min(west, lng);
  });

  return { north, south, east, west };
}
