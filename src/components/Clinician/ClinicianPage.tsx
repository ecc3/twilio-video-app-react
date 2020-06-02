import { Button, TextField, Container } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ConnectOptions } from 'twilio-video';
import { useAppState } from '../../state';
import ErrorDialog from '../ErrorDialog/ErrorDialog';
import { VideoProvider } from '../VideoProvider';
import ClinicianRoom from './ClinicianRoom';
import { response } from 'express';
import IPatientSlot from '../../interfaces/IPatientSlot';

const useStyles = makeStyles({
  container: {
    height: '100vh',
    background: '#0D122B',
  },
  twilioLogo: {
    width: '55%',
    display: 'block',
  },
  videoLogo: {
    width: '25%',
    padding: '2.4em 0 2.1em',
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '2em',
    marginTop: '4em',
    background: 'white',
    color: 'black',
  },
  button: {
    color: 'black',
    background: 'white',
    margin: '0.8em 0 0.7em',
    textTransform: 'none',
  },
  errorMessage: {
    color: 'red',
    display: 'flex',
    alignItems: 'center',
    margin: '1em 0 0.2em',
    '& svg': {
      marginRight: '0.4em',
    },
  },
});

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

export default function ClinicianPage() {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [slots, setSlots] = useState([] as IPatientSlot[]);
  const [currentSlot, setCurrentSlot] = useState('');
  const { error, setError } = useAppState();

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`https://rgqra2u25c.execute-api.eu-west-2.amazonaws.com/dev/slots`)
        .then(response => response.json())
        .then(response => setSlots(response.slots));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSlots(
      slots.concat([
        {
          Slot: name,
          State: 'creating',
        },
      ])
    );

    fetch('https://rgqra2u25c.execute-api.eu-west-2.amazonaws.com/dev/slot', {
      method: 'POST',
      body: JSON.stringify({ subjectName: name }),
    });
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

  const joinSlot = (slotName: string) => {
    setCurrentSlot(slotName);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container fixed>
        <Grid container justify="center" alignItems="flex-start" className={classes.container}>
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={6}>
              <div>
                <p>Add a slot:</p>
                <form onSubmit={handleSubmit}>
                  <TextField
                    id="menu-name"
                    label="Name"
                    //className={classes.textField}
                    value={name}
                    onChange={handleNameChange}
                    margin="dense"
                  />
                  <Button type="submit">Create</Button>
                </form>
              </div>
              <div>
                {slots.map(s => {
                  return (
                    <div>
                      {s.Slot} : {s.State}{' '}
                      {s.State === 'connected' && <Button onClick={() => joinSlot(s.Slot)}>Join</Button>}
                    </div>
                  );
                })}
              </div>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={6}>
              <div>Video Goes Here</div>
              {currentSlot != '' && (
                <VideoProvider options={connectionOptions} onError={setError}>
                  <ErrorDialog dismissError={() => setError(null)} error={error} />
                  <ClinicianRoom slotName={currentSlot} />
                </VideoProvider>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
