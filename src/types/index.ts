
export enum AlertStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved"
}

export enum UserRole {
  RESIDENT = "resident",
  OFFICIAL = "official",
  ADMIN = "admin"
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: AlertStatus;
  imageUrl?: string;
  reportedBy: string; // User ID
  createdAt: string;
  updatedAt: string;
  assignedTo?: string; // Official User ID
}

export interface Notification {
  id: string;
  alertId: string;
  message: string;
  createdAt: string;
  readBy: string[]; // User IDs
}
