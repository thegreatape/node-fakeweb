var nodeunit = require('nodeunit'),
    fakeweb = require('../fakeweb'),
    http = require('http');

function request(options, cb){
    var req = http.request( options, function(response){
            var res = '';
            response.on('data', function(i){ res+=i;});
            response.on('end', function(){
                cb(res);
            });
    });
    req.end();
}

STOCK_RESPONSE = "Hi, you've reached the target server!";
module.exports = nodeunit.testCase({
    setUp: function (callback) {
        this.targetServer = http.createServer(function(req, res){
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(STOCK_RESPONSE);
        });
        this.targetServer.listen(3001, callback);
    },
    tearDown: function (callback) {
        this.targetServer.close();
        callback();
    },
    test_basic_uri_interception: function(assert) {
        assert.expect(1);
        http.register_intercept({uri: '/', body: 'intercepted!'});
        request( { host: 'localhost', port: 3001, uri: '/', method: "GET"},
            function(res){
                assert.equal(res, "intercepted!");
                assert.done();
        });
    },
    test_uri_unregister: function(assert) {
        assert.expect(1);
        http.clear_intercepts();
        var rule = {uri: '/', body: 'intercepted'};
        http.register_intercept(rule);
        http.unregister_intercept(rule);
        request( { host: 'localhost', port: 3001, uri: '/', method: "GET"},
            function(res){
                assert.equal(res, STOCK_RESPONSE);
                assert.done();
        });
    },
    test_clear_all: function(assert) {
        assert.expect(3);
        http.register_intercept({uri: '/', body: 'foo'});
        http.register_intercept({uri: '/bar', body: 'bar'});
        http.register_intercept({uri: '/baz', body: 'baz'});
        http.clear_intercepts();
        request({uri: '/', port: 3001, method: "GET", host: 'localhost'},
                function(res){
                    assert.equal(res, STOCK_RESPONSE);
                    request({uri: '/bar', port: 3001, method: "GET", host: 'localhost'},
                        function(res){
                            assert.equal(res, STOCK_RESPONSE);
                            request({uri: '/baz', port: 3001, method: "GET", host: 'localhost'},
                            function(res){
                                assert.equal(res, STOCK_RESPONSE);
                                assert.done();
                            });
                        });
                });
    }
});

