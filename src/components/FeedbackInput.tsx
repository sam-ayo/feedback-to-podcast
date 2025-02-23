import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mic } from "lucide-react";

interface FeedbackInputProps {
  onSubmit: (feedback: string) => void;
}

const FeedbackInput: React.FC<FeedbackInputProps> = ({ onSubmit }) => {
  const [feedback, setFeedback] = React.useState("");
  const [isRecording, setIsRecording] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      onSubmit(feedback);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/50 animate-slideUp">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Meeting Feedback
          </label>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your meeting notes or customer feedback here..."
            className="min-h-[150px] resize-none"
          />
        </div>

        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={toggleRecording}
            className={`flex items-center gap-2 ${isRecording ? "bg-red-50 text-red-500" : ""}`}
          >
            <Mic className="w-4 h-4" />
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
          <Button type="submit" disabled={!feedback.trim()}>
            Generate Voice
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FeedbackInput;
