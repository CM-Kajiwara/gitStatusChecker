'use strict';
/* jshint bitwise:false */
var git = require('git-utils');
var notifier = require('node-notifier');
var exec = require('child_process').exec;
var targetRepositories = require('./targetRepositories.json');
var terminalPath = '/Applications/iTerm.app/Contents/MacOS/iTerm';
var existsWarningRepository = false;
var screenLock = function(callback) {
    var command = '"/System/Library/CoreServices/Menu Extras/User.menu/Contents/Resources/CGSession" -suspend';
    exec(command,function(err){
        var message;
        if(!err){
            message = 'suspent';
        }
        callback(err,message);
    });
};
targetRepositories.forEach(function(targetRepository){
    var repository = git.open(targetRepository);
    var status = repository.getStatus();
    console.log(status);
    if(Object.keys(status).length > 0){
        notifier.notify({
            'title': 'Please check Repository' ,
            'message': 'Target Repository is ' + repository.getPath(),
            'icon':'./material-design-icons/alert/2x_web/ic_error_black_48dp.png',
            'wait': true
        });
        notifier.on('click', function () {
            exec(terminalPath + ' ' + targetRepository);
            process.exit();
        });
    }
    var command = 'export GIT_FORGOT_DIR=' + repository.getPath() + '&& git-forget';
    exec(command,function(err,stdout){
        if(!err && stdout){
            notifier.notify({
                'title': 'This Repository is not pushed!!' ,
                'message': 'Target Repository is ' + repository.getPath(),
                'icon':'./material-design-icons/alert/2x_web/ic_error_black_48dp.png',
                'wait': true
            });
            notifier.on('click', function () {
                exec(terminalPath + ' ' + targetRepository);
                process.exit();
            });
        }
    });
});

if(!existsWarningRepository){
   //screenLock(function(err,message){
   //    console.log(err,message);
   //});
}

var GIT_STATUS ={
    GIT_STATUS_CURRENT          : 0,
    GIT_STATUS_INDEX_NEW        : (1 << 0),
    GIT_STATUS_INDEX_MODIFIED   : (1 << 1),
    GIT_STATUS_INDEX_DELETED    : (1 << 2),
    GIT_STATUS_INDEX_RENAMED    : (1 << 3),
    GIT_STATUS_INDEX_TYPECHANGE : (1 << 4),
    GIT_STATUS_WT_NEW           : (1 << 7),
    GIT_STATUS_WT_MODIFIED      : (1 << 8),
    GIT_STATUS_WT_DELETED       : (1 << 9),
    GIT_STATUS_WT_TYPECHANGE    : (1 << 10),
    GIT_STATUS_WT_RENAMED       : (1 << 11),
    GIT_STATUS_WT_UNREADABLE    : (1 << 12),
    GIT_STATUS_IGNORED          : (1 << 14),
    GIT_STATUS_CONFLICTED       : (1 << 15)
};


