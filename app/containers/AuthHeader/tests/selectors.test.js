import { fromJS } from 'immutable';
import { selectAuthHeaderDomain } from '../selectors';

describe('selectAuthHeaderDomain', () => {
  it('should retrieve from authHeader domain', () => {
    expect(selectAuthHeaderDomain(fromJS({ authHeader: 'foo' }))).toEqual('foo');
  });
});
