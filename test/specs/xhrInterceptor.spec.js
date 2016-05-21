import test from 'tape';
import _ from 'lodash';

import { fakeService } from '../../src/interceptors/xhrInterceptor';
import { nativeXHR } from '../../src/helpers/nativeServices';

export const xhrInterceptorSpec = () => {
  test('xhrInterceptor . constructor', (assert) => {
    const XMLHttpRequestInterceptor = fakeService({});
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
    const XMLHttpRequestInterceptor = fakeService({});
    const xhr = new XMLHttpRequestInterceptor();

    xhr.open('GET', '/does_not_exist', true);

    assert.equal(xhr.readyState, 1, 'sets readyState to 1 after being called.');

    assert.end();
  });

  test('xhrInterceptor . setRequestHeader', (assert) => {
    const XMLHttpRequestInterceptor = fakeService({});
    const xhr = new XMLHttpRequestInterceptor();

    assert.throws(
      () => xhr.setRequestHeader('name', 'Morty'),
      'throws error when trying to setRequestHeader() before calling open().'
    );

    assert.equal(xhr.readyState, 0,
      'keeps readyState equal to 0 after failed call.');

    xhr.open('GET', '/does_not_exist', true);
    xhr.setRequestHeader('name', 'Morty');

    assert.equal(xhr.readyState, 1,
      'sets readyState to 1 after successful call.');

    assert.end();
  });
};
