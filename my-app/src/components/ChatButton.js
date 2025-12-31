"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "./ui/Button";

/**
 * @param {Object} otherUser - { id, name, avatar, isOnline }
 * @param {string} projectTitle - Context for the start of the chat
 */
export default function ChatButton({ otherUser, projectTitle, variant = "default", className = "" }) {
  
  const handleChatStart = () => {
    // For now, we'll just log the action. 
    // Later, you can link this to a Chat route or open a Modal.
    console.log(`Starting chat with ${otherUser.name} regarding: ${projectTitle}`);
    alert(`Opening chat with ${otherUser.name}...`);
  };

  // If you want it as a small icon button
  if (variant === "icon") {
    return (
      <Button 
        onClick={handleChatStart}
        variant="outline" 
        size="icon" 
        className={`border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 ${className}`}
        title={`Chat with ${otherUser.name}`}
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
    );
  }

  // Default wide button
  return (
    <Button 
      onClick={handleChatStart}
      className={`bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 ${className}`}
    >
      <MessageSquare className="h-4 w-4 text-emerald-600" />
      Chat
    </Button>
  );
}