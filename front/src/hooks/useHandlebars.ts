import { useMountEffect } from './useMountEffect';
import { registerHandlebarsHelpers } from 'components/MailMerge/MailMergeHelpers';

export default function useHandlebars() {
  useMountEffect(() => {
    registerHandlebarsHelpers();
  });
}
