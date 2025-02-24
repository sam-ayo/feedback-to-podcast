import React from "react";
import { Podcast } from "lucide-react";
import { Header } from "@/components/weekly-calls/Header";
import { WeeklyPodcastCard } from "@/components/weekly-calls/WeeklyPodcastCard";
import { useWeeklyPodcasts } from "@/hooks/useWeeklyPodcasts";

const MOCK_CALLS = [
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
      "Marketing strategy needs revision",
    ],
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
      "Priority bugs identified for next sprint",
    ],
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
      "Follow-up meeting scheduled for next week",
    ],
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
      "Team restructuring proposed for better territory coverage",
    ],
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
      "Technical debt reduction plan approved",
    ],
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
      "New brand guidelines presented",
    ],
  },
];

const WeeklyCallsInsights = () => {
  const { weeklyPodcasts, isLoading, generatePodcast } = useWeeklyPodcasts(MOCK_CALLS);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container max-w-4xl py-12 px-4">
        <div className="space-y-8">
          <Header />
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Podcast className="w-5 h-5" />
              <p>30-minute AI-generated summaries of your weekly calls</p>
            </div>
            <div className="grid gap-6">
              {weeklyPodcasts.map((podcast) => (
                <WeeklyPodcastCard
                  key={podcast.id}
                  {...podcast}
                  onGenerate={generatePodcast}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCallsInsights;
