###
  FramerKit for Framer
  https://github.com/raphdamico/framerKit

  Copyright (c) 2015, Raph D'Amico http://raphdamico.com (@raphdamico)
  MIT License

  Readme:
  https://github.com/raphdamico/framerKit

  License:
  https://github.com/raphdamico/framerKit/blob/master/LICENSE.md
###




###
	DEFAULT STYLES
	Note the screenwidth constant: this is probably one of the
	first things you want to change so it matches the device
	you're prototyping on.
###
defaults = {
	screenWidth: 750
}

###
	MORE STYLES
###
defaults.tableRowHeight = 88
defaults.tableRowHorizontalPadding = 20
defaults.tint = 'grey'
defaults.lineTint = "rgba(200,200,200,1)"
defaults.itemBackground = 'white'
defaults.listItemTextStyle = {
	fontSize: "32px"
	lineHeight: (defaults.tableRowHeight-4)+"px"		
	fontFamily: "Helvetica Neue"
	fontWeight: "200"
}
defaults.dividerItemTextStyle = {
	fontSize: "22px"
	lineHeight: (defaults.tableRowHeight-4)+"px"		
	fontFamily: "Helvetica Neue"
	fontWeight: "200"
	textTransform: 'uppercase'
}
exports.defaults = defaults


###
	TABLE VIEW ELEMENTS
	(e.g. "Thumb" for the switch control)
###

Switch = (params) ->
	params = params or {}
	_.defaults params, 
		switchTint: '#1DC24B'
		screenWidth: defaults.screenWidth
		tableRowHeight: defaults.tableRowHeight
		switchContainerBorder: 4
		switchContainerHeight: 54
		switchContainerWidth: 94
		borderColor: defaults.lineTint # Grey rounded pill & borders between cells

	@selected = true
	
	# Some of the values are based on other constants,
	# so you have to calculate them in a second pass
	switchButtonRadius = params.switchContainerHeight/2
	shrunkenBackgroundDiameter = 2
	
	# This is our fancy animated switch switch
	# we need to make a rounded rectangle with a circle inside it.
	@switchButtonContainer = new Layer
		x: 					0
		y: 					0
		clip: 				false # Clipping hurts the subtle shadow on the button
		width:				params.switchContainerWidth 
		height:				params.switchContainerHeight
		backgroundColor: 	""
		opacity: 			1

	@switchBackground = new Layer
		x:					switchButtonRadius - shrunkenBackgroundDiameter/2
		y:					switchButtonRadius - shrunkenBackgroundDiameter/2 - 4
		width: 				params.switchContainerWidth - params.switchContainerHeight + shrunkenBackgroundDiameter
		height: 			params.switchContainerHeight - params.switchContainerHeight + shrunkenBackgroundDiameter
		borderRadius: 		params.switchContainerHeight
		shadowSpread:		switchButtonRadius - shrunkenBackgroundDiameter/2 + params.switchContainerBorder
		shadowColor: 		params.switchTint
		backgroundColor: 	''
		opacity: 			1
		superLayer: 		@switchButtonContainer
		
	@switchButton = new Layer
		x: params.switchContainerWidth - params.switchContainerHeight
		y: -4
		width:				switchButtonRadius*2
		height:				switchButtonRadius*2
		borderRadius: 		switchButtonRadius
		shadowY:			3
		shadowBlur: 		5
		shadowColor: 		'rgba(0,0,0,0.3)'
		backgroundColor: 	"white"
		opacity: 			1
		superLayer: 		@switchButtonContainer
	
	# SET UP ANIMATIONS
	@switchBackground.states.add
		deselected: 
			x: 				0
			y: 				-4
			width:			params.switchContainerWidth
			height:			params.switchContainerHeight
			shadowSpread: 	params.switchContainerBorder
			saturate: 		0
			brightness: 	153
			backgroundColor: ""
	@switchBackground.states.animationOptions =
		curve: "ease-in-out"
		time: 0.3 
	@switchBackground.on Events.AnimationEnd, =>
		Utils.delay 0, =>
	 		if @selected
 				@switchBackground.backgroundColor = params.switchTint

	@switchBackground.on Events.AnimationStart, =>
		@switchBackground.backgroundColor = ''

	@switchButton.states.add
		deselected: {x: 0}
	@switchButton.states.animationOptions =
		curve: "spring(400,25,0)"
		
	@switchButtonContainer.select = =>
		@selected = true
		@switchBackground.states.switch("default")
		@switchButton.states.switch("default")
		
	@switchButtonContainer.deselect = =>
		@selected = false
		@switchBackground.states.switch("deselected")
		@switchButton.states.switch("deselected")

	if @selected == false
		@switchBackground.states.switchInstant("deselected")
		@switchButton.states.switchInstant("deselected")
	else
		@switchBackground.backgroundColor = params.switchTint

	return @switchButtonContainer
	
