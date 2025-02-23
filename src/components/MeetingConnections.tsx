
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ZoomIcon from "@/components/icons/ZoomIcon";

const MEETING_PLATFORMS = [
  {
    name: "Zoom",
    icon: ZoomIcon,
    action: () => console.log("Connecting to Zoom..."),
  },
  {
    name: "Microsoft Teams",
    icon: "/lovable-uploads/d725522d-d449-4284-ad8c-34b718fcec60.png#teams",
    action: () => console.log("Connecting to Teams..."),
  },
  {
    name: "Google Meet",
    icon: "/lovable-uploads/d725522d-d449-4284-ad8c-34b718fcec60.png#meet",
    action: () => console.log("Connecting to Google Meet..."),
  },
];

const MeetingConnections = () => {
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
        {MEETING_PLATFORMS.map((platform) => (
          <Card
            key={platform.name}
            className="p-6 hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/50 cursor-pointer"
            onClick={platform.action}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm p-2 flex items-center justify-center">
                {typeof platform.icon === 'string' ? (
                  <img
                    src={platform.icon}
                    alt={platform.name}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <platform.icon className="w-10 h-10" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {platform.name}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" className="mt-6">
          View More
        </Button>
      </div>
    </div>
  );
};

export default MeetingConnections;
