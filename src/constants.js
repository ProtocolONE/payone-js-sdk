const buildPurpose = process.env.VUE_APP_BUILD_PURPOSE;

const formUrlMap = {
  dev: 'http://localhost:4040/',
  test: 'https://checkout.tst.pay.super.com/pay/order/',
  stage: 'https://checkout.stg.pay.super.com/pay/order/',
  release: 'https://checkout.pay.super.com/pay/order/',
};

// eslint-disable-next-line import/prefer-default-export
export const formUrl = formUrlMap[buildPurpose] || formUrlMap.dev;
