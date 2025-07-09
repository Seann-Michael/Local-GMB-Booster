import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Save, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MediaMetadataEnhancer } from "@/lib/mediaMetadata";

export function MetadataSettings() {
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    businessCity: "",
    businessState: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load existing settings
    const settings = JSON.parse(localStorage.getItem("userSettings") || "{}");
    const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");

    setBusinessInfo({
      businessName:
        settings.businessName ||
        profile.businessName ||
        profile.companyName ||
        "",
      businessCity: settings.businessCity || "",
      businessState: settings.businessState || "",
    });
  }, []);

  const handleSave = async () => {
    if (!businessInfo.businessName.trim()) {
      toast.error("Business name is required");
      return;
    }

    setIsLoading(true);

    try {
      // Save to localStorage
      const existingSettings = JSON.parse(
        localStorage.getItem("userSettings") || "{}",
      );
      const updatedSettings = {
        ...existingSettings,
        ...businessInfo,
      };

      localStorage.setItem("userSettings", JSON.stringify(updatedSettings));

      setIsSaved(true);
      toast.success("Metadata settings saved successfully");

      // Reset saved indicator after 2 seconds
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const previewMetadata = () => {
    if (!businessInfo.businessName) {
      return "Configure business information to see metadata preview";
    }

    const currentInfo = MediaMetadataEnhancer.getBusinessInfo();
    const cityState =
      businessInfo.businessCity && businessInfo.businessState
        ? `${businessInfo.businessCity}, ${businessInfo.businessState}`
        : "City, State";

    return `${businessInfo.businessName} | ${cityState} | ${new Date().toLocaleDateString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Media Metadata Configuration
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure business information that will be automatically added to all
          uploaded media files
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Business Information Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              placeholder="Enter your business name"
              value={businessInfo.businessName}
              onChange={(e) =>
                setBusinessInfo((prev) => ({
                  ...prev,
                  businessName: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessCity">City</Label>
              <Input
                id="businessCity"
                placeholder="Enter city"
                value={businessInfo.businessCity}
                onChange={(e) =>
                  setBusinessInfo((prev) => ({
                    ...prev,
                    businessCity: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessState">State</Label>
              <Input
                id="businessState"
                placeholder="Enter state"
                value={businessInfo.businessState}
                onChange={(e) =>
                  setBusinessInfo((prev) => ({
                    ...prev,
                    businessState: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Metadata Preview */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Metadata Preview
          </Label>
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="text-sm font-medium mb-2">
              Sample metadata that will be added to uploaded files:
            </div>
            <div className="text-sm text-muted-foreground">
              {previewMetadata()}
            </div>
            {businessInfo.businessName && (
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary">construction</Badge>
                <Badge variant="secondary">project</Badge>
                <Badge variant="secondary">documentation</Badge>
                <Badge variant="outline">+ project keywords</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            What gets added to your media files?
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Business name and location</li>
            <li>• Upload timestamp and user information</li>
            <li>• Project name, address, and customer details</li>
            <li>• Keywords and tags for easy searching</li>
            <li>• Enhanced file naming for organization</li>
          </ul>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isLoading || !businessInfo.businessName.trim()}
            className="gap-2"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : isSaved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isLoading ? "Saving..." : isSaved ? "Saved!" : "Save Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