Cross = ->
	color = defaults.tint
	crossThickness = 4
	cross = new Layer
		width: 30	
		height: 30	
		backgroundColor: 'none'
	crossUpstroke = new Layer
		height: crossThickness
		width: 20
		backgroundColor: color
		originX: 1
		superLayer: cross
	crossUpstroke.y = 14
	crossUpstroke.rotationZ = 45
	crossDownstroke = new Layer
		height: crossThickness
		width: 20
		originX: 1
		backgroundColor: color
		superLayer: cross
	crossDownstroke.rotationZ = -45
	cross.select = ->
		cross.animate
			properties:
				opacity: 1
				scale: 1
			curve: 'spring(400,15,0)'
	cross.deselect = ->
		cross.animate
			properties:
				opacity: 0
				scale: 0.4
			curve: 'spring(400,15,0)'		
	return cross
	
Caret = ->
	color = defaults.tint
	caretThickness = 4
	caret = new Layer
		width: 30
		height: 30
		backgroundColor: 'none'		
	caretUpstroke = new Layer
		height: caretThickness
		width: 18
		backgroundColor: color
		originX: 1
		superLayer: caret
	caretUpstroke.y = 14
	caretUpstroke.rotationZ = 45
	caretDownstroke = new Layer
		height: caretThickness
		width: 18
		originX: 1
		backgroundColor: color
		superLayer: caret
	caretDownstroke.y = 12		
	caretDownstroke.rotationZ = -45
	caret.select = ->
		caret.animate
			properties:
				opacity: 1
				scale: 1
			curve: 'spring(400,15,0)'
	caret.deselect = ->
		caret.animate
			properties:
				opacity: 0
				scale: 0.4
			curve: 'spring(400,15,0)'	
	return caret
	
Check = ->
	color = defaults.tint
	checkThickness = 4
	check = new Layer
		width: 30
		height: 30
		backgroundColor: 'none'
	checkUpstroke = new Layer
		height: checkThickness
		width: 13
		backgroundColor: color
		originX: 1
		superLayer: check
	checkUpstroke.y = 16
	checkUpstroke.rotationZ = 45
	checkDownstroke = new Layer
		height: checkThickness
		width: 22
		originX: 1
		backgroundColor: color
		superLayer: check	
	checkDownstroke.x = 4
	checkDownstroke.rotationZ = -45
	check.select = ->
		check.animate
			properties:
				opacity: 1
				scale: 1
			curve: 'spring(400,15,0)'
	check.deselect = ->
		check.animate
			properties:
				opacity: 0
				scale: 0.4
			curve: 'spring(400,15,0)'
	return check


###
	TABLE VIEW
	
	--------------------------------------
	TableViewRow		[Elements go here]
	--------------------------------------

###

