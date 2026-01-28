import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AllBooks from "./pages/AllBooks";
import BookDetails from "./pages/BookDetails";
import Profile from "./pages/Profile";
import OCRResults from "./pages/OCRResults";
import NotFound from "./pages/NotFound";
import { AppProvider, useApp } from "./context/appContext";



const App = () => {
  const { token } = useApp();
  return token ? (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/books" element={<AllBooks />} />
      <Route path="/books/ocr" element={<OCRResults />} />
      <Route path="/book/:bookId" element={<BookDetails />} />
      <Route path="/profile" element={<Profile />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  ) : <Login />;
};

export default App;
