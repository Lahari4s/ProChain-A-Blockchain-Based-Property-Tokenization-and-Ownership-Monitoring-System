import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, Clock, Shield, AlertTriangle, CheckCircle, FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { wsClient } from "@/services/WebSocketClient";
import { useProperties } from "@/contexts/PropertyContext";
import { fraudDetectionService, VerificationResult } from "@/services/FraudDetectionService";
import DocumentVerificationModal from "@/components/DocumentVerificationModal";
import { useAlertSystem } from "@/components/AlertSystem";
import { useNotifications } from "@/contexts/NotificationContext";

const PropertyTransfer = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const isConnected = true; // Mock for prototype
  const address = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
  const { toast } = useToast();
  const { transferProperty } = useProperties();
  
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<{ images?: File[] }>({});
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { addAlert } = useAlertSystem();
  const { getProperty } = useProperties();
  const property = getProperty(tokenId || '');
  const { addNotification } = useNotifications();

  // Validate Ethereum address
  const validateAddress = (addr: string) => {
    if (!addr) {
      setAddressError("");
      setIsValidAddress(false);
      return false;
    }

    // Check format: 0x followed by 40 hex characters
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    
    if (!addr.startsWith('0x')) {
      setAddressError("Address must start with '0x'");
      setIsValidAddress(false);
      return false;
    }
    
    if (addr.length < 42) {
      setAddressError(`Address too short (${addr.length}/42 characters)`);
      setIsValidAddress(false);
      return false;
    }
    
    if (addr.length > 42) {
      setAddressError(`Address too long (${addr.length}/42 characters)`);
      setIsValidAddress(false);
      return false;
    }
    
    if (!ethAddressRegex.test(addr)) {
      setAddressError("Address contains invalid characters (only hex: 0-9, a-f, A-F)");
      setIsValidAddress(false);
      return false;
    }

    if (addr.toLowerCase() === address.toLowerCase()) {
      setAddressError("Cannot transfer to yourself");
      setIsValidAddress(false);
      return false;
    }
    
    setAddressError("");
    setIsValidAddress(true);
    return true;
  };

  // Validate address on change
  useEffect(() => {
    if (recipientAddress) {
      validateAddress(recipientAddress);
    }
  }, [recipientAddress]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedDocuments({ images: Array.from(files) });
    }
  };

  const initiateVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to transfer property.",
        variant: "destructive",
      });
      return;
    }

    if (!validateAddress(recipientAddress)) {
      toast({
        title: "Invalid Address",
        description: addressError || "Please enter a valid Ethereum address.",
        variant: "destructive",
      });
      return;
    }

    if (!property) {
      toast({
        title: "Property Not Found",
        description: "Unable to find property details.",
        variant: "destructive",
      });
      return;
    }

    // Start verification process
    setIsVerifying(true);
    setShowVerificationModal(true);

    try {
      // Run fraud detection analysis
      const result = await fraudDetectionService.analyzePropertyTransfer(
        property,
        recipientAddress,
        uploadedDocuments
      );

      setVerificationResult(result);
      setIsVerifying(false);

      // Create alert and notification based on verification result
      if (result.alerts.length > 0) {
        addAlert({
          type: 'fraud_detected',
          severity: result.riskLevel,
          title: `${result.alerts.length} Security Issue(s) Detected`,
          message: `Risk Level: ${result.riskLevel.toUpperCase()} - ${result.recommendation}`,
          propertyId: property.id,
        });
        
        // Send notification for suspicious activity
        addNotification({
          type: 'suspicious_activity',
          title: '⚠️ Suspicious Activity Detected',
          message: `${result.alerts.length} security issue(s) detected during property transfer verification. Risk Level: ${result.riskLevel.toUpperCase()}`,
          propertyId: property.id,
          propertyName: property.name,
          actionUrl: `/property/${property.id}`,
          severity: result.riskLevel,
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setIsVerifying(false);
      toast({
        title: "Verification Failed",
        description: "Unable to complete fraud detection analysis.",
        variant: "destructive",
      });
    }
  };

  const handleTransfer = async () => {
    setIsSubmitting(true);
    setShowVerificationModal(false);

    try {
      // Simulate blockchain transaction
      // TODO: Implement smart contract createTransferRequest function
      
      // Simulate delay for blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if transfer should be blocked
      if (verificationResult && verificationResult.riskLevel === 'critical') {
        addAlert({
          type: 'transfer_blocked',
          severity: 'critical',
          title: 'Transfer Blocked',
          message: 'This transfer has been automatically blocked due to critical fraud indicators.',
          propertyId: property?.id,
        });
        
        toast({
          title: "Transfer Blocked",
          description: "This transfer has been blocked due to critical security concerns.",
          variant: "destructive",
        });
        return;
      }

      // Update property ownership in context
      if (tokenId) {
        console.log('Transferring property:', tokenId, 'to:', recipientAddress);
        transferProperty(tokenId, recipientAddress);
        console.log('Transfer completed successfully');
        
        // Add success alert
        addAlert({
          type: 'verification_complete',
          severity: 'info',
          title: 'Transfer Completed',
          message: `Property #${tokenId} has been successfully transferred to ${recipientAddress.substring(0, 10)}...`,
          propertyId: property?.id,
        });
        
        // Send notification for transfer completion
        addNotification({
          type: 'transfer_complete',
          title: '✅ Property Transfer Completed',
          message: `Property "${property.name}" has been successfully transferred to ${recipientAddress.substring(0, 10)}...${recipientAddress.substring(38)}`,
          propertyId: property?.id,
          propertyName: property?.name,
          actionUrl: `/property/${tokenId}`,
          severity: 'low',
        });
      }

      // Trigger notification via WebSocket (simulated)
      if (wsClient.isConnected()) {
        wsClient.send('TRANSFER_REQUEST', {
          tokenId,
          from: address,
          to: recipientAddress,
          timestamp: Date.now(),
        });
      }

      // Show success notification
      toast({
        title: "Transfer Completed! 🎉",
        description: `Property has been successfully transferred to ${recipientAddress.substring(0, 6)}...${recipientAddress.substring(38)}`,
      });

      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('ProChain - Transfer Completed', {
          body: `Property #${tokenId} transferred to ${recipientAddress.substring(0, 6)}...${recipientAddress.substring(38)}`,
          icon: '/icon-192x192.png',
        });
      }

      setTimeout(() => {
        navigate(`/property/${tokenId}`);
      }, 2000);
      
    } catch (error) {
      console.error("Transfer error:", error);
      toast({
        title: "Transfer Failed",
        description: "There was an error creating the transfer request. Please try again.",
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Transfer Property</h1>
            <p className="text-muted-foreground">
              Property Token ID: #{tokenId}
            </p>
          </div>

          <Alert className="mb-6">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Time-locked Transfer:</strong> All property transfers include a 2-day safety period before execution.
            </AlertDescription>
          </Alert>

          <form onSubmit={initiateVerification} className="space-y-6">
            {/* Current Owner */}
            <Card>
              <CardHeader>
                <CardTitle>Current Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg font-mono text-sm break-all">
                  {address}
                </div>
              </CardContent>
            </Card>

            {/* New Owner */}
            <Card>
              <CardHeader>
                <CardTitle>New Owner</CardTitle>
                <CardDescription>
                  Enter the wallet address of the new property owner
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="recipient">Recipient Wallet Address *</Label>
                  <div className="relative">
                    <Input
                      id="recipient"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      placeholder="0x1234567890abcdef1234567890abcdef12345678"
                      required
                      className={
                        recipientAddress
                          ? isValidAddress
                            ? "border-green-500 pr-10"
                            : "border-red-500 pr-10"
                          : ""
                      }
                    />
                    {recipientAddress && isValidAddress && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {addressError && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {addressError}
                    </p>
                  )}
                  {!addressError && recipientAddress && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Valid Ethereum address
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Please verify the address carefully. Transfers cannot be reversed.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Address format: 0x + 40 hexadecimal characters (42 total)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Document Upload for Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Document Verification
                </CardTitle>
                <CardDescription>
                  Upload property documents for fraud detection analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="documents">Property Documents (Optional)</Label>
                  <div className="mt-2">
                    <Input
                      id="documents"
                      type="file"
                      accept="image/*,.pdf"
                      multiple
                      onChange={handleFileUpload}
                    />
                  </div>
                  {uploadedDocuments.images && uploadedDocuments.images.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {uploadedDocuments.images.length} document(s) uploaded
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload documents to verify authenticity and detect potential fraud. Documents will be analyzed for tampering and compared against blockchain records.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">2-Day Timelock</p>
                    <p className="text-sm text-muted-foreground">
                      Transfer will be executable after 48 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Multi-Signature Verification</p>
                    <p className="text-sm text-muted-foreground">
                      May require approval from authorized verifiers
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Fraud Detection Analysis</p>
                    <p className="text-sm text-muted-foreground">
                      AI-powered system will analyze documents and detect suspicious patterns
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/property/${tokenId}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || !recipientAddress || !isValidAddress}
              >
                {isSubmitting ? (
                  "Processing Transfer..."
                ) : (
                  <>
                    Verify & Transfer Property
                    <Shield className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Verification Modal */}
          <DocumentVerificationModal
            isOpen={showVerificationModal}
            onClose={() => setShowVerificationModal(false)}
            verificationResult={verificationResult}
            onProceed={handleTransfer}
            onCancel={() => {
              setShowVerificationModal(false);
              setVerificationResult(null);
            }}
            isVerifying={isVerifying}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyTransfer;
