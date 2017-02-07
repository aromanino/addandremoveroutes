# addandremoveroutes
This module deals with to add and remove routes on the fly to an existing API. It uses express-remove-route   
If you need to do more complicate things as extend or override your API, you must use **apiextender** npm package.

**addandremoveroutes** allow ta add and remove routes in a **simple and fast** mode and with **few lines of code**.

* [Installation](#installation) 
* [Using apiextender](#addandremoveroutes)
* [Reference](#reference) 
    * [addRoute(router,method,resource,expressLikeFunction)](#addRoute)
    * [removeRoute(router,resource)](#removeRoute)
* [Examples](#examples)

## <a name="installation"></a>Installation
To use **addandremoveroutes** install it in your project by typing:

```shell
$ npm install addandremoveroutes
```


## <a name="using"></a>Using addandremoveroutes
This is an express module for nodejs and now we explain how to use it in you code to make your API modificable/updatable on the fly.

### Include addandremoveroutes
Just require it like a simple package:
```javascript
var addandremoveroutes = require('addandremoveroutes');
```

### Using addandremoveroutes

```javascript
var express=require('express'); 
var addandremoveroutes = require('addandremoveroutes');
var app=express();
var router = express.Router();

app.use('/foo', router);
   
// Add a route on the fly. Add Resource /foo/add/me in get method
addandremoveroutes.addRoute(router,"GET","/add/me",function(req,res){

req.staus(200).send({"content":"resource added on the fly"});
});
 
router.get("/removeme",function(req,res,next){
    // should never be reachable due the resource is removed on the fly in the next section
});

// Remove a route on the fly. Remove  resource "/foo/remove/me" in get method
addandremoveroutes.removeRoute(app, '/foo/remove/me');
```

## <a name="reference"></a>Reference
### <a name="addRoute"></a>`addRoute(router,method,resource,expressLikeFunction)` 
This is the function that allow to add a resource on the fly 
The param `router` is the router or application(app) on which you want add the resource.  
The param `method` is the method by which the resource is invoked  
The param `resource` is the resource to add on the fly  
The param `expressLikeFunction` is the express like function "function(req,res){"your logic"}"  that define the new resource   
                                 
Example:
```javascript
ar express=require('express'); 
var addandremoveroutes = require('addandremoveroutes');
var app=express();


   
// Add a route on the fly. Add Resource /foo/add/me in get method
addandremoveroutes.addRoute(app,"GET","/foo/add/me",function(req,res){

req.staus(200).send({"content":"resource added on the fly"});
});
```

### <a name="removeRoute"></a>`removeRoute(router,resource)` 
This is the function that allow to remove a resource on the fly   
The param `router` is the router or application(app) on which you want remove the resource.  
the param `resource` is the resource to remove on the fly   
                                 
Example:
```javascript
var express=require('express'); 
var addandremoveroutes = require('addandremoveroutes');
var app=express();
var router = express.Router();


router.get('/remove/me', function(res, res) {
    res.send('I should not be here');
});

app.use('/foo', router);

// Remove a route on the fly. Remove  resource "/foo/remove/me" in get method
addandremoveroutes.removeRoute(app, '/foo/remove/me');
```



## <a name="examples"></a>`Examples`
### <a name="examplesapi"></a>`Examples: How to make a dynamic API`
From a shell, go in your application home directory and type de follow commands:
```shell
$ cd /Your_App_Home
$ npm install addandremoveroutes -S   // install addandremoveroutes
```


Now from your app.js include the addandremoveroutes module.
```javascript
var express=require('express'); 
var addandremoveroutes = require('addandremoveroutes');
var app=express();
``` 


To make a dynamic API at runtime, we need to define an endpoint that wrap addandremoveroutes and add/remove resources ad runtime. 
To do it add the fee code lines to you app.js:
```javascript
var express=require('express'); 
var addandremoveroutes = require('addandremoveroutes');
var app=express();
   
// .....
// Old app.js logic
// ..... 

// Define an endpoint that wrap "addandremoveroutes" to add resources on the fly
// The access to this endpoint should be protected with token privileges
app.post("/addresource",function(req,res,next){
    // check for tokens
    //.....
     
    addandremoveroutes.addRoute(app,req.body.method,req.body.resourcePath,req.body.ResourceLogicfunction);    
    res.send({"status":"add resource done"});
});

// Define an endpoint that wrap "addandremoveroutes" to remove resources on the fly
// The access to this endpoint should be protected with token privileges
app.post("/removeResource",function(req,res,next){
    // check for tokens
    //.....
     
    addandremoveroutes.removeRoute(app,req.body.resourcePath);    
    res.send({"status":"remove resource done"});
});

```

With no extension resource defined, if we test it with curl we have:
```shell
 $ curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://hostname/foo/add/resource
 HTTP/1.1 404 Not Found
 X-Powered-By: Express
 Content-Type: text/html; charset=utf-8
 Content-Length: 1946
 ETag: W/"JITdME9ePIMNamJKK4biwQ=="
 Date: Tue, 31 Jan 2017 16:14:41 GMT
 Connection: keep-alive
```

Now we extend endpoint with a new resource installed on the fly "/foo/add/resource"
addandremoveroutes.addRoute(app,req.body.method,req.body.,req.body.);  

```shell
EXTENDER='{
            "resourcePath":"/foo/add/resource",  // add a new endpoint
             "method":"GET",                  // add new endpoint in get method  
             "ResourceLogicfunction": function(req,res,next){   // this is the resource Function definition
                    
                        res.status.send({"content":"new resource added"});
             },
            
}
$
$ curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST http://hostname/addresource
    -d $EXTENDER
    
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 31
ETag: "35-6BXjKyRXlm+rSEU9a23z/g"
Date: Fri, 11 Nov 2016 13:16:44 GMT
Connection: keep-alive
 
{"status":"add resource done"} // new resource endpoint installed
```

now **without shutdown** and restart your application make the same test with curl. You can see that you API now responds on this resource:
```shell 
$ curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://hostname/foo/add/resource
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 33
ETag: "35-6BXjKyRXlm+rSEU9a23z/g"
Date: Fri, 11 Nov 2016 13:16:44 GMT
Connection: keep-alive

 {"response":"new resource added"} // new resource response                                                           
$
```

now we remove again the resource just created
```shell
$ curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST http://hostname/removeResource
    -d $EXTENDER
    
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 34
ETag: "35-6BXjKyRXlm+rSEU9a23z/g"
Date: Fri, 11 Nov 2016 13:16:44 GMT
Connection: keep-alive
 
{"status":"remove resource done"} // new resource endpoint removed
```

now **without shutdown** and restart your application make the same test with curl. You can see that you API now responds with 404 on this resource:
```shell
 $ curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://hostname/foo/add/resource
 HTTP/1.1 404 Not Found
 X-Powered-By: Express
 Content-Type: text/html; charset=utf-8
 Content-Length: 1946
 ETag: W/"JITdME9ePIMNamJKK4biwQ=="
 Date: Tue, 31 Jan 2017 16:14:41 GMT
 Connection: keep-alive
```

License - "MIT License"
-----------------------

MIT License

Copyright (c) 2016 aromanino

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Contributors
------------

Alessandro Romanino ([a.romanino@gmail.com](mailto:a.romanino@gmail.com))
Guido Porruvecchio ([guido.porruvecchio@gmail.com](mailto:guido.porruvecchio@gmail.com))