
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mic, Link } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface FeedbackInputProps {
  onSubmit: (feedback: string) => void;
}

const FeedbackInput: React.FC<FeedbackInputProps> = ({ onSubmit }) => {
  const [feedback, setFeedback] = React.useState('');
  const [meetingUrl, setMeetingUrl] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      try {
        const { data, error } = await supabase.functions.invoke('text-to-speech', {
          body: { text: feedback }
        });

        if (error) throw error;
        
        // Create audio element and play
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        await audio.play();
        
        onSubmit(feedback);
        setFeedback('');
      } catch (error) {
        console.error('Error generating speech:', error);
      }
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement actual recording logic
  };

  const validateMeetingUrl = (url: string) => {
    return url.includes('zoom.us') || 
           url.includes('meet.google.com') || 
           url.includes('teams.microsoft.com');
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/50 animate-slideUp">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Meeting URL</label>
          <div className="flex gap-2">
            <Input
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              placeholder="Paste your Zoom, Google Meet, or Teams URL"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              disabled={!validateMeetingUrl(meetingUrl)}
              onClick={() => window.open(meetingUrl, '_blank')}
            >
              <Link className="w-4 h-4" />
              Join
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Meeting Feedback</label>
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
            className={`flex items-center gap-2 ${isRecording ? 'bg-red-50 text-red-500' : ''}`}
          >
            <Mic className="w-4 h-4" />
            {isRecording ? 'Stop Recording' : 'Start Recording'}
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
