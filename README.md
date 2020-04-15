# PaySuper JS SDK

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-brightgreen.svg)](https://www.gnu.org/licenses/gpl-3.0) 
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/paysuper/paysuper-js-sdk/issues)
[![Build Status](https://travis-ci.com/paysuper/paysuper-js-sdk.svg?branch=develop)](https://travis-ci.com/paysuper/paysuper-js-sdk) [![codecov](https://codecov.io/gh/paysuper/paysuper-js-sdk/branch/develop/graph/badge.svg)](https://codecov.io/gh/paysuper/paysuper-js-sdk)

PaySuper Javascript SDK is designed to integrate a [PaySuper Payment Form](https://github.com/paysuper/paysuper-payment-form) on your website or a game client.

Learn more about a [payments flow](https://docs.pay.super.com/docs/payments/quick-start) and [PaySuper Checkout integration](https://docs.pay.super.com/docs/payments/sdk-integration).

|   | PaySuper Service Architecture
:---: | :---
✨ | **Checkout integration.** [PaySuper JS SDK](https://github.com/paysuper/paysuper-js-sdk) is designed to integrate a Checkout Form on a merchant's website or a game client.
💵 | **Frontend for a payment form.** [PaySuper Payment Form](https://github.com/paysuper/paysuper-payment-form) is a frontend for a single-page application with a payment form.
📊 | **Frontend for a merchant.** [PaySuper Dashboard](https://github.com/paysuper/paysuper-dashboard) is the BFF server and frontend to interact with all PaySuper related features for merchants.
🔧 | **Payment Form API Backend.** [PaySuper Checkout](https://github.com/paysuper/paysuper-checkout) is a REST API backend for [PaySuper Payment Form](https://github.com/paysuper/paysuper-payment-form) and a billing processing such as purchase receipts and others. Public API methods are documented in the [API Reference](https://docs.pay.super.com/api).
🔧 | **Billing API Backend.** [PaySuper Management API](https://github.com/paysuper/paysuper-management-api) is a REST API backend for [PaySuper Dashboard](https://github.com/paysuper/paysuper-dashboard) and other management API methods. Public API methods are documented in the [API Reference](https://docs.pay.super.com/api).
💳 | **Payment processing.** [PaySuper Billing Server](https://github.com/paysuper/paysuper-billing-server) is a micro-service that provides with any payment processing business logic.

***

## Features

**Conversion-optimized:** The payment form loads instantly with a single-page layout.

**Payment methods:** VISA, Master Card, AMEX, JCB, China UnionPay, Bitcoin payments, Alipay, QIWI, Bank Wire Transfers.

**Payment types:** Simple Checkout, Items Checkout.

**Authentication:** Dynamic 3D Secure (ready for Strong Customer Authentication).

**Localization:** Localized for [24 languages](https://docs.pay.super.com/docs/payments/localization).

## Table of Contents

- [Demo](#demo)
- [Usage](#usage)
    - [Parameters](#parameters)
    - [Methods](#methods)
    - [Events](#events)
    - [Analytics integration](#analytics-integration)
- [Developing](#developing)
    - [Branches](#branches)
    - [Versioning](#versioning)
    - [Building](#building)
- [Tests](#tests)
- [Contributing](#contributing-feature-requests-and-support)
- [License](#license)

## Demo

Try out [the payment sample](https://checkout.pay.super.com/demo/shop) for a [Simple Checkout](https://docs.pay.super.com/docs/payments/#simple-checkout) and a [Products Checkout](https://docs.pay.super.com/docs/payments/#products-checkout).

## Usage

You can create an instance of a PaySuper Form on your website using this sample code:

> Use your IDs for the Project and Products found in your merchant account in PaySuper Dashboard. To get the Project and Product IDs click on the Product from the Products list page and copy the ID from an opened page URL.

```html
<script src="https://cdn.pay.super.com/paysdk/latest/paysuper.js"></script>

<script>
function buyItems() {
    // Create an instance of the Payment Form with required order parameters
    const paySuper = new PaySuper({
        token: '5cd5620f06ae110001509185'
    });
    
    // Display a modal window with the Payment Form
    paySuper.renderModal();

    paySuper.on('paymentCompleted', function() {
        // You can show a completed payment message
    });
 }
</script>

<button onclick="buyItems()">BUY</button>
```

### Parameters

| Method | Type and Example | Description |
|---|---|---|
| `token` | String | Order parameters as a secure string generated with [Tokens API](https://docs.pay.super.com/api/#token). **Example:** 'DWuGy6S1ADGUqR2Crnp4V2q26Jk309b3'.|
|`project`|String| Unique identifier of the Project in PaySuper Dashboard. **Example:** '5be2e16701d96d00012d26c3'.|
|`type`|String|The Type depends on your [products in the payment order](https://docs.pay.super.com/docs/payments/#getting-started). **Available options:** `simple` (default), `key`, `product`.|
|`products`|Array|Unique identifier of the Product being in the Project. The order can have multiple Products. **Example:** ['5d848f484dd6a50001970479', '4g848f484dd6a50001970490'].|
|`amount`|Number|The order amount. **Example:** 59.9.|
|`currency`|String|The order currency. Three-letter Currency Code ISO 4217, in uppercase. The default value is used from the Project general settings. If the value for this field is passed, the default value is overwritten. **Example:** 'USD'.|
|`formUrl`|String|The URL with the ID of the created order. The URL format is `https://order.pay.super.com/?order_id=YOUR_ORDER_ID`.|
|`viewScheme`|String|Sample code is available at [Theme style](docs/CUSTOMIZATION.md). **Available options:** `dark` (default), `light`.|
|`viewSchemeConfig`|Object|Sample code is available at [Colors styles](docs/CUSTOMIZATION.md). **Example:** { headerTextColor: '#333333' }|

#### Sample code for the Virtual item:

```html
const paySuper = new PaySuper({
    project: '5cd5620f06ae110001509185',
    products: ['5d848f484dd6a50001970479', '5d8c7a219e362100013de214'],
    type: 'product'
});
```

#### Sample code for the Game key:

```html
const paySuper = new PaySuper({
    project: '5cd5620f06ae110001509185',
    products: ['5d7baee015ff7d0001b986a8'],
    platform_id: 'gog',
    type: 'key'
});
```

#### Sample code for Simple Checkout:

```html
const paySuper = new PaySuper({
    project: '5cd5624a06ae110001509186',
    amount: 50,
    currency: 'USD'
});
```

### Methods

| Method | Type | Description |
|---|---|---|
| `renderModal()` | return: {PaySuper} | Renders the form in a modal dialog window.|
|`renderPage()`|return: {PaySuper}|Renders the form as an iframe. Height is determined automatically.|
|`closeModal()`|return: {PaySuper}|Closes a modal dialog.|
|`setAmount(value)` |param: **value** {Number}, return: {PaySuper}|**Example:** 59.9.|
|`setCurrency(value)`|param: **value** {String}, return: {PaySuper}|**Example:** 'USD'.|
|`setProducts(value)`|param: **value** {Array}, return: {PaySuper}|**Example:** ['5d848f484dd6a50001970479'].|
|`setType(value)`|param: **value** {String}, return: {PaySuper}|**Example:** 'product'.|

#### Use this code sample to open the Checkout Form as a standalone web-page:

```html
<script>
function buyItems() {
    const paySuper = new PaySuper({
        formUrl: 'https://order.pay.super.com/?order_id=YOUR_ORDER_ID'
    });

    paySuper.renderPage();
}
</script>

<button onclick="buyItems()">BUY</button>
```

### Events

#### Full events list in the expected order of execution:

| Method | Description |
|---|---|
| `pageBeforeInit` | PaySuper form has started to render as a page. |
| `modalBeforeInit` | PaySuper form has started to render as a modal dialog. |
| `inited` | PaySuper form scripts have been downloaded and have started to load. |
| `loaded` | PaySuper form has finished to load and is ready to operate. |
| `paymentFailedToBegin` | An error has occured while fetching the order. |
| `paymentBeforeCreated` | The moment before the payment is created. |
| `paymentCreated` | The payment has been created, but has not finished yet. |
| `paymentFailedToCreate` | An error has occured while creating the payment. |
| `paymentCompleted` | The payment is successful. |
| `paymentDeclined` | The payment is declined by the payment system. |
| `paymentInterrupted` | The payment is interrupted by the user. |
| `modalClosed` | PaySuper form modal dialog is closed. Applicable when the form was created inside a modal dialog. |

#### Sample code to handle events of the Payment Form or a payment status:

```js
paySuper.on('inited', function() {
  console.log('PaySuper is initialized')
})
```

### Analytics integration

#### Google Analytics

We've set up a Google Analytics data collection in a test mode inside PaySuper. After the Beta testing, we'll release the [analytics integration](https://docs.pay.super.com/docs/analytics-integration) to use with a customer's tracking ID.

## Developing

### Branches

We use the [GitFlow](https://nvie.com/posts/a-successful-git-branching-model) as a branching model for Git.

### Versioning

`https://cdn.pay.super.com/paysdk/latest/paysuper.js` is the latest production version.

`https://cdn.pay.super.com/paysdk/v0.11.0/paysuper.js` is a production release version (for example `v0.11.0`) and it updates by releases [paysuper-js-sdk/releases](https://github.com/paysuper/paysuper-js-sdk/releases).

`https://cdn.pay.super.com/paysdk/dev/paysuper.js` is a development version. It works with develpment api and updates with `develop` branch pushes.

### Building

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies into a single js-file
```
npm run build
```

#### Like `run build` but with a dist file size analysis
```
npm run check-size
```

## Tests

### Run tests
```
npm run test
```

### Run tests for development in watch mode 
```
npm run test:dev
```

## Contributing, Feature Requests and Support
If you like this project then you can put a ⭐️ on it. It means a lot to us.

If you have an idea of how to improve PaySuper (or any of the product parts) or have general feedback, you're welcome to submit a [feature request](../../issues/new?assignees=&labels=&template=feature_request.md&title=).

Chances are, you like what we have already but you may require a custom integration, a special license or something else big and specific to your needs. We're generally open to such conversations.

If you have a question and can't find the answer yourself, you can [raise an issue](../../issues/new?assignees=&labels=&template=support-request.md&title=I+have+a+question+about+%3Cthis+and+that%3E+%5BSupport%5D) and describe what exactly you're trying to do. We'll do our best to reply in a meaningful time.

We feel that a welcoming community is important and we ask that you follow PaySuper's [Open Source Code of Conduct](https://github.com/paysuper/code-of-conduct/blob/master/README.md) in all interactions with the community.

PaySuper welcomes contributions from anyone and everyone. Please refer to [our contribution guide to learn more](CONTRIBUTING.md).


## License

The project is available as open source under the terms of the [GPL v3 License](https://www.gnu.org/licenses/gpl-3.0).
