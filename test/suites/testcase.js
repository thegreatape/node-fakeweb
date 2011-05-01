var fakeweb = require('../../fakeweb'),
    utils = require('../utils');
    http = require('http');

STOCK_RESPONSE = "Hi, you've reached the target server!";
module.exports = fakeweb.testCase({
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
    // the following two tests both request /foo and /bar. the first test only sets
    // an intercept for /foo, where the second only sets the intercept for /bar. 
    // both then verify that the non-intercepted uri request contains the stock
    // response (e.g. that the test suite has reset the intercept list in between
    test_stateless_setting_first_uri : function(assert){
        http.register_intercept({uri: '/foo', body: 'foo'});
        utils.request({host: 'localhost', port: 3001, uri: '/foo', method: 'GET'},
            function(res){
                assert.equals(res, "foo");
                utils.request({host: 'localhost', port: 3001, uri: '/bar', method: 'GET'},
                    function(res){
                        assert.equals(res, STOCK_RESPONSE);
                        assert.done();
                    });
            });

    },
    test_stateless_setting_second_uri : function(assert){
        http.register_intercept({uri: '/bar', body: 'bar'});
        utils.request({host: 'localhost', port: 3001, uri: '/foo', method: 'GET'},
            function(res){
                assert.equals(res, STOCK_RESPONSE);
                utils.request({host: 'localhost', port: 3001, uri: '/bar', method: 'GET'},
                    function(res){
                        assert.equals(res, "bar");
                        assert.done();
                    });
            });

    }

});
