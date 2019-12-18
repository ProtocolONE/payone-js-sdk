const buildPurpose = process.env.VUE_APP_BUILD_PURPOSE;

const formUrlMap = {
  dev: 'http://localhost:8080/order',
  test: 'https://paysupermgmt.tst.protocol.one/order',
  stage: 'https://order.stg.pay.super.com',
  release: 'https://order.pay.super.com',
};

// eslint-disable-next-line import/prefer-default-export
export const formUrl = formUrlMap[buildPurpose] || formUrlMap.dev;
