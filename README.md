# ChromeApplicationLauncher

This is a simple Chrome extension plus Windows application showcasing the usage of Chrome's NativeMessaging feature.
It doesn't really do anything but act as a middleman. Currently it only supports Windows.

All you have to do is set the path of the executable and arguments, if any. 

Run it yourself:

1) Load C# project

2) Load `chrome` folder as Chrome extension

3) Open `manifest.json` under C# project and update application name and chrome extension ID

4) Open `chrome\background.js` and update `app_name` to the same used above

5) Add the following key to windows registry:

```
Windows Registry Editor Version 5.00
[HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\your.app.name]
@="C:\\path\\to\\manifest.json"
```

6) [optional] To generate the installer with Inno Setup, update the Registry section in `setup.iss` with your application name and chrome extension ID, respectively.
