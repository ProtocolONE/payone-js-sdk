import { receiveMessagesFromPaymentForm } from '@/PaySuper';
import { paysuperPaymentFormSourceName } from '@/postMessage';

class WindowMock {
  constructor() {
    this.listeners = {
      message() { },
    };
  }

  addEventListener(name, handler) {
    this.listeners[name] = handler;
    return this;
  }

  postMessage(data) {
    this.listeners.message({
      data,
    });
  }

  imitateReceivedMessage(name, data) {
    this.listeners.message({
      data: {
        source: paysuperPaymentFormSourceName,
        name,
        data,
      },
    });
  }
}

function getPaySuperMock() {
  return {
    language: 'en',
    project: '123',
    products: ['111', '222'],
    token: '456',
    amount: 10,
    currency: 'USD',
    layout: 'modal',
    viewScheme: 'light',
    viewSchemeConfig: { headerTextColor: '#333333' },
    apiUrl: 'check',
    iframe: {
      src: 'none',
      width: 0,
      height: 0,
      setAttribute(attr, value) {
        this[attr] = value;
      },
    },
    async createOrder() {
      return {
        id: '222',
        payment_form_url: 'https://test.com',
      };
    },
    emit() {

    },
  };
}

describe('PaySuper.receiveMessagesFromPaymentForm ', () => {
  it('should handle INITED properly', () => {
    const currentWindow = new WindowMock();
    const postMessageWindow = new WindowMock();
    const PaySuperMock = getPaySuperMock();
    receiveMessagesFromPaymentForm.call(
      PaySuperMock,
      currentWindow,
      postMessageWindow,
    );

    let result;
    postMessageWindow.addEventListener('message', (event) => {
      result = event.data.data;
    });

    currentWindow.imitateReceivedMessage('INITED');

    // expect(result.orderParams.project).toEqual(PaySuperMock.project);
    // expect(result.orderParams.products).toEqual(PaySuperMock.products);
    // expect(result.orderParams.token).toEqual(PaySuperMock.token);
    // expect(result.orderParams.amount).toEqual(PaySuperMock.amount);
    // expect(result.orderParams.currency).toEqual(PaySuperMock.currency);

    expect(result.options.language).toEqual(PaySuperMock.language);
    expect(result.options.layout).toEqual(PaySuperMock.layout);
    expect(result.options.viewScheme).toEqual(PaySuperMock.viewScheme);
    expect(result.options.viewSchemeConfig).toEqual(PaySuperMock.viewSchemeConfig);
    expect(result.options.apiUrl).toEqual(PaySuperMock.apiUrl);
  });
});
