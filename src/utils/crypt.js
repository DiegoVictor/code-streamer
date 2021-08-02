import crypto from 'crypto-js';

export const encrypt = (buffer, secret) => {
  const hex = buffer.toString('hex');
  const cipherText = crypto.AES.encrypt(
    hex,
    secret,
  ).toString();

  return cipherText;
};

export const decrypt = (cipherText, secret) => Buffer.from(
  crypto.AES.decrypt(cipherText, secret).toString(crypto.enc.Utf8),
  'hex',
);
