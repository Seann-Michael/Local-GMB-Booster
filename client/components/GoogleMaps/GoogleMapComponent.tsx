import React, { useEffect, useState } from "react";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Maximize } from "lucide-react";
import { toast } from "sonner";
import { getGoogleMapsApiKey } from "@/lib/googleMaps";

interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  content?: string;
  color?: string;
  rank?: number | null;
  icon?: string;
}

interface Waypoint {
  id: string;
  position: { lat: number; lng: number };
  rank: number;
}

interface GoogleMapComponentProps {
  address?: string;
  lat?: number;
  lng?: number;
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  showControls?: boolean;
  showDirectionsButton?: boolean;
  className?: string;
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  waypoints?: Waypoint[];
  onWaypointClick?: (waypointId: string) => void;
  selectedWaypoint?: string | null;
  onMapLoad?: (map: google.maps.Map) => void;
}

export const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  address,
  lat,
  lng,
  center,
  zoom = 14,
  height = "300px",
  showControls = true,
  showDirectionsButton = true,
  className,
  markers = [],
  onMarkerClick,
  waypoints = [],
  onWaypointClick,
  selectedWaypoint,
  onMapLoad,
}) => {
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
    null,
  );
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Check if API key is available
  useEffect(() => {
    try {
      const apiKey = getGoogleMapsApiKey();
      if (!apiKey) {
        setUseIframeFallback(true);
      }
    } catch (error) {
      console.error("Error checking Google Maps API key:", error);
      setUseIframeFallback(true);
    }
  }, []);

  const mapOptions: google.maps.MapOptions = {
    zoom,
    disableDefaultUI: !showControls,
    zoomControl: showControls,
    streetViewControl: showControls,
    fullscreenControl: showControls,
  };

  const { mapRef, map, isLoaded, error, addMarker, setCenter } =
    useGoogleMaps(mapOptions);

  // Add timeout for loading state
  useEffect(() => {
    if (useIframeFallback) return;

    const timer = setTimeout(() => {
      try {
        if (!isLoaded && !error && !useIframeFallback) {
          console.warn("Google Maps loading timeout, falling back to iframe");
          setUseIframeFallback(true);
        }
      } catch (error) {
        console.error("Error in timeout handler:", error);
        setUseIframeFallback(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [isLoaded, error, useIframeFallback]);

  // Create custom marker icon based on rank and color
  const createMarkerIcon = (marker: MapMarker): google.maps.Icon | string => {
    if (marker.icon === "business") {
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="${marker.color || "#3B82F6"}" stroke="white" stroke-width="2"/>
            <path d="M16 8 L20 12 L18 12 L18 20 L14 20 L14 12 L12 12 Z" fill="white"/>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16),
      };
    }

    if (marker.rank) {
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0 C7.163 0 0 7.163 0 16 C0 24.837 16 40 16 40 S32 24.837 32 16 C32 7.163 24.837 0 16 0 Z" fill="${marker.color || "#6B7280"}"/>
            <circle cx="16" cy="16" r="12" fill="white"/>
            <text x="16" y="21" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="${marker.color || "#6B7280"}">${marker.rank}</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(32, 40),
        anchor: new google.maps.Point(16, 40),
      };
    }

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="24" height="30" viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0 C5.373 0 0 5.373 0 12 C0 18.627 12 30 12 30 S24 18.627 24 12 C24 5.373 18.627 0 12 0 Z" fill="${marker.color || "#6B7280"}"/>
          <circle cx="12" cy="12" r="8" fill="white"/>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(24, 30),
      anchor: new google.maps.Point(12, 30),
    };
  };

  // Clear existing markers
  const clearMarkers = () => {
    mapMarkers.forEach((marker) => marker.setMap(null));
    setMapMarkers([]);
    if (infoWindow) {
      infoWindow.close();
    }
  };

  // Handle map center and markers
  useEffect(() => {
    if (!map) return;

    // Determine the center
    let mapCenter = center;
    if (!mapCenter && lat !== undefined && lng !== undefined) {
      mapCenter = { lat, lng };
    }
    if (!mapCenter && markers.length > 0) {
      // Calculate center from markers
      const avgLat =
        markers.reduce((sum, m) => sum + m.position.lat, 0) / markers.length;
      const avgLng =
        markers.reduce((sum, m) => sum + m.position.lng, 0) / markers.length;
      mapCenter = { lat: avgLat, lng: avgLng };
    }

    if (mapCenter) {
      setCenter(mapCenter);
    }

    // Clear existing markers
    clearMarkers();

    // Create info window if not exists
    if (!infoWindow) {
      setInfoWindow(new google.maps.InfoWindow());
    }

    // Add new markers
    const newMarkers: google.maps.Marker[] = [];

    // Add custom markers
    markers.forEach((markerData) => {
      const googleMarker = new google.maps.Marker({
        position: markerData.position,
        map: map,
        title: markerData.title,
        icon: createMarkerIcon(markerData),
      });

      // Add click listener
      googleMarker.addListener("click", () => {
        if (infoWindow && markerData.content) {
          infoWindow.setContent(markerData.content);
          infoWindow.open(map, googleMarker);
        }
        if (onMarkerClick) {
          onMarkerClick(markerData);
        }
      });

      newMarkers.push(googleMarker);
    });

    // Add legacy single marker if no custom markers and coordinates provided
    if (markers.length === 0 && lat !== undefined && lng !== undefined) {
      const legacyMarker = addMarker(
        { lat, lng },
        {
          title: address || "Location",
        },
      );
      newMarkers.push(legacyMarker);
    }

    setMapMarkers(newMarkers);

    // Fit bounds if multiple markers
    if (markers.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend(marker.position);
      });
      map.fitBounds(bounds);

      // Add padding
      setTimeout(() => {
        if (map.getZoom() && map.getZoom()! > 15) {
          map.setZoom(15);
        }
      }, 100);
    }
  }, [
    map,
    markers,
    center,
    lat,
    lng,
    address,
    addMarker,
    setCenter,
    infoWindow,
    onMarkerClick,
  ]);

  const openInGoogleMaps = () => {
    let url = "https://maps.google.com/";

    if (lat !== undefined && lng !== undefined) {
      url += `?q=${lat},${lng}`;
    } else if (address) {
      url += `?q=${encodeURIComponent(address)}`;
    }

    window.open(url, "_blank");
  };

  const getDirections = () => {
    let url = "https://maps.google.com/maps/dir/";

    if (lat !== undefined && lng !== undefined) {
      url += `/${lat},${lng}`;
    } else if (address) {
      url += `/${encodeURIComponent(address)}`;
    }

    window.open(url, "_blank");
  };

  // Iframe fallback when no API key is available
  if (
    useIframeFallback &&
    (address || (lat !== undefined && lng !== undefined))
  ) {
    let embedUrl = "";
    if (lat !== undefined && lng !== undefined) {
      embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=${zoom}&output=embed`;
    } else if (address) {
      embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&hl=en&z=${zoom}&output=embed`;
    }

    return (
      <Card className={className}>
        <CardContent className="p-3">
          <iframe
            src={embedUrl}
            width="100%"
            height={height}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full rounded-md"
          />

          <div className="flex justify-between items-center mt-3 gap-2">
            <div className="flex-1 min-w-0">
              {address && (
                <p
                  key="address-text"
                  className="text-xs text-muted-foreground truncate"
                >
                  {address}
                </p>
              )}
              {lat !== undefined && lng !== undefined && !address && (
                <p
                  key="coordinates-text"
                  className="text-xs text-muted-foreground font-mono"
                >
                  {lat.toFixed(6)}, {lng.toFixed(6)}
                </p>
              )}
            </div>

            <div className="flex gap-1">
              {showDirectionsButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getDirections}
                  className="gap-1 text-xs px-2 h-7"
                >
                  <Navigation className="h-3 w-3" />
                  Directions
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={openInGoogleMaps}
                className="gap-1 text-xs px-2 h-7"
              >
                <Maximize className="h-3 w-3" />
                Open
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center flex-col space-y-3 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="font-medium text-sm">Map Unavailable</h3>
              <p className="text-xs text-muted-foreground mt-1">{error}</p>
            </div>
            {(address || (lat !== undefined && lng !== undefined)) && (
              <Button
                variant="outline"
                size="sm"
                onClick={openInGoogleMaps}
                className="gap-2"
              >
                <Navigation className="h-3 w-3" />
                Open in Google Maps
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded && !useIframeFallback) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center" style={{ height }}>
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">
                Loading interactive map...
              </span>
              <span className="text-xs text-muted-foreground">
                This may take a few seconds
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-3">
        <div
          ref={mapRef}
          style={{ height }}
          className="w-full rounded-md overflow-hidden"
        />

        {(showDirectionsButton ||
          address ||
          (lat !== undefined && lng !== undefined)) && (
          <div className="flex justify-between items-center mt-3 gap-2">
            <div className="flex-1 min-w-0">
              {address && (
                <p
                  key="address-text"
                  className="text-xs text-muted-foreground truncate"
                >
                  {address}
                </p>
              )}
              {lat !== undefined && lng !== undefined && !address && (
                <p
                  key="coordinates-text"
                  className="text-xs text-muted-foreground font-mono"
                >
                  {lat.toFixed(6)}, {lng.toFixed(6)}
                </p>
              )}
            </div>

            <div className="flex gap-1">
              {showDirectionsButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getDirections}
                  className="gap-1 text-xs px-2 h-7"
                >
                  <Navigation className="h-3 w-3" />
                  Directions
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={openInGoogleMaps}
                className="gap-1 text-xs px-2 h-7"
              >
                <Maximize className="h-3 w-3" />
                Open
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
