import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProperties } from "@/contexts/PropertyContext";
import Navbar from "@/components/Navbar";
import DocumentViewer from "@/components/DocumentViewer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  MapPin, 
  FileText, 
  Clock, 
  Shield,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  User
} from "lucide-react";

// Mock property data for fallback (not normally used)
const mockProperty = {
  id: "999",
  tokenId: "0x123abc...def789",
  name: "Mock Property",
  address: "123 Main Street, Springfield, IL 62701",
  coordinates: "39.7817° N, 89.6501° W",
  size: "2,500 sq ft",
  legalDescription: "Lot 15, Block 3, Springfield Subdivision, as recorded in Plat Book 42, Page 18",
  registrationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'active' as const,
  type: "Residential",
  owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  requiresMultiSig: false,
  ownershipHistory: [
    {
      owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      transactionHash: "0xabc123..."
    }
  ]
};

const PropertyDetails = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { getProperty } = useProperties();
  const isConnected = true; // Mock for prototype
  const address = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
  const [selectedTab, setSelectedTab] = useState("details");
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);

  // Get property from context - try by ID first, then by tokenId
  const property = getProperty(tokenId || '') || mockProperty;
  
  // Debug: Log property data to verify ownership history
  console.log('Property Details - Property Data:', property);
  console.log('Property Details - Ownership History:', property.ownershipHistory);
  
  const isOwner = address?.toLowerCase() === property.owner.toLowerCase();

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Removed wallet check for prototype

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{property.name}</h1>
                <p className="text-muted-foreground">{property.address}</p>
              </div>
              <div className="flex gap-2">
                {property.status === 'active' && (
                  <Badge className="gap-1" variant="default">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </Badge>
                )}
                {property.status === 'pending' && (
                  <Badge className="gap-1" variant="secondary">
                    <Clock className="w-3 h-3" />
                    Pending
                  </Badge>
                )}
                {property.status === 'frozen' && (
                  <Badge className="gap-1" variant="destructive">
                    <AlertTriangle className="w-3 h-3" />
                    Frozen
                  </Badge>
                )}
                {isOwner && (
                  <Badge variant="secondary">You Own This</Badge>
                )}
              </div>
            </div>

            {isOwner && property.status !== 'frozen' && (
              <Button onClick={() => navigate(`/transfer/${property.id}`)}>
                Transfer Property
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Main Content */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3 max-w-2xl">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Property Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Property Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Address</p>
                    <p className="font-medium">{property.address}</p>
                  </div>
                  {property.coordinates && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">GPS Coordinates</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <p className="font-medium">{property.coordinates}</p>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Property Size</p>
                    <p className="font-medium">{property.size}</p>
                  </div>
                  {property.legalDescription && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Legal Description</p>
                      <p className="font-medium">{property.legalDescription}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Property Type</p>
                    <p className="font-medium">{property.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Registration Date</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p className="font-medium">{formatTimestamp(property.registrationDate)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ownership Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Current Owner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg font-mono text-sm break-all">
                    {property.owner}
                  </div>
                </CardContent>
              </Card>

              {/* Blockchain Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Blockchain Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Token ID</p>
                    <p className="font-medium font-mono text-sm">{property.tokenId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Property ID</p>
                    <p className="font-medium">#{property.id}</p>
                  </div>
                  {property.requiresMultiSig && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Security</p>
                      <Badge variant="secondary">Multi-Signature Required</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Property Documents
                  </CardTitle>
                  <CardDescription>
                    All documents are stored on IPFS with cryptographic verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Property Survey</p>
                        <p className="text-sm text-muted-foreground">PDF • 3.1 MB</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsDocumentViewerOpen(true)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Ownership History
                  </CardTitle>
                  <CardDescription>
                    Complete chain of custody recorded on the blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {property.ownershipHistory && property.ownershipHistory.length > 0 ? (
                      property.ownershipHistory.map((record, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            {index < property.ownershipHistory.length - 1 && (
                              <div className="w-0.5 h-full bg-border mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-8">
                            <p className="text-sm text-muted-foreground mb-1">
                              {formatTimestamp(record.timestamp)}
                            </p>
                            <p className="font-mono text-sm break-all mb-2">{record.owner}</p>
                            <p className="text-xs text-muted-foreground">
                              Tx: {record.transactionHash}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No ownership history available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewer
        isOpen={isDocumentViewerOpen}
        onClose={() => setIsDocumentViewerOpen(false)}
        documentTitle="Property Survey"
        documentType="PDF"
        documentSize="3.1 MB"
      />
    </div>
  );
};

export default PropertyDetails;