exports.TableViewRow = (params) ->
	
	# The tricky thing about reusable components is remembering
	# how to use them (particularly if they have lots of customizable
	# parameters). Setting sensible defaults makes it way easier to get
	# started (and remember how to use the thing you made)
	_.defaults params, 
		name: 'Give me a name!'
		x: 0
		y: 0
		enabled: true
		selected: true
		icon: 'check'
		textColor: defaults.tint
		switchTint: 'green'
		firstItemInList: true # could be first or last
		lastItemInList: true # could be first or last
		
		# Constants
		screenWidth: defaults.screenWidth
		tableRowHorizontalPadding: defaults.tableRowHorizontalPadding
		tableRowHeight: defaults.tableRowHeight
		borderColor: defaults.lineTint # Grey rounded pill & borders between cells

	# Some of the values are based on other constants,
	# so you have to calculate them in a second pass
	switchButtonRadius = params.switchContainerHeight/2
	shrunkenBackgroundDiameter = 2
		
	# This is the root object for this entire component.
	# We will attach all our functions directly to this layer
	@listItemContainer = new Layer
		x: params.x
		y: params.y
		width: 	defaults.screenWidth
		height: defaults.tableRowHeight
		clip: false
		backgroundColor: defaults.itemBackground
	@listItemContainer.style = 
		borderTop: 		if params.firstItemInList then "1px solid " + params.borderColor else ""
		borderBottom: 	if params.lastItemInList then "1px solid " + params.borderColor else ""

	# These will be accessed using functions
	@enabled = params.enabled
	@selected = params.selected
	
	@listItem = new Layer 
		x: params.tableRowHorizontalPadding
		width: 	defaults.screenWidth
		height: defaults.tableRowHeight
		superLayer: @listItemContainer
		backgroundColor: 'none'	
	@listItem.style = defaults.listItemTextStyle
	@listItem.style =
		color: params.textColor
		borderTop: 	if params.firstItemInList then "" else "1px solid " + params.borderColor

	# This is where the label of the list item lives
	@listItem.html = params.name 

	# Add the checkmark for the list
	thingToSwitch = switch
		when params.icon == 'check' then new Check()
		when params.icon == 'cross' then new Cross()
		when params.icon == 'caret' then new Caret()
		when params.icon == 'switch' then new Switch()

	thingToSwitch.superLayer = @listItemContainer
	thingToSwitch.x = defaults.screenWidth - thingToSwitch.width - defaults.tableRowHorizontalPadding
	thingToSwitch.centerY(2)
# 	thingToSwitch.y = -defaults.tableRowHeight/2 - thingToSwitch.height/2
	
	# MAKE IT ALL INTERACTIVE
	# On a click, go to the next state
	if params.icon == 'switch'
		thingToSwitch.on Events.Click, =>
			@listItemContainer.switch()
	else 
		@listItem.on Events.Click, =>
			@listItemContainer.switch()

	@listItemContainer.switch = =>
		if @selected then @listItemContainer.deselect() else @listItemContainer.select()
		
	@listItemContainer.select = (options) =>
		options = options || {supressEvents: false}
		if @enabled 
			thingToSwitch.select()
			@selected = true
		if options.supressEvents == false
			@listItemContainer.emit "DidChange", { selected: @selected }

	@listItemContainer.deselect = (options) =>
		options = options || {supressEvents: false}
		if @enabled 
			thingToSwitch.deselect()		
			@selected = false
		if options.supressEvents == false
			@listItemContainer.emit "DidChange", { selected: @selected }

	@listItemContainer.updateLabel = (newText) =>
		@listItem.html = newText
			
	@listItemContainer.updateLabel(params.name)

	return @listItemContainer

exports.TableView = (params) ->
	params = params or {}
	_.defaults params,
		y: 		0
		width:	defaults.screenWidth
		items: ["It's just me!"]
		icon: 'check'
		validation: 'none'
	
	@buttonGroupContainer = new Layer
		x: 		0
		y:		params.y
		width: 	params.width
		height: defaults.tableRowHeight * params.items.length
		backgroundColor: 	"none"
					
	@buttonArray = []
	for buttonName, i in params.items
		firstItemInList = if i == 0 then true else false
		lastItemInList = if i == (params.items.length-1) then true else false
		newButton = new exports.TableViewRow({
			x: 0, 
			y: i*defaults.tableRowHeight, 
			name: buttonName, 
			icon: params.icon,
			firstItemInList: firstItemInList,
			lastItemInList: lastItemInList
		})
		@buttonArray.push(newButton)
		newButton.superLayer = @buttonGroupContainer

	attachRadioButtonValidation = (buttonArray) =>
		for buttonClicked, indexOfButtonClicked in buttonArray
			buttonClicked.deselect({supressEvents: true, instant: true})
			# Creates a closure to save the index of the button we're dealing with
			do (buttonClicked, indexOfButtonClicked) -> 
				# Listen for events and change other buttons in response
				buttonClicked.on 'DidChange', (event) =>
					for otherButton, otherButtonIndex in buttonArray
						if otherButtonIndex != indexOfButtonClicked
							# Do stuff to the other buttons
							otherButton.deselect({suppressEvents: true})

	if params.validation == 'radio'
		attachRadioButtonValidation(@buttonArray)
		
	return @buttonGroupContainer



