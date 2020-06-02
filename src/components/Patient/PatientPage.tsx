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
    maxWidth: '460px',
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
  const history = useHistory();
  const location = useLocation<{ from: Location }>();
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<Error | null>(null);
  const { isConnecting, connect } = useVideoContext();
  const roomState = useRoomState();
  const [name, setName] = useState('');

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`https://rgqra2u25c.execute-api.eu-west-2.amazonaws.com/dev/token?identity=${name}&room=${name}`)
      .then(res => res.json())
      .then(result => {
        console.log(result.token);
        connect(result.token);
      });
  };

  //  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2RmMDMyMmQ1ZjM4ZDY0MDNhOTQ1ZGE4MTVkYmEwZWU5LTE1OTEwMTY3OTEiLCJpc3MiOiJTS2RmMDMyMmQ1ZjM4ZDY0MDNhOTQ1ZGE4MTVkYmEwZWU5Iiwic3ViIjoiQUM3ZDFhMGFhNjNiZGE0YzA3MDcyMmRmM2VmZjRhOWNlZiIsImV4cCI6MTU5MTAyMDM5MSwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiUGF0aWVudCIsInZpZGVvIjp7InJvb20iOiJ0ZXN0In19fQ.ZVV7lE34OXeDETa0Y4fEQgCBCzQWJZMoRSkIF0tgpEo"

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
          {roomState !== 'disconnected' && <Room />}
        </Paper>
      </Grid>
    </ThemeProvider>
  );
}
