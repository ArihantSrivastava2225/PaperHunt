import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { validateSession } from "@/store/authSlice";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Discover from "./pages/Discover";
import Signin from "./pages/Signin";
import Library from "./pages/Library";
import Hots from "./pages/Hots";
import ResearchOpportunities from "./pages/ResearchOpportunities";
import About from "./pages/AboutUs";
import Contact from "./pages/ContactUs";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(validateSession());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signin" element={<Signin />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/discover" element={<Discover />} />
              <Route path="/library" element={<Library />} />
              <Route path="/hots" element={<Hots />} />
              <Route path="/research-opportunities" element={<ResearchOpportunities />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
