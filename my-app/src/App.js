"use client";

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';

// Auth & Layout
import { Navbar } from "./components/Header"; 
import ProtectedRoute from "./components/ProtectedRoute"; 

// Page Imports
import HomePage from "./pages/Home";
import BrowseJobsPage from "./pages/BrowseJobs";
import BrowseFreelancersPage from "./pages/BrowseFreelancersPage";
import PostJobPage from "./pages/PostJobPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPasswordPage from "./pages/ForgotPassword";
import VerifyEmailPage from "./pages/VerifyEmail";
import FreelancerSetup from "./pages/FreelancerSetup";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import SearchPage from "./pages/SearchPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import FreelancerProfilePage from "./pages/FreelancerProfilePage";
import ChatPage from "./pages/ChatPage"; 
import SavedJobsPage from "./pages/SavedJobsPage";
import ProposalsPage from "./pages/ProposalsPage";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import NotificationsPage from "./pages/NotificationsPage";
import WalletPage from "./pages/WalletPage";
import ClientProjectDashboard from "./pages/ClientProjectDashboard";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import HelpSupportPage from "./pages/HelpSupportPage";
import ContactUsPage from "./pages/ContactUsPage";
import PaymentSafetyPage from "./pages/PaymentSafetyPage";
import SettingsPage from "./pages/SettingsPage";
import ClientDashboard from "./pages/ClientDashboard";
import PublicProfile from "./pages/PublicProfile";
import ManageProposals from "./pages/ManageProposals";
import ContractDetails from "./pages/ContractDetails";
import MyProjects from "./pages/MyProjects";
import CreateOffer from "./pages/CreateOffer"; // Import the new page



export default function App() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Backend URL detected:", process.env.REACT_APP_API_URL);
    }
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Navbar is inside Router, so Link and useNavigate will work */}
        <Navbar />
        
        {/* Toaster for global notifications */}
        <Toaster position="top-center" richColors closeButton /> 

        <main className="flex-grow">
          <Routes>
            {/* ==========================================
                PUBLIC ROUTES
                ========================================== */}
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage/>} />
            <Route path="/browse-jobs" element={<BrowseJobsPage />} />
            <Route path="/browse-freelancers" element={<BrowseFreelancersPage/>} />
            <Route path="/job/:id" element={<JobDetailsPage />} />
            <Route path="/freelancer/:id" element={<FreelancerProfilePage />} />
            <Route path="/profile/:id" element={<PublicProfile />} />
            
            {/* Legal & Help */}
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/payment-safety" element={<PaymentSafetyPage />} />
            <Route path="/help-center" element={<HelpSupportPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />

            {/* ==========================================
                SHARED PROTECTED ROUTES (Logged-in)
                ========================================== */}
            <Route path="/messages" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="/messages/:conversationId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/my-projects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />
            <Route path="/workspace/:contractId" element={<ProtectedRoute><ProjectWorkspace /></ProtectedRoute>} />
            <Route path="/contract/:contractId" element={<ProtectedRoute><ContractDetails /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><FreelancerProfilePage /></ProtectedRoute>} />

            {/* ==========================================
                FREELANCER SPECIFIC ROUTES
                ========================================== */}
            <Route path="/setup-profile" element={<ProtectedRoute allowedRole="freelancer"><FreelancerSetup /></ProtectedRoute>} />
            <Route path="/freelancer-dashboard" element={<ProtectedRoute allowedRole="freelancer"><FreelancerDashboard /></ProtectedRoute>} />
            <Route path="/saved-jobs" element={<ProtectedRoute allowedRole="freelancer"><SavedJobsPage /></ProtectedRoute>} />
            <Route path="/proposals" element={<ProtectedRoute allowedRole="freelancer"><ProposalsPage/></ProtectedRoute>} />

            {/* ==========================================
                CLIENT SPECIFIC ROUTES
                ========================================== */}
            <Route path="/client-dashboard" element={<ProtectedRoute allowedRole="client"><ClientDashboard /></ProtectedRoute>} /> 
            <Route path="/post-job" element={<ProtectedRoute allowedRole="client"><PostJobPage/></ProtectedRoute>} />
            <Route path="/manage-project/:projectId" element={<ProtectedRoute allowedRole="client"><ClientProjectDashboard /></ProtectedRoute>} />
            <Route path="/manage-proposals/:jobId" element={<ProtectedRoute allowedRole="client"><ManageProposals /> </ProtectedRoute>} />
            <Route path="/create-offer/:freelancerId" element={<ProtectedRoute allowedRole="client"><CreateOffer /></ProtectedRoute>} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}