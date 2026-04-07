import { useNavigate } from 'react-router-dom';
import { Shield, Home, Building2, UserCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LoginSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-6 shadow-2xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Welcome to ProChain
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Secure blockchain-powered property tokenization and ownership verification
            </p>
          </div>

          {/* Login Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Admin Login Card */}
            <Card className="border-purple-500/20 bg-slate-900/50 backdrop-blur hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-purple-400" />
                </div>
                <CardTitle className="text-white text-2xl">Admin Portal</CardTitle>
                <CardDescription className="text-slate-400">
                  Full system access for administrators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 text-purple-400" />
                    Property registration & management
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 text-purple-400" />
                    System analytics & reports
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 text-purple-400" />
                    User management & oversight
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/admin-login')} 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  size="lg"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Continue as Admin
                </Button>
              </CardContent>
            </Card>

            {/* Buyer Login Card */}
            <Card className="border-blue-500/20 bg-slate-900/50 backdrop-blur hover:border-blue-500/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mx-auto mb-4">
                  <Home className="w-8 h-8 text-blue-400" />
                </div>
                <CardTitle className="text-white text-2xl">Buyer Portal</CardTitle>
                <CardDescription className="text-slate-400">
                  Browse and purchase tokenized properties
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 text-blue-400" />
                    Browse property listings
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 text-blue-400" />
                    View property details & history
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 text-blue-400" />
                    Secure property transfers
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 text-blue-400" />
                    Manage your portfolio
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/buyer-login')} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  Continue as Buyer
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer Info */}
          <div className="text-center mt-12 space-y-4">
            <div className="inline-flex items-center px-4 py-2 glass rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              <span className="text-sm text-slate-300">Blockchain Security Active</span>
            </div>
            <p className="text-sm text-slate-400">
              Powered by Ethereum blockchain technology for maximum security and transparency
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSelection;
