
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !location) {
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
      
      const newAlert = createAlert({
        title,
        description,
        location: {
          ...location,
          address,
        },
        reportedBy: "user1", // This would come from authentication
        imageUrl,
      });
      
      toast({
        title: "Alert submitted!",
        description: "Your alert has been sent to officials and nearby residents.",
      });
      
      // Clear form
      setTitle("");
      setDescription("");
      setImage(null);
      setImagePreview(null);
      
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Report Power Line Issue</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Issue Title*</label>
            <Input
              placeholder="Briefly describe the issue (e.g., 'Fallen power line')"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
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
          <Button type="submit" className="w-full" disabled={loading || !location}>
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
