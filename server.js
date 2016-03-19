#!/bin/env node
var express = require('express');
var path = require('path');
var http = require('http')
var pug = require('pug');
var fs = require('fs');
var app = express();

var appRoot = path.join(__dirname, '/app');
var videoDir = path.join(__dirname, '/video');

var compileJade = function() {
	// compile jade(pug) to html
	jadeFiles = fs.readdirSync(path.join(appRoot, '/views'));
	for (var j in jadeFiles) {
		jade = jadeFiles[j];
		console.log('Compiling %s...', jade);
		htmlFile = path.join(appRoot, '/public/', jade.replace('.jade', '.html'));
		html = pug.renderFile(path.join(appRoot, '/views/', jade));
		fs.writeFile(htmlFile, html, function(err) {
			if (err) {
				console.log('Error compiling %s: %s', jade, err);
				process.exit();
			}
		})
	}
};

var generateClipList = function() {
	// generate clip list
	clipList = [];
	videos = fs.readdirSync(videoDir);
	for (var v in videos) {
		clipList.push({'fname': 'video/' + videos[v], 'name': escapeClipName(videos[v])});
	}
	return clipList;
};

var escapeClipName = function(clip) {
	return clip.replace('.webm', '')
			   .replace(/_/g, ' ');
};

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP);

compileJade();
cliplist = generateClipList();

app.use(express.static(path.join(appRoot, '/public')));
app.use('/video', express.static(videoDir));
app.use(express.static(path.join(appRoot, '/scripts')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));

app.get('/cliplist', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(cliplist);
})

http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
    console.log('%s: Node server started on %s:%d ...',
                Date(Date.now() ), app.get('ip'), app.get('port'));
});