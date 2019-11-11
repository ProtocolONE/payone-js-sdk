import assert from 'assert';
import { includes } from 'lodash-es';
import { postMessageOrigin } from './constants';

export const paysuperPaymentFormSourceName = 'PAYSUPER_PAYMENT_FORM';

export const sendingMessagesNames = [
  'REQUEST_INIT_FORM',
];

/**
 * If a status is not in list the SDK won't react on it (no handling, no event emmitting)
 */
export const receivingMessagesNames = [
  'INITED',
  'LOADED',
  'FORM_RESIZE',
  'PAYMENT_BEFORE_CREATED',
  'PAYMENT_CREATED',
  'PAYMENT_FAILED_TO_CREATE',
  'PAYMENT_PENDING',
  'PAYMENT_COMPLETED',
  'PAYMENT_CANCELLED',
  'PAYMENT_DECLINED',
  'PAYMENT_INTERRUPTED',
  'PAYMENT_SYSTEM_SUCCESS',
  'TRY_TO_BEGIN_AGAIN',
  'MODAL_CLOSED',
];

export function postMessage(targetWindow, name, data = {}) {
  assert(includes(sendingMessagesNames, name), `Undefiend postMessage name: ${name}`);
  targetWindow.postMessage({
    source: 'PAYSUPER_JS_SDK',
    name,
    data,
  }, postMessageOrigin);
}

export function receiveMessages(from, objectWithCallbacks, callbackEvery) {
  function handler(event) {
    if (event.data && event.data.source !== paysuperPaymentFormSourceName) {
      return;
    }
    const { name } = event.data;
    if (!includes(receivingMessagesNames, name)) {
      return;
    }
    callbackEvery(name, event.data.data);
    const callback = objectWithCallbacks[name];
    if (!callback) {
      return;
    }
    callback(event.data.data);
  }
  from.addEventListener('message', handler);

  return () => {
    from.removeEventListener('message', handler);
  };
}
