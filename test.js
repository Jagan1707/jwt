// const url = require('url');

// const adrs = "http://localhost:7070/api/v2/user?year=2020&month=july";

// var que = url.parse(adrs,true);

// console.log(que.host);
// console.log(que.pathname);
// console.log(que.search);
// var querydata = que.query
// console.log(querydata.month);

// const express = require('express');

// var app = express();

// app.get('/',function(req,res){
//     res.send("hello worls");
// })

// var server = app.listen(9090,function(){
//     var host = server.address().address
//     var port = server.address().address
//     console.log("ex",host,port)
// })
var http = require('http');
// // // http.createServer(function (req, res) {
// // //    // res.writeHead(200, {'Content-Type': 'text/plain'});
// // //     res.end('Hello jagan!');
// // //   }).listen(8080);
http.createServer(function (req, res) {
  //  res.writeHead(200,{'content-Type':'test/plain'});
  res.write(req.url)
    res.end('')
    
}).listen(8080);

// var http = require('http');

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   //Return the url part of the request object:
//   res.write(req.url);
//   res.end("hello");
// }).listen(8080);