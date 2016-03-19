#!/bin/env node
var express = require('express');
var path = require('path');
var http = require('http')
var pug = require('pug');
var fs = require('fs');

var app = express()

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP);

var appRoot = __dirname + '/app'

// compile jade(pug) to html
jadeFiles = fs.readdirSync(appRoot + '/views')
for (var j in jadeFiles) {
	jade = jadeFiles[j]
	console.log('Compiling %s...', jade);
	htmlFile = appRoot + '/public/' + jade.replace('.jade', '.html')
	html = pug.renderFile(appRoot + '/views/' + jade)
	fs.writeFile(htmlFile, html, function(err) {
		if (err) {
			console.log('Error compiling %s: %s', jade, err)
			process.exit()
		}
	})
}

app.use(express.static(appRoot + '/public'));
app.use(express.static(appRoot + '/scripts'));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));

http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
    console.log('%s: Node server started on %s:%d ...',
                Date(Date.now() ), app.get('ip'), app.get('port'));
})
