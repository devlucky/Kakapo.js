import tapeTest from 'tape';
import {Database, Router, Server} from '../../src/kakapo';

function before() {

};

function test(title, cb) {
  tapeTest(title, (...args) => {
    before();
    cb(...args);
  });
}

export const serverSpec = () => {
  test('Server#config', assert => {
    const server = new Server({
      delay: 100
    });
    assert.end();
  });
  test('Server#use', assert => {
    const db = new Database();
    const router = new Router();
    const server = new Server();

    server.use(db);
    server.use(router);

    assert.end();
  });
};
