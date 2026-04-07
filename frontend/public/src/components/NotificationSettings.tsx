import { useState, useEffect } from 'react';
import { Bell, Smartphone, Mail, MessageSquare, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { firebaseService } from '@/services/FirebaseService';
import { useToast } from '@/hooks/use-toast';

export const NotificationSettings = () => {
  const { toast } = useToast();
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [isEmailEnabled, setIsEmailEnabled] = useState(true);
  const [isSMSEnabled, setIsSMSEnabled] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState('Medium');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Initialize Firebase
    firebaseService.initialize();

    // Check notification permission
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
      setIsPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleEnablePush = async () => {
    if (!firebaseService.isNotificationSupported()) {
      toast({
        title: 'Not Supported',
        description: 'Push notifications are not supported in this browser',
        variant: 'destructive',
      });
      return;
    }

    try {
      const token = await firebaseService.subscribeToNotifications('user_id_placeholder');
      
      if (token) {
        setFcmToken(token);
        setIsPushEnabled(true);
        setPermissionStatus('granted');
        
        toast({
          title: 'Success',
          description: 'Push notifications enabled successfully',
        });
      } else {
        toast({
          title: 'Permission Denied',
          description: 'Please allow notifications in your browser settings',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error enabling push notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to enable push notifications',
        variant: 'destructive',
      });
    }
  };

  const handleTestNotification = async () => {
    if (!fcmToken) {
      toast({
        title: 'No Token',
        description: 'Please enable push notifications first',
        variant: 'destructive',
      });
      return;
    }

    try {
      const success = await firebaseService.sendTestNotification(fcmToken);
      
      if (success) {
        toast({
          title: 'Test Sent',
          description: 'Check your device for the test notification',
        });
      } else {
        toast({
          title: 'Failed',
          description: 'Failed to send test notification',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  const handleSaveSettings = () => {
    // Save settings to backend
    const settings = {
      enablePush: isPushEnabled,
      enableEmail: isEmailEnabled,
      enableSMS: isSMSEnabled,
      alertThreshold,
      fcmToken,
    };

    console.log('Saving settings:', settings);

    toast({
      title: 'Settings Saved',
      description: 'Your notification preferences have been updated',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Configure how you want to receive alerts about your properties
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Push Notifications */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <Label htmlFor="push-notifications" className="text-base font-medium">
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive instant alerts on your device
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {permissionStatus === 'granted' && (
              <Check className="h-4 w-4 text-green-500" />
            )}
            <Switch
              id="push-notifications"
              checked={isPushEnabled}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleEnablePush();
                } else {
                  setIsPushEnabled(false);
                }
              }}
            />
          </div>
        </div>

        {isPushEnabled && (
          <div className="pl-12 space-y-2">
            <Button variant="outline" size="sm" onClick={handleTestNotification}>
              Send Test Notification
            </Button>
            {fcmToken && (
              <p className="text-xs text-muted-foreground font-mono break-all">
                Token: {fcmToken.substring(0, 20)}...
              </p>
            )}
          </div>
        )}

        {/* Email Notifications */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <Label htmlFor="email-notifications" className="text-base font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive detailed alerts via email
              </p>
            </div>
          </div>
          <Switch
            id="email-notifications"
            checked={isEmailEnabled}
            onCheckedChange={setIsEmailEnabled}
          />
        </div>

        {/* SMS Notifications */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
              <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <Label htmlFor="sms-notifications" className="text-base font-medium">
                SMS Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive critical alerts via text message
              </p>
            </div>
          </div>
          <Switch
            id="sms-notifications"
            checked={isSMSEnabled}
            onCheckedChange={setIsSMSEnabled}
          />
        </div>

        {/* Alert Threshold */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Alert Threshold</Label>
          <p className="text-sm text-muted-foreground">
            Minimum severity level for notifications
          </p>
          <Select value={alertThreshold} onValueChange={setAlertThreshold}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low - All alerts</SelectItem>
              <SelectItem value="Medium">Medium - Important alerts</SelectItem>
              <SelectItem value="High">High - Urgent alerts only</SelectItem>
              <SelectItem value="Critical">Critical - Critical alerts only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Browser Notification Info */}
        {permissionStatus === 'denied' && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              Notifications are blocked. Please enable them in your browser settings to receive alerts.
            </p>
          </div>
        )}

        {/* Save Button */}
        <Button onClick={handleSaveSettings} className="w-full">
          <Bell className="h-4 w-4 mr-2" />
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
};
