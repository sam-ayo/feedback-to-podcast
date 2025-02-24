
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PodcastPreview from "@/components/PodcastPreview";

interface WeeklyPodcastCardProps {
  id: number;
  weekStart: string;
  weekEnd: string;
  numCalls: number;
  audioUrl?: string;
  isGenerating?: boolean;
  onGenerate: (weekStart: string, weekEnd: string) => void;
}

const formatWeekRange = (start: string, end: string) => {
  return `${new Date(start).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${new Date(end).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
};

export const WeeklyPodcastCard: React.FC<WeeklyPodcastCardProps> = ({
  weekStart,
  weekEnd,
  numCalls,
  audioUrl,
  isGenerating,
  onGenerate,
}) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Week of {formatWeekRange(weekStart, weekEnd)}
            </h3>
            <p className="text-sm text-gray-500">{numCalls} calls summarized</p>
          </div>
          {!audioUrl && !isGenerating && (
            <Button
              onClick={() => onGenerate(weekStart, weekEnd)}
              size="sm"
            >
              Generate Summary
            </Button>
          )}
        </div>
        {isGenerating && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            Generating podcast summary...
          </div>
        )}
        {audioUrl && <PodcastPreview audioUrl={audioUrl} />}
      </div>
    </Card>
  );
};
