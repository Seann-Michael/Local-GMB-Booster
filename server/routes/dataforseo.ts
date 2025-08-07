import { Request, Response } from "express";

// DataForSEO API Configuration
const DATAFORSEO_BASE_URL = "https://api.dataforseo.com/v3";

interface DataForSEOCredentials {
  username: string;
  password: string;
}

// Get credentials from environment variables
const getDataForSEOCredentials = (): DataForSEOCredentials | null => {
  const username = process.env.DATAFORSEO_USERNAME;
  const password = process.env.DATAFORSEO_PASSWORD;
  
  if (username && password) {
    return { username, password };
  }
  
  return null;
};

// Proxy endpoint for DataForSEO API calls
export const handleDataForSEOProxy = async (req: Request, res: Response) => {
  try {
    const credentials = getDataForSEOCredentials();
    
    if (!credentials) {
      return res.status(500).json({
        success: false,
        error: "DataForSEO credentials not configured"
      });
    }
    
    const { endpoint, method = "GET", body } = req.body;
    
    if (!endpoint) {
      return res.status(400).json({
        success: false,
        error: "Endpoint is required"
      });
    }
    
    const authString = Buffer.from(
      `${credentials.username}:${credentials.password}`
    ).toString('base64');
    
    const response = await fetch(`${DATAFORSEO_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      ...(body && { body: JSON.stringify(body) })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`DataForSEO API error: ${response.status}`);
    }
    
    res.json({
      success: true,
      data
    });
    
  } catch (error) {
    console.error("DataForSEO proxy error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Check if DataForSEO is configured
export const handleDataForSEOStatus = async (_req: Request, res: Response) => {
  const credentials = getDataForSEOCredentials();
  
  res.json({
    success: true,
    configured: !!credentials
  });
};
