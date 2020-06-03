import * as React from 'react';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { makeStyles, Theme, createStyles, Button } from '@material-ui/core';
import Participant from '../Participant/Participant';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';

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
  })
);

export const AireRoom: React.FC = () => {
  const styles = useStyles();
  const { room } = useVideoContext();
  const participants = useParticipants();

  const renderMainVideo = () => {
    if (participants.length > 0) {
      return (
        <React.Fragment>
          <Button variant="contained" onClick={() => room.disconnect()}>
            Disconnect
          </Button>
          <div className={styles.bigVideo}>
            <ParticipantTracks participant={participants[0]} disableAudio={false} enableScreenShare={false} />
            <div className={styles.hostName}>{participants[0].identity}</div>
          </div>
        </React.Fragment>
      );
    } else {
      return <div className={styles.title}>We have told the doctor you've arrived. They will be with you shortly</div>;
    }
  };
  return (
    <>
      <div className={styles.videoContainer}>
        <div>{renderMainVideo()}</div>
        <div className={styles.smallVideo}>
          <Participant participant={room.localParticipant} onClick={() => {}} isSelected={false} />
        </div>
      </div>
    </>
  );
};
