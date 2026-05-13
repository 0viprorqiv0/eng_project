import React, { forwardRef } from 'react';
import { PlayCircle } from 'lucide-react';

interface VideoPlayerBlockProps {
  selectedModule: any;
  hasVideo: boolean;
  onEnded: () => void;
}

export const VideoPlayerBlock = forwardRef<HTMLVideoElement, VideoPlayerBlockProps>(
  ({ selectedModule, hasVideo, onEnded }, ref) => {
    if (selectedModule.lesson_type !== 'video') return null;

    if (hasVideo) {
      return (
        <video
          ref={ref}
          controls
          controlsList="nodownload"
          src={selectedModule.video_full_url || ''}
          className="w-full h-full object-contain rounded-2xl"
          onEnded={onEnded}
        />
      );
    }

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#13375f] to-[#0a1628]">
        <div className="text-center">
          <PlayCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-sm">Video đang được cập nhật</p>
        </div>
      </div>
    );
  }
);
