import { useState, useEffect } from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/AppLayout";
import {
  getGoogleMapsApiKey,
  validateGoogleMapsApiKey,
  loadGoogleMapsAPI,
  testGoogleMapsConnection,
} from "@/lib/googleMaps";
import { toast } from "sonner";

interface TestResult {
  test: string;
  status: "pending" | "success" | "error";
  message: string;
  details?: any;
}

export default function GoogleMapsTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");

  const addResult = (
    test: string,
    status: "pending" | "success" | "error",
    message: string,
    details?: any,
  ) => {
    setResults((prev) => {
      const existing = prev.find((r) => r.test === test);
      if (existing) {
        return prev.map((r) =>
          r.test === test ? { test, status, message, details } : r,
        );
      }
      return [...prev, { test, status, message, details }];
    });
  };

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    // Test 1: Environment Variable
    addResult(
      "Environment Variable",
      "pending",
      "Checking VITE_GOOGLE_MAPS_API_KEY...",
    );
    const envKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (envKey) {
      addResult(
        "Environment Variable",
        "success",
        `Found: ${envKey.substring(0, 10)}...${envKey.substring(envKey.length - 6)}`,
      );
    } else {
      addResult(
        "Environment Variable",
        "error",
        "VITE_GOOGLE_MAPS_API_KEY not found",
      );
    }

    // Test 2: API Key Function
    addResult(
      "API Key Function",
      "pending",
      "Testing getGoogleMapsApiKey()...",
    );
    const retrievedKey = getGoogleMapsApiKey();
    setApiKey(retrievedKey);
    if (retrievedKey) {
      addResult(
        "API Key Function",
        "success",
        `Retrieved: ${retrievedKey.substring(0, 10)}...${retrievedKey.substring(retrievedKey.length - 6)}`,
      );
    } else {
      addResult("API Key Function", "error", "No API key returned");
      setIsRunning(false);
      return;
    }

    // Test 3: Direct API Validation
    addResult(
      "API Key Validation",
      "pending",
      "Validating API key with Google...",
    );
    try {
      const validation = await validateGoogleMapsApiKey(retrievedKey);
      if (validation.valid) {
        addResult("API Key Validation", "success", "API key is valid");
      } else {
        addResult(
          "API Key Validation",
          "error",
          validation.error || "API key invalid",
          validation,
        );
      }
    } catch (error: any) {
      addResult(
        "API Key Validation",
        "error",
        `Validation failed: ${error.message}`,
        error,
      );
    }

    // Test 4: Script Loading
    addResult(
      "Script Loading",
      "pending",
      "Loading Google Maps JavaScript API...",
    );
    try {
      await loadGoogleMapsAPI();
      addResult(
        "Script Loading",
        "success",
        "Google Maps API script loaded successfully",
      );
    } catch (error: any) {
      addResult(
        "Script Loading",
        "error",
        `Script loading failed: ${error.message}`,
        error,
      );
    }

    // Test 5: Places API Test
    addResult("Places API", "pending", "Testing Places API functionality...");
    try {
      if (typeof google !== "undefined" && google.maps && google.maps.places) {
        const service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions(
          {
            input: "1600 Amphitheatre Parkway",
            types: ["address"],
            componentRestrictions: { country: "us" },
          },
          (predictions, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              predictions
            ) {
              addResult(
                "Places API",
                "success",
                `Found ${predictions.length} predictions`,
              );
            } else {
              addResult("Places API", "error", `Places API error: ${status}`);
            }
          },
        );
      } else {
        addResult(
          "Places API",
          "error",
          "Google Maps Places API not available",
        );
      }
    } catch (error: any) {
      addResult(
        "Places API",
        "error",
        `Places API test failed: ${error.message}`,
        error,
      );
    }

    setIsRunning(false);
  };

  const runQuickConnection = async () => {
    setIsRunning(true);
    addResult("Connection Test", "pending", "Running quick connection test...");

    try {
      const success = await testGoogleMapsConnection();
      if (success) {
        addResult(
          "Connection Test",
          "success",
          "Google Maps connection successful",
        );
      } else {
        addResult("Connection Test", "error", "Google Maps connection failed");
      }
    } catch (error: any) {
      addResult(
        "Connection Test",
        "error",
        `Connection test error: ${error.message}`,
        error,
      );
    }

    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const copyResults = () => {
    const resultsText = results
      .map(
        (r) =>
          `${r.test}: ${r.status.toUpperCase()} - ${r.message}${r.details ? `\nDetails: ${JSON.stringify(r.details, null, 2)}` : ""}`,
      )
      .join("\n\n");

    navigator.clipboard.writeText(resultsText);
    toast.success("Results copied to clipboard");
  };

  return (
    <AppLayout>
      <div className="container px-4 py-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Google Maps API Diagnostic
          </h1>
          <p className="text-muted-foreground">
            Test Google Maps API configuration and functionality
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>API Key Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Environment Variable:</span>
                  <Badge
                    variant={
                      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                        ? "default"
                        : "destructive"
                    }
                  >
                    {import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                      ? "SET"
                      : "NOT SET"}
                  </Badge>
                </div>
                {apiKey && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Retrieved Key:</span>
                    <code className="px-2 py-1 bg-muted rounded text-sm">
                      {apiKey.substring(0, 10)}...
                      {apiKey.substring(apiKey.length - 6)}
                    </code>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  onClick={runTests}
                  disabled={isRunning}
                  className="gap-2"
                >
                  {isRunning && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                  Run Full Tests
                </Button>
                <Button
                  onClick={runQuickConnection}
                  disabled={isRunning}
                  variant="outline"
                  className="gap-2"
                >
                  {isRunning && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                  Quick Connection Test
                </Button>
                {results.length > 0 && (
                  <Button onClick={copyResults} variant="secondary">
                    Copy Results
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(result.status)} mt-1 flex-shrink-0`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{result.test}</span>
                          <Badge
                            variant={
                              result.status === "success"
                                ? "default"
                                : result.status === "error"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {result.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {result.message}
                        </p>
                        {result.details && (
                          <details className="mt-2">
                            <summary className="text-xs text-muted-foreground cursor-pointer">
                              Details
                            </summary>
                            <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Common Issues & Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">1. API Key Restrictions</h4>
                  <p className="text-muted-foreground">
                    Ensure your API key allows requests from your Netlify domain
                    (*.netlify.app or your custom domain).
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">2. Required APIs</h4>
                  <p className="text-muted-foreground">
                    Enable "Maps JavaScript API" and "Places API" in Google
                    Cloud Console.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">3. Billing Account</h4>
                  <p className="text-muted-foreground">
                    Ensure your Google Cloud project has a valid billing account
                    attached.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">4. Environment Variables</h4>
                  <p className="text-muted-foreground">
                    Verify VITE_GOOGLE_MAPS_API_KEY is set in Netlify and
                    redeploy after changes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
