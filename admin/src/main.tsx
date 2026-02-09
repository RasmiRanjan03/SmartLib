import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { AdminDataProvider } from "./contexts/AdminDataContext.tsx";
import { T } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
<BrowserRouter>
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <AdminDataProvider>
        <Toaster />
        <Sonner />
        <App />
    </AdminDataProvider>
    </TooltipProvider>
</QueryClientProvider>
</BrowserRouter>

);
