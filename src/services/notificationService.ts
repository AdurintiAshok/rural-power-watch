import { Notification } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "@/services/alertService";

// In-memory notifications store (mock)
let notifications: Notification[] = [
  {
    id: uuidv4(),
    alertId: "1",
    message: "New alert reported near your location.",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    readBy: [],
  },
  {
    id: uuidv4(),
    alertId: "2",
    message: "An alert you follow has been updated to In Progress.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    readBy: [],
  },
  {
    id: uuidv4(),
    alertId: "3",
    message: "Resolved: Power restored in your area.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    readBy: [],
  },
];

// Utilities
const sortByDateDesc = (a: Notification, b: Notification) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

export function getNotifications(): Notification[] {
  return [...notifications].sort(sortByDateDesc);
}

export function getUnreadCount(userId?: string): number {
  const uid = userId ?? getCurrentUser().id;
  return notifications.filter((n) => !n.readBy.includes(uid)).length;
}

export function markAsRead(id: string, userId?: string): void {
  const uid = userId ?? getCurrentUser().id;
  notifications = notifications.map((n) =>
    n.id === id ? { ...n, readBy: Array.from(new Set([...n.readBy, uid])) } : n
  );
}

export function markAllAsRead(userId?: string): void {
  const uid = userId ?? getCurrentUser().id;
  notifications = notifications.map((n) => ({
    ...n,
    readBy: Array.from(new Set([...n.readBy, uid])),
  }));
}

export function addNotification(message: string, alertId: string): Notification {
  const newNotification: Notification = {
    id: uuidv4(),
    alertId,
    message,
    createdAt: new Date().toISOString(),
    readBy: [],
  };
  notifications = [newNotification, ...notifications];
  return newNotification;
}
