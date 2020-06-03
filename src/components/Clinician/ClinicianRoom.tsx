import React, { useEffect } from 'react';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState } from '../../state';
import LocalVideoPreview from '../LocalVideoPreview/LocalVideoPreview';
import axios from 'axios';
import { AireRoom } from '../Room/AireRoom';
import Video, { ConnectOptions, LocalTrack } from 'twilio-video';
import { usePatientService } from '../Patient/PatientDetails';

interface IClinicianRoomProps {
  slotId: string;
}

// @ts-ignore
window.TwilioVideo = Video;

export default function ClinicianRoom(props: IClinicianRoomProps) {
  const { signIn, user, isAuthReady, error, setError } = useAppState();
  const { isConnecting, connect } = useVideoContext();
  const roomState = useRoomState();

  const { patient, getPatient } = usePatientService();

  useEffect(() => {
    if (props.slotId !== '') {
      fetch(`https://rgqra2u25c.execute-api.eu-west-2.amazonaws.com/dev/v2/token?slot=${props.slotId}&user=host`)
        .then(res => res.json())
        .then(result => {
          connect(result.token);
          getPatient(result.subjectName);
        });
    }
  }, [props.slotId]);

  return <div>{roomState != 'disconnected' && <AireRoom patientDetails={patient} />}</div>;
}
