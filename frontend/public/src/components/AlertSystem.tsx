import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Shield, 
  Bell, 
  X, 
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";
import { RiskLevel } from "@/services/FraudDetectionService";

export interface SystemAlert {
  id: string;
  type: 'fraud_detected' | 'verification_complete' | 'transfer_blocked' | 'suspicious_activity' | 'info';
  severity: RiskLevel | 'info';
  title: string;
  message: string;
  timestamp: Date;
  propertyId?: string;
  read: boolean;
}

interface AlertSystemProps {
  alerts: SystemAlert[];
  onDismiss: (alertId: string) => void;
  onClearAll: () => void;
}

const AlertSystem = ({ alerts, onDismiss, onClearAll }: AlertSystemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const unreadCount = alerts.filter(alert => !alert.read).length;

  const getAlertIcon = (type: SystemAlert['type']) => {
    switch (type) {
      case 'fraud_detected':
        return <XCircle className="w-5 h-5" />;
      case 'verification_complete':
        return <CheckCircle className="w-5 h-5" />;
      case 'transfer_blocked':
        return <Shield className="w-5 h-5" />;
      case 'suspicious_activity':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertVariant = (severity: SystemAlert['severity']) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'default';
    }
  };

  const getSeverityColor = (severity: SystemAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Show browser notification for critical alerts
  useEffect(() => {
    alerts.forEach(alert => {
      if (!alert.read && (alert.severity === 'critical' || alert.severity === 'high')) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`ProChain Security Alert - ${alert.severity.toUpperCase()}`, {
            body: alert.message,
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png',
            tag: alert.id,
          });
        }
      }
    });
  }, [alerts]);

  if (alerts.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No Active Alerts</p>
          <p className="text-sm mt-1">Your properties are secure</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Alert Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <h3 className="font-semibold">Security Alerts</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} New
            </Badge>
          )}
        </div>
        {alerts.length > 0 && (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand All'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClearAll}
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {alerts.slice(0, isExpanded ? alerts.length : 5).map((alert) => (
          <Alert 
            key={alert.id} 
            variant={getAlertVariant(alert.severity)}
            className={`relative ${!alert.read ? 'border-l-4' : ''}`}
          >
            <div className="flex items-start gap-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <AlertTitle className="flex items-center gap-2 flex-wrap">
                    {alert.title}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getSeverityColor(alert.severity)}`}
                    >
                      {alert.severity}
                    </Badge>
                  </AlertTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => onDismiss(alert.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <AlertDescription className="mb-2">
                  {alert.message}
                </AlertDescription>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{alert.timestamp.toLocaleString()}</span>
                  {alert.propertyId && (
                    <span>Property ID: #{alert.propertyId}</span>
                  )}
                </div>
              </div>
            </div>
          </Alert>
        ))}
      </div>

      {alerts.length > 5 && !isExpanded && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setIsExpanded(true)}
        >
          Show {alerts.length - 5} More Alerts
        </Button>
      )}
    </div>
  );
};

export default AlertSystem;

// Alert Manager Hook
export const useAlertSystem = () => {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);

  const addAlert = (alert: Omit<SystemAlert, 'id' | 'timestamp' | 'read'>) => {
    const newAlert: SystemAlert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  };

  return {
    alerts,
    addAlert,
    dismissAlert,
    clearAllAlerts,
    markAsRead,
  };
};
