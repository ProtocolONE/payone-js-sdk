const buildPurpose = process.env.VUE_APP_BUILD_PURPOSE;

const apiUrlMap = {
  dev: 'https://p1payapi.tst.protocol.one',
  test: 'https://p1payapi.tst.protocol.one',
  release: 'https://api.pay.super.com',
};
export const apiUrl = apiUrlMap[buildPurpose] || apiUrlMap.dev;

const formUrlMap = {
  dev: 'http://localhost:8080/order',
  test: 'https://paysupermgmt.tst.protocol.one/order',
  release: 'https://order.pay.super.com/',
};
export const formUrl = formUrlMap[buildPurpose] || formUrlMap.dev;

const postMessageOriginMap = {
  dev: 'http://localhost:8080',
  test: 'https://paysupermgmt.tst.protocol.one',
  release: 'https://dashboard.pay.super.com',
};
export const postMessageOrigin = postMessageOriginMap[buildPurpose] || postMessageOriginMap.dev;
