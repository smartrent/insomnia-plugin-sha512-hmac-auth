const CryptoJS = require("crypto-js");
const InsomniaUrl = require("insomnia-url");
const TIMESTAMP_STORE_KEY = "current_unixtime";

module.exports.templateTags = [
  {
    name: "sha512_hmac_auth_timestamp",
    displayName: "SHA512 HMAC Timestamp",
    description: "Current timestamp in Unixtime",
    async run(context) {
      let timestamp = await context.store.getItem(TIMESTAMP_STORE_KEY);

      if (!timestamp) {
        timestamp = Math.round(new Date().getTime() / 1000);
        await context.store.setItem(TIMESTAMP_STORE_KEY, timestamp);
      }

      //const request = await context.util.models.request.getById(context.meta.requestId);
      return timestamp;
    }
  },
  {
    name: "sha512_hmac_auth_signature",
    displayName: "SHA512 HMAC Signature",
    description: "Signature of request",
    args: [
      {
        displayName: "HMAC Secret",
        type: "string"
      }
    ],
    async run(context, secret) {
      let timestamp = await context.store.getItem(TIMESTAMP_STORE_KEY);

      if (!timestamp) {
        timestamp = Math.round(new Date().getTime() / 1000);
        await context.store.setItem(TIMESTAMP_STORE_KEY, timestamp);
      }

      const request = await context.util.models.request.getById(
        context.meta.requestId
      );
      const method = request.method.toUpperCase();
      const url = new URL(await context.util.render(request.url));
      const path = url.href.substring(url.origin.length);

      const renderedParameters = await Promise.all(
        request.parameters.map(async function(param) {
          const name = await context.util.render(param.name);
          const value = await context.util.render(param.value);

          param.name = name;
          param.value = value;

          return param;
        })
      );

      const query = InsomniaUrl.buildQueryStringFromParams(renderedParameters);
      const fullPath = InsomniaUrl.joinUrlAndQueryString(path, query);
      const body = request.body.text
        ? await context.util.render(request.body.text)
        : "";
      const message = timestamp + "\n" + method + "\n" + fullPath + "\n" + body;
      const signature = CryptoJS.enc.Hex.stringify(
        CryptoJS.HmacSHA512(message, secret)
      );

      return signature;
    }
  }
];

function clearTimestamp(context) {
  context.store.removeItem(TIMESTAMP_STORE_KEY);
}

module.exports.responseHooks = [clearTimestamp];
