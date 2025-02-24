
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Call {
  id: number;
  platform: string;
  title: string;
  date: string;
  duration: string;
  participants: number;
  insights: string[];
}

interface WeeklyPodcast {
  id: number;
  weekStart: string;
  weekEnd: string;
  audioUrl?: string;
  numCalls: number;
  isGenerating?: boolean;
}

const groupCallsByWeek = (calls: Call[]): WeeklyPodcast[] => {
  const weeks: { [key: string]: Call[] } = {};

  calls.forEach((call) => {
    const date = new Date(call.date);
    const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
    const weekEnd = new Date(date.setDate(date.getDate() - date.getDay() + 6));

    const weekKey = weekStart.toISOString().split("T")[0];
    if (!weeks[weekKey]) {
      weeks[weekKey] = [];
    }
    weeks[weekKey].push(call);
  });

  return Object.entries(weeks)
    .map(([weekStart, calls], index) => {
      const start = new Date(weekStart);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      return {
        id: index + 1,
        weekStart: start.toISOString().split("T")[0],
        weekEnd: end.toISOString().split("T")[0],
        numCalls: calls.length,
      };
    })
    .sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime());
};

export const useWeeklyPodcasts = (initialCalls: Call[]) => {
  const { toast } = useToast();
  const [weeklyPodcasts, setWeeklyPodcasts] = useState<WeeklyPodcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const grouped = groupCallsByWeek(initialCalls);
    setWeeklyPodcasts(grouped);
    setIsLoading(false);
  }, [initialCalls]);

  const generatePodcast = async (weekStart: string, weekEnd: string) => {
    try {
      const weekCalls = initialCalls.filter((call) => {
        const callDate = new Date(call.date);
        return callDate >= new Date(weekStart) && callDate <= new Date(weekEnd);
      });

      setWeeklyPodcasts((prev) =>
        prev.map((podcast) =>
          podcast.weekStart === weekStart
            ? { ...podcast, isGenerating: true }
            : podcast
        )
      );

      console.log("Generating script for calls:", weekCalls);
      const scriptResponse = await supabase.functions.invoke(
        "generate-podcast-script",
        {
          body: { feedback: weekCalls },
        }
      );

      if (scriptResponse.error) {
        console.error("Script generation error:", scriptResponse.error);
        throw new Error("Failed to generate script");
      }

      const script = scriptResponse.data.script;
      console.log("Generated script:", script);

      console.log("Converting script to speech");
      const audioResponse = await supabase.functions.invoke("text-to-speech", {
        body: { text: script },
      });

      if (audioResponse.error) {
        console.error("Audio generation error:", audioResponse.error);
        throw new Error("Failed to generate audio");
      }

      console.log("Received audio URL:", audioResponse.data.audioUrl);

      setWeeklyPodcasts((prev) =>
        prev.map((podcast) =>
          podcast.weekStart === weekStart
            ? {
                ...podcast,
                audioUrl: audioResponse.data.audioUrl,
                isGenerating: false,
              }
            : podcast
        )
      );

      toast({
        title: "Success",
        description: "Weekly podcast summary generated successfully!",
      });
    } catch (error) {
      console.error("Error generating podcast:", error);
      setWeeklyPodcasts((prev) =>
        prev.map((podcast) =>
          podcast.weekStart === weekStart
            ? { ...podcast, isGenerating: false }
            : podcast
        )
      );

      toast({
        title: "Error",
        description: "Failed to generate podcast summary. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { weeklyPodcasts, isLoading, generatePodcast };
};

export type { Call, WeeklyPodcast };
