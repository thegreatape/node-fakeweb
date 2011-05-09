Simple HTTP request mocking/interception for testing node.js modules that interface with external web services. Inspired by [chrisk's fakeweb][1].

# Examples

Fakeweb works by wrapping node's native http lib, so it needs to be required before ```http```.

Catch requests to test.com with uri "/foo":
```javascript
var fakeweb = require('fakeweb'),
    http = require('http')
http.register_intercept({
    uri: '/foo', 
    host: 'test.com',
    body: 'I'm the mocked-out body!'
})
http.request({uri: "/foo", host: "test.com"}, function(response){
    // ...
})
```

You can match request properties with regular expressions:
```javascript
http.register_intercept({uri: /page\d+/, body: 'intercepted body'})
```

Unregister rules like so:
```javascript
http.register_intercept({uri: '/page3', body: 'intercepted body'})
// ...
http.unregister_intercept({uri: '/page3', body: 'intercepted body'})
```

Clear the list of registered intercept rules:
```javascript
http.clear_intercepts()
```

[1]: https://github.com/chrisk/fakeweb
