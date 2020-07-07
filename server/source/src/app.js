"use strict";
exports.__esModule = true;
var express_1 = require("express");
var app = express_1["default"]();
var port = 3000;
app.listen(port, function () {
    console.log('Example app listening');
});
app.get('/', function (request, response) {
    response.send('hello');
});
