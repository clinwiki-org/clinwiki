import {
  STRING_MISSING_IDENTIFIER,
  DATE_MISSING_IDENTIFIER,
} from 'utils/constants';
import { AggBucket } from 'containers/SearchPage/Types';

function bucketKeyIsMissing(bucket: AggBucket): boolean {
  const { key, keyAsString } = bucket;
  return (
    key == STRING_MISSING_IDENTIFIER ||
    keyAsString === STRING_MISSING_IDENTIFIER ||
    key === DATE_MISSING_IDENTIFIER ||
    keyAsString === DATE_MISSING_IDENTIFIER
  );
}
export default bucketKeyIsMissing;
