# FramerKit
iOS Picker & Table View controls recreated in Framer, for your prototyping pleasure. 

In my day to day as a designer at [Timeful](http://timeful.com), I've been increasingly making modular components to work through complex interactions with a lot of states and dynamic copy. Framer's awesome new Modules seemed like a perfect way to put them out into the world.

Let me know what you think [@raphdamico](http://twitter.com/raphdamico)!


#Demos 
### [Rainbow Calendar (+ moment.js)](http://share.framerjs.com/0gxtic1jlq2r/)
### [Kitchen Sink](http://share.framerjs.com/85gpnmpy4f17/)
### [Kitchen Sink Blue](http://share.framerjs.com/eklfnhxmq4ya/)


# Usage
* Create a new Framer project
* Download `framerKit.coffee` and put it in the `/modules ` folder of your project
* In Framer studio add the following lines to your Framer file:

```
framerKit = require "framerKit"
new framerKit.TableViewRow name: "Cool switch", icon: 'switch'

## Change '750' to the pixel width of whatever device you're working with
framerKit.defaults.screenWidth = 750
```
* You should see a row of a table view with a [switch](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/UIKitUICatalog/UISwitch.html#//apple_ref/doc/uid/TP40012857-UISwitch)! Try clicking it!

Check [Framer docs](http://framerjs.com/docs/#modules) for more info on how to use packages.

# Controls
There are two controls to play with each with a bunch of options.

## Picker

For eack picker, you can
```
yourPicker = new framerKit.Picker 
	x: 0
	y: 0
    width: [defaults to screen width]
	defaultText: [Default text of the picker's header row]
	drums: [an array of drum objects (see below)]
```
Each drum is an object that can have the following options:
```
drumObject = {
	name: "firstDrum" 		 # Set this, it's the easiest way to access the drum 
	enabled: [true/false]	  # if you set 'false', the drum won't be interactable
	xPct: 0  				  # % of width of picker to place the drum
	widthPct: 1				# width of this drum as % of the picker's width
	textAlign: "center"		# left, center, right
	textColor: 				# defaults to overall text tint	
}
```

Notes:

* Pickers fire the following events: `'PickerStartedMoving'` `'PickerDidChange'` `'PickerFinishedChanging'`, which can be used just as you would a normal Framer event, e.g.:
```
yourPicker.on 'PickerDidChange', (drums, layer)->
	## Do some stuff
```
* Get value of the drum by using `yourPicker.drumsByName('firstDrum').val`
* To set the drum to a value, e.g. the 4th item in the drum `yourPicker.drumsByName('firstDrum').setIndex(4)`
* If you want to make a date picker, this pairs very well with a date library like [moment.js](http://momentjs.com/)

## Table view

You can create whole TableViews or just single rows. Both fire a 'DidChange' event when they change.

```
yourTableView = new framerKit.TableView 
	x: 0
	y: 248
    items: ["Eggs", "Bacon", "Beans"] # Any array
    icon: ['switch'|'cross'|'check'|'caret']
    validation: ['none', 'radio']
```

Bonus, there's also a TableViewHeader.
```
yourHeader = new framerKit.TableViewHeader 
	y: 10
	text: 'Header text!'
```


# Questions

Feel free to contact me, Raph D'Amico, on raph-at-gmail-dot-com or @raphdamico on Twitter.
