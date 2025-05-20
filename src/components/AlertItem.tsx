
import React from "react";
import { Alert, AlertStatus, User } from "@/types";
import { getRelativeTime, getUser } from "@/services/alertService";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface AlertItemProps {
  alert: Alert;
  onClick?: () => void;
}

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

export const AlertItem: React.FC<AlertItemProps> = ({ alert, onClick }) => {
  const reportedByUser = getUser(alert.reportedBy);
  const isActive = alert.status === AlertStatus.PENDING;

  return (
    <Card 
      className={`mb-4 cursor-pointer transition-all hover:shadow-md ${
        isActive ? "border-l-4 border-l-warning" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{alert.title}</h3>
          <Badge className={`${getStatusColor(alert.status)}`}>
            {getStatusText(alert.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
        <div className="flex items-center text-xs text-gray-500">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{alert.location.address || "Unknown location"}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 text-xs text-gray-500 flex justify-between">
        <span>Reported by: {reportedByUser?.name || "Unknown"}</span>
        <span>{getRelativeTime(alert.createdAt)}</span>
      </CardFooter>
    </Card>
  );
};
