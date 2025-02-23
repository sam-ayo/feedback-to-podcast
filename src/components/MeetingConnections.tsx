
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MEETING_PLATFORMS = [
  {
    name: "Zoom",
    icon: "/lovable-uploads/23979912-505b-4501-9983-9cd4de105f0f.png",
    action: () => console.log("Connecting to Zoom..."),
  },
  {
    name: "Microsoft Teams",
    icon: "/lovable-uploads/ac08d998-f1c0-4c94-b4f4-ffa439e8f247.png",
    action: () => console.log("Connecting to Teams..."),
  },
  {
    name: "Google Meet",
    icon: "/lovable-uploads/3b32a131-94e7-44ec-9162-26509b84d144.png",
    action: () => console.log("Connecting to Google Meet..."),
  },
  {
    name: "Dial Pad",
    icon: "/lovable-uploads/39d733de-6aa7-47b5-ad16-9b396e7b4181.png",
    action: () => console.log("Opening Dial Pad..."),
  },
];

const MeetingConnections = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedPlatforms = showAll ? MEETING_PLATFORMS : MEETING_PLATFORMS.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Connect your calls and meetings
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Extract key moments from your meetings and transform them into concise, engaging podcasts.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayedPlatforms.map((platform) => (
          <Card
            key={platform.name}
            className="p-6 hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/50 cursor-pointer"
            onClick={platform.action}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 rounded-2xl bg-white shadow-sm p-3 flex items-center justify-center">
                <img
                  src={platform.icon}
                  alt={platform.name}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {platform.name}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {MEETING_PLATFORMS.length > 3 && (
        <div className="text-center">
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "View More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MeetingConnections;
