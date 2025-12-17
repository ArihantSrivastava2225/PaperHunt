import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchResults from "@/components/SearchResults";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <SearchResults />
      <Footer />
    </div>
  );
};

export default Index;
