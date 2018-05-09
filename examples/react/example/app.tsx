import * as React from 'react';
import {Component} from 'react';
import {Server, Router} from '../../../dist';
import {AppWrapper} from './styled';

const server = new Server();
const router = new Router();

router.get('/files', () => {
  return {
    files: [1,2]
  };
});

router.get('/promise/files', () => {
  return Promise.resolve({
    files: [1,2]
  });
});

router.post('/promise/file', async () => {
  await new Promise(resolve => setTimeout(resolve, 100));

  return new Promise(resolve => {
    resolve({
      status: 'success'
    });
  });
});

server.use(router);

export interface AppState {
  
}

export default class App extends Component <{}, AppState> {
  state: AppState = {
    
  }
  
  componentDidMount() {
    this.getFilesXHR();
    this.getFilesPromiseXHR();
    this.postFilePromiseXHR();
  }

  async getFilesFetch() {
    const files = await (await fetch('/files')).json();

    console.log(files)
  }

  async getFilesXHR() {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', '/files');
    xhr.onload = () => {
      console.log('response', xhr.response);
    };
    xhr.send();
  }

  getFilesPromiseXHR() {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', '/promise/files');
    xhr.onload = () => {
      console.log('promise response', xhr.response);
    };
    xhr.send();
  }

  postFilePromiseXHR() {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/promise/file');
    xhr.onload = () => {
      console.log('promise post response', xhr.response);
    };
    xhr.send();
  }

  render() {
    return (
      <AppWrapper>
        Example!
      </AppWrapper>
    )
  }
}