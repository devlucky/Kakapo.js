import tapeTest from 'tape';
import {Kakapo} from '../../src/kakapo';

function before() {

};

function test(title, cb) {
  tapeTest(title, (...args) => {
    before();
    cb(...args);
  });
}

export const kakapoSpec = () => {
  test('Kakapo', assert => {
    let kakapo = new Kakapo();
    let db = new Db();

    assert.ok(1, 'foo');

    assert.end();
  });
};
