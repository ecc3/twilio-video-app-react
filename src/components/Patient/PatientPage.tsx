import React, { ChangeEvent, useState, FormEvent, useEffect } from 'react';
import { useAppState } from '../../state';

import Button from '@material-ui/core/Button';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation, useHistory } from 'react-router-dom';
import { Link } from '@material-ui/core';
import Room from '../Room/Room';
import LocalVideoPreview from '../LocalVideoPreview/LocalVideoPreview';
import MenuBar from '../MenuBar/MenuBar';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import PatientRoom from './PatientRoom';
import { VideoProvider } from '../VideoProvider';
import ErrorDialog from '../ErrorDialog/ErrorDialog';
import { ConnectOptions } from 'twilio-video';

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
    //maxWidth: '460px',
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

export default function PatientPage() {
  const classes = useStyles();
  const { signIn, user, isAuthReady } = useAppState();
  const [name, setName] = useState('');
  const [inSession, setInSession] = useState(false);
  const { error, setError } = useAppState();

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInSession(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container justify="center" alignItems="flex-start" className={classes.container}>
        <Paper className={classes.paper} elevation={6}>
          <div>Patient</div>
          <form onSubmit={handleSubmit}>
            <TextField
              id="menu-name"
              label="Name"
              //className={classes.textField}
              value={name}
              onChange={handleNameChange}
              margin="dense"
            />
            <Button type="submit">Join</Button>
          </form>
          {inSession && (
            <Grid item xs={6}>
              <VideoProvider options={connectionOptions} onError={setError}>
                <ErrorDialog dismissError={() => setError(null)} error={error} />
                <PatientRoom slotName={name} />
              </VideoProvider>
            </Grid>
          )}
        </Paper>
      </Grid>
    </ThemeProvider>
  );
}
