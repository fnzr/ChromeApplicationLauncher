const app_name = 'fmatos.chromeapplicationlauncher';

function start(url) {    
    chrome.storage.sync.get({path: "", arguments: []}, function(items) {
            var port = chrome.runtime.connectNative(app_name);
            var args = "";
            items.arguments.forEach(function(arg){
                args += arg + " ";
            });
            args = args.replace("$url",url)
        console.log({exec: items.path, args: args});
            port.postMessage({exec: items.path, args: args});
    });
}

chrome.browserAction.onClicked.addListener(function(tab){
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        start(tabs[0].url);
    });    
});
