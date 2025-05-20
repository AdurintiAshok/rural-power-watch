
import { Alert, AlertStatus, User, UserRole } from "@/types";

// Mock data for alerts
const mockAlerts: Alert[] = [
  {
    id: "1",
    title: "Fallen power line",
    description: "Power line has fallen across the road due to storm",
    location: {
      latitude: 13.0827,
      longitude: 80.2707,
      address: "Near Village Center, Rural Area"
    },
    status: AlertStatus.PENDING,
    imageUrl: "/placeholder.svg",
    reportedBy: "user1",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: "2",
    title: "Transformer sparking",
    description: "Transformer near the market is sparking and making loud noises",
    location: {
      latitude: 13.0822,
      longitude: 80.2755,
      address: "Main Market Road, Rural District"
    },
    status: AlertStatus.IN_PROGRESS,
    reportedBy: "user2",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 minutes ago
  },
  {
    id: "3",
    title: "Power pole leaning dangerously",
    description: "Wooden power pole is leaning at a dangerous angle after heavy rain",
    location: {
      latitude: 13.0780,
      longitude: 80.2690,
      address: "Farm Road 3, Rural Area"
    },
    status: AlertStatus.RESOLVED,
    reportedBy: "user3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  }
];

// Mock data for users
const mockUsers: User[] = [
  {
    id: "user1",
    name: "John Resident",
    role: UserRole.RESIDENT,
    location: {
      latitude: 13.0827,
      longitude: 80.2707
    }
  },
  {
    id: "user2",
    name: "Mary Resident",
    role: UserRole.RESIDENT,
    location: {
      latitude: 13.0822,
      longitude: 80.2755
    }
  },
  {
    id: "official1",
    name: "Sam Official",
    role: UserRole.OFFICIAL,
    location: {
      latitude: 13.0800,
      longitude: 80.2700
    }
  },
  {
    id: "admin1",
    name: "Admin User",
    role: UserRole.ADMIN
  }
];

// In-memory store for alerts
let alerts = [...mockAlerts];
let users = [...mockUsers];
const NOTIFICATION_RADIUS = 4; // km

// Earth radius in km
const EARTH_RADIUS = 6371;

// Calculate distance between two points using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
};

// Get all alerts
export const getAllAlerts = (): Alert[] => {
  return alerts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Get alerts by status
export const getAlertsByStatus = (status: AlertStatus): Alert[] => {
  return alerts.filter(alert => alert.status === status)
    .sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

// Get an alert by ID
export const getAlertById = (id: string): Alert | undefined => {
  return alerts.find(alert => alert.id === id);
};

// Create a new alert
export const createAlert = (alert: Omit<Alert, "id" | "createdAt" | "updatedAt" | "status">): Alert => {
  const now = new Date().toISOString();
  const newAlert: Alert = {
    ...alert,
    id: `alert-${Date.now()}`,
    status: AlertStatus.PENDING,
    createdAt: now,
    updatedAt: now
  };
  
  alerts = [newAlert, ...alerts];
  return newAlert;
};

// Update alert status
export const updateAlertStatus = (id: string, status: AlertStatus, assignedTo?: string): Alert | undefined => {
  const alertIndex = alerts.findIndex(alert => alert.id === id);
  if (alertIndex === -1) return undefined;
  
  const updatedAlert: Alert = {
    ...alerts[alertIndex],
    status,
    assignedTo,
    updatedAt: new Date().toISOString()
  };
  
  alerts[alertIndex] = updatedAlert;
  return updatedAlert;
};

// Get alerts within radius
export const getAlertsWithinRadius = (
  latitude: number,
  longitude: number,
  radiusKm: number = NOTIFICATION_RADIUS
): Alert[] => {
  return alerts.filter(alert => {
    const distance = calculateDistance(
      latitude,
      longitude,
      alert.location.latitude,
      alert.location.longitude
    );
    return distance <= radiusKm;
  });
};

// Get users within radius
export const getUsersWithinRadius = (
  latitude: number,
  longitude: number,
  radiusKm: number = NOTIFICATION_RADIUS
): User[] => {
  return users.filter(user => {
    if (!user.location) return false;
    
    const distance = calculateDistance(
      latitude,
      longitude,
      user.location.latitude,
      user.location.longitude
    );
    return distance <= radiusKm;
  });
};

// Authentication helpers
export const getCurrentUser = (): User => {
  // For now, we'll mock the current user as a resident
  // In a real app, this would come from authentication
  return users[0];
};

export const getOfficials = (): User[] => {
  return users.filter(user => 
    user.role === UserRole.OFFICIAL || user.role === UserRole.ADMIN
  );
};

export const getUser = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Get current user geolocation
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

// Convert date to relative time (e.g. "2 hours ago")
export const getRelativeTime = (date: string): string => {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};
