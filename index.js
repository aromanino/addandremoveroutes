var plugin = require("../.././plugin/extend");
var removeRoute = require('remove-route-onthefly');
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