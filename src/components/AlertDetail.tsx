
import React, { useState } from "react";
import { Alert, AlertStatus } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateAlertStatus, getUser, getRelativeTime } from "@/services/alertService";
import { MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AlertDetailProps {
  alert: Alert;
  onUpdate?: (updatedAlert: Alert) => void;
  onClose: () => void;
}

export const AlertDetail: React.FC<AlertDetailProps> = ({ alert, onUpdate, onClose }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const reportedByUser = getUser(alert.reportedBy);
  const assignedToUser = alert.assignedTo ? getUser(alert.assignedTo) : null;

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.PENDING:
        return "bg-warning-light text-warning-hover border-warning";
      case AlertStatus.IN_PROGRESS:
        return "bg-blue-50 text-blue-700 border-blue-500";
      case AlertStatus.RESOLVED:
        return "bg-success-light text-success-hover border-success";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusText = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.PENDING:
        return "Pending";
      case AlertStatus.IN_PROGRESS:
        return "In Progress";
      case AlertStatus.RESOLVED:
        return "Resolved";
      default:
        return "Unknown";
    }
  };

  const handleStatusUpdate = async (newStatus: AlertStatus) => {
    try {
      setLoading(true);
      
      // In a real app, we would call an API to update the alert
      const updatedAlert = updateAlertStatus(alert.id, newStatus, newStatus === AlertStatus.IN_PROGRESS ? "official1" : alert.assignedTo);
      
      if (!updatedAlert) {
        throw new Error("Failed to update alert status");
      }
      
      toast({
        title: "Status Updated",
        description: `Alert status changed to ${getStatusText(newStatus)}`,
      });
      
      if (onUpdate) {
        onUpdate(updatedAlert);
      }
    } catch (error) {
      console.error("Error updating alert status:", error);
      toast({
        title: "Error",
        description: "Failed to update alert status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{alert.title}</CardTitle>
          <Badge className={`${getStatusColor(alert.status)}`}>
            {getStatusText(alert.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{alert.description}</p>
        
        {alert.imageUrl && (
          <div className="mt-4">
            <img src={alert.imageUrl} alt="Alert" className="rounded-md max-h-60 object-cover" />
          </div>
        )}
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="flex items-center mb-2">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <h4 className="font-medium">Location</h4>
          </div>
          <p className="text-sm">{alert.location.address || "Unknown location"}</p>
          <p className="text-xs text-gray-500 mt-1">
            Coordinates: {alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="font-medium mb-1">Reported By</h4>
            <p className="text-sm">{reportedByUser?.name || "Unknown"}</p>
            <p className="text-xs text-gray-500 mt-1">{getRelativeTime(alert.createdAt)}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="font-medium mb-1">Assigned To</h4>
            <p className="text-sm">{assignedToUser?.name || "Not assigned"}</p>
            {alert.status !== AlertStatus.PENDING && (
              <p className="text-xs text-gray-500 mt-1">Last updated: {getRelativeTime(alert.updatedAt)}</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
        <Button 
          variant="outline" 
          className="w-full sm:w-1/3" 
          onClick={onClose}
        >
          Close
        </Button>
        
        {alert.status === AlertStatus.PENDING && (
          <Button 
            variant="default"
            className="w-full sm:w-2/3 bg-blue-600 hover:bg-blue-700"
            onClick={() => handleStatusUpdate(AlertStatus.IN_PROGRESS)}
            disabled={loading}
          >
            Mark as In Progress
          </Button>
        )}
        
        {alert.status === AlertStatus.IN_PROGRESS && (
          <Button 
            variant="default"
            className="w-full sm:w-2/3 bg-success hover:bg-success-hover"
            onClick={() => handleStatusUpdate(AlertStatus.RESOLVED)}
            disabled={loading}
          >
            Mark as Resolved
          </Button>
        )}
        
        {alert.status === AlertStatus.RESOLVED && (
          <Button 
            variant="default"
            className="w-full sm:w-2/3 bg-warning hover:bg-warning-hover"
            onClick={() => handleStatusUpdate(AlertStatus.PENDING)}
            disabled={loading}
          >
            Reopen Alert
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
