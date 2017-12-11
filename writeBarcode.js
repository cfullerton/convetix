const bwipjs = require('bwip-js');
const serverless = require('serverless-http');
const express = require('express')
const app = express()

app.get('/write-barcode/', function (req, res) {
      bwipjs(req, res);
})

module.exports.handler = serverless(app);
