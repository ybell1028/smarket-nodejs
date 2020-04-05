var util = require("../middleware/util");
var express = require('express');
const {check, validationResult} = require('express-validator');

exports.parseError = function (err) {
    var parsed = [
        {
            msg: err.message,
            data: err.stack,
        }
    ];
    if (err.name == 'ValidationError') {
        return err.errors;
    }
    if (err.name == 'TypeError'){
        return parsed;
    }
     else {
        parsed.unhandled = err;
    }
    return parsed;
};