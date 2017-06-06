# camera rig for GTA Network

dead simple camera rig system for GTA Network

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Installing

1. clone this repo into your server's `resources` folder.

2. add `<resource src="camrig" />` as a resource.

3. done!

(can also be installed standalone in your resource.)

## Using

The API is designed to be dead simple. Only tell it what you need for a specific movement, and it does it.

### Presets

To use a preset, just call it's function, e.g. `exported.camrig.camrig.presetName( GameplayCamera startCamera, GameplayCamera endCamera )`. Replace `presetName` with one of the names below

- **presetSimpleSkyZoom** - Example: https://clips.twitch.tv/SpineyAbstemiousZebraMingLee

- *more soon*

### API

Presets not good enough for you? Well, here's how to script your own!

#### CamRig class

The CamRig class accepts either multiple objects or a single array of objects as an argument. These objects **must** have the below structure. The data you see below is the default values.

```js
{
  // These create a new camera 
  pos: new Vector3(0, 0, 0),    // position
  rot: new Vector3(0, 0, 0),    // rotation

  camera: null,                 // GameplayCamera object to use instead of making a new one.
                                // Setting this will ignore the pos and rot fields.
  
  ease: true,                   // Bezier curve in and out of the movement.
  duration: 3000,               // movement time in milliseconds (3000 = 3 seconds)
  pauseDelta: +0,               // Pause time between movements where no camera movement happens

  // 
  effect: null,                 // Screen effect name, see https://wiki.gtanet.work/index.php?title=Screen_Effects
  effectDurationDelta: +1000,   // Extra time for the screen effect
  effectLooped: false,          // loop effect
  
  reset: false                  // resets screen effects and stops the cycle (useful when done)
}
```

You can add movements at any time using `.add()` with a single movement object, shown above.

To run your camera rig, simply use the `.run()` method on a CamRig instance. This returns a Promise/awaitable value that resolves when the rig is done moving.

##### Full Example

```js
  const rig = new CamRig(
    {
      pos: new Vector3(400, 400, 3000),
      rot: new Vector3(-90, 0, 90),
      effect: 'SwitchSceneNeutral',
      duration: 7000,
      pauseDelta: +1500
    },
    { pos: new Vector3(-600, 400, 3000),
      rot: new Vector3(-90, 0, 90),
      effect: 'SwitchSceneNeutral',
      duration: 7000
    },
    {
      camera: API.getGameplayCamera(),
      effect: 'CamPushInNeutral',
      pauseDelta: +1500,      
      reset: true
    }
  )

  API.sendChatMessage('Rig movement started!')  
  await rig.run()
  API.sendChatMessage('Rig movement finished!')
```

## Support

If you're looking for support, please [join my discord](https://discord.gg/Raj7Vvc) and ask in **#gtan-mods**
