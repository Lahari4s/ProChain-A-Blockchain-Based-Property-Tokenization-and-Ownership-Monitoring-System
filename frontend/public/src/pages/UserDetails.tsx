import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Building2, 
  TrendingUp, 
  Activity,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  User
} from "lucide-react";
import { useUsers } from "@/contexts/UserContext";
import { useProperties } from "@/contexts/PropertyContext";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getUser } = useUsers();
  const { properties } = useProperties();
  
  const user = getUser(parseInt(userId || "0"));

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">User Not Found</h1>
            <Button onClick={() => navigate("/users")}>Back to Users</Button>
          </div>
        </main>
      </div>
    );
  }

  // Generate mock data based on user ID for consistency
  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const registrationDate = formatDate(user.registrationDate);
  const lastLoginDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US');

  // Get actual properties owned by this user
  const propertiesOwned = properties.filter(p => p.userId === user.id);

  // Mock transaction history
  const transactions = [
    {
      id: `TX${user.id}${Math.floor(Math.random() * 1000)}`,
      type: 'Property Purchase',
      amount: `$${(250000 + user.id * 5000).toLocaleString()}`,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    },
    {
      id: `TX${user.id}${Math.floor(Math.random() * 1000)}`,
      type: 'KYC Verification',
      amount: '-',
      date: new Date(Date.now() - Math.random() * 400 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    },
    {
      id: `TX${user.id}${Math.floor(Math.random() * 1000)}`,
      type: 'Profile Update',
      amount: '-',
      date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    }
  ];

  // Mock activity log
  const activityLog = [
    {
      action: 'Logged in to platform',
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      ip: `192.168.${user.id % 255}.${Math.floor(Math.random() * 255)}`
    },
    {
      action: 'Viewed property listings',
      timestamp: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString(),
      ip: `192.168.${user.id % 255}.${Math.floor(Math.random() * 255)}`
    },
    {
      action: 'Updated profile information',
      timestamp: new Date(Date.now() - Math.random() * 120 * 60 * 60 * 1000).toISOString(),
      ip: `192.168.${user.id % 255}.${Math.floor(Math.random() * 255)}`
    }
  ];

  const kycStatus = user.id % 5 === 0 ? 'pending' : 'verified';
  const riskScore = Math.floor((user.id % 20) / 20 * 100);
  const trustScore = 100 - riskScore;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/users")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-4xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="h-fit capitalize">
                {user.role}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Properties Owned</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                {propertiesOwned.length}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Transactions</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Activity className="w-6 h-6 text-green-500" />
                {transactions.length}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>KYC Status</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {kycStatus === 'verified' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                )}
                <span className="text-xl capitalize">{kycStatus}</span>
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Trust Score</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
                {trustScore}%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Registration Date</p>
                  <p className="font-medium">{registrationDate}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="font-medium">{lastLoginDate}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">User ID</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">{user.id}</code>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="properties" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>

              <TabsContent value="properties" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Owned Properties</CardTitle>
                    <CardDescription>
                      Properties registered under this user's account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {propertiesOwned.length > 0 ? (
                      <div className="space-y-4">
                        {propertiesOwned.map((property) => (
                          <div 
                            key={property.id} 
                            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/property/${property.tokenId}`)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold">{property.name}</h4>
                                <p className="text-sm text-muted-foreground">{property.address}</p>
                              </div>
                              <Badge 
                                variant={property.status === 'active' ? 'default' : property.status === 'pending' ? 'secondary' : 'destructive'}
                              >
                                {property.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <div>
                                <p className="text-sm text-muted-foreground">Type</p>
                                <p className="font-semibold">{property.type}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Size</p>
                                <p className="font-semibold">{property.size}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Registration Date</p>
                                <p className="text-sm">{new Date(property.registrationDate).toLocaleDateString('en-US')}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No properties registered yet</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      Recent transactions and activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                            <TableCell>{tx.type}</TableCell>
                            <TableCell className="font-semibold">{tx.amount}</TableCell>
                            <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {tx.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                    <CardDescription>
                      Recent user activities and login history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activityLog.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                          <div className="flex-1">
                            <p className="font-medium">{activity.action}</p>
                            <div className="flex gap-4 mt-1">
                              <p className="text-sm text-muted-foreground">
                                {new Date(activity.timestamp).toLocaleString()}
                              </p>
                              <p className="text-sm text-muted-foreground">IP: {activity.ip}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDetails;