###
	TABLE VIEW HEADER
	In iOS, this is typically attached to the table view, 
	but it's independent here so you can put it wherever you want.
###

exports.TableViewHeader = (params) ->
	params = params || {}
	_.defaults params,
		text: 'I am a divider'
		x: 0
		y: 0
	listDivider = new Layer
		x: params.x + defaults.tableRowHorizontalPadding
		y: params.y
		width: defaults.screenWidth
		backgroundColor: 'none'
	listDivider.html = params.text
	listDivider.style = defaults.dividerItemTextStyle
	listDivider.style = 
		color: defaults.tint
	return listDivider



###
	PICKER
	In iOS, this is typically attached to the table view, 
	but it's independent here so you can put it wherever you want.
###


## Utility functions

quantize = (input, stepSize) ->
	return Math.floor(input/stepSize) * stepSize


## The items in the picker

Drum = (parentDrumLayer, listName, listItems, params) ->
	
	# Setup variables
	@parentDrumLayer = parentDrumLayer
	params = params || {}
	_.defaults params,
		enabled: true
		xPct: 0  				# 0 to 1
		widthPct: 1				# 0 to 1
		textAlign: "center"		# left, center, right
		textPadding: "0"
		textColor: defaults.tint
	
	# Values derived from params
	drumContainerHeight = defaults.tableRowHeight*5

	# Set up content of list 		
	listItems = listItems
	@name = listName
	@index = 0
	@val = listItems[@index]
	
	intervalToupdateDrumAppearance = 0
	
	# Calculate height and vertical bounds of the list
	listMinYPos 	= -defaults.tableRowHeight/2
	listMaxYPos 	= -listItems.length*defaults.tableRowHeight+defaults.tableRowHeight/2
	listHeight 		= listItems.length*defaults.tableRowHeight + drumContainerHeight

	@drumContainer = new Layer
		x: 					params.xPct * defaults.screenWidth
		y: 					0
		width: 				params.widthPct * defaults.screenWidth
		height: 			drumContainerHeight
		backgroundColor: 	"none"
		superLayer: 		parentDrumLayer
	
	listLayer = new Layer
		x: 					0
		y: 					-defaults.tableRowHeight/2
		width: 				params.widthPct * defaults.screenWidth
		height: 			listHeight
		superLayer: 		@drumContainer
		backgroundColor: 	"none"
	
	# listLayer.scroll = true
	listLayer.draggable.enabled = params.enabled
	listLayer.draggable.speedX = 0
	
	for li, i in listItems
		listItemLayer = new Layer
			x: 				0
			y: 				i * defaults.tableRowHeight + drumContainerHeight/2
			width: 			params.widthPct * defaults.screenWidth
			height: 		defaults.tableRowHeight
			superLayer: 	listLayer
			backgroundColor: "none"#Utils.randomColor()
		listItemLayer.html = li
		listItemLayer.style =
			color: 			params.textColor
			fontFamily: 	"Helvetica Neue"
			fontWeight: 	"200"
			fontSize: 		"42px"
			lineHeight: 	defaults.tableRowHeight+"px"
			textAlign: 		params.textAlign
			padding: 		params.textPadding

		listItemLayer.startY = i * defaults.tableRowHeight + drumContainerHeight/2

	listLayer.on Events.DragMove, =>
		updateDrumAppearance()
		
	# To simulate iOS momentum scrolling (which causes the drum to keep spinning 
	# after your finger lifts off it), we trigger an animation the moment you lift
	# your finger. The intensity of this animation is proportional to the speed when
	# of the dragging when your finger was lifted.
	listLayer.on Events.DragEnd, (e, f) =>
	
		# This calculates the animation
		scrollVelocity = listLayer.draggable.calculateVelocity().y
		timeAfterDrag = (0.5+Math.abs(scrollVelocity*0.2)).toFixed(1)
		finalPositionAfterMomentum = quantize(listLayer.y + scrollVelocity*400, defaults.tableRowHeight) + defaults.tableRowHeight/2
		
		# At the top and bottom, the momentum should be adjusted so the 
		# first and last values on the drum don't go too far out of view
		distanceToTravel = finalPositionAfterMomentum - listLayer.y
		listHeightWithoutEndBuffer = -listItems.length*defaults.tableRowHeight
		bottomOverflow = Math.max(0, listHeightWithoutEndBuffer-finalPositionAfterMomentum )
		topOverflow = Math.max(0, finalPositionAfterMomentum )
		overflowDampening = 10
		
		if bottomOverflow > 0
			finalPositionAfterMomentum = listHeightWithoutEndBuffer - (bottomOverflow / overflowDampening)
			newDistanceToTravel = finalPositionAfterMomentum - listLayer.y
			timeAfterDrag = timeAfterDrag * (newDistanceToTravel/distanceToTravel)

		if topOverflow > 0
			finalPositionAfterMomentum = 40 + (topOverflow / overflowDampening)
			newDistanceToTravel = finalPositionAfterMomentum - listLayer.y
			timeAfterDrag = timeAfterDrag * (newDistanceToTravel/distanceToTravel)

		# Trigger the animation, and schedule an event that will
		# trigger when the drum finally stops spinning.
		listLayer.animate({
				properties: {y: finalPositionAfterMomentum}
				time: timeAfterDrag
				curve: "ease-out"
			})
		Utils.delay timeAfterDrag, ->
			stopDrum()

	# This ensures that during the animation of the list layer, the drum's appearance continues
	# to be updated. Because multiple animations could overlap, we ensure that every new animation
	# ends the interval and starts a new one so that we never have more than one running 
	listLayer.on Events.AnimationStart, ->
		clearInterval(intervalToupdateDrumAppearance)
		intervalToupdateDrumAppearance = Utils.interval 1/30, updateDrumAppearance    

	listLayer.on Events.AnimationEnd, =>		
		clearInterval(intervalToupdateDrumAppearance)

		# Emit after all movement ends in the list
		@drumContainer.emit("DrumFinishedChanging", {list: listName, index: @index, value: @val})

	updateDrumAppearance = =>
		itemsInDrum = 4
		listPosition = listLayer.y / -defaults.tableRowHeight - 0.5
		cappedListPosition = Math.max(0, Math.min(listLayer.y / -defaults.tableRowHeight - 0.5, listItems.length - 1))
		focusItem = Math.round(cappedListPosition)
		distanceFromMiddle = Math.abs(focusItem - cappedListPosition)
		for i in [(focusItem-itemsInDrum)..(focusItem+itemsInDrum)]
			if i >= 0 and i < listItems.length
				listLayer.subLayers[i].opacity = 1 - Math.abs(listPosition - i)/5 - (if (i != focusItem) then 0.3 else 0)
				listLayer.subLayers[i].scaleY = 1 - Math.min(1, Math.abs(listPosition - i)/4)
				listLayer.subLayers[i].y = listLayer.subLayers[i].startY - (i-listPosition)*Math.abs(i-listPosition)*10

		# Update the value of the drum only when a new value is reached
		if (@index != focusItem)
			updateDrumValues(focusItem)
		
	stopDrum = =>		
		# Ensure the drum never ends out of bounds
		if listLayer.y > listMinYPos 
			listLayer.animate({
		    	properties: {y:listMinYPos}
		    	curve: "spring(400,50,0)"
			})
		if listLayer.y < listMaxYPos
			listLayer.animate({
				properties: {y: listMaxYPos}
				curve: "spring(400,50,0)"
			})
	
	# Update the values of the drums and invoke the callback 
	updateDrumValues = (newIndex) =>
		@index = newIndex
		@val = listItems[@index]
		@drumContainer.emit("DrumDidChange", {list: listName, index: @index, value: @val})
	
	# Render for the first time		
	updateDrumAppearance()
	
	@setIndex = (index) =>
		yPositionForThisIndex = -defaults.tableRowHeight/2 - (index * defaults.tableRowHeight)
		listLayer.animate({
				properties: {y: yPositionForThisIndex}
				time: 0.5
				curve: "ease-out"
			})

	@setValue = (val) =>
		index = listItems.indexOf(val)
		if index != -1
			@setIndex(index)

	# Return the drum object so we can access its values
	return @


