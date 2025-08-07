import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getGoogleMapsApiKey, loadGoogleMapsAPI } from "@/lib/googleMaps";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

export const GoogleMapsDebug: React.FC = () => {
  const [envVariable, setEnvVariable] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [apiLoaded, setApiLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkEnvironmentVariable = () => {
    // Check environment variable directly
    const env = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    setEnvVariable(env || "Not Set");
    console.log("Environment variable VITE_GOOGLE_MAPS_API_KEY:", env);
  };

  const checkApiKey = () => {
    const key = getGoogleMapsApiKey();
    setApiKey(key || "Not Available");
    console.log("getGoogleMapsApiKey() returned:", key);
  };

  const testApiLoad = async () => {
    setIsLoading(true);
    setError("");
    setApiLoaded(false);

    try {
      console.log("Attempting to load Google Maps API...");
      await loadGoogleMapsAPI();
      setApiLoaded(true);
      console.log("Google Maps API loaded successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Failed to load Google Maps API:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkEnvironmentVariable();
    checkApiKey();
  }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Google Maps API Debug
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              checkEnvironmentVariable();
              checkApiKey();
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Environment Variable */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            Environment Variable
            {envVariable !== "Not Set" ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </h4>
          <div className="p-3 bg-muted rounded-md font-mono text-sm">
            VITE_GOOGLE_MAPS_API_KEY:{" "}
            {envVariable === "Not Set"
              ? envVariable
              : `${envVariable.substring(0, 10)}...${envVariable.substring(envVariable.length - 6)}`}
          </div>
        </div>

        {/* API Key Function */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            getGoogleMapsApiKey() Result
            {apiKey !== "Not Available" ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </h4>
          <div className="p-3 bg-muted rounded-md font-mono text-sm">
            {apiKey === "Not Available"
              ? apiKey
              : `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 6)}`}
          </div>
        </div>

        {/* API Load Test */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            API Load Test
            {apiLoaded ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : error ? (
              <XCircle className="h-4 w-4 text-red-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
          </h4>
          <div className="flex items-center gap-2">
            <Button
              onClick={testApiLoad}
              disabled={isLoading || apiKey === "Not Available"}
              size="sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Test API Load"
              )}
            </Button>
            {apiLoaded && <Badge variant="default">API Loaded</Badge>}
            {error && <Badge variant="destructive">Error: {error}</Badge>}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Troubleshooting
          </h4>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p>
              1. Ensure VITE_GOOGLE_MAPS_API_KEY is set in Netlify environment
              variables
            </p>
            <p>2. Variable name must be ALL CAPS: VITE_GOOGLE_MAPS_API_KEY</p>
            <p>3. Redeploy after changing environment variables</p>
            <p>4. Check browser console for detailed logs</p>
          </div>
        </div>

        {/* Current Values */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Environment: {import.meta.env.MODE}</p>
          <p>Base URL: {import.meta.env.BASE_URL}</p>
          <p>
            All VITE_ variables:{" "}
            {JSON.stringify(
              Object.keys(import.meta.env).filter((key) =>
                key.startsWith("VITE_"),
              ),
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
