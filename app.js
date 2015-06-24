'use strict';
var git = require('git-utils');
var repository = git.open('./');

var GIT_STATUS_CURRENT = 0;
var GIT_STATUS_INDEX_NEW        = (1 << 0);
var GIT_STATUS_INDEX_MODIFIED   = (1 << 1);
var GIT_STATUS_INDEX_DELETED    = (1 << 2);
var GIT_STATUS_INDEX_RENAMED    = (1 << 3);
var GIT_STATUS_INDEX_TYPECHANGE = (1 << 4);
var GIT_STATUS_WT_NEW           = (1 << 7);
var GIT_STATUS_WT_MODIFIED      = (1 << 8);
var GIT_STATUS_WT_DELETED       = (1 << 9);
var GIT_STATUS_WT_TYPECHANGE    = (1 << 10);
var GIT_STATUS_WT_RENAMED       = (1 << 11);
var GIT_STATUS_WT_UNREADABLE    = (1 << 12);
var GIT_STATUS_IGNORED          = (1 << 14);
var GIT_STATUS_CONFLICTED       = (1 << 15);
var status = repository.getStatus();


