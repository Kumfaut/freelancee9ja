"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { MessageSquare, Loader2 } from "lucide-react";
import { Button } from "./ui/Button";

/**
 * @param {Object} otherUser - { id, name, avatar, isOnline }
 * @param {string} projectTitle - Context for the start of the chat
 */
export default function ChatButton({ otherUser, projectTitle, variant = "default", className = "" }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChatStart = async () => {
    try {
      setLoading(true);
      
      // We use the sendMessage endpoint. 
      // Your backend logic already handles "Find or Create" conversation.
      const res = await API.post("/messages/send", {
        receiver_id: otherUser.id,
        message_text: `Hi ${otherUser.name}, I'm interested in discussing: ${projectTitle || "a new project"}.`,
      });

      if (res.data.success) {
        // Redirect to the message page using the ID returned from your DB
        navigate(`/messages/${res.data.conversation_id}`);
      }
    } catch (err) {
      console.error("❌ Failed to start chat:", err);
      alert("Unable to start conversation at this time.");
    } finally {
      setLoading(false);
    }
  };

  const isLoadingContent = loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />;

  if (variant === "icon") {
    return (
      <Button 
        onClick={handleChatStart}
        disabled={loading}
        variant="outline" 
        size="icon" 
        className={`border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 ${className}`}
        title={`Chat with ${otherUser.name}`}
      >
        {isLoadingContent}
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleChatStart}
      disabled={loading}
      className={`bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 h-12 w-full rounded-2xl font-bold shadow-sm transition-all ${className}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin text-emerald-600" /> : <MessageSquare className="h-4 w-4 text-emerald-600" />}
      {loading ? "Connecting..." : `Message ${otherUser.name?.split(' ')[0]}`}
    </Button>
  );
}