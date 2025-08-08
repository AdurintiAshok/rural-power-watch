import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertItem } from "@/components/AlertItem";
import { AlertDetail } from "@/components/AlertDetail";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Alert } from "@/types";
import { getAllAlerts } from "@/services/alertService";

export const HomePage: React.FC = () => {
  
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  

  useEffect(() => {
    // In a real app, we would fetch this data from an API
    const alerts = getAllAlerts().slice(0, 3); // Get 3 most recent alerts
    setRecentAlerts(alerts);
  }, []);



  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setDialogOpen(true);
  };

  const handleAlertUpdate = (updatedAlert: Alert) => {
    setSelectedAlert(updatedAlert);
    setRecentAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === updatedAlert.id ? updatedAlert : alert
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">

        <section className="mb-8">
          <div className="bg-warning-light border-l-4 border-warning p-4 rounded-md shadow-sm">
            <h1 className="text-2xl font-bold text-warning-hover mb-2">
              PowerLine Alert System
            </h1>
            <p className="mb-4">
              Help keep your community safe by reporting downed power lines, electrical hazards, or power outages. 
              Alerts notify electrical officials and nearby residents within a 4 km radius.
            </p>
            <div className="flex space-x-4">
              <Link to="/report">
                <Button className="bg-warning hover:bg-warning-hover">
                  Report an Issue
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-warning-light rounded-full text-warning mb-4">
                    <svg 
                      className="w-8 h-8" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M13 2L13 10H19L11 22V14H5L13 2Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Report Issues</h3>
                  <p className="text-gray-600 text-sm">
                    Report power line issues with your exact location. Add photos for clearer assessment.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full text-blue-600 mb-4">
                    <svg 
                      className="w-8 h-8" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Get Notified</h3>
                  <p className="text-gray-600 text-sm">
                    Receive real-time alerts about power issues within 4 km of your location.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-success-light rounded-full text-success mb-4">
                    <svg 
                      className="w-8 h-8" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M8 12H12M16 12H12M12 12V8M12 12V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Stay Safe</h3>
                  <p className="text-gray-600 text-sm">
                    Get safety instructions and updates on reported issues in your area.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-bold mb-4">Recent Alerts</h2>
          {recentAlerts.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No recent alerts.</p>
          ) : (
            <div>
              {recentAlerts.map(alert => (
                <AlertItem 
                  key={alert.id} 
                  alert={alert} 
                  onClick={() => handleAlertClick(alert)}
                />
              ))}
              <div className="mt-4 text-center">
                <Link to="/dashboard">
                  <Button variant="outline">View All Alerts</Button>
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
      
      <footer className="bg-gray-50 border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p className="mb-2">
            PowerLine Alert System for Rural Areas
          </p>
          <p>
            &copy; {new Date().getFullYear()} - An essential service for community safety
          </p>
        </div>
      </footer>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedAlert && (
            <AlertDetail
              alert={selectedAlert}
              onUpdate={handleAlertUpdate}
              onClose={() => setDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
