import test from 'tape';
import _ from 'lodash';

import { fakeService } from '../../src/interceptors/xhrInterceptor';
import { nativeXHR } from '../../src/helpers/nativeServices';

const interceptorConfigFixture = {
  host: '',
  requestDelay: 0,
  routes: { GET: {}, POST: {}, PUT: {}, DELETE: {} },
};

export const xhrInterceptorSpec = () => {
  test('xhrInterceptor . constructor', (assert) => {
    const XMLHttpRequestInterceptor = fakeService(interceptorConfigFixture);
    const xhr = new XMLHttpRequestInterceptor();

    const xhrInterceptorOwnProps = ['xhr', 'getHandler', 'getParams'];

    assert.ok(
      xhrInterceptorOwnProps.every(_.partial(_.has, xhr)),
      'defines own properties to xhrInterceptor.'
    );

    assert.ok(
      _.keysIn(new nativeXHR()).every(_.partial(_.has, xhr)),
      'inherits properties from native XHR object.'
    );

    assert.equal(xhr.readyState, 0, 'sets readyState to 0 as default.');

    assert.end();
  });

  test('xhrInterceptor . open', (assert) => {
    const XMLHttpRequestInterceptor = fakeService(interceptorConfigFixture);
    const xhr = new XMLHttpRequestInterceptor();

    xhr.open('GET', '/does_not_exist', true);

    assert.equal(xhr.readyState, 1, 'sets readyState to 1 after being called.');

    assert.end();
  });

  test('xhrInterceptor . setRequestHeader', (assert) => {
    const XMLHttpRequestInterceptor = fakeService(interceptorConfigFixture);
    const xhr = new XMLHttpRequestInterceptor();

    assert.throws(
      () => xhr.setRequestHeader('name', 'Morty'),
      'throws error when trying to setRequestHeader() when state is not OPENED.'
    );

    assert.equal(xhr.readyState, 0,
      'doesnt change readyState after failed call.');

    assert.end();
  });

  test('xhrInterceptor . send', (assert) => {
    assert.plan(3);

    const XMLHttpRequestInterceptor = fakeService(interceptorConfigFixture);
    const xhr = new XMLHttpRequestInterceptor();
    const readyStateChanges = [];

    assert.throws(
      () => xhr.send(),
      'throws error when trying to send() when state is not OPENED.'
    );

    assert.equal(xhr.readyState, 0,
      'doesnt change readyState after failed call.');

    xhr.open('GET', '/does_not_exist', true);

    xhr.onreadystatechange = () => {
      readyStateChanges.push(xhr.readyState);
      if (xhr.readyState !== 4) { return; }

      assert.deepEqual(readyStateChanges, [2, 3, 4],
        'invokes multiple changes to readyState.');
    };

    xhr.send();
  });
};
