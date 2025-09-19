import { Base64EncodedWireTransaction, getBase58Codec, getBase64Codec } from "gill";

export function u8FromBase64(msg: Base64EncodedWireTransaction) {
  const codec = getBase64Codec();
  const uint8 = codec.encode(msg);
  return Uint8Array.from(uint8);
}

export function u8ToBase64(uint8: Uint8Array): Base64EncodedWireTransaction {
  const codec = getBase64Codec();
  const base64 = codec.decode(uint8);
  return base64 as Base64EncodedWireTransaction;
}

export function u8ToBase58(uint8: Uint8Array) {
  const codec = getBase58Codec();
  return codec.decode(uint8);
}