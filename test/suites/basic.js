var nodeunit = require('nodeunit'),
    fakeweb = require('../../fakeweb'),
    utils = require('../utils'),
    http = require('http');

module.exports = nodeunit.testCase({
    setUp: utils.setUp,
    tearDown: utils.tearDown,
    test_basic_uri_interception: function(assert) {
        assert.expect(1);
        http.register_intercept({uri: '/', body: 'intercepted!'});
        utils.request( { uri: '/'},
            function(res){
                assert.equal(res.body, "intercepted!");
                assert.done();
        });
    },
    test_uri_unregister: function(assert) {
        assert.expect(1);
        http.clear_intercepts();
        var rule = {uri: '/', body: 'intercepted'};
        http.register_intercept(rule);
        http.unregister_intercept(rule);
        utils.request( { uri: '/'},
            function(res){
                assert.equal(res.body, utils.STOCK_RESPONSE);
                assert.done();
        });
    },
    test_clear_all: function(assert) {
        assert.expect(3);
        http.register_intercept({uri: '/', body: 'foo'});
        http.register_intercept({uri: '/bar', body: 'bar'});
        http.register_intercept({uri: '/baz', body: 'baz'});
        http.clear_intercepts();
        utils.request({uri: '/'},
                function(res){
                    assert.equal(res.body, utils.STOCK_RESPONSE);
                    utils.request({uri: '/bar'},
                        function(res){
                            assert.equal(res.body, utils.STOCK_RESPONSE);
                            utils.request({uri: '/baz'},
                            function(res){
                                assert.equal(res.body, utils.STOCK_RESPONSE);
                                assert.done();
                            });
                        });
                });
    }
});

