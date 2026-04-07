import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/contexts/PropertyContext";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Properties = () => {
  const navigate = useNavigate();
  const { properties } = useProperties();
  const [filter, setFilter] = useState<'all' | 'active' | 'pending'>('all');

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true;
    return property.status === filter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">All Properties</h1>
              <p className="text-muted-foreground">
                Manage your tokenized property portfolio
              </p>
            </div>
            <Button onClick={() => navigate("/register")} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Register Property
            </Button>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All ({properties.length})
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              onClick={() => setFilter('active')}
            >
              Active ({properties.filter(p => p.status === 'active').length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
            >
              Pending ({properties.filter(p => p.status === 'pending').length})
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No properties found</p>
            <Button onClick={() => navigate("/register")}>
              Register Your First Property
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
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
        )}
      </div>
    </div>
  );
};

export default Properties;
