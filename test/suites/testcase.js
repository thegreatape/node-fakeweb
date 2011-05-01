var fakeweb = require('../../fakeweb'),
    utils = require('../utils');
    http = require('http');

module.exports = fakeweb.testCase({
    setUp: utils.setUp,
    tearDown: utils.tearDown,
    // the following two tests both request /foo and /bar. the first test only sets
    // an intercept for /foo, where the second only sets the intercept for /bar. 
    // both then verify that the non-intercepted uri request contains the stock
    // response (e.g. that the test suite has reset the intercept list in between
    test_stateless_setting_first_uri : function(assert){
        http.register_intercept({uri: '/foo', body: 'foo'});
        utils.request({uri: '/foo'},
            function(res){
                assert.equals(res, "foo");
                utils.request({uri: '/bar'},
                    function(res){
                        assert.equals(res, utils.STOCK_RESPONSE);
                        assert.done();
                    });
            });

    },
    test_stateless_setting_second_uri : function(assert){
        http.register_intercept({uri: '/bar', body: 'bar'});
        utils.request({uri: '/foo'},
            function(res){
                assert.equals(res, utils.STOCK_RESPONSE);
                utils.request({uri: '/bar'},
                    function(res){
                        assert.equals(res, "bar");
                        assert.done();
                    });
            });

    }

});
