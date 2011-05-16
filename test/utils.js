var http = require('http'),
    utils = module.exports;

utils.request = function(options, cb){
    options.host = options.host || 'localhost';
    options.port = options.port || 3001;
    options.method = options.method || 'GET';
    var req = http.request( options, function(response){
        var res = {body: "", headers: response.headers};
        response.on('data', function(i){ res.body+=i;});
        response.on('end', function(){
            cb(res);
        });
    });
    req.end();
}

utils.STOCK_RESPONSE = "Hi, you've reached the target server!";
utils.setUp = function (callback) {
    this.targetServer = http.createServer(function(req, res){
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(utils.STOCK_RESPONSE);
    });
    this.targetServer.listen(3001, callback);
}

utils.tearDown = function (callback) {
        this.targetServer.close();
        callback();
    }
