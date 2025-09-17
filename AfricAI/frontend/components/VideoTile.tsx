
import React, { useEffect, useRef, useState } from 'react';
import { Participant, Track } from 'livekit-client';
import { MicOffIcon } from './icons/MicOffIcon';
import { UserIcon } from './icons/UserIcon';

interface VideoTileProps {
  participant: Participant;
}

const VideoTile: React.FC<VideoTileProps> = ({ participant }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [videoTrack, setVideoTrack] = useState<Track | undefined>();
  const [audioTrack, setAudioTrack] = useState<Track | undefined>();
  
  useEffect(() => {
    const videoPub = participant.getTrack(Track.Source.Camera);
    const audioPub = participant.getTrack(Track.Source.Microphone);
    
    const handleTrackSubscribed = (track: Track) => {
        if (track.kind === Track.Kind.Video) {
            track.attach(videoRef.current!);
            setVideoTrack(track);
        } else if (track.kind === Track.Kind.Audio) {
            track.attach(audioRef.current!);
            setAudioTrack(track);
        }
    };
    
    const handleTrackUnsubscribed = (track: Track) => {
        track.detach();
         if (track.kind === Track.Kind.Video) {
            setVideoTrack(undefined);
        } else if (track.kind === Track.Kind.Audio) {
            setAudioTrack(undefined);
        }
    };
    
    // Attach existing tracks
    if (videoPub?.isSubscribed && videoPub.videoTrack) {
        handleTrackSubscribed(videoPub.videoTrack);
    }
    if (audioPub?.isSubscribed && audioPub.audioTrack) {
        handleTrackSubscribed(audioPub.audioTrack);
    }
    
    participant.on(Track.Event.TrackSubscribed, handleTrackSubscribed);
    participant.on(Track.Event.TrackUnsubscribed, handleTrackUnsubscribed);
    
    return () => {
      participant.off(Track.Event.TrackSubscribed, handleTrackSubscribed);
      participant.off(Track.Event.TrackUnsubscribed, handleTrackUnsubscribed);
    };

  }, [participant]);
  
  const isVideoOff = !videoTrack;

  return (
    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      <video ref={videoRef} width="100%" height="100%" style={{ display: isVideoOff ? 'none' : 'block' }} />
      <audio ref={audioRef} />

      {isVideoOff && (
        <div className="w-full h-full flex items-center justify-center">
            <UserIcon className="w-16 h-16 text-gray-500"/>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{participant.identity} {participant.isLocal && '(You)'}</span>
            {participant.isMicrophoneMuted && <MicOffIcon className="w-4 h-4 text-white" />}
        </div>
      </div>
    </div>
  );
};

export default VideoTile;
