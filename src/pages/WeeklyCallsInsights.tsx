
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Podcast, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PodcastPreview from "@/components/PodcastPreview";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  
  calls.forEach(call => {
    const date = new Date(call.date);
    const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
    const weekEnd = new Date(date.setDate(date.getDate() - date.getDay() + 6));
    
    const weekKey = weekStart.toISOString().split('T')[0];
    if (!weeks[weekKey]) {
      weeks[weekKey] = [];
    }
    weeks[weekKey].push(call);
  });

  return Object.entries(weeks).map(([weekStart, calls], index) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    return {
      id: index + 1,
      weekStart: start.toISOString().split('T')[0],
      weekEnd: end.toISOString().split('T')[0],
      numCalls: calls.length,
    };
  }).sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime());
};

const MOCK_CALLS: Call[] = [
  {
    id: 1,
    platform: "Zoom",
    title: "Weekly Team Sync",
    date: "2024-03-18T10:00:00",
    duration: "45 mins",
    participants: 8,
    insights: [
      "Discussed Q1 objectives and milestones",
      "Team agreed on new project timeline",
      "Marketing strategy needs revision"
    ]
  },
  {
    id: 2,
    platform: "Microsoft Teams",
    title: "Product Review",
    date: "2024-03-18T15:30:00",
    duration: "60 mins",
    participants: 12,
    insights: [
      "New feature requirements outlined",
      "User feedback analysis presented",
      "Priority bugs identified for next sprint"
    ]
  },
  {
    id: 3,
    platform: "Google Meet",
    title: "Client Presentation",
    date: "2024-03-19T14:00:00",
    duration: "30 mins",
    participants: 5,
    insights: [
      "Client approved proposed design changes",
      "Budget increase requested for Q2",
      "Follow-up meeting scheduled for next week"
    ]
  },
  {
    id: 4,
    platform: "Zoom",
    title: "Sales Pipeline Review",
    date: "2024-03-11T09:00:00",
    duration: "45 mins",
    participants: 6,
    insights: [
      "Q2 sales targets exceeded expectations",
      "Three new enterprise leads identified",
      "Team restructuring proposed for better territory coverage"
    ]
  },
  {
    id: 5,
    platform: "Microsoft Teams",
    title: "Engineering Standup",
    date: "2024-03-12T11:00:00",
    duration: "30 mins",
    participants: 10,
    insights: [
      "Code deployment successful",
      "Performance improvements measured",
      "Technical debt reduction plan approved"
    ]
  },
  {
    id: 6,
    platform: "Zoom",
    title: "Marketing Strategy",
    date: "2024-03-13T13:00:00",
    duration: "60 mins",
    participants: 7,
    insights: [
      "Social media campaign results analyzed",
      "Content calendar approved for Q2",
      "New brand guidelines presented"
    ]
  }
];

const WeeklyCallsInsights = () => {
  const { toast } = useToast();
  const [weeklyPodcasts, setWeeklyPodcasts] = React.useState<WeeklyPodcast[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const grouped = groupCallsByWeek(MOCK_CALLS);
    setWeeklyPodcasts(grouped);
    setIsLoading(false);
  }, []);

  const generatePodcast = async (weekStart: string, weekEnd: string) => {
    try {
      const weekCalls = MOCK_CALLS.filter(call => {
        const callDate = new Date(call.date);
        return callDate >= new Date(weekStart) && callDate <= new Date(weekEnd);
      });

      setWeeklyPodcasts(prev => prev.map(podcast => 
        podcast.weekStart === weekStart ? { ...podcast, isGenerating: true } : podcast
      ));

      const { data: scriptData, error: scriptError } = await supabase.functions.invoke(
        "generate-podcast-script",
        {
          body: { calls: weekCalls }
        }
      );

      if (scriptError) throw scriptError;

      const { data: audioData, error: audioError } = await supabase.functions.invoke(
        "text-to-speech",
        {
          body: { 
            text: scriptData.script,
            structuredScript: scriptData.structuredScript
          }
        }
      );

      if (audioError) throw audioError;

      setWeeklyPodcasts(prev => prev.map(podcast => 
        podcast.weekStart === weekStart 
          ? { ...podcast, audioUrl: audioData.audioUrl, isGenerating: false }
          : podcast
      ));

      toast({
        title: "Success",
        description: "Weekly podcast summary generated successfully!",
      });

    } catch (error) {
      console.error('Error generating podcast:', error);
      toast({
        title: "Error",
        description: "Failed to generate podcast summary. Please try again.",
        variant: "destructive",
      });

      setWeeklyPodcasts(prev => prev.map(podcast => 
        podcast.weekStart === weekStart ? { ...podcast, isGenerating: false } : podcast
      ));
    }
  };

  const formatWeekRange = (start: string, end: string) => {
    return `${new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

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
              {weeklyPodcasts.map((podcast) => (
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
                      {!podcast.audioUrl && !podcast.isGenerating && (
                        <Button
                          onClick={() => generatePodcast(podcast.weekStart, podcast.weekEnd)}
                          size="sm"
                        >
                          Generate Summary
                        </Button>
                      )}
                    </div>
                    {podcast.isGenerating && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        Generating podcast summary...
                      </div>
                    )}
                    {podcast.audioUrl && <PodcastPreview audioUrl={podcast.audioUrl} />}
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
