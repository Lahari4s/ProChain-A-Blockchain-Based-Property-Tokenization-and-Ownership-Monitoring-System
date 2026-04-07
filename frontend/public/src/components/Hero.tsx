import { Button } from "@/components/ui/button";
import { Shield, Lock, ArrowRight, FileCheck, TrendingUp, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Blockchain Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/blockchain-bg.jpg')",
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 via-transparent to-purple-950/50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Main Content */}
          <div className="text-center mb-16 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white">Secure · Transparent · Immutable</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">
                Property Ownership
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Secured by Blockchain
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Tokenize, transfer, and protect your real estate assets with blockchain technology. 
              Prevent fraud with immutable records and complete ownership transparency.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all"
                  onClick={() => navigate(user?.role === 'admin' ? "/dashboard" : "/properties")}
                >
                  Go to {user?.role === 'admin' ? 'Dashboard' : 'Properties'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all"
                    onClick={() => navigate("/buyer-login")}
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white px-8 py-6 text-lg rounded-xl transition-all"
                    onClick={() => navigate("/admin-login")}
                  >
                    Admin Portal
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-20">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">50+</div>
                <div className="text-sm text-slate-400">Properties Secured</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-sm text-slate-400">Fraud Prevention</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-sm text-slate-400">Blockchain Security</div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:bg-white/10 group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Fraud Prevention</h3>
              <p className="text-slate-400 leading-relaxed">
                Immutable blockchain records ensure every transaction is verified and cannot be tampered with
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">NFT Tokenization</h3>
              <p className="text-slate-400 leading-relaxed">
                Each property becomes a unique digital asset with complete ownership history on the blockchain
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:bg-white/10 group">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <FileCheck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instant Verification</h3>
              <p className="text-slate-400 leading-relaxed">
                Verify property ownership and documents instantly with cryptographic proof and digital signatures
              </p>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Why Choose ProChain?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Multi-Signature Security</h4>
                    <p className="text-slate-400 text-sm">High-value transfers require multiple approvals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Time-Locked Transfers</h4>
                    <p className="text-slate-400 text-sm">2-day safety period for all transactions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Complete History</h4>
                    <p className="text-slate-400 text-sm">Full chain of custody for every property</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">IPFS Storage</h4>
                    <p className="text-slate-400 text-sm">Decentralized document storage and verification</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
