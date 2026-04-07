import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileCheck,
  Link2,
  TrendingDown,
  Activity,
  Download
} from "lucide-react";
import { VerificationResult, RiskLevel } from "@/services/FraudDetectionService";
import { Button } from "@/components/ui/button";

interface VerificationReportProps {
  verificationResult: VerificationResult;
  propertyName: string;
  propertyId: string;
}

const VerificationReport = ({ 
  verificationResult, 
  propertyName, 
  propertyId 
}: VerificationReportProps) => {
  
  const getRiskBadgeVariant = (level: RiskLevel) => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
    }
  };

  const downloadReport = () => {
    const reportData = {
      propertyName,
      propertyId,
      ...verificationResult,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verification-report-${propertyId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="w-6 h-6" />
                Property Verification Report
              </CardTitle>
              <CardDescription className="mt-2">
                Property: {propertyName} (ID: #{propertyId})
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={downloadReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Risk Assessment</p>
              <p className="text-2xl font-bold uppercase">{verificationResult.riskLevel} Risk</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Risk Score</p>
              <p className="text-3xl font-bold">{verificationResult.riskScore}/100</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="font-medium">Document Hash Verification</span>
              </div>
              {verificationResult.checks.documentHash ? (
                <Badge variant="default">Passed</Badge>
              ) : (
                <Badge variant="destructive">Failed</Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 text-primary" />
                <span className="font-medium">Ownership Chain Validation</span>
              </div>
              {verificationResult.checks.ownershipChain ? (
                <Badge variant="default">Passed</Badge>
              ) : (
                <Badge variant="destructive">Failed</Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary" />
                <span className="font-medium">Transfer Frequency Analysis</span>
              </div>
              {verificationResult.checks.transferFrequency ? (
                <Badge variant="default">Passed</Badge>
              ) : (
                <Badge variant="destructive">Failed</Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-primary" />
                <span className="font-medium">Price Validation</span>
              </div>
              {verificationResult.checks.priceValidation ? (
                <Badge variant="default">Passed</Badge>
              ) : (
                <Badge variant="destructive">Failed</Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-medium">Pattern Analysis</span>
              </div>
              {verificationResult.checks.patternAnalysis ? (
                <Badge variant="default">Passed</Badge>
              ) : (
                <Badge variant="destructive">Failed</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts and Warnings */}
      {verificationResult.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Detected Issues ({verificationResult.alerts.length})
            </CardTitle>
            <CardDescription>
              Critical findings that require attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {verificationResult.alerts.map((alert, index) => (
              <Alert 
                key={index} 
                variant={alert.severity === 'critical' || alert.severity === 'high' ? 'destructive' : 'default'}
                className="relative"
              >
                <div className="absolute top-3 right-3">
                  <Badge variant={getRiskBadgeVariant(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
                {alert.severity === 'critical' ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertTitle>{alert.message}</AlertTitle>
                <AlertDescription className="mt-2 pr-20">
                  {alert.details}
                </AlertDescription>
                <div className="mt-2 text-xs text-muted-foreground">
                  Alert Type: {alert.type.replace(/_/g, ' ').toUpperCase()}
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant={verificationResult.riskLevel === 'critical' || verificationResult.riskLevel === 'high' ? 'destructive' : 'default'}>
            <AlertDescription className="text-base">
              {verificationResult.recommendation}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Report Metadata */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Report Generated</p>
              <p className="font-mono">{new Date(verificationResult.timestamp).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Verification Status</p>
              <p className="font-semibold">
                {verificationResult.isVerified ? (
                  <span className="text-green-600">Verified</span>
                ) : (
                  <span className="text-red-600">Not Verified</span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationReport;
