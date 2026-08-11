/* =========================================================================
   ANALYTICS — Vercel Web Analytics initialization for Hylogos
========================================================================= */

import { inject } from '@vercel/analytics';

inject({
  mode: 'production',
});
