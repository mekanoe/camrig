# require for gta: network

because i require a better way of getting stuff.. and classes.

and they won't let me fix stuff so i did it myself.

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Installing

1. clone this repo into your server's `resources` folder.

2. add `<resource src="require" />` as the ***first*** resource.

3. done!

## Using (for script developers)

**Important Note:** You cannot use this before an onResourceStart event.

You can use require with this long incantation: `exported.require.require.require(moduleName)`

`moduleName` is a string, and can consist of,
 
 - a resource name (see "Using (for module developers)" if this interests you)
 
 - a resource name, followed by any loaded filename inside that resource
   + *example:* `menu-builder/menu-builder`
   + It does *not* matter if the file is at resourceName/libs/something, it is still at `resourceName/something`.

 - any of the above, including of things it returns.
   + caveat being it cannot spit out classes, see "Using (for module developers)"

 - a `@` and any of the above.
   + this turns off caching so you can reload resources without it sticking. 

Simple example using MessageChannel

```js
let MessageChannel

API.onResourceStart.connect(() => {
	MessageChannel = exported.require.require.require('messagechannel')

	MessageChannel.SendRequest('hello world!').then((response) => {
		API.sendNotification(response.args)
	})
})
```

Local module example, with classes intact (local modules skip caching)

```js
let Rect
let helloWorld

API.onResourceStart.connect(() => {
	let UIKit = exported.require.require.require('@/liberty/uikit')

	Rect = UIKit.Rect

	helloWorld = new Rect({ x: 0, y: 0, w: 100, h: 100 })
})
```

## Using (for module developers)

If you don't use classes, you don't have to do anything particularly special. 

require gives two benefits:

- Single file modules can be loaded by only their resource name
  + To exploit this, name your file `index.js` or `<yourResourceName>.js`.

- Classes can be used directly.


### Exporting Classes

Currently, GTA:N's exporter system only exports bare functions, require works around this by using a common function, `__requireModuleClasses`. In the future, if variables can ever be exported but classes cannot, this will instead reside as `module.classes`.

You can return a singular class OR an object of classes. Anything else will be discarded.

Variables might also be exported this way, if you'd like.

```js
function __requireModuleClasses () {
  return {
    YourClass
  }
}
```

## Advanced Usage

See the [wiki](https://github.com/kayteh/require/wiki/Advanced-Usage)