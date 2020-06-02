import qs from 'qs';
import { Base64 } from 'js-base64';
import PaySuper from '@/PaySuper';

describe('PaySuper.getIframeSrc', () => {
  it('should work well with formUrl only', () => {
    const formUrl = 'https://ya.ru';
    const paySuper = new PaySuper({
      formUrl,
    });
    expect(paySuper.getIframeSrc()).toEqual(`${formUrl}?sdk=true`);
    expect(paySuper.getFormUrl()).toEqual(`${formUrl}?`);
  });

  it('should work well with formUrl only 2', () => {
    const formUrl = 'https://ya.ru?order_id=123';
    const paySuper = new PaySuper({
      formUrl,
    });
    expect(paySuper.getIframeSrc()).toEqual(`${formUrl}&sdk=true`);
  });

  it('should return valid url if token is used', () => {
    const formUrl = 'https://ya.ru';
    const query = {
      token: '5de4fad5070725159f457dcb',
    };
    const paySuper = new PaySuper({
      formUrl,
      ...query,
    });
    const expectedQueryString = qs.stringify({
      ...query,
      sdk: true,
    });
    expect(paySuper.getIframeSrc()).toEqual(`${formUrl}?${expectedQueryString}`);
  });

  it('should return valid url if project ID is used', () => {
    const formUrl = 'https://ya.ru';
    const query = {
      project: '5de4fad5070725159f457dcb',
      amount: 30,
      currency: 'USD',
      type: 'simple',
    };
    const paySuper = new PaySuper({
      formUrl,
      ...query,
    });
    const expectedQueryString = qs.stringify({
      ...query,
      time: String(new Date().getTime()).slice(0, 10),
      sdk: true,
    });
    expect(paySuper.getIframeSrc()).toEqual(`${formUrl}?${expectedQueryString}`);
  });

  it('should return valid url if token is used', () => {
    const formUrl = 'https://ya.ru';
    const viewSchemeConfig = {
      cartBackgroundColor: 'red',
    };
    const query = {
      token: '5de4fad5070725159f457dcb',
      viewScheme: 'light',
    };
    const paySuper = new PaySuper({
      formUrl,
      ...query,
      viewSchemeConfig,
    });
    const expectedQueryString = qs.stringify({
      ...query,
      viewSchemeConfig: Base64.encode(JSON.stringify(viewSchemeConfig)),
      sdk: true,
    });
    expect(paySuper.getIframeSrc()).toEqual(`${formUrl}?${expectedQueryString}`);
  });
});
