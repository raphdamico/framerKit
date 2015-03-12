# Made with Framer
# By Raphael D'Amico 
# @raphdamico 
# raphdamico.com

framerKit = require 'framerKit'
moment = require 'moment'

# Set up constants
screenWidth 	= 375*2
screenHeight 	= 667 * 2
framerKit.defaults.tint = 'rgba(0,0,0,0.75)'
framerKit.defaults.lineTint = 'rgba(200,200,200,0.5)'
framerKit.defaults.itemBackground = 'none'

###############################################################
# 	CALENDAR WIDGET ⤵
###############################################################
FancyMonthWidget = (params)->
	
	# Setup variables
	params = params || {}
	_.defaults params,
		enabled: true
		y: 0
		monthCellWidth: 154
		monthCellHeight: 116
		gutter: 16

	year = 2014
	rows = 4
	cols = 3
	dayCellSize = 20
		
	monthAttributes = []
	@days = []
	@highlightedDayIndex = 0
	
	for month in [0..11]
		baseMoment = moment([year, month, 1])
		monthAttributes.push(
			startDayIndex: parseInt(baseMoment.day()) # 0 is Sunday
			daysInMonth: parseInt(baseMoment.endOf("month").format("D"))
		)
	
	@monthWidget = new Layer
		y: params.y
		width: (cols-1)*params.gutter + cols*params.monthCellWidth
		height: (rows-1)*params.gutter + rows*params.monthCellHeight
		backgroundColor: "none"	
		clip: false
	@monthWidget.centerX()
	@monthWidget.perspective = 100
	
	dayIndex = 0
	monthIndex = 0
	for rowIndex in [0..rows-1]
		for colIndex in [0..cols-1]
		
			monthCellLayer = new Layer
				width:  params.monthCellWidth
				height: params.monthCellHeight
				x: colIndex * (params.monthCellWidth + params.gutter)
				y: rowIndex * (params.monthCellHeight + params.gutter)
				clip: false
				superLayer: @monthWidget
				backgroundColor: "none"
	
			dayCellIndex = 0
			for dayCellRow in [0..4]
				for dayCellCol in [0..6]
					ma =  monthAttributes[monthIndex]
					if (dayCellIndex > ma.startDayIndex) and (dayCellIndex < ma.startDayIndex + ma.daysInMonth)
						dayCell = new Layer
							width: dayCellSize
							height: dayCellSize	
							x: dayCellCol * params.monthCellWidth/7
							y: dayCellRow * params.monthCellHeight/5
							originX: 0
							originY: 0.5
							superLayer: monthCellLayer
							backgroundColor: "rgba(0,255,0,1)"
							saturate: 1
							#borderRadius: 14
							scale: 0.2
						@days.push(dayCell)
						dayCell.hueRotate = dayIndex
						
					dayCellIndex++
					dayIndex++
					
			monthIndex++
	
	@days[0].backgroundColor = "white"
	
	# Zero is the first day of the year
	@highlightDay = (dayToHighlightIndex) ->
		dayToHighlight = @days[dayToHighlightIndex]
		dayToFade = @days[@highlightedDayIndex]
		dayToHighlight.animate
			properties:
				saturate: 100
				scale: 1.54
			curve: "spring(350,35,0)"
		dayToFade.animate
			properties:
				saturate: 0
				scale: 0.2
		@highlightedDayIndex = dayToHighlightIndex

	@highlightRange = (dayToHighlightIndex) ->
		dayToHighlightIndex = Math.min(dayToHighlightIndex, @days.length-1)
		for dayIndex in [@highlightedDayIndex..dayToHighlightIndex]
			@days[dayIndex].animate
				properties:
					saturate: 100
					scaleX: 6
				curve: "spring("+(950-750*dayIndex/dayToHighlightIndex)+",10,0)"
		
		if dayToHighlightIndex < @highlightedDayIndex 
			for dayIndex in [(dayToHighlightIndex+1)..@highlightedDayIndex]
				@days[dayIndex].animateStop()
				@days[dayIndex].animate
					properties:
						saturate: 0
						scaleX: 1
					time: 0.1
				
		@highlightedDayIndex = dayToHighlightIndex
		
	return @
###############################################################
#	End of rainbow calendar module ⤴ 
###############################################################



###############################################################
#	THIS IS WHERE YOU MAKE YOUR STUFF ⤵ 
###############################################################

drumValues = [
	"1 day",
	"2 days",
	"3 days",
	"4 days",
	"5 days",
	"6 days",
	"1 week",
	"2 weeks",
	"3 weeks",
	"4 weeks",
	"5 weeks",
	"6 weeks",
	"7 weeks",
	"8 weeks",
	"9 weeks",
	"10 weeks",
	"11 weeks",
	"12 week",
	"3 months",
	"4 months",
	"5 months",
	"6 months",
	"7 months",
	"8 months",
	"9 months",
	"10 months",
	"11 months",
	"12 months"	
]

