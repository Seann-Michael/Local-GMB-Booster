import React, { useEffect, useState } from "react";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Maximize } from "lucide-react";
import { toast } from "sonner";
import { getGoogleMapsApiKey } from "@/lib/googleMaps";

interface GoogleMapComponentProps {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: string;
  showControls?: boolean;
  showDirectionsButton?: boolean;
  className?: string;
}

export const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  address,
  lat,
  lng,
  zoom = 14,
  height = "300px",
  showControls = true,
  showDirectionsButton = true,
  className,
}) => {
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Check if API key is available
  useEffect(() => {
    const apiKey = getGoogleMapsApiKey();
    if (!apiKey) {
      setUseIframeFallback(true);
    }
  }, []);

  // Add timeout for loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded && !error && !useIframeFallback) {
        console.warn("Google Maps loading timeout, falling back to iframe");
        setUseIframeFallback(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [isLoaded, error, useIframeFallback]);

  const mapOptions: google.maps.MapOptions = {
    zoom,
    disableDefaultUI: !showControls,
    zoomControl: showControls,
    streetViewControl: showControls,
    fullscreenControl: showControls,
  };

  const { mapRef, map, isLoaded, error, addMarker, setCenter } =
    useGoogleMaps(mapOptions);

  useEffect(() => {
    if (map && lat !== undefined && lng !== undefined) {
      // Set center and add marker for coordinates
      const position = { lat, lng };
      setCenter(position);

      // Remove existing marker
      if (marker) {
        marker.setMap(null);
      }

      // Add new marker
      const newMarker = addMarker(position, {
        title: address || "Location",
      });
      setMarker(newMarker);
    }
  }, [map, lat, lng, address, addMarker, setCenter, marker]);

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

  if (!isLoaded) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center" style={{ height }}>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">
                Loading map...
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
