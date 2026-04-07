import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import StatsCard from "@/components/StatsCard";
import { Building2, Shield, TrendingUp, Bell, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/contexts/PropertyContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const isConnected = true; // Mock wallet connection for prototype
  const { properties } = useProperties();
  
  // Calculate stats from actual properties
  const activeProperties = properties.filter(p => p.status === 'active').length;
  const totalAlerts = properties.reduce((sum, p) => sum + (p.fraudAlerts || 0), 0);
  const frozenProperties = properties.filter(p => p.status === 'frozen').length;
  
  const stats = [
    {
      title: "Total Properties",
      value: properties.length,
      description: "Tokenized assets",
      icon: Building2,
      trend: { value: 20, isPositive: true },
    },
    {
      title: "Portfolio Value",
      value: "₹8.5M",
      description: "Total asset value",
      icon: TrendingUp,
      trend: { value: 15, isPositive: true },
    },
    {
      title: "Alerts",
      value: totalAlerts,
      description: `${frozenProperties} properties frozen`,
      icon: Bell,
      trend: { value: frozenProperties > 0 ? 100 : 0, isPositive: false },
    },
  ];

  // Removed wallet check for prototype mode

  return (
    <div className="min-h-screen relative">
      {/* Dashboard Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/dashboard-bg.jpg')",
        }}
      />
      
      {/* Dark overlay for better content readability */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-800/95" />
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage and monitor your tokenized properties
              </p>
            </div>
            <Button onClick={() => navigate("/register")} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Register Property
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Properties Section */}
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Properties</h2>
            <button 
              onClick={() => navigate("/properties")}
              className="text-primary hover:underline"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0, 6).map((property) => (
              <PropertyCard 
                key={property.id}
                id={property.id}
                name={property.name}
                address={property.address}
                tokenId={property.tokenId}
                status={property.status === 'frozen' ? 'pending' : property.status}
                type={property.type}
                size={property.size}
              />
            ))}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default Dashboard;
