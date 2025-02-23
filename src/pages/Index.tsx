import React from "react";
import MeetingConnections from "@/components/MeetingConnections";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container max-w-4xl py-12 px-4">
        <div className="space-y-16">
          <MeetingConnections />

          <div className="text-center">
            <Link to="/feedback">
              <Button className="gap-2">
                Continue to Podcast Creation
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
