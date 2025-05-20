
import React, { useState } from "react";
import { Alert, AlertStatus } from "@/types";
import { AlertItem } from "@/components/AlertItem";
import { getAllAlerts, getAlertsByStatus } from "@/services/alertService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Dashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  
  // In a real app, we would fetch this data from an API
  const allAlerts = getAllAlerts();
  const pendingAlerts = getAlertsByStatus(AlertStatus.PENDING);
  const inProgressAlerts = getAlertsByStatus(AlertStatus.IN_PROGRESS);
  const resolvedAlerts = getAlertsByStatus(AlertStatus.RESOLVED);
  
  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
  };
  
  const getActiveAlerts = () => {
    switch (selectedTab) {
      case "pending":
        return pendingAlerts;
      case "in-progress":
        return inProgressAlerts;
      case "resolved":
        return resolvedAlerts;
      default:
        return allAlerts;
    }
  };
  
  const activeAlerts = getActiveAlerts();
  
  return (
    <div className="w-full">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Power Line Alert Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="bg-white rounded-md border p-4 text-center">
              <h3 className="text-sm font-medium text-gray-500">Total Alerts</h3>
              <p className="text-2xl font-bold">{allAlerts.length}</p>
            </div>
            <div className="bg-warning-light rounded-md border border-warning p-4 text-center">
              <h3 className="text-sm font-medium text-warning-hover">Pending</h3>
              <p className="text-2xl font-bold text-warning">{pendingAlerts.length}</p>
            </div>
            <div className="bg-blue-50 rounded-md border border-blue-200 p-4 text-center">
              <h3 className="text-sm font-medium text-blue-700">In Progress</h3>
              <p className="text-2xl font-bold text-blue-600">{inProgressAlerts.length}</p>
            </div>
            <div className="bg-success-light rounded-md border border-success p-4 text-center">
              <h3 className="text-sm font-medium text-success-hover">Resolved</h3>
              <p className="text-2xl font-bold text-success">{resolvedAlerts.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Alert List</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="all" className="flex-1">All ({allAlerts.length})</TabsTrigger>
              <TabsTrigger value="pending" className="flex-1">Pending ({pendingAlerts.length})</TabsTrigger>
              <TabsTrigger value="in-progress" className="flex-1">In Progress ({inProgressAlerts.length})</TabsTrigger>
              <TabsTrigger value="resolved" className="flex-1">Resolved ({resolvedAlerts.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {allAlerts.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No alerts found.</p>
              ) : (
                <div>
                  {allAlerts.map(alert => (
                    <AlertItem 
                      key={alert.id} 
                      alert={alert} 
                      onClick={() => handleAlertClick(alert)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              {pendingAlerts.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No pending alerts.</p>
              ) : (
                <div>
                  {pendingAlerts.map(alert => (
                    <AlertItem 
                      key={alert.id} 
                      alert={alert} 
                      onClick={() => handleAlertClick(alert)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="in-progress" className="mt-0">
              {inProgressAlerts.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No alerts in progress.</p>
              ) : (
                <div>
                  {inProgressAlerts.map(alert => (
                    <AlertItem 
                      key={alert.id} 
                      alert={alert} 
                      onClick={() => handleAlertClick(alert)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="resolved" className="mt-0">
              {resolvedAlerts.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No resolved alerts.</p>
              ) : (
                <div>
                  {resolvedAlerts.map(alert => (
                    <AlertItem 
                      key={alert.id} 
                      alert={alert} 
                      onClick={() => handleAlertClick(alert)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
