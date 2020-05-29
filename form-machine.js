import { Machine, assign } from 'xstate';

const change = assign((context, event) => {
  return { name: event.value };
});

const valid = (context) => {
  return context.name.length > 3;
};

export const formMachine = Machine(
  {
    id: 'form',
    initial: 'incomplete',
    context: {
      name: '',
    },
    states: {
      incomplete: {
        on: {
          SUBMIT: 'validate',
          CHANGE: {
            target: 'incomplete',
            actions: 'change',
          },
        },
      },
      validate: {
        on: {
          '': [
            {
              target: 'complete',
              cond: 'valid',
            },
            { target: 'error' },
          ],
        },
      },
      error: {
        on: {
          CHANGE: {
            target: 'incomplete',
            actions: 'change',
          },
        },
      },
      complete: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      change,
    },
    guards: {
      valid,
    },
  },
);
