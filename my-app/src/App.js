import React from "react";
import { Toaster } from 'sonner';
import { Routes, Route } from "react-router-dom";

// Auth & Security
import { Navbar } from "./components/Header"; 
import ProtectedRoute from "./components/ProtectedRoute"; // Ensure this file exists in components

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

export default function App() {
  return (
    <>
      <Navbar />
      <Toaster position="top-center" richColors closeButton /> 
      
      <Routes>
        {/* ==========================================
            PUBLIC ROUTES (Available to everyone)
            ========================================== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage/>} />
        <Route path="/browse-jobs" element={<BrowseJobsPage />} />
        <Route path="/browse-freelancers" element={<BrowseFreelancersPage/>} />
        <Route path="/job/:id" element={<JobDetailsPage />} />
        <Route path="/freelancer/:id" element={<FreelancerProfilePage />} />
        
        {/* Legal & Help */}
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/payment-safety" element={<PaymentSafetyPage />} />
        <Route path="/help-center" element={<HelpSupportPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />

        {/* ==========================================
            SHARED PROTECTED ROUTES (Any logged-in user)
            ========================================== */}
        <Route path="/messages" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><FreelancerProfilePage /></ProtectedRoute>} />

        {/* ==========================================
            FREELANCER ROUTES (Only Freelancers)
            ========================================== */}
        <Route path="/search" element={<ProtectedRoute allowedRole="freelancer"><SearchPage/></ProtectedRoute>} />
        <Route path="/setup-profile" element={<ProtectedRoute allowedRole="freelancer"><FreelancerSetup /></ProtectedRoute>} />
        <Route path="/freelancer-dashboard" element={<ProtectedRoute allowedRole="freelancer"><FreelancerDashboard /></ProtectedRoute>} />
        <Route path="/saved-jobs" element={<ProtectedRoute allowedRole="freelancer"><SavedJobsPage /></ProtectedRoute>} />
        <Route path="/proposals" element={<ProtectedRoute allowedRole="freelancer"><ProposalsPage/></ProtectedRoute>} />

        {/* ==========================================
            CLIENT ROUTES (Only Clients)
            ========================================== */}
        <Route path="/client-dashboard" element={<ProtectedRoute allowedRole="client"><ClientDashboard /></ProtectedRoute>} /> 
        <Route path="/post-job" element={<ProtectedRoute allowedRole="client"><PostJobPage/></ProtectedRoute>} />
        <Route path="/manage-project/:projectId" element={<ProtectedRoute allowedRole="client"><ClientProjectDashboard /></ProtectedRoute>} />
        <Route path="/hired-freelancers" element={<ProtectedRoute allowedRole="client"><ClientDashboard /></ProtectedRoute>} />
        <Route path="/workspace/:projectId" element={<ProtectedRoute allowedRole="client"><ProjectWorkspace /></ProtectedRoute>} />
      </Routes>
    </>
  );
}