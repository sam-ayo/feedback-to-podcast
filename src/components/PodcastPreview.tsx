
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, PlayCircle, PauseCircle } from 'lucide-react';
import AudioWaveform from './AudioWaveform';

interface PodcastPreviewProps {
  audioUrl: string;
}

const PodcastPreview: React.FC<PodcastPreviewProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(`data:audio/mp3;base64,${audioUrl}`);
    audioRef.current.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', () => setIsPlaying(false));
        audioRef.current.pause();
      }
    };
  }, [audioUrl]);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([Buffer.from(audioUrl, 'base64')], { type: 'audio/mp3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `podcast-${new Date().toISOString()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/50 animate-slideUp">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Podcast Preview</h3>
          <Button variant="outline" size="icon" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
        <AudioWaveform audioUrl={audioUrl} />
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12"
            onClick={togglePlayback}
          >
            {isPlaying ? (
              <PauseCircle className="w-8 h-8 text-primary" />
            ) : (
              <PlayCircle className="w-8 h-8 text-primary" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PodcastPreview;
