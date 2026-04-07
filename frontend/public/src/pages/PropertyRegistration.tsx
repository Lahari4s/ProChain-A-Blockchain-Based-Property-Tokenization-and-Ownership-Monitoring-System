import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProperties } from "@/contexts/PropertyContext";
import { useUsers } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Upload, FileText, MapPin, Home, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PropertyRegistration = () => {
  const navigate = useNavigate();
  const isConnected = true; // Mock for prototype
  const { toast } = useToast();
  const { addProperty } = useProperties();
  const { addUser, getUserByName, getUserByEmail } = useUsers();
  
  const [formData, setFormData] = useState({
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    propertyAddress: "",
    coordinates: "",
    size: "",
    legalDescription: "",
    requiresMultiSig: false,
  });
  
  const [files, setFiles] = useState<{
    images?: File[];
  }>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFiles(prev => ({ ...prev, images: Array.from(selectedFiles) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to register a property.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate IPFS upload and blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add or update user in User Management
      let existingUser = getUserByEmail(formData.ownerEmail);
      const isNewUser = !existingUser;
      
      if (!existingUser) {
        // Create new user if doesn't exist
        existingUser = addUser({
          name: formData.ownerName,
          email: formData.ownerEmail,
          phone: formData.ownerPhone,
          role: 'buyer',
          status: 'active',
        });
      }

      // Extract property name from address (first part before comma)
      const propertyName = formData.propertyAddress.split(',')[0] || "Property";
      
      // Determine property type based on size or default to Residential
      const propertyType = parseInt(formData.size) > 5000 ? "Commercial" : "Residential";

      // Add property to context
      addProperty({
        name: propertyName,
        ownerName: formData.ownerName,
        userId: existingUser.id,
        address: formData.propertyAddress,
        size: formData.size + " sq ft",
        legalDescription: formData.legalDescription,
        type: propertyType,
        requiresMultiSig: formData.requiresMultiSig,
      });

      toast({
        title: "Property Registered Successfully!",
        description: `Your property has been tokenized and added to your portfolio. ${isNewUser ? 'New user created' : 'User profile linked'} in User Management.`,
      });

      // Navigate to dashboard after successful registration
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error registering your property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Removed wallet check for prototype

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Register New Property</h1>
            <p className="text-muted-foreground">
              Tokenize your property on the blockchain with secure, immutable records.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Property Details
                </CardTitle>
                <CardDescription>
                  Enter the basic information about your property
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ownerName">Owner Name *</Label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ownerEmail">Owner Email *</Label>
                    <Input
                      id="ownerEmail"
                      name="ownerEmail"
                      type="email"
                      value={formData.ownerEmail}
                      onChange={handleInputChange}
                      placeholder="owner@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ownerPhone">Owner Phone *</Label>
                    <Input
                      id="ownerPhone"
                      name="ownerPhone"
                      type="tel"
                      value={formData.ownerPhone}
                      onChange={handleInputChange}
                      placeholder="1234567890"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="propertyAddress">Property Address *</Label>
                  <Input
                    id="propertyAddress"
                    name="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={handleInputChange}
                    placeholder="123 Main Street, City, State, ZIP"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="coordinates">GPS Coordinates *</Label>
                  <div className="flex gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-2" />
                    <Input
                      id="coordinates"
                      name="coordinates"
                      value={formData.coordinates}
                      onChange={handleInputChange}
                      placeholder="40.7128° N, 74.0060° W"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="size">Property Size (sq ft) *</Label>
                  <Input
                    id="size"
                    name="size"
                    type="number"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="2500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="legalDescription">Legal Description *</Label>
                  <Textarea
                    id="legalDescription"
                    name="legalDescription"
                    value={formData.legalDescription}
                    onChange={handleInputChange}
                    placeholder="Enter the legal description of the property..."
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Document Upload
                </CardTitle>
                <CardDescription>
                  Upload property documents (will be stored on IPFS)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="images">Property Images</Label>
                  <div className="mt-2">
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                    />
                  </div>
                  {files.images && files.images.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {files.images.length} image(s) selected
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security features for your property token
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="multiSig">Require Multi-Signature Transfer</Label>
                    <p className="text-sm text-muted-foreground">
                      Transfers will require approval from authorized verifiers
                    </p>
                  </div>
                  <Switch
                    id="multiSig"
                    checked={formData.requiresMultiSig}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, requiresMultiSig: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Register Property
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyRegistration;
