import { Machine, assign } from '@root/vendor/xstate';

const routes = {
  LOADING: '/prefill/prefill-loading',
  NAME: '/prefill/name',
  DOB: '/prefill/dob',
  ADDRESS: '/prefill/mailing-address',
  DOWNLOAD_APP: '/triage/success-download-app',
  UNSUPPORTED_MARKET: '/triage/unsupported-market',
  HOMEOWNER: '/prefill/homeowner',
  MARITAL_STATUS: '/prefill/marital-status',
  PHONE_NUMBER: '/prefill/phone-number',
  EMAIL: '/prefill/email',
  LICENSE: '/prefill/license',
  ACCOUNT_EXPLAINER: '/prefill/account-explainer',
};

export const prefillRouteMachine = Machine(
  {
    id: 'prefill-routes',
    initial: 'unknown',
    context: {
      prefillRequest: {},
      supportedMarkets: [],
    },
    states: {
      unknown: {
        on: {
          INIT: 'init',
        },
      },

      init: {
        entry: 'initContext',
        on: {
          '': [
            {
              target: routes.NAME,
              cond: 'isNameValid',
            },
            {
              target: routes.DOB,
              cond: 'isDobValid',
            },
            {
              target: routes.ADDRESS,
              cond: 'isMailingAddressValid',
            },
            {
              target: routes.DOWNLOAD_APP,
              cond: 'isPushToAppMarket',
            },
            {
              target: routes.UNSUPPORTED_MARKET,
              cond: 'isUnsupportedMarket',
            },
            {
              target: routes.HOMEOWNER,
              cond: 'isHomeownerValid',
            },
            {
              target: routes.MARITAL_STATUS,
              cond: 'isMaritalStatusValid',
            },
            {
              target: routes.PHONE_NUMBER,
              cond: 'isPhoneNumberValid',
            },
            {
              target: routes.LOADING,
              cond: 'hasNoPreviousResponse',
            },
            {
              target: routes.LICENSE,
              cond: 'isLicenseValid',
            },
            {
              target: routes.LOADING,
            },
          ],
        },
      },

      [routes.NAME]: {
        on: {
          CONTINUE: routes.DOB,
        },
      },

      [routes.DOB]: {
        on: {
          CONTINUE: routes.ADDRESS,
        },
      },

      [routes.ADDRESS]: {
        on: {
          CONTINUE: 'validateMarket',
        },
      },

      validateMarket: {
        entry: 'updatePrefillRequest',
        on: {
          '': [
            {
              target: routes.DOWNLOAD_APP,
              cond: 'isPushToAppMarket',
            },
            {
              target: routes.UNSUPPORTED_MARKET,
              cond: 'isUnsupportedMarket',
            },
            {
              target: routes.HOMEOWNER,
            },
          ],
        },
      },

      [routes.DOWNLOAD_APP]: {
        type: 'final',
      },

      [routes.UNSUPPORTED_MARKET]: {
        type: 'final',
      },

      [routes.HOMEOWNER]: {
        on: {
          CONTINUE: routes.MARITAL_STATUS,
        },
      },

      [routes.MARITAL_STATUS]: {
        on: {
          CONTINUE: routes.PHONE_NUMBER,
        },
      },

      [routes.PHONE_NUMBER]: {
        on: {
          CONTINUE: routes.LOADING,
        },
      },

      [routes.LOADING]: {
        on: {
          CONTINUE: routes.LICENSE,
        },
      },

      [routes.LICENSE]: {
        on: {
          CONTINUE: routes.LOADING,
        },
      },
    },
  },
  {
    actions: {
      initContext: assign((context, event) => ({
        prefillRequest: event.prefillRequest,
        supportedMarkets: event.supportedMarkets,
      })),
      updatePrefillRequest: assign({
        prefillRequest: (context, event) => event.prefillRequest,
      }),
    },
    guards: {
      isNameValid: ({ prefillRequest }) => !prefillRequest.isNameValid(),
      isDobValid: ({ prefillRequest }) => !prefillRequest.isDobValid(),
      isMailingAddressValid: ({ prefillRequest }) =>
        !prefillRequest.mailingAddress.isValid(),
      isHomeownerValid: ({ prefillRequest }) =>
        !prefillRequest.isHomeownerValid(),
      isMaritalStatusValid: ({ prefillRequest }) =>
        !prefillRequest.isMaritalStatusValid(),
      isPhoneNumberValid: ({ prefillRequest }) =>
        !prefillRequest.isPhoneNumberValid(),
      hasNoPreviousResponse: ({ prefillRequest }) =>
        !prefillRequest.previousResponse ||
        !Object.keys(prefillRequest.previousResponse),
      isLicenseValid: ({ prefillRequest }) =>
        !prefillRequest.isLicenseValid &&
        prefillRequest.previousResponse.requiresDriversLicenseEntry,
      isUnsupportedMarket: ({ prefillRequest, supportedMarkets }) => {
        return !prefillRequest.isInSupportedMarket(supportedMarkets);
      },
    },
  },
);
