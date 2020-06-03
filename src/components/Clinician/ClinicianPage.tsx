import { Button, TextField, Container, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { createMuiTheme, makeStyles, createStyles, ThemeProvider } from '@material-ui/core/styles';
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ConnectOptions } from 'twilio-video';
import { useAppState } from '../../state';
import ErrorDialog from '../ErrorDialog/ErrorDialog';
import { VideoProvider } from '../VideoProvider';
import ClinicianRoom from './ClinicianRoom';
import { response } from 'express';
import IPatientSlot from '../../interfaces/IPatientSlot';
import ClinicianSlot from './CinicianSlot';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      margin: 'auto',
      textAlign: 'center',
      fontSize: '1.2rem',
      padding: '10px',
    },
    messageContainer: {
      margin: 'auto',
      width: '40%',
      backgroundColor: '#ccc',
      border: 'solid 1px #fff',
      borderRadius: '5px;',
      color: 'black',
      textAlign: 'center',
    },
    formContainer: {
      backgroundColor: '#558b2f',
      color: 'white',
    },
    button: {
      margin: '10px',
      color: '#558b2f',
    },
    localPreview: {
      margin: 'auto',
      marginTop: '20px',
      padding: '4px',
      width: '40%',
      border: 'solid 1px #fff',
      borderRadius: '5px;',
    },
  })
);

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

export default function ClinicianPage() {
  const styles = useStyles();
  const [name, setName] = useState('');
  const [slots, setSlots] = useState([] as IPatientSlot[]);
  const [currentSlot, setCurrentSlot] = useState('');
  const { error, setError } = useAppState();

  useEffect(() => {
    getSlots();
    const interval = setInterval(() => {
      getSlots();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSlots(
      slots.concat([
        {
          SubjectName: name,
          State: 'creating',
          HostName: 'Doctor',
          SlotId: '',
        },
      ])
    );

    fetch('https://rgqra2u25c.execute-api.eu-west-2.amazonaws.com/dev/v2/slot', {
      method: 'POST',
      body: JSON.stringify({ subjectName: name, hostName: 'Doctor' }),
    });
  };

  const getSlots = () => {
    fetch(`https://rgqra2u25c.execute-api.eu-west-2.amazonaws.com/dev/v2/slots`)
      .then(response => response.json())
      .then(response => setSlots(response.slots));
  };

  const connectionOptions: ConnectOptions = {
    // Bandwidth Profile, Dominant Speaker, and Network Quality
    // features are only available in Small Group or Group Rooms.
    // Please set "Room Type" to "Group" or "Small Group" in your
    // Twilio Console: https://www.twilio.com/console/video/configure
    bandwidthProfile: {
      video: {
        mode: 'collaboration',
        dominantSpeakerPriority: 'standard',
        renderDimensions: {
          high: { height: 1080, width: 1920 },
          standard: { height: 720, width: 1280 },
          low: { height: 90, width: 160 },
        },
      },
    },
    dominantSpeaker: false,
    networkQuality: { local: 1, remote: 1 },

    // Comment this line if you are playing music.
    maxAudioBitrate: 16000,

    // VP8 simulcast enables the media server in a Small Group or Group Room
    // to adapt your encoded video quality for each RemoteParticipant based on
    // their individual bandwidth constraints. This has no effect if you are
    // using Peer-to-Peer Rooms.
    preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const joinSlot = (slotId: string) => {
    setCurrentSlot(slotId);
  };

  return (
    <React.Fragment>
      <Container fixed>
        <div className={styles.title}>Airelogic Video Consultation</div>
        {currentSlot === '' && (
          <div className={styles.messageContainer}>
            <div className={styles.formContainer}>
              <form onSubmit={handleSubmit}>
                <TextField
                  id="menu-name"
                  label="Name"
                  //className={classes.textField}
                  value={name}
                  onChange={handleNameChange}
                />
                <Button type="submit" variant="contained" className={styles.button}>
                  Create Slot
                </Button>
              </form>
            </div>
            {slots.map(s => {
              return <ClinicianSlot slot={s} joinSlot={() => joinSlot(s.SlotId)} />;
            })}
          </div>
        )}
      </Container>
      {currentSlot != '' && (
        <VideoProvider options={connectionOptions} onError={setError} onDisconnect={() => setCurrentSlot('')}>
          <ErrorDialog dismissError={() => setError(null)} error={error} />
          <ClinicianRoom slotId={currentSlot} />
        </VideoProvider>
      )}
    </React.Fragment>
  );
}
