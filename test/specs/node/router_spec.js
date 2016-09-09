import test from 'tape';
import {Router, Server} from '../../../src';
import https from 'https';

export const routerSpec = () => {
  //TODO: Test get request using options as string
  test('Node # Router # get string', (assert) => {
    const router = new Router();
    const server = new Server();

    server.use(router);

    const options = {
      hostname: 'api.github.com',
      path: '/emojis',
      method: 'GET',
      headers: {
        'User-Agent': 'Awesome-Octocat-App'
      }
    };

    https.get(options, res => {
      // console.log('statusCode: ', res.statusCode);
      // console.log('headers: ', res.headers);
      let body = '';

      res.on('data', (d) => {
        body += d;
      });

      res.on('end', () => {
        const json = JSON.parse(body);
        console.log('emoji length', Object.keys(json).length);
        assert.end();
      });

    }).on('error', (e) => {
      console.error(e);
    });
  });

  //TODO: Test get request using options as object
  //TODO: Test different options properties
  test('Node # Router # get options', (assert) => {
    assert.end();
  });
}