import PaySuper, { getRegion, getLanguage } from '@/PaySuper';

const project = '5be2e16701d96d00012d26c3';

describe('PaySuper', () => {
  it('should require project, token or formUrl to init', () => {
    expect(() => {
      // eslint-disable-next-line
      new PaySuper();
    }).toThrowError(/project, token or formUrl is required/);
  });

  it('should work well with formUrl only', () => {
    const formUrl = 'https://ya.ru';
    const paySuper = new PaySuper({
      formUrl,
    });
    expect(paySuper.formUrl).toEqual(formUrl);
  });

  it('should work well with token only', () => {
    const token = '123123123';
    const paySuper = new PaySuper({
      token,
    });
    expect(paySuper.token).toEqual(token);
  });

  it('should be able to handle events', () => {
    const p1PayOne = new PaySuper({
      project,
    });

    let check;
    p1PayOne.on('testEvent', (value) => {
      check = value;
    });
    p1PayOne.emit('testEvent', 'ok');

    expect(check).toEqual('ok');
  });

  it('should be able to handle custom apiUrl', () => {
    const customApiUrl = 'https://localhost:3333';
    const p1PayOne = new PaySuper({
      project,
      apiUrl: customApiUrl,
    });

    expect(p1PayOne.apiUrl).toEqual(customApiUrl);
  });

  describe('setAmount', () => {
    const amount = 5;
    it('should set the value as instance option', () => {
      const p1PayOne = new PaySuper({
        project,
        amount,
      });
      expect(p1PayOne.amount).toEqual(amount);
    });

    it('should set the value as instance option', () => {
      const p1PayOne = new PaySuper({
        project,
      });
      p1PayOne.setAmount(amount);
      expect(p1PayOne.amount).toEqual(amount);
    });

    it('should throw error if amount value passed as option is invalid', () => {
      expect(() => {
        // eslint-disable-next-line
        const p1PayOne = new PaySuper({
          project,
          amount: {},
        });
      }).toThrowError(/Amount value must/);
    });

    it('should throw error if no value passed', () => {
      const p1PayOne = new PaySuper({
        project,
      });
      expect(() => {
        p1PayOne.setAmount();
      }).toThrowError(/Amount value must/);
    });

    it('should autoconvert strings to numbers', () => {
      const p1PayOne = new PaySuper({
        project,
      });
      p1PayOne.setAmount('5');
      expect(p1PayOne.amount).toEqual(5);
    });
  });

  describe('setCurrency', () => {
    const currency = 'USD';
    it('should set the value as instance option', () => {
      const p1PayOne = new PaySuper({
        project,
        currency,
      });
      expect(p1PayOne.currency).toEqual(currency);
    });

    it('should set the value as instance option', () => {
      const p1PayOne = new PaySuper({
        project,
      });
      p1PayOne.setCurrency(currency);
      expect(p1PayOne.currency).toEqual(currency);
    });

    it('should throw error if currency value passed as option is invalid', () => {
      expect(() => {
        // eslint-disable-next-line
        const p1PayOne = new PaySuper({
          project,
          currency: {},
        });
      }).toThrowError(/Currency value must/);
    });

    it('should throw error if no value passed', () => {
      const p1PayOne = new PaySuper({
        project,
      });

      expect(() => {
        p1PayOne.setCurrency();
      }).toThrowError(/Currency value must/);
    });
  });

  describe('getRegion', () => {
    const defaultRegion = 'US';
    it(`should return ${defaultRegion} if no value and no navigator`, () => {
      const value = getRegion();
      expect(value).toEqual(defaultRegion);
    });

    it(`should return ${defaultRegion} if no value and no navigator.language`, () => {
      const value = getRegion(null, {});
      expect(value).toEqual(defaultRegion);
    });

    it('should return region from navigator.language when no value', () => {
      const value = getRegion(null, {
        language: 'ru-RU',
      });
      expect(value).toEqual('RU');
    });

    it('should cast value into upper case', () => {
      const value = getRegion('us');
      expect(value).toEqual('US');
    });

    it('should throw error if value has incorrect type', () => {
      expect(() => {
        getRegion({});
      }).toThrowError(/Region value must be a string/);
    });

    it('should throw error if value has incorrect format', () => {
      expect(() => {
        getRegion('omg');
      }).toThrowError(/Region value must be in 2-characters format/);
    });
  });

  describe('getLanguage', () => {
    it('should return region undefined when no value', () => {
      const value = getLanguage(null);
      expect(value).toEqual(undefined);
    });

    it('should cast value into upper case', () => {
      const value = getLanguage('EN');
      expect(value).toEqual('en');
    });

    it('should throw error if value has incorrect type', () => {
      expect(() => {
        getLanguage({});
      }).toThrowError(/Language value must be a string/);
    });

    it('should throw error if value has incorrect format', () => {
      expect(() => {
        getLanguage('omg');
      }).toThrowError(/Language value must be in 2-characters format/);
    });
  });

  describe('setProducts', () => {
    const products = ['5cda8d3938e0e2000176988b'];
    it('should set the value as instance option', () => {
      const p1PayOne = new PaySuper({
        project,
        products,
      });
      expect(p1PayOne.products).toEqual(products);
    });

    it('should set the value as instance option', () => {
      const p1PayOne = new PaySuper({
        project,
      });
      p1PayOne.setProducts(products);
      expect(p1PayOne.products).toEqual(products);
    });

    it('should throw error if products value passed as option is invalid', () => {
      expect(() => {
        // eslint-disable-next-line
        const p1PayOne = new PaySuper({
          project,
          products: {},
        });
      }).toThrowError(/Products value must/);
    });

    it('should throw error if no value passed', () => {
      const p1PayOne = new PaySuper({
        project,
      });

      expect(() => {
        p1PayOne.setProducts();
      }).toThrowError(/Products value must/);
    });
  });
});
