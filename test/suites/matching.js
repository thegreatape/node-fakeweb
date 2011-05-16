var fakeweb = require('../../fakeweb'),
    utils = require('../utils'),
    http = require('http');

module.exports = fakeweb.testCase({
    setUp: utils.setUp,
    tearDown: utils.tearDown,
    'test regex uri matching': function(assert){
        assert.expect(2);
        http.register_intercept({uri: /\d/, body: 'matched'});
        utils.request( {uri: '/23232322'},
            function(res){
                assert.equals(res.body, 'matched');
                utils.request( {uri: '/wombat-combat'},
                    function(res){
                        assert.equals(res.body, utils.STOCK_RESPONSE);
                        assert.done();
                    });
            });
    }
});
