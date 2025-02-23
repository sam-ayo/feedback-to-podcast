
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for demonstration
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
      "Marketing strategy needs revision"
    ]
  },
  {
    id: 2,
    platform: "Microsoft Teams",
    title: "Product Review",
    date: "2024-03-17T15:30:00",
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
    date: "2024-03-16T14:00:00",
    duration: "30 mins",
    participants: 5,
    insights: [
      "Client approved proposed design changes",
      "Budget increase requested for Q2",
      "Follow-up meeting scheduled for next week"
    ]
  }
];

const IndividualCallsInsights = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container max-w-4xl py-12 px-4">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Link to="/calls">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Weekly Summaries
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Individual Calls</h1>
            <div className="w-24" /> {/* Spacer for alignment */}
          </div>

          <div className="space-y-4">
            {MOCK_CALLS.map((call) => (
              <Card key={call.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {call.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {call.platform} • {formatDate(call.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {call.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {call.participants}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Key Insights
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {call.insights.map((insight, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualCallsInsights;
