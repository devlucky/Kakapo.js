export * from './db';
export * from './router';
export * from './server';
export * from './response';

export class Kakapo {
  constructor(config) {
    this.config = config;
  }
}