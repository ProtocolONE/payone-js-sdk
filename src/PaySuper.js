import assert from 'simple-assert';
import Events from 'events';
import qs from 'qs';
import getFunctionalUrls from './getFunctionalUrls';
import { createIframe, createModalLayer } from './createElements';
import modalTools from './modalTools';
import { postMessage, receiveMessages } from './postMessage';
import './assets/styles.scss';

/**
 * Returns DOM element by selector or actual DOM element
 *
 * @param {String|DomElement} element
 * @return {DomElement}
 */
function getDomElement(element) {
  if (!element) {
    return undefined;
  }

  return typeof element === 'string'
    ? document.querySelector(element)
    : element;
}

/**
 * Converts region value to uppercase, throw errors on incorrect values
 *
 * @param {String} value example: "US"
 * @param {Object} navigator browser global object
 * @return {String}
 */
export function getRegion(value, navigator) {
  if (!value) {
    if (navigator && navigator.language && navigator.language.indexOf('-') !== -1) {
      return navigator.language.split('-')[1];
    }
    return 'US';
  }

  assert(typeof value === 'string', 'Region value must be a string');
  assert(value.length === 2, 'Region value must be in 2-characters format');
  return value.toUpperCase();
}

/**
 * Converts region value to uppercase, throw errors on incorrect values
 *
 * @param {String} value example: "en"
 * @param {Object} navigator browser global object
 * @return {String}
 */
export function getLanguage(value) {
  if (!value) {
    return undefined;
  }
  assert(typeof value === 'string', 'Language value must be a string');
  assert(value.length === 2, 'Language value must be in 2-characters format');
  return value.toLowerCase();
}

export function receiveMessagesFromPaymentForm(currentWindow, postMessageWindow) {
  return receiveMessages(currentWindow, {
    /**
     * The form insize iframe is awaiting the command below with listed options to init
     * Real form rendering start here
     */
    INITED: () => {
      /**
       * In development the form receives form data from sdk
       * but in production the page receives it by itself
       */
      postMessage(postMessageWindow, 'REQUEST_INIT_FORM', {
        options: {
          ...(this.language ? { language: this.language } : {}),
          layout: this.layout,
          viewScheme: this.viewScheme,
          viewSchemeConfig: this.viewSchemeConfig,
          apiUrl: this.urls.apiUrl,
        },
      });
    },

    LOADED: () => {
      if (!this.modalLayer) {
        return;
      }
      this.modalLayer.classList.remove('paysuper-js-sdk-modal-layer--loading');
    },

    TRY_TO_BEGIN_AGAIN: () => {
      if (!this.modalLayer) {
        return;
      }
      this.modalLayer.classList.add('paysuper-js-sdk-modal-layer--loading');
    },

    MODAL_CLOSED: () => {
      this.closeModal();
    },
  }, (name, data) => {
    this.emit(name, data);
  });
}

export default class PaySuper extends Events.EventEmitter {
  constructor({
    project, token, currency, amount, language, apiUrl, formUrl, products, type,
    viewScheme, viewSchemeConfig,
  } = {}) {
    super();
    assert(project || token || formUrl, 'project, token or formUrl is required for "new PaySuper(...)"');
    this.project = project;
    this.language = getLanguage(language);
    this.token = token;
    this.type = null;
    this.viewScheme = viewScheme || 'dark';
    this.viewSchemeConfig = viewSchemeConfig || null;

    if (currency) {
      this.setCurrency(currency);
    } else {
      this.currency = undefined;
    }
    if (amount) {
      this.setAmount(amount);
    } else {
      this.amount = undefined;
    }
    if (products) {
      this.setProducts(products);
    } else {
      this.products = undefined;
    }
    this.setType(type);

    this.customApiUrl = apiUrl;
    this.urls = getFunctionalUrls({ customApiUrl: apiUrl, customFormUrl: formUrl });
    this.formUrl = this.urls.formUrl;

    this.iframe = null;
    this.modalLayer = null;
    this.cancelIframeMessagesHandling = null;

    this.isInited = false;
    this.layout = null;
  }

