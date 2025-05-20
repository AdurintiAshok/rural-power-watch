
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { AlertDetail } from "@/components/AlertDetail";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Alert } from "@/types";

export const DashboardPage: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAlertSelect = (alert: Alert) => {
    setSelectedAlert(alert);
    setDialogOpen(true);
  };

  const handleAlertUpdate = (updatedAlert: Alert) => {
    setSelectedAlert(updatedAlert);
    // In a real app, we would update the state of alerts in the dashboard
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Official Dashboard</h1>
        <Dashboard />
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
