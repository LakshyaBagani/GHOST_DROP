import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Ghost, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <Ghost className="h-24 w-24 text-primary animate-pulse-glow mx-auto" />
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground">This page has vanished like a ghost!</p>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Button asChild className="ghost-glow border-2 font-semibold">
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
