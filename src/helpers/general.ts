import { Metadata } from "../types";
import { sha256 } from "js-sha256";

export const pause = () => {
  return new Promise((r) => setTimeout(r, 0));
};

/**
 * Generates an sha256 hash for a given object
 * @param _obj The metadata object to hash
 * @returns {string} sha256 hashed hex string
 */
export function generateHash(_obj: Metadata): Promise<string> {
  return new Promise((resolve, _reject) => {
    const hash = sha256.create();
    hash.update(JSON.stringify(_obj));
    resolve(hash.hex());
  });
}
