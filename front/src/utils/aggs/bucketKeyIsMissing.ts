import {
  STRING_MISSING_IDENTIFIER,
  DATE_MISSING_IDENTIFIER,
} from 'utils/constants';
import { AggBucket } from 'containers/SearchPage/Types';

export function bucketKeyStringIsMissing(key: string): boolean {
  return key === STRING_MISSING_IDENTIFIER || key === DATE_MISSING_IDENTIFIER;
}

export function bucketKeyAsStringIsMissing(keyAsString: string): boolean {
  return (
    keyAsString === STRING_MISSING_IDENTIFIER ||
    keyAsString === DATE_MISSING_IDENTIFIER
  );
}

function bucketKeyIsMissing(bucket: AggBucket): boolean {
  return (
    bucketKeyStringIsMissing(bucket.key) ||
    bucketKeyStringIsMissing(bucket.keyAsString || '')
  );
}
export default bucketKeyIsMissing;
