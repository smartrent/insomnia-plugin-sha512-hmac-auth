# Insomnia SHA512 HMAC Auth

Exposes two Template Tags for injecting (1) the current Unixtime and
(2) a SHA512 HMAC signature of the request, based on the following string:

```javascript
timestamp + "\n" + method + "\n" + path + "\n" + body
```

## Installation

Open the Plugins menu in [Insomnia](https://insomnia.rest/) and add `insomnia-plugin-sha512-hmac-auth`.

## Usage

(Use control+space to inject Template Tags into header value fields.)

Use the `SHA512 HMAC Timestamp` Template Tag to generate current Unixtime.

Use the `SHA512 HMAC Signature` Template Tag to generate current the signature. (You'll need to open the template tag once added and input the encryption secret.)
