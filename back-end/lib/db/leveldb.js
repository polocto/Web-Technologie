const level = require('level');
const db = level(__dirname + '/../../db');

module.exports = db;