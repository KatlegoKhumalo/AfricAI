import React, { useEffect, useRef, useState } from 'react';
import { Participant, Track, TrackEvent } from 'livekit-client';
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
  const [isAudioMuted, setIsAudioMuted] = useState(true);

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
        setIsAudioMuted(track.isMuted ?? false);
        track.on(TrackEvent.Muted, () => setIsAudioMuted(true));
        track.on(TrackEvent.Unmuted, () => setIsAudioMuted(false));
      }
    };

    const handleTrackUnsubscribed = (track: Track) => {
      track.detach(); // detach from all elements
      if (track.kind === Track.Kind.Video) setVideoTrack(undefined);
      if (track.kind === Track.Kind.Audio) {
        setAudioTrack(undefined);
        setIsAudioMuted(true);
      }
    };

    // Attach existing subscribed tracks
    if (videoPub?.track && videoPub.isSubscribed) handleTrackSubscribed(videoPub.track);
    if (audioPub?.track && audioPub.isSubscribed) handleTrackSubscribed(audioPub.track);

    // Subscribe to future track events
    participant.on(TrackEvent.Subscribed, handleTrackSubscribed);
    participant.on(TrackEvent.Unsubscribed, handleTrackUnsubscribed);

    return () => {
      participant.off(TrackEvent.Subscribed, handleTrackSubscribed);
      participant.off(TrackEvent.Unsubscribed, handleTrackUnsubscribed);
    };
  }, [participant]);

  const isVideoOff = !videoTrack;

  // Determine mic mute status
  const isMicMuted = participant.isLocal
    ? participant.isMicrophoneMuted
    : isAudioMuted;

  return (
    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        muted={participant.isLocal} // local participant must be muted
        playsInline
        style={{ display: isVideoOff ? 'none' : 'block', width: '100%', height: '100%' }}
      />
      <audio ref={audioRef} autoPlay />

      {isVideoOff && (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <UserIcon className="w-16 h-16 text-gray-500" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">
            {participant.identity} {participant.isLocal && '(You)'}
          </span>
          {isMicMuted && <MicOffIcon className="w-4 h-4 text-white" />}
        </div>
      </div>
    </div>
  );
};

export default VideoTile;
