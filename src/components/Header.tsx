
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import { getCurrentUser } from "@/services/alertService";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";

export const Header: React.FC = () => {
  // In a real app, we would get the current user from authentication
  const currentUser = getCurrentUser();
  const isOfficial = currentUser.role === UserRole.OFFICIAL || currentUser.role === UserRole.ADMIN;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <svg 
            className="w-6 h-6 text-warning mr-2" 
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
          <span className="font-bold text-lg">PowerLine Alert</span>
        </Link>
        
        <nav className="flex items-center space-x-2">
          <Link to="/">
            <Button variant="ghost" size="sm">
              Home
            </Button>
          </Link>
          
          <Link to="/report">
            <Button variant="ghost" size="sm">
              Report Issue
            </Button>
          </Link>
          
          {isOfficial && (
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
          )}
          
          <NotificationsDropdown />
          
          <Button variant="outline" size="sm">
            {currentUser.name}
          </Button>
        </nav>
      </div>
    </header>
  );
};
