import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {  Routes, Route, Navigate } from "react-router-dom";

import NotFound from "./pages/NotFound";
import { AdminLayout } from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentManagement from "./pages/admin/StudentManagement";
import BookManagement from "./pages/admin/BookManagement";
import IssueReturnBooks from "./pages/admin/IssueReturnBooks";

import Login from "./pages/admin/Login";
import { useAdminData } from "./contexts/AdminDataContext";
const App = () => {
  const {atoken}=useAdminData();
  if(!atoken){
    return <Login/>
  }
  return (
  

          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="books" element={<BookManagement />} />
              <Route path="issues" element={<IssueReturnBooks />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        
);
}
export default App;
