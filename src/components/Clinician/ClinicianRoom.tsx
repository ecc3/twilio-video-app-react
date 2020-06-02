import React, { useEffect } from 'react';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState } from '../../state';
import LocalVideoPreview from '../LocalVideoPreview/LocalVideoPreview';
import Room from '../Room/Room';
import axios from 'axios';

interface IClinicianRoomProps {
  slotName: string;
}

export default function ClinicianRoom(props: IClinicianRoomProps) {
  const { signIn, user, isAuthReady, error, setError } = useAppState();
  const { isConnecting, connect } = useVideoContext();
  const roomState = useRoomState();

  useEffect(() => {
    if (props.slotName !== '') {
      fetch(`https://rgqra2u25c.execute-api.eu-west-2.amazonaws.com/dev/token?identity=Doctor&room=${props.slotName}`)
        .then(res => res.json())
        .then(result => {
          connect(result.token);
        });
    }
  }, [props.slotName]);

  return <div>{roomState != 'disconnected' && <Room />}</div>;
}
