import { Storage } from "@ionic/storage";

let storage: Storage;

export async function initStorage() {
  storage = new Storage();
  await storage.create();
}

export function getStorage() {
  return storage;
}
