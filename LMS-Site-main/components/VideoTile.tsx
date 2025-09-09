import React from 'react';
import { MicOffIcon } from './icons/MicOffIcon';

interface VideoTileProps {
  name: string;
  isMuted?: boolean;
  isSelf?: boolean;
  avatarUrl?: string;
}

const VideoTile: React.FC<VideoTileProps> = ({ name, isMuted, isSelf, avatarUrl }) => {
  return (
    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      <img src={avatarUrl || `https://i.pravatar.cc/300?u=${name}`} alt={name} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{name} {isSelf && '(You)'}</span>
            {isMuted && <MicOffIcon className="w-4 h-4 text-white" />}
        </div>
      </div>
    </div>
  );
};

export default VideoTile;
