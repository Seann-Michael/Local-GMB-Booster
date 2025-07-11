import { toast } from "sonner";

// Google Maps Configuration
const GOOGLE_MAPS_CONFIG = {
  apiKey: "", // Will be loaded from third-party integrations
  libraries: ["places", "geometry", "drawing"] as google.maps.Libraries,
  version: "weekly",
};

// Types
export interface PlaceResult {
  address: string;
  lat: number;
  lng: number;
  placeId: string;
  formattedAddress: string;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

// Google Maps API Key Management
export const getGoogleMapsApiKey = (): string => {
  try {
    const integrations = JSON.parse(
      localStorage.getItem("third_party_integrations") || "[]",
    );
    const googleMapsIntegration = integrations.find(
      (int: any) => int.service === "Google Maps" && int.isActive,
    );

    if (googleMapsIntegration?.apiKey) {
      // Extract the actual API key (remove masking if present)
      let apiKey = googleMapsIntegration.apiKey;

      // If it's a masked key, try to get the full key from a secure storage
      if (apiKey.includes("•")) {
        // In production, this would be retrieved securely
        console.warn(
          "Using masked API key. Please configure the full API key.",
        );
        return "";
      }

      return apiKey;
    }
  } catch (error) {
    console.error("Error retrieving Google Maps API key:", error);
  }

  return "";
};

// Load Google Maps API
export const loadGoogleMapsAPI = (): Promise<typeof google> => {
  return new Promise((resolve, reject) => {
    if (typeof google !== "undefined" && google.maps) {
      resolve(google);
      return;
    }

    const apiKey = getGoogleMapsApiKey();
    if (!apiKey) {
      reject(new Error("Google Maps API key not configured"));
      return;
    }

    // Check if script is already loading
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Wait for existing script to load
      const checkGoogleMaps = setInterval(() => {
        if (typeof google !== "undefined" && google.maps) {
          clearInterval(checkGoogleMaps);
          resolve(google);
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkGoogleMaps);
        reject(new Error("Google Maps API failed to load"));
      }, 10000);
      return;
    }

    // Create script element
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${GOOGLE_MAPS_CONFIG.libraries.join(",")}&v=${GOOGLE_MAPS_CONFIG.version}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (typeof google !== "undefined" && google.maps) {
        resolve(google);
      } else {
        reject(new Error("Google Maps API failed to initialize"));
      }
    };

    script.onerror = () => {
      reject(new Error("Failed to load Google Maps API script"));
    };

    document.head.appendChild(script);
  });
};

// Initialize Google Maps for a container
export const initializeMap = async (
  container: HTMLElement,
  options: google.maps.MapOptions = {},
): Promise<google.maps.Map> => {
  try {
    await loadGoogleMapsAPI();

    const defaultOptions: google.maps.MapOptions = {
      zoom: 14,
      center: { lat: 40.7128, lng: -74.006 }, // Default to NYC
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      ...options,
    };

    return new google.maps.Map(container, defaultOptions);
  } catch (error) {
    console.error("Failed to initialize Google Maps:", error);
    throw error;
  }
};

// Address Autocomplete
export const initializeAutocomplete = async (
  input: HTMLInputElement,
  options: google.maps.places.AutocompleteOptions = {},
): Promise<google.maps.places.Autocomplete> => {
  try {
    await loadGoogleMapsAPI();

    const defaultOptions: google.maps.places.AutocompleteOptions = {
      types: ["address"],
      componentRestrictions: { country: "us" }, // Adjust as needed
      fields: [
        "address_components",
        "formatted_address",
        "geometry",
        "place_id",
      ],
      ...options,
    };

    return new google.maps.places.Autocomplete(input, defaultOptions);
  } catch (error) {
    console.error("Failed to initialize Google Places Autocomplete:", error);
    throw error;
  }
};

// Geocoding
export const geocodeAddress = async (
  address: string,
): Promise<PlaceResult | null> => {
  try {
    await loadGoogleMapsAPI();
    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const result = results[0];
          const location = result.geometry.location;

          resolve({
            address: address,
            lat: location.lat(),
            lng: location.lng(),
            placeId: result.place_id || "",
            formattedAddress: result.formatted_address,
          });
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
};

// Reverse Geocoding
export const reverseGeocode = async (
  lat: number,
  lng: number,
): Promise<string | null> => {
  try {
    await loadGoogleMapsAPI();
    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
};

// Get directions
export const getDirections = async (
  origin: string | google.maps.LatLng,
  destination: string | google.maps.LatLng,
  travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING,
): Promise<google.maps.DirectionsResult | null> => {
  try {
    await loadGoogleMapsAPI();
    const directionsService = new google.maps.DirectionsService();

    return new Promise((resolve, reject) => {
      directionsService.route(
        {
          origin,
          destination,
          travelMode,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            resolve(result);
          } else {
            resolve(null);
          }
        },
      );
    });
  } catch (error) {
    console.error("Failed to get directions:", error);
    return null;
  }
};

// Utility: Create embed URL for iframe
export const createMapEmbedUrl = (
  location: string | { lat: number; lng: number },
): string => {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) return "";

  let query = "";
  if (typeof location === "string") {
    query = encodeURIComponent(location);
  } else {
    query = `${location.lat},${location.lng}`;
  }

  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}&zoom=14`;
};

// Test API key connection
export const testGoogleMapsConnection = async (): Promise<boolean> => {
  try {
    const apiKey = getGoogleMapsApiKey();
    if (!apiKey) {
      toast.error("Google Maps API key not configured");
      return false;
    }

    await loadGoogleMapsAPI();

    // Test with a simple geocoding request
    const result = await geocodeAddress(
      "1600 Amphitheatre Parkway, Mountain View, CA",
    );

    if (result) {
      toast.success("Google Maps API connection successful");
      return true;
    } else {
      toast.error("Google Maps API test failed");
      return false;
    }
  } catch (error) {
    console.error("Google Maps API test failed:", error);
    toast.error("Google Maps API connection failed");
    return false;
  }
};
