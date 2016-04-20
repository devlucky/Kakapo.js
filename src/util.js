export const randomIndex = (arr) => {
  return Math.floor(Math.random() * arr.length);
}

export const randomItem = (arr) => {
  return arr[randomIndex(arr)];
}

export const last = (arr) => {
  return arr[arr.length - 1];
}