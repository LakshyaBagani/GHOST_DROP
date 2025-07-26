import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Ghost, Shield, Zap, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("ghost-drop-user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <Ghost className="h-16 w-16 text-primary animate-pulse-glow" />
            <h1 className="text-6xl font-bold text-primary">Ghost Drop</h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your secure, ephemeral file vault. Upload, share, and manage files that disappear when you're done with them.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              size="lg" 
              className="ghost-glow border-2 font-semibold text-lg px-8 py-3"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="ghost-hover border-2 font-semibold text-lg px-8 py-3"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <Card className="ghost-glow border-2 hover:scale-105 transition-all duration-300">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-xl">Secure Storage</CardTitle>
              <CardDescription>
                Your files are encrypted and stored securely with end-to-end protection.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="purple-glow border-2 hover:scale-105 transition-all duration-300">
            <CardHeader>
              <Zap className="h-12 w-12 text-accent mb-4" />
              <CardTitle className="text-xl">Lightning Fast</CardTitle>
              <CardDescription>
                Upload and share files instantly with our optimized cloud infrastructure.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="green-glow border-2 hover:scale-105 transition-all duration-300">
            <CardHeader>
              <Cloud className="h-12 w-12 text-success mb-4" />
              <CardTitle className="text-xl">Smart Management</CardTitle>
              <CardDescription>
                Track file usage and automatically clean up unused files from your vault.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
