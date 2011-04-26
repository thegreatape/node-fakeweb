var http = require('http'),
    events = require('events');

http.intercept_rules = [];

function match_rule(options){
    var matched_rule;
    http.intercept_rules.forEach(function(rule){
        var keys = Object.keys(rule),
            match = false;
        // TODO headers matching and regex support
        keys.forEach(function(key){
            if(options[key]){ 
                match = options[key] == rule[key];
            }
        });
        if(match){
            matched_rule = rule;
        }
    });
    return matched_rule;
}

// wrap http.request with interceptor function
var old_request = http.request;
http.request = function(options, callback){
    var rule = match_rule(options);
    if(rule){
        var res = new events.EventEmitter();
        return {end: function(){ 
            callback(res);
            res.emit('data', rule.body);
            res.emit('end');
            } 
        };
    } else {
        return old_request.call(http, options, callback);
    }
};
