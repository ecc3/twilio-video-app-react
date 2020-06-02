import React, { useRef, useEffect, useState } from 'react';
import { IVideoTrack } from '../../types';
import { styled } from '@material-ui/core/styles';
import { Track } from 'twilio-video';
import { Button } from '@material-ui/core';

const Video = styled('video')({
  width: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

interface VideoTrackProps {
  track: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
}

export default function VideoTrack({ track, isLocal, priority }: VideoTrackProps) {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [imgData, setImageData] = useState('');

  useEffect(() => {
    const el = videoRef.current;
    el.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    track.attach(el);
    return () => {
      track.detach(el);
      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  // The local video track is mirrored.
  const isFrontFacing = track.mediaStreamTrack.getSettings().facingMode !== 'environment';
  const style = isLocal && isFrontFacing ? { transform: 'rotateY(180deg)' } : {};

  const snap = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const ratio = video.videoWidth / video.videoHeight;
    canvas.width = video.videoWidth - 100;
    canvas.height = canvas.width / ratio;

    const context = canvas.getContext('2d');
    if (context) {
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setImageData(canvas.toDataURL());
    }
  };

  useEffect(() => {
    if (imgData != '') {
      linkRef.current?.click();
    }
  }, [imgData]);

  return (
    <>
      <Video ref={videoRef} style={style} />
      <Button onClick={snap}>Snap</Button>
      <div style={{ display: 'none' }}>
        <a ref={linkRef} href={imgData} download="image.png">
          Download Image Data
        </a>
        <canvas ref={canvasRef}></canvas>
      </div>
    </>
  );
}
