var nodeunit = require('nodeunit'),
    fakeweb = require('../fakeweb'),
    http = require('http');

module.exports = nodeunit.testCase({
    setUp: function (callback) {
        this.targetServer = http.createServer(function(req, res){
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end("Hi, you've reached the target server!");
        });
        this.targetServer.listen(3001, callback);
    },
    tearDown: function (callback) {
        this.targetServer.close();
        callback();
    },
    test_basic_uri_interception: function(assert) {
        assert.expect(1);
        http.intercept_rules.push({uri: '/', body: 'intercepted!'});
        var req = http.request(
            { host: 'localhost', port: 3001, uri: '/', method: "GET"},
            function(response){
                var res = '';
                response.on('data', function(i){ res+=i;});
                response.on('end', function(){
                    assert.equal(res, "intercepted!");
                    assert.done();
                });
            });
        req.end();

        
    }
});

