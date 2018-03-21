const app_name = 'fmatos.chromeapplicationlauncher';

function start(name, tab) {
    chrome.storage.sync.get({launchers: {}}, function (items) {
        let launcher = items.launchers[name];
        chrome.storage.sync.set({lastUsed: name});

        chrome.storage.local.get('tasks', function(local){
            let tasks = local.tasks === undefined ? {} : local.tasks;

            let port = chrome.runtime.connectNative(app_name);
            let id = Date.now();
            tasks[id] = {
                id: id,
                last_message: "Task started",
                finished: false,
                title: tab.title,
                url: tab.url
            };

            port.onMessage.addListener(function (msg) {
                tasks[id].last_message = msg.data;
                chrome.storage.local.set({tasks: tasks, last_updated_task: id});
                //chrome.runtime.sendMessage("", {request: "message_received", id: id, message: msg});
            });
            port.onDisconnect.addListener(function () {
                tasks[id].finished = true;
                chrome.storage.local.set({tasks: tasks, last_updated_task: id});
                //chrome.runtime.sendMessage("", {request: "task_end", id: id});
                console.log("Disconnected");
            });

            let args = "";
            launcher.arguments.forEach(function (arg) {
                args += arg + " ";
            });
            args = args.replace("$url", tab.url);
            //console.log({exec: launcher.path, args: args});
            port.postMessage({exec: launcher.path, args: args});

            //chrome.runtime.sendMessage("", {request: "task_begin", id: id, tab: tab});
            chrome.storage.local.set({tasks: tasks, last_updated_task: id});
        });

    });
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.request === "launch") {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            start(message.launcher, tabs[0]);
        });

    }
});

/*
chrome.browserAction.onClicked.addListener(function (tab, ev) {
    console.log(tab)
    console.log(ev)
    start(tab.url)

});
*/
