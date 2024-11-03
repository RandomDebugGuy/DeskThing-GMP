# Deskthing Server NPM

This will be updated later to include how to use this 

```ts
import Deskthing from 'deskthing-server';

Deskthing.on('start', main)

const main = async () => {
    // Setup listeners
    let data = await Deskthing.getData()
    Deskthing.on('data', (newData) => {
        data = newData
    })
}

```


To save settings, you can use the following

```ts
Deskthing.addSetting("auto_switch_view", "Auto Switch View", true, [{label: 'Disabled', value: false}, {label: 'Enabled', value: true}])
```
To access the setting you set, you can do so through 
```ts
const settings = Deskthing.getSettings()
console.log(settings.auto_switch_view.value)
```
or
```ts
const data = Deskthing.getData()
console.log(data.settings.auto_switch_view.value)
```

The settings will update automatically when mutated or changed by the client 


To add a new action, you can use the following
```ts
Deskthing.registerAction('test', 'Test Action', 'The testing action', '')
```
and for keys, you can
```ts
Deskthing.registerKey('Digit5')
```

These will be cleaned up automatically by the server when it purges your app.

Ensure you have a manifest in your build directory!

```json
{
  "id": "thisisyourappid",
  "isAudioSource": false,
  "isWebApp": true,
  "isLocalApp": false,
  "requires": [],
  "label": "Testing App",
  "version": "v0.8.0",
  "description": "This is some description for the app",
  "author": "Riprod",
  "platforms": [
    "windows",
    "macos",
    "linux"
  ],
  "homepage": "",
  "repository": ""
}
```