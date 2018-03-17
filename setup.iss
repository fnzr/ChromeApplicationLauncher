[Setup]
AppName=Chrome Application Launcher
AppVersion=0.1
OutputDir=./
OutputBaseFilename=ChromeApplicationLauncher
DefaultDirName={localappdata}\fmatos\Chrome Application Launcher
DefaultGroupName=Chrome Application Launcher
UninstallDisplayIcon={app}\ChromeApplicationLauncher.exe

[Files]
Source: "windows\ChromeApplicationLauncher\ChromeApplicationLauncher\bin\Release\*"; DestDir: "{app}"
;Source: "Readme.txt"; DestDir: "{app}"; Flags: isreadme

[Registry]
Root: HKCU; Subkey: "Software\Google\Chrome\NativeMessagingHosts\fmatos.chromeapplicationlauncher"; ValueType: string; ValueData: "{app}\manifest.json"; Flags:uninsdeletekey
Root: HKLM; Subkey: "Software\Google\Chrome\Extensions\ojmdfhaidaemhiinkhhbidmgnmdejcgc"; ValueType: string; ValueName:"update_url"; ValueData: "https://clients2.google.com/service/update2/crx"