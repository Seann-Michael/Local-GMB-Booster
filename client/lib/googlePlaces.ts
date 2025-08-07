// Google Places API Integration
export interface PlaceResult {
  placeId: string;
  name: string;
  formattedAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  types: string[];
  rating?: number;
  userRatingsTotal?: number;
  businessStatus?: string;
  cid?: string;
}

export interface PlaceSearchOptions {
  query: string;
  location?: {
    lat: number;
    lng: number;
  };
  radius?: number;
  type?: string;
}

// Extract CID from various Google URLs
export function extractCidFromUrl(url: string): string | null {
  try {
    // Handle different Google Maps URL formats
    const cidPatterns = [
      /\/data=.*!1s(0x[a-f0-9]+):0x([a-f0-9]+)/i, // Standard format
      /cid=(\d+)/i, // Direct CID parameter
      /!4m\d+!1s(0x[a-f0-9]+):0x([a-f0-9]+)/i, // Alternative format
    ];

    for (const pattern of cidPatterns) {
      const match = url.match(pattern);
      if (match) {
        if (match[2]) {
          // Convert hex to decimal for CID
          return parseInt(match[2], 16).toString();
        } else if (match[1] && match[1].startsWith('0x')) {
          return parseInt(match[1], 16).toString();
        } else if (match[1]) {
          return match[1];
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting CID from URL:', error);
    return null;
  }
}

// Extract Place ID from Google Maps URL
export function extractPlaceIdFromUrl(url: string): string | null {
  try {
    const placeIdPattern = /place_id:([A-Za-z0-9_-]+)/i;
    const match = url.match(placeIdPattern);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting Place ID from URL:', error);
    return null;
  }
}

// Mock Google Places API search (replace with actual implementation)
export async function searchPlaces(options: PlaceSearchOptions): Promise<PlaceResult[]> {
  // This is a mock implementation - replace with actual Google Places API call
  console.log('Searching places with options:', options);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock results
  const mockResults: PlaceResult[] = [
    {
      placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      name: `${options.query} - Main Location`,
      formattedAddress: '123 Main St, Anytown, ST 12345',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      types: ['restaurant', 'food', 'point_of_interest', 'establishment'],
      rating: 4.5,
      userRatingsTotal: 123,
      businessStatus: 'OPERATIONAL',
      cid: '1234567890123456789'
    },
    {
      placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY5',
      name: `${options.query} - Branch`,
      formattedAddress: '456 Oak Ave, Anytown, ST 12345',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      types: ['restaurant', 'food', 'point_of_interest', 'establishment'],
      rating: 4.2,
      userRatingsTotal: 87,
      businessStatus: 'OPERATIONAL',
      cid: '9876543210987654321'
    }
  ];
  
  return mockResults;
}

// Get place details by Place ID
export async function getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
  console.log('Getting place details for:', placeId);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock result
  return {
    placeId,
    name: 'Sample Business',
    formattedAddress: '789 Sample St, Example City, ST 12345',
    coordinates: { lat: 40.7414, lng: -74.0055 },
    types: ['restaurant', 'food', 'point_of_interest', 'establishment'],
    rating: 4.3,
    userRatingsTotal: 156,
    businessStatus: 'OPERATIONAL',
    cid: '1122334455667788990'
  };
}

// Get place details by CID
export async function getPlaceByCid(cid: string): Promise<PlaceResult | null> {
  console.log('Getting place details by CID:', cid);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock result
  return {
    placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY6',
    name: 'Business from CID',
    formattedAddress: '999 CID Street, Sample Town, ST 12345',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    types: ['business', 'point_of_interest', 'establishment'],
    rating: 4.1,
    userRatingsTotal: 89,
    businessStatus: 'OPERATIONAL',
    cid
  };
}

// Validate business input (name, CID, or URL)
export function validateBusinessInput(input: string): {
  type: 'name' | 'cid' | 'url' | 'invalid';
  value: string;
  extractedData?: {
    cid?: string;
    placeId?: string;
  };
} {
  const trimmedInput = input.trim();
  
  // Check if it's a URL
  if (trimmedInput.includes('google.com/maps') || trimmedInput.includes('goo.gl/maps')) {
    const cid = extractCidFromUrl(trimmedInput);
    const placeId = extractPlaceIdFromUrl(trimmedInput);
    
    return {
      type: 'url',
      value: trimmedInput,
      extractedData: { cid, placeId }
    };
  }
  
  // Check if it's a CID (numeric string typically 15-21 digits)
  if (/^\d{10,25}$/.test(trimmedInput)) {
    return {
      type: 'cid',
      value: trimmedInput
    };
  }
  
  // Check if it's a valid business name (at least 2 characters, not all numbers)
  if (trimmedInput.length >= 2 && !/^\d+$/.test(trimmedInput)) {
    return {
      type: 'name',
      value: trimmedInput
    };
  }
  
  return {
    type: 'invalid',
    value: trimmedInput
  };
}
