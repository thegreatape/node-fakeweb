var fakeweb = require('../../fakeweb'),
    utils = require('../utils'),
    http = require('http');

module.exports = fakeweb.testCase({
    setUp: utils.setUp,
    tearDown: utils.tearDown,
    "test fake headers" : function(assert){
        assert.expect(2);
        var headers = {'Content-Type': 'text/pineapple'};
        http.register_intercept({uri: '/', headers: headers});
        utils.request({uri: '/'},
            function(res){
                assert.equal(res.body, '');
                assert.equal(res.headers, headers);
                assert.done();
            });
    },
    "test fake headers along with fake body": function(assert){
        assert.expect(2);
        var headers = {'Content-Type': 'text/pineapple'},
            body = 'intercepted!';
        http.register_intercept({uri: '/', headers: headers, body: body});
        utils.request({uri: '/'},
            function(res){
                assert.equal(res.body, body);
                assert.equal(res.headers, headers);
                assert.done();
            });
    }
});
