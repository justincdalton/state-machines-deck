import React from 'react';
import { useMachine } from '@xstate/react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from '@material-ui/core';
import { formMachine } from './form-machine';

export default () => {
  const [current, send] = useMachine(formMachine);

  const handleChange = (e) => {
    send('CHANGE', {
      value: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send('SUBMIT');
  };

  console.log('event:', current.event);
  console.log('current:', current.value);

  if (current.matches('complete')) {
    return (
      <>
        <Card>
          <CardContent>
            <Typography variant="h5">
              Greetings {current.context.name}!!
            </Typography>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          <TextField
            label="Name"
            variant="outlined"
            onChange={handleChange}
            error={current.matches('error')}
            value={current.context.name}
          />
        </CardContent>
        <CardActions>
          <Button type="submit">Save</Button>
        </CardActions>
      </Card>
    </form>
  );
};
