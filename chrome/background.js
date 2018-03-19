const app_name = 'fmatos.chromeapplicationlauncher';

function start(name, tab) {
    chrome.storage.sync.get({launchers: {}}, function (items) {
        let launcher = items.launchers[name];
        let port = chrome.runtime.connectNative(app_name);
        let id = Date.now();
        port.onMessage.addListener(function (msg) {
            chrome.runtime.sendMessage("", {request: "message_received", id: id, message: msg});
        });
        port.onDisconnect.addListener(function () {
            chrome.runtime.sendMessage("", {request: "task_end", id: id});
            console.log("Disconnected");
        });

        let args = "";
        launcher.arguments.forEach(function (arg) {
            args += arg + " ";
        });
        args = args.replace("$url", tab.url);
        port.postMessage({exec: launcher.path, args: args});
        chrome.runtime.sendMessage("", {request: "task_begin", id: id, tab: tab});
    });
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.request === "launch") {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            start(message.launcher, tabs[0]);
        });

    }
});

chrome.browserAction.onClicked.addListener(function (tab, ev) {
    console.log(tab)
    console.log(ev)
    start(tab.url)

});
