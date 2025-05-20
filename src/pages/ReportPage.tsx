
import React from "react";
import { Header } from "@/components/Header";
import { AlertForm } from "@/components/AlertForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AlertCircle, Users, MapPin, BarChart3, Clock } from "lucide-react";
import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip } from "recharts";
import { createAlert, getCurrentUser } from "@/services/alertService";
import { AlertStatus } from "@/types";

// Mock data for statistics display
const stats = {
  total: 15,
  pending: 8,
  inProgress: 5,
  resolved: 2
};

const chartData = [
  { name: 'Pending', value: stats.pending, fill: '#f97316' },
  { name: 'In Progress', value: stats.inProgress, fill: '#0ea5e9' },
  { name: 'Resolved', value: stats.resolved, fill: '#16a34a' }
];

export const ReportPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Report a Power Line Issue</h1>
          <p className="text-muted-foreground">
            Submit a power line issue to alert nearby residents and officials.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <AlertForm />
          </div>
          
          <div className="space-y-6">
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">PowerLine Alert Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <StatsCard 
                    title="Total Reports" 
                    value={stats.total} 
                    icon={<Users className="h-5 w-5" />}
                    color="bg-blue-50 text-blue-700"
                  />
                  <StatsCard 
                    title="Pending Alerts" 
                    value={stats.pending} 
                    icon={<AlertCircle className="h-5 w-5" />} 
                    color="bg-warning-light text-warning"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Alert Status Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ChartContainer config={{}} className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-md">
                                  <div className="font-medium">{data.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {data.value} reports
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Response Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="flex items-center gap-2 font-medium text-blue-700">
                      <Users className="h-4 w-4" />
                      Response Summary
                    </div>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-700"></span>
                        {stats.total} power line issues have been reported in your area.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-700"></span>
                        Officials have responded to {stats.inProgress + stats.resolved} reports.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-700"></span>
                        Average response time is approximately 35 minutes.
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
    </div>
  );
};

// Stats card component for displaying key metrics
interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => (
  <div className="rounded-lg border p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className={`rounded-full p-2 ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);
