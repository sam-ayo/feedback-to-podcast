
import React from 'react';

interface AudioWaveformProps {
  audioUrl: string;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ audioUrl }) => {
  return (
    <div className="w-full h-24 bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 animate-fadeIn">
      {/* Placeholder waveform visualization */}
      <div className="flex items-center justify-center h-full space-x-1">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-primary/60 rounded-full"
            style={{
              height: `${Math.random() * 100}%`,
              transition: 'height 0.5s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioWaveform;
