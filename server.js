#!/bin/env node
var express = require('express');
var path = require('path');
var http = require('http')

var app = express()

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP);

app.use(express.static(__dirname + '/app'))
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));

http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
    console.log('%s: Node server started on %s:%d ...',
                Date(Date.now() ), app.get('ip'), app.get('port'));
})
