import * as React from 'react';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import Participant from '../Participant/Participant';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { IPatientDetails } from '../Patient/PatientDetails';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marin: 'auto',
      textAlign: 'center',
      fontSize: '1.2rem',
      padding: '10px',
    },
    videoContainer: {
      position: 'relative',
      padding: '10px',
    },
    hostName: {
      position: 'absolute',
      top: '5px',
      left: '5px',
      backgroundColor: '#333',
      border: 'solid 1px green',
      color: '#fff',
      fontSize: '1.2rem',
      fontStyle: 'bold',
      padding: '5px',
    },
    bigVideo: {
      position: 'relative',
      margin: 'auto',
      width: '1040px',
      height: '585px',
    },
    smallVideo: {
      position: 'absolute',
      width: '260px',
      height: '150px',
      top: '25px',
      right: '25px',
      border: 'solid 2px green',
    },
    patientDetails: {
      padding: '5px',
      position: 'absolute',
      width: '260px',
      height: '400px',
      top: '250px',
      right: '25px',
      border: 'solid 1px green',
      background: '#333',
    },
  })
);

interface IAireRoomProps {
  patientDetails?: IPatientDetails;
}

export const AireRoom: React.FC<IAireRoomProps> = (props: IAireRoomProps) => {
  const styles = useStyles();
  const { room } = useVideoContext();
  const participants = useParticipants();

  const renderMainVideo = () => {
    if (participants.length > 0) {
      return (
        <div className={styles.bigVideo}>
          <ParticipantTracks participant={participants[0]} disableAudio={false} enableScreenShare={false} />
          <div className={styles.hostName}>{participants[0].identity}</div>
        </div>
      );
    } else {
      return <div className={styles.title}>We have told the doctor you've arrived. They will be with you shortly</div>;
    }
  };

  const renderPatientDetails = () => {
    if (!props.patientDetails) return;

    return (
      <div className={styles.patientDetails}>
        <div>Patient Details</div>
        <div>Name: {props.patientDetails.PatientName}</div>
        <div>Date of Birth: {props.patientDetails.DateOfBirth}</div>
        <div>Sex: {props.patientDetails.Sex}</div>
        <div>NHS number: {props.patientDetails.NhsNumber}}</div>
        <div>Postcode: {props.patientDetails.Postcode}}</div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.videoContainer}>
        <div>{renderMainVideo()}</div>
        <div className={styles.smallVideo}>
          <Participant participant={room.localParticipant} onClick={() => {}} isSelected={false} />
        </div>
        {renderPatientDetails()}
      </div>
    </>
  );
};
