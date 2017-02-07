var plugin = require("../.././plugin/extend");
var removeRoute = require('express-remove-route');
var async=require('async');
var fs = require('fs');


exports.removeRoute=function(app,resourceMethod,resourcePath){
    removeRoute(app, resourcePath,resourceMethod);
};

exports.addRoute=function(app,method,resourcePath,functionDeclaration){
    getErrorHandlers(app,function(error_handlers){
        extendGet(app,method,resourcePath,functionDeclaration);
        if(error_handlers)
            app._router.stack.push.apply(app._router.stack, error_handlers);
    });
};


function extendGet(app,method,resourcePath,functionDeclaration) {
    method=method.toLocaleLowerCase();
    app[method](resourcePath, function(req,res) {
        functionDeclaration(req,res);
    });
}


function getErrorHandlers(app,error_map) {
    var route, stack;

    stack = app._router.stack;


    async.eachOfSeries(stack, function(layer,key, callback) {
        if (layer && layer.name == '<anonymous>' &&  layer.route == undefined)
            callback(key);
        else callback();

    }, function(err_map) {
        var error_handlers=null;
        if(err_map){
            error_handlers = stack.splice(err_map);
            app._router.stack=stack;
        }
        error_map(error_handlers);
    });
}


//###############################
var util=require('util');
var _=require('underscore');

module.exports = function removeRoute(app, path) {
    var found, route, stack, idx;

    found = findRoute(app, path);

    console.log(util.inspect(found));

    found.forEach(function(layer) {
        route = layer.route;
        stack = layer.stack;

        if (route) {
            idx = stack.indexOf(route);
            stack.splice(idx, 1);
            console.log("##############################Rimosso");
        }
    });

    return true;
};

module.exports.findRoute = findRoute;


function _findRoute(path,stack) {
    var count=0;
    var routes=[];
    stack.forEach(function(layer) {
        console.log("Layer:---->" + layer.regexp);
        //console.log(util.inspect(layer,false,null,true));
        //console.log(_.allKeys(layer));
        //console.log("Path:" +path);

        if (!layer) return;
        if (layer && !layer.match(path)) return;
        //console.log("Match" + layer.match);
        if (['query', 'expressInit'].indexOf(layer.name) != -1) return;
        if (layer.name == 'router') {
            //stack = ;
            console.log(count++ + ":" + layer.path);
            routes=routes.concat(_findRoute(trimPrefix(path, layer.path),layer.handle.stack));
        } else {
            if (layer.name == 'bound ') {
                console.log(count++ + ":" + layer.path);
                routes.push({route: layer || null, stack: stack});
            }else{
                console.log(count++ + ":NOTBOUND" + layer.path);
            }
        }
    });

    console.log("routes:" + routes);
    return routes;
}

function findRoute(app, path) {
    var  stack;


    stack = app._router.stack;

    return (_findRoute(path, stack));
}

function trimPrefix(path, prefix) {
    // This assumes prefix is already at the start of path.
    return path.substr(prefix.length);
}
//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