###
	PICKER
	This contains the picker 
### 
exports.Picker = (params) ->
	
	params = params || {}
	_.defaults params,
		x: 		0
		y: 		0
		width:	defaults.screenWidth
		defaultText: ""
		textColor: defaults.tint

	drumContainerHeight = defaults.tableRowHeight*5

	@pickerContainer = new Layer
		x: 		params.x
		y:		params.y
		width: 	params.width
		height: drumContainerHeight+88
		backgroundColor: 	defaults.itemBackground
			
	@drum = new Layer
		x: 		0
		y: 		88
		width: 	params.width
		height: drumContainerHeight
		backgroundColor: "none"
		superLayer: @pickerContainer		
		
	@selectedItem = new Layer
		x: 		0
		y: 		drumContainerHeight/2 - defaults.tableRowHeight/2
		width: 	params.width
		height: defaults.tableRowHeight
		backgroundColor: "none"
		superLayer: @drum

	@pickerContainer.pickerHeader = new Layer
		x: 		0
		y: 		0
		width: 	params.width
		height:	88
		backgroundColor: defaults.itemBackground
		superLayer: @pickerContainer
		
	# Styles
	@drum.style =
		pointerEvents: "none"
		borderTop: "1px solid " + defaults.lineTint
		borderBottom: "1px solid " + defaults.lineTint
	
	@selectedItem.style =
		pointerEvents: "none"
		borderTop: "1px solid rgba(0,0,0,0.3)"
		borderBottom: "1px solid rgba(0,0,0,0.3)"
		
	@pickerContainer.pickerHeader.style = defaults.listItemTextStyle
	@pickerContainer.pickerHeader.style = 
		color: params.textColor
		paddingLeft: "20px"
		borderTop: "1px solid " + defaults.lineTint
			
	@pickerContainer.pickerHeader.html = params.defaultText
		
		
	# Add drums
	@pickerContainer.drums = []
	@pickerContainer.drumsByName = {}
	
	pickerDidChange = ()=>
		drumValues = {}
		newValues = for drum in @pickerContainer.drums
			drumValues[drum.name] = {index: drum.index, val: drum.val}

		@pickerContainer.emit("PickerDidChange", drumValues )
	
	pickerFinishedChanging = ()=>
		drumValues = {}
		newValues = for drum in @pickerContainer.drums
			drumValues[drum.name] = {index: drum.index, val: drum.val}

		@pickerContainer.emit("PickerFinishedChanging", drumValues )	
	if (params.drums and params.drums.length > 0)
		for drum in params.drums
			newDrum = new Drum(@drum, drum.name, drum.items, drum.params)

			## Store drums inside the picker
			@pickerContainer.drums.push(newDrum)
			@pickerContainer.drumsByName[drum.name] = newDrum 

			## Ensure that changes to the drum bubble up to the picker
			newDrum.drumContainer.on "DrumDidChange", pickerDidChange
			
			## Emit an event when drums stop moving altogether
			newDrum.drumContainer.on "DrumFinishedChanging", pickerFinishedChanging

	return @pickerContainer