  getIframeSrc() {
    const orderParams = {
      ...(this.project ? { project: this.project } : {}),
      ...(this.token ? { token: this.token } : {}),
      ...(this.products ? { products: this.products } : {}),
      ...(this.amount ? { amount: this.amount, currency: this.currency } : {}),
      ...(this.type ? { type: this.type } : {}),
      ...(this.customApiUrl ? { apiUrl: this.urls.apiUrl } : {}),
    };
    return `${this.formUrl}?${qs.stringify(orderParams)}`;
  }

  /**
   * Renders the payment form in modal dialog layer
   *
   * @param {String|DomElement} selectorOrElement
   * @return {PaySuper}
   */
  async renderModal(selectorOrElement) {
    if (this.isInited) {
      console.warn('PaySuper: the form is already rendering or finished rendering');
      return this;
    }
    if (!this.project && !this.token) {
      console.warn('PaySuper: renderModal method is not allowed with standalone "formUrl"');
      return this;
    }
    this.isInited = true;
    this.layout = 'modal';
    const appendContainer = selectorOrElement ? getDomElement(selectorOrElement) : document.body;

    const { modalLayer } = createModalLayer();
    this.modalLayer = modalLayer;

    appendContainer.appendChild(this.modalLayer);

    this.iframe = createIframe(
      this.getIframeSrc(),
      this.modalLayer,
    );

    this.initIframeMessagesHandling();

    modalTools.hideBodyScrollbar();
    this.emit('modalBeforeInit');

    return this;
  }

  /**
   * Renders the payment form in iframe as a page
   *
   * @param {String|DomElement} selectorOrElement
   * @return {PaySuper}
   */
  async renderPage(selectorOrElement) {
    if (this.isInited) {
      console.warn('PaySuper: the form is already rendering or finished rendering');
      return this;
    }
    this.isInited = true;
    this.layout = 'page';
    const appendContainer = selectorOrElement ? getDomElement(selectorOrElement) : document.body;
    appendContainer.innerHTML = '';

    this.iframe = createIframe(
      this.getIframeSrc(),
      appendContainer,
      true,
    );

    this.initIframeMessagesHandling();

    modalTools.hideBodyScrollbar();
    this.emit('pageBeforeInit');

    return this;
  }

  /**
   * Handling iframe message transport with the form
   *
   * @return {PaySuper}
   */
  initIframeMessagesHandling() {
    const postMessageWindow = this.iframe.contentWindow;
    this.cancelIframeMessagesHandling = receiveMessagesFromPaymentForm
      .call(this, window, postMessageWindow);
    return this;
  }

  closeModal() {
    modalTools.showBodyScrollbar();
    this.modalLayer.parentNode.removeChild(this.modalLayer);
    this.modalLayer = null;
    this.iframe = null;
    this.isInited = false;
    this.cancelIframeMessagesHandling();
    this.cancelIframeMessagesHandling = null;
  }

  /**
   * Renders the payment form
   *
   * @param {String|DomElement} appendContainer
   * @return {PaySuper}
   */
  setAmount(amount) {
    const amountIsValidType = (typeof amount === 'string' || typeof amount === 'number');
    assert(amountIsValidType, 'Amount value must be a string or number');
    this.amount = Number(amount);
    return this;
  }

  /**
   * Setups the currency
   *
   * @param {String} currency example: "US"
   * @return {PaySuper}
   */
  setCurrency(currency) {
    assert(typeof currency === 'string', 'Currency value must be a string');
    this.currency = currency;
    return this;
  }

  /**
   * Setups the products
   *
   * @param {String[]} products example: "US"
   * @return {PaySuper}
   */
  setProducts(products) {
    assert(Array.isArray(products), 'Products value must be an array');
    this.products = products;
    return this;
  }

  setType(type) {
    if (type) {
      this.type = type;
      return this;
    }
    if (this.amount) {
      this.type = 'simple';
    } else if (this.products) {
      this.type = 'product';
    } else {
      this.type = null;
    }
    return this;
  }
}
