import crypto from 'crypto';

export default ({ key, secret, payload }) => {
  const encodedPayload = (new Buffer(JSON.stringify(payload)))
    .toString(`base64`);

  const signature = crypto
    .createHmac(`sha384`, secret)
    .update(encodedPayload)
    .digest(`hex`);

  return {
    headers: {
      'X-BFX-APIKEY': key,
      'X-BFX-PAYLOAD': encodedPayload,
      'X-BFX-SIGNATURE': signature,
    },
  };
};
