
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const Header = () => {
  return (
    <div className="flex items-center justify-between">
      <Link to="/">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">Weekly Call Summaries</h1>
      <Link to="/calls/individual">
        <Button variant="outline" className="gap-2">
          View Individual Calls
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};
