import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bell, Check } from "lucide-react";
import { getCurrentUser, getRelativeTime } from "@/services/alertService";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "@/services/notificationService";

export const NotificationsDropdown: React.FC = () => {
  const user = getCurrentUser();
  const [open, setOpen] = useState(false);
  const [tick, setTick] = useState(0); // simple invalidation trigger

  const notifications = useMemo(() => getNotifications(), [tick]);
  const unread = useMemo(() => getUnreadCount(user.id), [tick, user.id]);

  const handleMarkAll = () => {
    markAllAsRead(user.id);
    setTick((t) => t + 1);
  };

  const handleMarkOne = (id: string) => {
    markAsRead(id, user.id);
    setTick((t) => t + 1);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] leading-[18px] text-center px-1">
              {unread}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2">
          <p className="text-sm font-medium">Notifications</p>
          <Button variant="ghost" size="sm" onClick={handleMarkAll} disabled={unread === 0}>
            <Check className="h-4 w-4 mr-1" /> Mark all read
          </Button>
        </div>
        <Separator />
        <ScrollArea className="h-72">
          <ul className="divide-y">
            {notifications.length === 0 ? (
              <li className="p-4 text-sm text-muted-foreground text-center">No notifications</li>
            ) : (
              notifications.map((n) => {
                const isRead = n.readBy.includes(user.id);
                return (
                  <li key={n.id} className="p-3 hover:bg-muted/40">
                    <div className="flex items-start gap-2">
                      <div className={`mt-1 h-2 w-2 rounded-full ${isRead ? "bg-muted" : "bg-primary"}`} />
                      <div className="flex-1">
                        <p className={`text-sm ${isRead ? "text-muted-foreground" : ""}`}>{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{getRelativeTime(n.createdAt)}</p>
                      </div>
                      {!isRead && (
                        <Button variant="ghost" size="sm" onClick={() => handleMarkOne(n.id)}>
                          Mark read
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
