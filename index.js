'use strict';
var git = require('git-utils');
var notifier = require('node-notifier');
var exec = require('child_process').exec;
var argv = require('argv');
var fs = require('fs');
var path = require('path');
var settingFilePath = __dirname +  '/setting.json';
var setting = require( settingFilePath);
var terminalPath = setting.terminalPath;
var existsWarningRepository = false;
var screenLock = function(callback) {
    var command = '"/System/Library/CoreServices/Menu Extras/User.menu/Contents/Resources/CGSession" -suspend';
    exec(command,function(err){
        var message;
        if(!err){
            message = 'suspend';
        }
        callback(err,message);
    });
};
argv.type('check',function(){
    var targetRepositories = setting.targetRepositories;
    targetRepositories.forEach(function(targetRepository){
        var repository = git.open(targetRepository);
        var status = repository.getStatus();
        if(Object.keys(status).length > 0){
            existsWarningRepository = true;
            notifier.notify({
                'title': 'Please check Repository' ,
                'message': 'Target Repository is ' + repository.getPath(),
                'icon': __dirname + '/node_modules/material-design-icons/alert/2x_web/ic_error_black_48dp.png',
                'wait': true
            });
            notifier.on('click', function () {
                exec(terminalPath + ' ' + targetRepository);
                process.exit();
            });
        }
        var command = 'export GIT_FORGOT_DIR=' + targetRepository + '&& git-forgot';
        exec(command,function(err,stdout){
            existsWarningRepository = true;
            if(!err && stdout){
                notifier.notify({
                    'title': 'This Repository is not pushed!!' ,
                    'message': 'Target Repository is ' + repository.getPath(),
                    'icon': __dirname + '/node_modules/material-design-icons/alert/2x_web/ic_error_black_48dp.png',
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
        screenLock(function(err,message){
            console.log(err,message);
            process.exit();
        });
    }
});

argv.type('setTerminal',function(value){
    if(!value){
        console.log('please set target terminal path');
    }else{
        setting.terminalPath = value;
        fs.writeFile(settingFilePath,JSON.stringify(setting),function(err){
            if(!err){
                process.exit();
            }
        });
    }
});

argv.type('addRepository',function(value){
    if(!setting.targetRepositories) {
        setting.targetRepositories = [];
    }
    if(!value){
        console.log('plese set target repository path');
    }else{
        var absolutePath = path.resolve(value);
        setting.targetRepositories.push(absolutePath);
        fs.writeFile(settingFilePath,JSON.stringify(setting),function(err){
            if(!err){
                console.log(setting.targetRepositories);
                process.exit();
            }
        });
    }
});

argv.type('removeRepository',function(value){
    if(!value){
        console.log('plese set target repository path');
    }else{
        if(setting.targetRepositories) {
            var absolutePath = path.resolve(value);
            var targetRepositories = setting.targetRepositories;
            for(var i=0; i<targetRepositories.length; i++){
                if(targetRepositories[i] === absolutePath){
                    targetRepositories.splice(i--, 1);
                }
            }
            fs.writeFile(settingFilePath,JSON.stringify(setting),function(err){
                if(!err){
                    console.log(targetRepositories);
                    process.exit();
                }
            });
        }
    }
});
argv.option([
    {
        name: 'check',
        short: 'c',
        type: 'check',
        description : 'check add & pull forgot git branch'
    },
    {
        name: 'setTerminal',
        short:'s',
        type:'setTerminal',
        description : 'set terminal path',
        example: '/Applications/iTerm.app/Contents/MacOS/iTerm'
    },
    {
        name: 'addRepository',
        short: 'a',
        type: 'addRepository',
        description : 'add check git branch'
    },{
        name: 'removeRepository',
        short: 'r',
        type: 'removeRepository',
        description : 'remove check git branch'
    }]);
//var GIT_STATUS ={
//    GIT_STATUS_CURRENT          : 0,
//    GIT_STATUS_INDEX_NEW        : (1 << 0),
//    GIT_STATUS_INDEX_MODIFIED   : (1 << 1),
//    GIT_STATUS_INDEX_DELETED    : (1 << 2),
//    GIT_STATUS_INDEX_RENAMED    : (1 << 3),
//    GIT_STATUS_INDEX_TYPECHANGE : (1 << 4),
//    GIT_STATUS_WT_NEW           : (1 << 7),
//    GIT_STATUS_WT_MODIFIED      : (1 << 8),
//    GIT_STATUS_WT_DELETED       : (1 << 9),
//    GIT_STATUS_WT_TYPECHANGE    : (1 << 10),
//    GIT_STATUS_WT_RENAMED       : (1 << 11),
//    GIT_STATUS_WT_UNREADABLE    : (1 << 12),
//    GIT_STATUS_IGNORED          : (1 << 14),
//    GIT_STATUS_CONFLICTED       : (1 << 15)
//};
argv.run();