pickerY = screenHeight / 1.61803398875
background = new BackgroundLayer
	backgroundColor: 'white'

calendarBackground = new Layer
	width: screenWidth
	height: pickerY
	backgroundColor: "rgba(0,255,0,1)" #'hsla(0,100%,45%,1)'
calendarBackground.brightness = 15
calendarBackground.saturate = 0

fancyMonthWidget = new FancyMonthWidget
	y: 132
	monthCellWidth: 154
	monthCellHeight: 116
	gutter: 26
		
# Picker
datePicker = new framerKit.Picker
	y: pickerY
	defaultText: "How long will this take?"
	drums: [
		{items: drumValues, name: "date", params: {textAlign: "center"}}
	]
datePicker.pickerHeader.style =
	textAlign: 'center'
	padding: '0px'
	marginLeft: '0px'
# Variables to keep track of the picker's speed
# Eventually I'd move these into the picker itself
previousDaysSinceStart = 0
lastTimeThereWasAChange = new Date().getTime()
cumulativeMovesInOneDirection = 0
cumulativeVelocityInOneDirection = 0
pickerDirection = 0
newPickerDirection = 0

elasticZoom = Utils.throttle 1/45, (scale)->
	fancyMonthWidget.monthWidget.animate
		properties:
			scale: 1 + Math.min(0.25, scale) * pickerDirection
		curve: 'spring(200,30,0)'
			
colorAnimation = Utils.throttle 0.1, (dayIndex)->
	calendarBackground.animate
		properties:
			hueRotate: dayIndex
		curve: 'ease-in-out'
		time: 0.2

datePickerDidChange = (lists, layer, e) ->

	# Get the date shown in the picker
	# It always starts on the 1st January 2015
	splitDate = lists["date"].val.split(" ")
	today = moment([2015, 0, 1])
	endTime = moment(today).add(splitDate[0], splitDate[1])
	daysSinceStart = endTime.diff(today, "days")
	dayIndex = endTime.dayOfYear()-1
	
	# Calculate how fast picker is moving
	millisecondsSinceLastChange = new Date().getTime() - lastTimeThereWasAChange
	lastTimeThereWasAChange = new Date().getTime()
	pickerVelocity = 1000 / millisecondsSinceLastChange
	
	# Check direction picker is moving to calculate elastic zoom
	newPickerDirection = if daysSinceStart < previousDaysSinceStart then -1 else 1
	if newPickerDirection == pickerDirection
		cumulativeMovesInOneDirection++
		cumulativeVelocityInOneDirection += (pickerVelocity / Math.pow(cumulativeMovesInOneDirection,1.5))
	else 
		cumulativeMovesInOneDirection = 0
		cumulativeVelocityInOneDirection = 0
	pickerDirection = newPickerDirection
	previousDaysSinceStart = daysSinceStart
	
	date = switch
		when daysSinceStart == 0 then lists["date"].val
		when daysSinceStart < 7 then "By " + endTime.format("dddd")
		when daysSinceStart < 14 then "By next " + endTime.format("dddd")
		when daysSinceStart < 12*7 then "By " + endTime.format("MMMM D, YYYY")
		when daysSinceStart < 366 then "By sometime in " + endTime.format("MMMM, YYYY")
		else "By this time in " + endTime.format("YYYY")

	# Do the elastic zoom
	elasticZoom(cumulativeVelocityInOneDirection/1000)
	colorAnimation(dayIndex)
	
	datePicker.pickerHeader.html = date
	fancyMonthWidget.highlightRange(daysSinceStart)


datePickerStartedMoving = ->
	# Brighten background of calendar area
	calendarBackground.animate
		properties:
			brightness: 20
			saturate: 20
		curve: 'spring(100,20,5)'


datePickerFinishedChanging = (lists, layer) ->
	# Put things back where they were
	fancyMonthWidget.monthWidget.animate
		properties:
			scale: 1
		curve: 'spring(100,20,5)'
	calendarBackground.animate
		properties:
			brightness: 15
			saturate: 0
		curve: 'ease-in-out'
		time: 0.4
	

# Set up event listeners
datePicker.on "PickerStartedMoving", datePickerStartedMoving
datePicker.on "PickerDidChange", datePickerDidChange
datePicker.on "PickerFinishedChanging", datePickerFinishedChanging

# Start list on the 6th item
datePicker.drumsByName["date"].setIndex(5)