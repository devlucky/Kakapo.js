export const randomIndex = arr => Math.floor(Math.random() * arr.length);

export const randomItem = arr => arr[randomIndex(arr)];

export const lastItem = arr => arr[arr.length - 1];
