// The API only allows CORS requests from the production origin, so the dev
// server proxies /api to it (see proxy.conf.json).
export const environment = {
  apiBaseUrl: '/api',
};
