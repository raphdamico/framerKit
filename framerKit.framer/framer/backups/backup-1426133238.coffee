framerKit = require "framerKit"

screenWidth = 640
screenHeight = 1136
framerKit.defaults.screenWidth = screenWidth

scrollContainer = new Layer
	y: 0
	width: screenWidth
	height: screenHeight
	backgroundColor: 'rgba(100,200,40)'
scrollContainer.scrollVertical = true

container = new Layer
	width: screenWidth
	height: 2136
	backgroundColor: '#efefef'
	superLayer: scrollContainer

###
	TABLE VIEWS
###
# Don't forget the new keyword!
fancyButton = new framerKit.TableViewRow 
	y: 80
	name: "Toggle me →"
	icon: 'switch'
fancyButton.superLayer = container
fancyButton.on 'DidChange', (event) ->
	if event.selected == true
		fancyButton.updateLabel('Toggle me →')
	else
		fancyButton.updateLabel('You did it!')

checklistHeader = new framerKit.TableViewHeader text: 'Checklists (check me!)', y: 248-68
breakfastChecklist = new framerKit.TableView 
	y: 248
	items: ["Eggs", "Bacon", "Beans"]
	icon: 'check'
breakfastChecklist.on 'DidChange', (event) ->
	checklistHeader.html = event.numSelected+' items selected'
		
radioHeader = new framerKit.TableViewHeader text: 'Radio buttons (check one of me!)', y: 594-68
radioButtonGroup = new framerKit.TableView 
	y: 594
	items: ["Tall", "Grande", "Venti"]
	icon: 'check'
	validation: 'radio'
radioButtonGroup.on 'DidChange', (event) ->
	radioHeader.html = 'Item '+event.selected+' selected'

# Some headers
toggleDivider = new framerKit.TableViewHeader text: 'Switch', y: 10
simplepickerDivider = new framerKit.TableViewHeader text: 'Simple picker', y: 938-68
lesssimplepickerDivider = new framerKit.TableViewHeader text: 'More complicated picker', y: 1548-68

# PRETTY SIMPLE PICKER
simplePicker = new framerKit.Picker 
	y: 938
	defaultText: "Choose an amazing person:"
	drums: [
		name: "drum"
		items: ['Madam C.J. Walker', 'Fannie Farmer', 'Trieu Thi Trinh', 'Buffalo Calf Road', 'Margaret Nash', 'Gertrude Bell', 'Daphne Du Maurier', 'Elizabeth Woodville', 'Admiral Grace Hopper', 'Edith Kroupa', 'Lucy Gonzales', 'Mother Jones', 'Ching Shih', 'Helen Kemp' , 'Muriel E. Mussels Seyfert', 'Kate Sheppard', 'Emmy Noether', 'Caroline Herschel', 'Rosalind Franklin', 'Henriette Avram', 'Alice Coachman', 'Laura Smith Haviland']
	]

# Set the starting value
simplePicker.drumsByName['drum'].setIndex(4)

# Make it do stuff when it spins
simplePicker.on "PickerDidChange", ->
	simplePicker.pickerHeader.html = 'I choose ' + simplePicker.drumsByName['drum'].val


# MORE COMPLICATED PICKER
timesForMoreComplicatedDrum = ["15 min", "30 min", "45 min", "1 hour", "1:30 hour", "2 hours", "3 hours", "4 hours", "5 hours", "6 hours"]
drumValuesInHours = [0.25,	0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6]

sessionLengthPicker = new framerKit.Picker 
	x: 0
	y: 1548
	defaultText: "Session length"
	drums: [
		{items: timesForMoreComplicatedDrum, name: "leftDrum", params: {widthPct: 0.45, textAlign: "right"}}
		{items: ['-'], name: "divider", params: {xPct: 0.475, widthPct: 0.05, textAlign: "center", enabled: false}}
		{items: timesForMoreComplicatedDrum, name: "rightDrum", params: {widthPclkt: 0.525, textAlign: "left", xPct: 0.55}}
	]
sessionLengthPicker.drumsByName['leftDrum'].setIndex(1)
sessionLengthPicker.drumsByName['rightDrum'].setIndex(3)
sessionLengthPicker.superLayer = container

# Validation to stop you selecting a range where the
# right drum is a smaller value than the left one
sessionLengthPickerDidChange = (drums, layer) ->
	startTime 	= drumValuesInHours[drums["leftDrum"].index]
	endTime 	= drumValuesInHours[drums["rightDrum"].index]
	leftDrum 	= sessionLengthPicker.drumsByName['leftDrum']
	rightDrum	= sessionLengthPicker.drumsByName['rightDrum']
	pickerHeaderText = sessionLengthPicker.pickerHeader.html
	
	if endTime < startTime
		leftDrum.setIndex(drumValuesInHours.indexOf(startTime))

	if startTime > endTime
		rightDrum.setIndex(Math.min(drumValuesInHours.indexOf(startTime)+1, drumValuesInHours.length-1))
		
	if endTime == startTime
		pickerHeaderText = "Session will last " + rightDrum.val
	else 
		pickerHeaderText = "Session will last " + leftDrum.val + " to " + rightDrum.val

sessionLengthPicker.on "PickerFinishedChanging", sessionLengthPickerDidChange



# Housekeeping. This puts 
# everything on the scrolling layer.
checklistHeader.superLayer = container
breakfastChecklist.superLayer = container
radioHeader.superLayer = container
radioButtonGroup.superLayer = container
toggleDivider.superLayer = container
simplePicker.superLayer = container
simplepickerDivider.superLayer = container
lesssimplepickerDivider.superLayer = container

