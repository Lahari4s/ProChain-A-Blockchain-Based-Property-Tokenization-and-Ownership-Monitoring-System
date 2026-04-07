import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Shield, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PropertyCardProps {
  id: string;
  name: string;
  address: string;
  tokenId: string;
  status: "active" | "pending" | "transferred";
  imageUrl?: string;
  size?: string;
  type?: string;
}

const PropertyCard = ({
  id,
  name,
  address,
  tokenId,
  status,
  imageUrl,
  size,
  type,
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const statusColors = {
    active: "bg-accent text-accent-foreground",
    pending: "bg-secondary text-secondary-foreground",
    transferred: "bg-muted text-muted-foreground",
  };

  return (
    <Card className="overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-[1.02] group">
      {/* Property Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-16 h-16 text-primary/40" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className={statusColors[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <div className="absolute inset-0 gradient-hero opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Property Name */}
        <h3 className="text-xl font-bold truncate">{name}</h3>

        {/* Address */}
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-sm line-clamp-2">{address}</span>
        </div>

        {/* Property Details */}
        <div className="flex gap-4 text-sm">
          {type && (
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4 text-primary" />
              <span>{type}</span>
            </div>
          )}
          {size && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">{size}</span>
            </div>
          )}
        </div>

        {/* Token ID */}
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <Shield className="w-4 h-4 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Token ID</p>
            <p className="text-sm font-mono truncate">{tokenId}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => navigate(`/property/${id}`)}
          >
            <Eye className="w-4 h-4" />
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => navigate(`/transfer/${id}`)}
          >
            Transfer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
