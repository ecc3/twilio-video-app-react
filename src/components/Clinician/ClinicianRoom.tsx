import React, { useEffect } from 'react';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState } from '../../state';
import LocalVideoPreview from '../LocalVideoPreview/LocalVideoPreview';
import Room from '../Room/Room';
import axios from 'axios';

interface IClinicianRoomProps {
  slotId: string;
}

export default function ClinicianRoom(props: IClinicianRoomProps) {
  const { signIn, user, isAuthReady, error, setError } = useAppState();
  const { isConnecting, connect } = useVideoContext();
  const roomState = useRoomState();

  useEffect(() => {
    if (props.slotId !== '') {
      fetch(`https://rgqra2u25c.execute-api.eu-west-2.amazonaws.com/dev/v2/token?slot=${props.slotId}&user=host`)
        .then(res => res.json())
        .then(result => {
          connect(result.token);
        });
    }
  }, [props.slotId]);

  return <div>{roomState != 'disconnected' && <Room />}</div>;
}
