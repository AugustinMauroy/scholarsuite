import { styleText } from 'node:util';
import { purgeAllCache } from '@/lib/cacheUtils.ts';

purgeAllCache()
  .then(() =>
    console.log(styleText('green', '✓') + ' Cache purged successfully')
  )
  .catch(error =>
    console.error(styleText('red', '✗') + ' Failed to purge cache', error)
  );
