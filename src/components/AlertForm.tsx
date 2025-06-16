
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, AlertTriangle } from "lucide-react";
import { getCurrentLocation, createAlert } from "@/services/alertService";
import { useToast } from "@/components/ui/use-toast";

export const AlertForm: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRedAlert, setIsRedAlert] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      setLocationError(null);
      setLoading(true);
      const position = await getCurrentLocation();
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setAddress("Location detected! Tap to edit if needed.");
    } catch (error) {
      console.error("Error getting location:", error);
      setLocationError("Unable to detect location. Please enter manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);

    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRedAlert = () => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please enable location access for red alert.",
        variant: "destructive",
      });
      return;
    }

    setIsRedAlert(true);
    setTitle("RED ALERT - Immediate Power Off Required");
    setDescription("URGENT: Power lines down or dangerous electrical situation requiring immediate power shutdown in this area.");
    
    // Auto-submit red alert
    handleSubmit(null, true);
  };

  const handleSubmit = (e: React.FormEvent | null, isRedAlertSubmission = false) => {
    if (e) e.preventDefault();
    
    if (!isRedAlertSubmission && (!title || !description || !location)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real app, we would upload the image to storage
      // and get a URL back. For now, we'll just use a placeholder
      const imageUrl = imagePreview || undefined;
      
      const alertTitle = isRedAlert ? "RED ALERT - Immediate Power Off Required" : title;
      const alertDescription = isRedAlert ? 
        "URGENT: Power lines down or dangerous electrical situation requiring immediate power shutdown in this area." : 
        description;
      
      const newAlert = createAlert({
        title: alertTitle,
        description: alertDescription,
        location: {
          ...location!,
          address,
        },
        reportedBy: "user1", // This would come from authentication
        imageUrl,
      });
      
      toast({
        title: isRedAlert ? "RED ALERT SUBMITTED!" : "Alert submitted!",
        description: isRedAlert ? 
          "RED ALERT sent to officials for immediate power shutdown!" : 
          "Your alert has been sent to officials and nearby residents.",
        variant: isRedAlert ? "destructive" : "default",
      });
      
      // Clear form
      setTitle("");
      setDescription("");
      setImage(null);
      setImagePreview(null);
      setIsRedAlert(false);
      
    } catch (error) {
      console.error("Error submitting alert:", error);
      toast({
        title: "Error",
        description: "Failed to submit alert. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Red Alert Section */}
      <Card className="border-red-500 bg-red-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Emergency Red Alert
          </CardTitle>
          <p className="text-sm text-red-600">
            Use this for immediate power shutdown requirements due to dangerous situations
          </p>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleRedAlert}
            disabled={loading || !location}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3"
            size="lg"
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            SUBMIT RED ALERT - IMMEDIATE POWER OFF
          </Button>
          {!location && (
            <p className="text-xs text-red-500 mt-2 text-center">
              Location access required for red alert
            </p>
          )}
        </CardContent>
      </Card>

      {/* Regular Alert Form */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Report Power Line Issue</CardTitle>
        </CardHeader>
        <form onSubmit={(e) => handleSubmit(e, false)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Issue Title*</label>
              <Input
                placeholder="Briefly describe the issue (e.g., 'Fallen power line')"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isRedAlert}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Detailed Description*</label>
              <Textarea
                placeholder="Please provide more details about the issue"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                disabled={isRedAlert}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Location*</label>
              <div className="flex items-center space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={getLocation}
                  disabled={loading}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Location description or address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              {locationError && (
                <p className="text-xs text-red-500">{locationError}</p>
              )}
              {location && !locationError && (
                <p className="text-xs text-green-600">
                  Location detected at {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Image (Optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isRedAlert}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-60 rounded-md object-cover"
                  />
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !location || isRedAlert}
            >
              {loading ? "Submitting..." : "Submit Regular Report"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
