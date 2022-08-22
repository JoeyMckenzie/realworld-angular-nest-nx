import { omit } from './omit';

describe('omit utility function', () => {
  it('should should return a partial object without the selected key', () => {
    // arrange
    const fullObject = {
      foo: 'bar',
      suh: 'dude',
      1: 2,
    };

    const expectedPartialObject = {
      suh: 'dude',
      1: 2,
    };

    // act
    const partialObject = omit(fullObject, 'foo');

    // assert
    expect(partialObject).toStrictEqual(expectedPartialObject);
  });
});
