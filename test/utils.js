var http = require('http');

module.exports.request = function(options, cb){
    var req = http.request( options, function(response){
            var res = '';
            response.on('data', function(i){ res+=i;});
            response.on('end', function(){
                cb(res);
            });
    });
    req.end();
}
