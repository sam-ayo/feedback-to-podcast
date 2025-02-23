
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Podcast, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PodcastPreview from "@/components/PodcastPreview";

// Mock weekly podcast data
const MOCK_WEEKLY_PODCASTS = [
  {
    id: 1,
    weekStart: "2024-03-18",
    weekEnd: "2024-03-24",
    audioUrl: "https://example.com/podcast1.mp3",
    numCalls: 5,
  },
  {
    id: 2,
    weekStart: "2024-03-11",
    weekEnd: "2024-03-17",
    audioUrl: "https://example.com/podcast2.mp3",
    numCalls: 4,
  }
];

const WeeklyCallsInsights = () => {
  const formatWeekRange = (start: string, end: string) => {
    return `${new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container max-w-4xl py-12 px-4">
        <div className="space-y-8">
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

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Podcast className="w-5 h-5" />
              <p>30-minute AI-generated summaries of your weekly calls</p>
            </div>
            <div className="grid gap-6">
              {MOCK_WEEKLY_PODCASTS.map((podcast) => (
                <Card key={podcast.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Week of {formatWeekRange(podcast.weekStart, podcast.weekEnd)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {podcast.numCalls} calls summarized
                        </p>
                      </div>
                    </div>
                    <PodcastPreview audioUrl={podcast.audioUrl} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCallsInsights;
