const __exampleMove = { // eslint-disable-line no-unused-vars
  pos: new Vector3(0, 0, 0),    // position
  rot: new Vector3(0, 0, 0),    // rotation
  camera: null,                 // GameplayCamera object to use instead of making a new one
  ease: true,                   // lerp or easy terp, herpa derp
  duration: 3000,               // in milliseconds
  effect: null,                 // ScreenEffects
  effectDurationDelta: +1000,   // Extra time for the screen effect
  effectLooped: false,           // loop effect
  pauseDelta: +0,               // Pause time between movements (in case effect needs cooldown time)
  reset: false                  // resets camera (use when done.)
}

let active = false
let nextStep = null
let locked = false

class CamRig {
  constructor (...cameraMoveset) {
    if (Array.isArray(cameraMoveset[0])) {
      cameraMoveset = cameraMoveset[0]
    }

    this.moveset = new Set(cameraMoveset)
  }

  add (move) {
    this.moveset.add(move)
    return this
  }

  defaults (move) {
    return Object.assign(__exampleMove, move)
  }

  async run (currentCamera = null) {
    if (locked) {
      return false
    }

    if (active) {
      return false
    }

    if (currentCamera === null) {
      currentCamera = API.getActiveCamera()
    }

    active = true

    for (let move of this.moveset) {
      const {
        pos,
        rot,
        camera,
        ease,
        duration,
        effect,
        effectDurationDelta,
        effectLooped,
        pauseDelta,
        reset
      } = this.defaults(move)

      API.sendChatMessage('hit')


      // nope!
      let newCam
      if (camera !== null) {
        // did this move provide a camera?
        newCam = camera
      } else {
        // nope! let's make one instead.
        newCam = API.createCamera(pos, rot)
      }

      // Let's lerp!
      API.interpolateCameras(currentCamera, newCam, duration, ease, ease)

      // And do screen effect stuff I guess.
      if (effect !== null) {
        API.playScreenEffect(effect, duration + effectDurationDelta, effectLooped)
      }

      currentCamera = newCam

      // Wait for the world to end, do it again.
      // API.sendChatMessage(`waiting for ${duration}ms with ${pauseDelta}ms added`)
      await this.wait(duration + pauseDelta)

      // Are we resetting?
      if (reset) {
        // API.sendChatMessage('STOP')
        active = false
        API.callNative('_STOP_ALL_SCREEN_EFFECTS')
        return null
      }
    }

    active = false
    return true
  }

  // simple wait timeout.
  wait (duration) {
    return new Promise((resolve, reject) => {
      const time = Date.now() + duration

      // API.sendChatMessage(`currently ${+Date.now()}, waiting for ${time} (${duration})`)

      nextStep = {
        time,
        fn: function () {
          nextStep = null
          resolve(true)
        }
      }
    })
  }
}
  // PRESETS
function presetSimpleSkyZoom (initialCam, endCamera) { // eslint-disable-line no-unused-vars
  const icPos = API.getCameraPosition(initialCam)
  const icRot = API.getCameraRotation(initialCam).Z
  const ecPos = API.getCameraPosition(endCamera)

  const rig = new CamRig(
    {
      pos: new Vector3(icPos.X, icPos.Y, 3000),
      rot: new Vector3(-90, 0, icRot),
      effect: 'SwitchSceneNeutral',
      duration: 7000,
      pauseDelta: +1500
    },
    { pos: new Vector3(ecPos.X, ecPos.Y, 3000),
      rot: new Vector3(-90, 0, icRot),
      effect: 'SwitchSceneNeutral',
      duration: 7000
    },
    {
      camera: endCamera,
      effect: 'CamPushInNeutral',
      pauseDelta: +1500,      
      reset: true
    }
  )

  return rig.run(initialCam)
}

API.onUpdate.connect(() => {
  if (active === false || nextStep === null) {
    return
  }

  if (nextStep.time <= Date.now()) {
    nextStep.fn()
  }
})

API.onResourceStop.connect(() => {
  locked = true
})

function __requireModuleClasses () { // eslint-disable-line no-unused-vars
  return {
    CamRig
  }
}

function camRig () {
  return CamRig
}
