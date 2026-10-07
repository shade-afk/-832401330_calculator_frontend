/**
 * Global front-end configuration.
 *
 * API_BASE_URL points at the separated backend service. It can be overridden
 * without editing this file by defining `window.CALC_API_BASE_URL` before the
 * scripts load (useful for deployment).
 *
 * @type {{ API_BASE_URL: string, REQUEST_TIMEOUT: number }}
 */
const APP_CONFIG = {
  API_BASE_URL: window.CALC_API_BASE_URL || 'https://calculator-backend-o3iy.onrender.com',
  REQUEST_TIMEOUT: 8000,
};

window.APP_CONFIG = APP_CONFIG;
