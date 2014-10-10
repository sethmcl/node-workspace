#!/usr/bin/env node

'use strict';

var minimist      = require('minimist');
var NodeWorkspace = require('../');

new NodeWorkspace(minimist(process.argv.slice(2))).run();

