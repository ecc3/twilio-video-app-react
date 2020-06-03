import React, { useEffect } from 'react';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState } from '../../state';
import LocalVideoPreview from '../LocalVideoPreview/LocalVideoPreview';
import Room from '../Room/Room';
import axios from 'axios';

interface IPatientRoomProps {
  slotName: string;
}

export default function PatientRoom(props: IPatientRoomProps) {
  const { signIn, user, isAuthReady, error, setError } = useAppState();
  const { isConnecting, connect } = useVideoContext();
  const roomState = useRoomState();

  useEffect(() => {
    if (props.slotName !== '') {
      fetch(
        `https://rgqra2u25c.execute-api.eu-west-2.amazonaws.com/dev/token?identity=${props.slotName}&room=${props.slotName}1`
      )
        .then(res => res.json())
        .then(result => {
          connect(result.token);
        });
    }
  }, [props.slotName]);

  return <div>{roomState != 'disconnected' && <Room />}</div>;
}
