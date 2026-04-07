import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  FileText,
  Clock,
  TrendingUp,
  Activity
} from "lucide-react";
import { VerificationResult, RiskLevel } from "@/services/FraudDetectionService";

interface DocumentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verificationResult: VerificationResult | null;
  onProceed: () => void;
  onCancel: () => void;
  isVerifying: boolean;
}

const DocumentVerificationModal = ({
  isOpen,
  onClose,
  verificationResult,
  onProceed,
  onCancel,
  isVerifying,
}: DocumentVerificationModalProps) => {
  
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'medium':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'high':
        return <AlertTriangle className="w-6 h-6 text-orange-600" />;
      case 'critical':
        return <XCircle className="w-6 h-6 text-red-600" />;
    }
  };

  const getAlertIcon = (severity: RiskLevel) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getAlertVariant = (severity: RiskLevel) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (isVerifying) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 animate-pulse text-primary" />
              Verifying Property Documents...
            </DialogTitle>
            <DialogDescription>
              Running comprehensive fraud detection analysis
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 animate-spin text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Analyzing document authenticity</p>
                <Progress value={33} className="mt-2" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 animate-spin text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Validating ownership chain</p>
                <Progress value={66} className="mt-2" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 animate-spin text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Detecting suspicious patterns</p>
                <Progress value={90} className="mt-2" />
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center mt-4">
              This may take a few moments...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!verificationResult) return null;

  const canProceed = verificationResult.riskLevel !== 'critical';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Property Verification Report
          </DialogTitle>
          <DialogDescription>
            Comprehensive fraud detection analysis completed
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Risk Level Summary */}
          <div className={`p-4 rounded-lg border-2 ${getRiskColor(verificationResult.riskLevel)}`}>
            <div className="flex items-start gap-4">
              {getRiskIcon(verificationResult.riskLevel)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg uppercase">
                    {verificationResult.riskLevel} Risk
                  </h3>
                  <Badge variant="secondary" className="font-mono">
                    Score: {verificationResult.riskScore}/100
                  </Badge>
                </div>
                <p className="text-sm">{verificationResult.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Verification Checks */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Verification Checks
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(verificationResult.checks).map(([key, passed]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 p-3 border rounded-lg"
                >
                  {passed ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          {verificationResult.alerts.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Fraud Alerts ({verificationResult.alerts.length})
              </h4>
              <div className="space-y-3">
                {verificationResult.alerts.map((alert, index) => (
                  <Alert key={index} variant={getAlertVariant(alert.severity)}>
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.severity)}
                      <div className="flex-1">
                        <AlertTitle className="flex items-center justify-between">
                          <span>{alert.message}</span>
                          <Badge variant="outline" className="ml-2">
                            {alert.severity}
                          </Badge>
                        </AlertTitle>
                        <AlertDescription className="mt-2">
                          {alert.details}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
            <Clock className="w-4 h-4" />
            <span>Verified at: {new Date(verificationResult.timestamp).toLocaleString()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel Transfer
            </Button>
            {canProceed ? (
              <Button
                onClick={onProceed}
                className="flex-1"
                variant={verificationResult.riskLevel === 'high' ? 'destructive' : 'default'}
              >
                {verificationResult.riskLevel === 'high' 
                  ? 'Proceed at Your Own Risk' 
                  : 'Proceed with Transfer'}
              </Button>
            ) : (
              <Button disabled className="flex-1">
                Transfer Blocked
              </Button>
            )}
          </div>

          {verificationResult.riskLevel === 'critical' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Transfer Automatically Blocked</AlertTitle>
              <AlertDescription>
                This transaction has been blocked due to critical fraud indicators. 
                Please contact support and report this incident to the authorities.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentVerificationModal;
