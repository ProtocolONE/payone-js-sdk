# PaySuper JS SDK

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-brightgreen.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Build Status](https://api.travis-ci.org/ProtocolONE/payone-js-sdk.svg?branch=master)](https://travis-ci.org/ProtocolONE/token_one)
[![codecov](https://codecov.io/gh/paysuper/paysuper-js-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/paysuper/paysuper-js-sdk)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=paysuper_paysuper-js-sdk&metric=alert_status)](https://sonarcloud.io/dashboard?id=paysuper_paysuper-js-sdk)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fpaysuper%2Fpaysuper-js-sdk.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fpaysuper%2Fpaysuper-js-sdk?ref=badge_shield)

PaySuper Javascript SDK is designed to integrate a Checkout Form on your website.

1. [Usage](#usage)
2. [Parameters](#paysuper-form-parameters)
3. [Methods](#paysuper-form-methods)
4. [Events](#paysuper-form-events)
5. [Library URLs](#library-urls)
6. [Development](#development)
7. [Contributing](#contributing)

## Usage

You can create an instance of a Checkout Form on your website using this sample code. 

> Use your IDs for the Project and Products found in your merchant account in the PaySuper Admin. To get the Project and Product IDs click on the Product from the Products list page and copy the ID from an opened page URL.

```html
<script src="https://cdn.pay.super.com/paysdk/latest/paysuper.js"></script>
<script>
function buyItems() {
    // Create an instance of the Payment form with required order parameters
    const paySuper = new PaySuper({
        token: '5cd5620f06ae110001509185'
    });
    
    // Display a modal window with the payment form
    paySuper.renderModal();

    paySuper.on('paymentCompleted', function() {
        // You can show a completed payment message
    });
 }
</script>

<button onclick="buyItems()">BUY</button>
```

### The PaySuper form parameters

| Method | Type and Example | Description |
|---|---|---|
| ``token`` | String, Example - 'DWuGy6S1ADGUqR2Crnp4V2q26Jk309b3' | Order parameters as a secure string generated with [Tokens API](https://docs.stg.pay.super.com/docs/api/#tag/Token). You should generate secure strings of order and user parameters with Tokens API. |
|``project``|String, Example - '5be2e16701d96d00012d26c3'| Unique identifier of the Project in PaySuper Admin.|
|``type``|String, Available options: 'simple' (default), 'virtual_currency', 'key', 'product'|The Type depends on your products in the payment order: set a `type` to **'product'** for a [Virtual item](https://docs.stg.pay.super.com/docs/payments/#products-checkout), **'key'** for a [Game key](https://docs.stg.pay.super.com/docs/payments/#products-checkout), **'virtual_currency'** for a [Virtual currency](https://docs.stg.pay.super.com/docs/payments/#products-checkout). Default type is set to 'simple' for a [simple checkout payment](https://docs.stg.pay.super.com/docs/payments/#simple-checkout).|
|``products``|Array, Example - ['5d848f484dd6a50001970479']|Unique identifier of the Product being in the Project. The order can have multiple Products.|
|``amount``|Number\|String, Example - 59.9|The order amount of the [Virtual currency](https://docs.stg.pay.super.com/docs/payments/#products-checkout).|
|``currency``|String, Example - 'USD'|The order currency. Three-letter Currency Code ISO 4217. If this field sent, then we're process amount in this field. |
|``viewScheme``|String, Available options: 'dark' (default), 'light'|Sample code is available at [Theme style](docs/CUSTOMIZATION.md)|
|``viewSchemeConfig``|Object, Example - { headerTextColor: '#333333' }|Sample code is available at [Colors styles](docs/CUSTOMIZATION.md)|
|``formUrl``|String, Example - 'https://order.pay.super.com/?order_id=14e9be11-42c2-4e12-8737-5a5b8e6b25b8'|You can get the payment form URL via [PaySuper Tokens API](https://docs.stg.pay.super.com/docs/api/#tag/Token) or [PaySuper Order API](https://docs.stg.pay.super.com/docs/api/#tag/Payment-Order). |

### Sample code of the PaySuper form for the Virtual item order:

```js
const paySuper = new PaySuper({
    project: '5cd5620f06ae110001509185',
    products: ['5d848f484dd6a50001970479', '5d8c7a219e362100013de214'],
    type: 'product'
});
```

### Sample code of the PaySuper form for the Game key order:

```js
const paySuper = new PaySuper({
    project: '5cd5620f06ae110001509185',
    products: ['5d7baee015ff7d0001b986a8'],
    type: 'key'
});
```

### Sample code of the PaySuper form for a simple checkout payment:

```js
const paySuper = new PaySuper({
    project: '5cd5624a06ae110001509186',
    amount: 50,
    currency: 'USD'
});
```

### Sample code of the PaySuper form as a standalone web-page:

```js
const paySuper = new PaySuper({
    formUrl: 'https://order.pay.super.com/?order_id=14e9be11-42c2-4e12-8737-5a5b8e6b25b8'
});
paySuper.renderPage();
```

### The PaySuper form methods

| Method | Type and Example | Description |
|---|---|---|
|``renderModal()``| return: {PaySuper} | Renders the form in a modal dialog. |
|``renderPage()``|return: {PaySuper}|Renders the form in a bare iframe. Height is determined automatically.|
|``closeModal()``|return: {PaySuper}|Closes a modal dialog.|
|``setAmount( value )`` |param: **value** {Number\|String} Example - 59.9, return: {PaySuper}||
|``setCurrency( value )``|param: **value** {String} Example - 'USD', return: {PaySuper}||
|``setProducts( value )``|param: **value** {Array} Example - ['5d848f484dd6a50001970479'], return: {PaySuper}||
|``setType( value )``|param: **value** {String} Example - 'product', return: {PaySuper}||

### The PaySuper form events

```js
// Handles events of the payment form and payment statuses
paySuper.on('inited', function() {
  console.log('PaySuper is initialized')
})
```

#### The full events list in the expected order of execution

| Method | Description |
|---|---|
| ``pageBeforeInit`` | The PaySuper form has started to render as a page. |
| ``modalBeforeInit`` | PaySuper form has started to render as a modal dialog. |
| ``inited`` | The PaySuper form scripts have been downloaded and have started to load. |
| ``loaded`` | The PaySuper form has finished to load and is ready to operate. |
| ``paymentFailedToBegin`` | An error has occured while fetching the order. |
| ``paymentBeforeCreated`` | The moment before the payment is created. |
| ``paymentCreated`` | The payment has been created, but has not finished yet. |
| ``paymentFailedToCreate`` | An error has occured while creating the payment. |
| ``paymentCompleted`` | The payment is successful. |
| ``paymentDeclined`` | The payment is declined by the payment system. |
| ``paymentInterrupted`` | The payment is interrupted by the user. |
| ``modalClosed`` | The PaySuper form modal dialog is closed. Applicable when the form was created inside a modal dialog. |

## Library URLs

### Hub with navigation

``https://static.protocol.one/minio/paysuper/sdk/``

### Dev version

``https://static.protocol.one/payone/sdk/dev/p1payone.js``
Updates automatically with `master` branch updates

### Production version

``https://cdn.pay.super.com/paysdk/latest/paysuper.js`` 
``https://cdn.pay.super.com/paysdk/v0.8.2/paysuper.js``
Updates width actual version releases (`v*` tag pushed into repo)



## Development

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies into single js-file
```
npm run build
```

### Like `run build` but with a dist file size analysis
```
npm run check-size
```

### Run tests
```
npm run test
```

### Run tests for development in watch mode 
```
npm run test:dev
```

## About

Learn more about PaySuper at https://pay.super.com

## Contributing

We feel that a welcoming community is important and we ask that you follow PaySuper's [Open Source Code of Conduct](https://github.com/paysuper/code-of-conduct/blob/master/README.md) in all interactions with the community.

PaySuper welcomes contributions from anyone and everyone. Please refer to each project's style and contribution guidelines for submitting patches and additions. In general, we follow the "fork-and-pull" Git workflow.

The master branch of this repository contains the latest stable release of this component.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fpaysuper%2Fpaysuper-js-sdk.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fpaysuper%2Fpaysuper-js-sdk?ref=badge_large)