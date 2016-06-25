const browserEnv = typeof window === 'object';
const nodeEnv = typeof global === 'object';
const name = browserEnv ? 'browser' : (nodeEnv ? 'node' : 'unknown');

export default {
  name,
  browserEnv,
  nodeEnv
};