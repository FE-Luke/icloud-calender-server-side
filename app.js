/**
 * Created by Zhichao Liu on 11/25/2015.
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
app.use(express.static('public'));//让目录public的内容直接通过'/'访问.
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
var fs = require('fs');
var db = {};
fs.readdir('./public/photos/', function (err, files) {
    for(var i = 0 ; i < files.length ; i++){
        fs.stat('./public/photos/'+files[i], (function (i) {
            return function(err,stats){
                var mtime = stats.mtime;
                var key = mtime.getFullYear()+'-'+mtime.getMonth()+'-'+mtime.getDate();
                if(!db[key]){
                    db[key] = [];
                }
                db[key].push(files[i]);
            };
        })(i));
    }
});
app.get('/showImg', function (req, res) {
    if(db[req.query.timeAttr]){
        res.json(db[req.query.timeAttr]);//json -> [] or {} or {[],[],...} or [{},{},...]
    }else{
        res.send('no data');
    }


    //send -> 14,'string'
    //sendFile -> page or file
});
http.listen(80, function () {
    console.log('listening on *:80')
});


