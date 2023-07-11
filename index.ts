import { setItemAsync, getItemAsync, deleteItemAsync, SecureStoreOptions } from 'expo-secure-store';


const chunkString = (str: string) => str.match(/.{1,2000}/g) ?? [];
const range = (n: number) => [...Array(n).keys()];

async function setItem(key: string, str: string, options?: SecureStoreOptions) {
  const chunks = chunkString(str);

  await Promise.all([
    setItemAsync(key, chunks.length.toString(), options),
    ...chunks.map((str, i) =>
      setItemAsync(key + i, str, options)
    ),
  ]);
}

async function getItem(key: string, options?: SecureStoreOptions) {
  const len = +(await getItemAsync(key, options) ?? 0);

  return await Promise.all(range(len).map(i =>
    getItemAsync(key + i, options)
  )).then(r => r.join("") || "null");
}

async function removeItem(key: string, options?: SecureStoreOptions) {
  const len = +(await getItemAsync(key, options) ?? 0);
  
  await Promise.all([
    deleteItemAsync(key, options),
    ...range(len).map(i =>
      deleteItemAsync(key + i, options)
    ),
  ]);
}

export default {
  setItem,
  getItem,
  removeItem,

  deleteItemAsync: removeItem,
  getItemAsync: getItem,
  setItemAsync: setItem,
}