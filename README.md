# Insomnia SHA512 HMAC Auth

Exposes two Template Tags for injecting (1) the current Unixtime and
(2) a SHA512 HMAC signature of the request, based on the following string:

```javascript
timestamp + "\n" + method + "\n" + path + "\n" + body
```
