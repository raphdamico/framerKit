require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"framerKit":[function(require,module,exports){

/*
  FramerKit for Framer
  https://github.com/raphdamico/framerKit

  Copyright (c) 2015, Raph D'Amico http://raphdamico.com (@raphdamico)
  MIT License

  Readme:
  https://github.com/raphdamico/framerKit

  License:
  https://github.com/raphdamico/framerKit/blob/master/LICENSE.md
 */

/*
	DEFAULT STYLES
	Note the screenwidth constant: this is probably one of the
	first things you want to change so it matches the device
	you're prototyping on.
 */
var Caret, Check, Cross, Drum, Switch, defaults, quantize;

defaults = {
  screenWidth: 750
};


/*
	MORE STYLES
 */

defaults.tableRowHeight = 88;

defaults.tableRowHorizontalPadding = 20;

defaults.tint = 'grey';

defaults.lineTint = "rgba(200,200,200,1)";

defaults.itemBackground = 'white';

defaults.listItemTextStyle = {
  fontSize: "32px",
  lineHeight: (defaults.tableRowHeight - 4) + "px",
  fontFamily: "Helvetica Neue",
  fontWeight: "200"
};

defaults.dividerItemTextStyle = {
  fontSize: "22px",
  lineHeight: (defaults.tableRowHeight - 4) + "px",
  fontFamily: "Helvetica Neue",
  fontWeight: "200",
  textTransform: 'uppercase'
};

exports.defaults = defaults;


/*
	TABLE VIEW ELEMENTS
	(e.g. "Thumb" for the switch control)
 */

Switch = function(params) {
  var shrunkenBackgroundDiameter, switchButtonRadius;
  params = params || {};
  _.defaults(params, {
    switchTint: '#1DC24B',
    screenWidth: defaults.screenWidth,
    tableRowHeight: defaults.tableRowHeight,
    switchContainerBorder: 4,
    switchContainerHeight: 54,
    switchContainerWidth: 94,
    borderColor: defaults.lineTint
  });
  this.selected = true;
  switchButtonRadius = params.switchContainerHeight / 2;
  shrunkenBackgroundDiameter = 2;
  this.switchButtonContainer = new Layer({
    x: 0,
    y: 0,
    clip: false,
    width: params.switchContainerWidth,
    height: params.switchContainerHeight,
    backgroundColor: "",
    opacity: 1
  });
  this.switchBackground = new Layer({
    x: switchButtonRadius - shrunkenBackgroundDiameter / 2,
    y: switchButtonRadius - shrunkenBackgroundDiameter / 2 - 4,
    width: params.switchContainerWidth - params.switchContainerHeight + shrunkenBackgroundDiameter,
    height: params.switchContainerHeight - params.switchContainerHeight + shrunkenBackgroundDiameter,
    borderRadius: params.switchContainerHeight,
    shadowSpread: switchButtonRadius - shrunkenBackgroundDiameter / 2 + params.switchContainerBorder,
    shadowColor: params.switchTint,
    backgroundColor: '',
    opacity: 1,
    superLayer: this.switchButtonContainer
  });
  this.switchButton = new Layer({
    x: params.switchContainerWidth - params.switchContainerHeight,
    y: -4,
    width: switchButtonRadius * 2,
    height: switchButtonRadius * 2,
    borderRadius: switchButtonRadius,
    shadowY: 3,
    shadowBlur: 5,
    shadowColor: 'rgba(0,0,0,0.3)',
    backgroundColor: "white",
    opacity: 1,
    superLayer: this.switchButtonContainer
  });
  this.switchBackground.states.add({
    deselected: {
      x: 0,
      y: -4,
      width: params.switchContainerWidth,
      height: params.switchContainerHeight,
      shadowSpread: params.switchContainerBorder,
      saturate: 0,
      brightness: 153,
      backgroundColor: ""
    }
  });
  this.switchBackground.states.animationOptions = {
    curve: "ease-in-out",
    time: 0.3
  };
  this.switchBackground.on(Events.AnimationEnd, (function(_this) {
    return function() {
      return Utils.delay(0, function() {
        if (_this.selected) {
          return _this.switchBackground.backgroundColor = params.switchTint;
        }
      });
    };
  })(this));
  this.switchBackground.on(Events.AnimationStart, (function(_this) {
    return function() {
      return _this.switchBackground.backgroundColor = '';
    };
  })(this));
  this.switchButton.states.add({
    deselected: {
      x: 0
    }
  });
  this.switchButton.states.animationOptions = {
    curve: "spring(400,25,0)"
  };
  this.switchButtonContainer.select = (function(_this) {
    return function() {
      _this.selected = true;
      _this.switchBackground.states["switch"]("default");
      return _this.switchButton.states["switch"]("default");
    };
  })(this);
  this.switchButtonContainer.deselect = (function(_this) {
    return function() {
      _this.selected = false;
      _this.switchBackground.states["switch"]("deselected");
      return _this.switchButton.states["switch"]("deselected");
    };
  })(this);
  if (this.selected === false) {
    this.switchBackground.states.switchInstant("deselected");
    this.switchButton.states.switchInstant("deselected");
  } else {
    this.switchBackground.backgroundColor = params.switchTint;
  }
  return this.switchButtonContainer;
};

Cross = function() {
  var color, cross, crossDownstroke, crossThickness, crossUpstroke;
  color = defaults.tint;
  crossThickness = 4;
  cross = new Layer({
    width: 30,
    height: 30,
    backgroundColor: 'none'
  });
  crossUpstroke = new Layer({
    height: crossThickness,
    width: 20,
    backgroundColor: color,
    originX: 1,
    superLayer: cross
  });
  crossUpstroke.y = 14;
  crossUpstroke.rotationZ = 45;
  crossDownstroke = new Layer({
    height: crossThickness,
    width: 20,
    originX: 1,
    backgroundColor: color,
    superLayer: cross
  });
  crossDownstroke.rotationZ = -45;
  cross.select = function() {
    return cross.animate({
      properties: {
        opacity: 1,
        scale: 1
      },
      curve: 'spring(400,15,0)'
    });
  };
  cross.deselect = function() {
    return cross.animate({
      properties: {
        opacity: 0,
        scale: 0.4
      },
      curve: 'spring(400,15,0)'
    });
  };
  return cross;
};

Caret = function() {
  var caret, caretDownstroke, caretThickness, caretUpstroke, color;
  color = defaults.tint;
  caretThickness = 4;
  caret = new Layer({
    width: 30,
    height: 30,
    backgroundColor: 'none'
  });
  caretUpstroke = new Layer({
    height: caretThickness,
    width: 18,
    backgroundColor: color,
    originX: 1,
    superLayer: caret
  });
  caretUpstroke.y = 14;
  caretUpstroke.rotationZ = 45;
  caretDownstroke = new Layer({
    height: caretThickness,
    width: 18,
    originX: 1,
    backgroundColor: color,
    superLayer: caret
  });
  caretDownstroke.y = 12;
  caretDownstroke.rotationZ = -45;
  caret.select = function() {
    return caret.animate({
      properties: {
        opacity: 1,
        scale: 1
      },
      curve: 'spring(400,15,0)'
    });
  };
  caret.deselect = function() {
    return caret.animate({
      properties: {
        opacity: 0,
        scale: 0.4
      },
      curve: 'spring(400,15,0)'
    });
  };
  return caret;
};

Check = function() {
  var check, checkDownstroke, checkThickness, checkUpstroke, color;
  color = defaults.tint;
  checkThickness = 4;
  check = new Layer({
    width: 30,
    height: 30,
    backgroundColor: 'none'
  });
  checkUpstroke = new Layer({
    height: checkThickness,
    width: 13,
    backgroundColor: color,
    originX: 1,
    superLayer: check
  });
  checkUpstroke.y = 16;
  checkUpstroke.rotationZ = 45;
  checkDownstroke = new Layer({
    height: checkThickness,
    width: 22,
    originX: 1,
    backgroundColor: color,
    superLayer: check
  });
  checkDownstroke.x = 4;
  checkDownstroke.rotationZ = -45;
  check.select = function() {
    return check.animate({
      properties: {
        opacity: 1,
        scale: 1
      },
      curve: 'spring(400,15,0)'
    });
  };
  check.deselect = function() {
    return check.animate({
      properties: {
        opacity: 0,
        scale: 0.4
      },
      curve: 'spring(400,15,0)'
    });
  };
  return check;
};


/*
	TABLE VIEW
	
	--------------------------------------
	TableViewRow		[Elements go here]
	--------------------------------------
 */

exports.TableViewRow = function(params) {
  var shrunkenBackgroundDiameter, switchButtonRadius, thingToSwitch;
  _.defaults(params, {
    name: 'Give me a name!',
    x: 0,
    y: 0,
    enabled: true,
    selected: true,
    icon: 'check',
    textColor: defaults.tint,
    switchTint: 'green',
    firstItemInList: true,
    lastItemInList: true,
    screenWidth: defaults.screenWidth,
    tableRowHorizontalPadding: defaults.tableRowHorizontalPadding,
    tableRowHeight: defaults.tableRowHeight,
    borderColor: defaults.lineTint
  });
  switchButtonRadius = params.switchContainerHeight / 2;
  shrunkenBackgroundDiameter = 2;
  this.listItemContainer = new Layer({
    x: params.x,
    y: params.y,
    width: defaults.screenWidth,
    height: defaults.tableRowHeight,
    clip: false,
    backgroundColor: defaults.itemBackground
  });
  this.listItemContainer.style = {
    borderTop: params.firstItemInList ? "1px solid " + params.borderColor : "",
    borderBottom: params.lastItemInList ? "1px solid " + params.borderColor : ""
  };
  this.enabled = params.enabled;
  this.selected = params.selected;
  this.listItem = new Layer({
    x: params.tableRowHorizontalPadding,
    width: defaults.screenWidth,
    height: defaults.tableRowHeight,
    superLayer: this.listItemContainer,
    backgroundColor: 'none'
  });
  this.listItem.style = defaults.listItemTextStyle;
  this.listItem.style = {
    color: params.textColor,
    borderTop: params.firstItemInList ? "" : "1px solid " + params.borderColor
  };
  this.listItem.html = params.name;
  thingToSwitch = (function() {
    switch (false) {
      case params.icon !== 'check':
        return new Check();
      case params.icon !== 'cross':
        return new Cross();
      case params.icon !== 'caret':
        return new Caret();
      case params.icon !== 'switch':
        return new Switch();
    }
  })();
  thingToSwitch.superLayer = this.listItemContainer;
  thingToSwitch.x = defaults.screenWidth - thingToSwitch.width - defaults.tableRowHorizontalPadding;
  thingToSwitch.centerY(2);
  if (params.icon === 'switch') {
    thingToSwitch.on(Events.Click, (function(_this) {
      return function() {
        return _this.listItemContainer["switch"]();
      };
    })(this));
  } else {
    this.listItem.on(Events.Click, (function(_this) {
      return function() {
        return _this.listItemContainer["switch"]();
      };
    })(this));
  }
  this.listItemContainer["switch"] = (function(_this) {
    return function() {
      if (_this.selected) {
        return _this.listItemContainer.deselect();
      } else {
        return _this.listItemContainer.select();
      }
    };
  })(this);
  this.listItemContainer.select = (function(_this) {
    return function(options) {
      options = options || {
        supressEvents: false
      };
      if (_this.enabled) {
        thingToSwitch.select();
        _this.selected = true;
      }
      if (options.supressEvents === false) {
        return _this.listItemContainer.emit("DidChange", {
          selected: _this.selected
        });
      }
    };
  })(this);
  this.listItemContainer.deselect = (function(_this) {
    return function(options) {
      options = options || {
        supressEvents: false
      };
      if (_this.enabled) {
        thingToSwitch.deselect();
        _this.selected = false;
      }
      if (options.supressEvents === false) {
        return _this.listItemContainer.emit("DidChange", {
          selected: _this.selected
        });
      }
    };
  })(this);
  this.listItemContainer.updateLabel = (function(_this) {
    return function(newText) {
      return _this.listItem.html = newText;
    };
  })(this);
  this.listItemContainer.updateLabel(params.name);
  return this.listItemContainer;
};

exports.TableView = function(params) {
  var attachRadioButtonValidation, buttonName, firstItemInList, i, j, lastItemInList, len, newButton, ref;
  params = params || {};
  _.defaults(params, {
    y: 0,
    width: defaults.screenWidth,
    items: ["It's just me!"],
    icon: 'check',
    validation: 'none'
  });
  this.buttonGroupContainer = new Layer({
    x: 0,
    y: params.y,
    width: params.width,
    height: defaults.tableRowHeight * params.items.length,
    backgroundColor: "none"
  });
  this.buttonArray = [];
  ref = params.items;
  for (i = j = 0, len = ref.length; j < len; i = ++j) {
    buttonName = ref[i];
    firstItemInList = i === 0 ? true : false;
    lastItemInList = i === (params.items.length - 1) ? true : false;
    newButton = new exports.TableViewRow({
      x: 0,
      y: i * defaults.tableRowHeight,
      name: buttonName,
      icon: params.icon,
      firstItemInList: firstItemInList,
      lastItemInList: lastItemInList
    });
    this.buttonArray.push(newButton);
    newButton.superLayer = this.buttonGroupContainer;
  }
  attachRadioButtonValidation = (function(_this) {
    return function(buttonArray) {
      var buttonClicked, indexOfButtonClicked, k, len1, results;
      results = [];
      for (indexOfButtonClicked = k = 0, len1 = buttonArray.length; k < len1; indexOfButtonClicked = ++k) {
        buttonClicked = buttonArray[indexOfButtonClicked];
        buttonClicked.deselect({
          supressEvents: true,
          instant: true
        });
        results.push((function(buttonClicked, indexOfButtonClicked) {
          return buttonClicked.on('DidChange', (function(_this) {
            return function(event) {
              var l, len2, otherButton, otherButtonIndex, results1;
              results1 = [];
              for (otherButtonIndex = l = 0, len2 = buttonArray.length; l < len2; otherButtonIndex = ++l) {
                otherButton = buttonArray[otherButtonIndex];
                if (otherButtonIndex !== indexOfButtonClicked) {
                  results1.push(otherButton.deselect({
                    suppressEvents: true
                  }));
                } else {
                  results1.push(void 0);
                }
              }
              return results1;
            };
          })(this));
        })(buttonClicked, indexOfButtonClicked));
      }
      return results;
    };
  })(this);
  if (params.validation === 'radio') {
    attachRadioButtonValidation(this.buttonArray);
  }
  return this.buttonGroupContainer;
};


/*
	TABLE VIEW HEADER
	In iOS, this is typically attached to the table view, 
	but it's independent here so you can put it wherever you want.
 */

exports.TableViewHeader = function(params) {
  var listDivider;
  params = params || {};
  _.defaults(params, {
    text: 'I am a divider',
    x: 0,
    y: 0
  });
  listDivider = new Layer({
    x: params.x + defaults.tableRowHorizontalPadding,
    y: params.y,
    width: defaults.screenWidth,
    backgroundColor: 'none'
  });
  listDivider.html = params.text;
  listDivider.style = defaults.dividerItemTextStyle;
  listDivider.style = {
    color: defaults.tint
  };
  return listDivider;
};


/*
	PICKER
	In iOS, this is typically attached to the table view, 
	but it's independent here so you can put it wherever you want.
 */

quantize = function(input, stepSize) {
  return Math.floor(input / stepSize) * stepSize;
};

Drum = function(parentDrumLayer, listName, listItems, params) {
  var drumContainerHeight, firstTouchAvailable, i, intervalToupdateDrumAppearance, j, len, li, listHeight, listItemLayer, listLayer, listMaxYPos, listMinYPos, stopDrum, updateDrumAppearance, updateDrumValues;
  this.parentDrumLayer = parentDrumLayer;
  params = params || {};
  _.defaults(params, {
    enabled: true,
    xPct: 0,
    widthPct: 1,
    textAlign: "center",
    textPadding: "0",
    textColor: defaults.tint
  });
  drumContainerHeight = defaults.tableRowHeight * 5;
  listItems = listItems;
  this.name = listName;
  this.index = 0;
  this.val = listItems[this.index];
  this.velocity = 0;
  firstTouchAvailable = true;
  intervalToupdateDrumAppearance = 0;
  listMinYPos = -defaults.tableRowHeight / 2;
  listMaxYPos = -listItems.length * defaults.tableRowHeight + defaults.tableRowHeight / 2;
  listHeight = listItems.length * defaults.tableRowHeight + drumContainerHeight;
  this.drumContainer = new Layer({
    x: params.xPct * defaults.screenWidth,
    y: 0,
    width: params.widthPct * defaults.screenWidth,
    height: drumContainerHeight,
    backgroundColor: "none",
    superLayer: parentDrumLayer
  });
  listLayer = new Layer({
    x: 0,
    y: -defaults.tableRowHeight / 2,
    width: params.widthPct * defaults.screenWidth,
    height: listHeight,
    superLayer: this.drumContainer,
    backgroundColor: "none"
  });
  listLayer.draggable.enabled = params.enabled;
  listLayer.draggable.speedX = 0;
  for (i = j = 0, len = listItems.length; j < len; i = ++j) {
    li = listItems[i];
    listItemLayer = new Layer({
      x: 0,
      y: i * defaults.tableRowHeight + drumContainerHeight / 2,
      width: params.widthPct * defaults.screenWidth,
      height: defaults.tableRowHeight,
      superLayer: listLayer,
      backgroundColor: "none"
    });
    listItemLayer.html = li;
    listItemLayer.style = {
      color: params.textColor,
      fontFamily: "Helvetica Neue",
      fontWeight: "200",
      fontSize: "42px",
      lineHeight: defaults.tableRowHeight + "px",
      textAlign: params.textAlign,
      padding: params.textPadding
    };
    listItemLayer.startY = i * defaults.tableRowHeight + drumContainerHeight / 2;
  }
  listLayer.on(Events.DragMove, (function(_this) {
    return function() {
      if (firstTouchAvailable) {
        _this.drumContainer.emit("DrumStartedMoving", {
          drum: drumName,
          index: _this.index,
          value: _this.val,
          velocity: 0
        });
        firstTouchAvailable = false;
      }
      return updateDrumAppearance();
    };
  })(this));
  listLayer.on(Events.DragEnd, (function(_this) {
    return function(e, f) {
      var bottomOverflow, distanceToTravel, finalPositionAfterMomentum, listHeightWithoutEndBuffer, newDistanceToTravel, overflowDampening, scrollVelocity, timeAfterDrag, topOverflow;
      firstTouchAvailable = true;
      scrollVelocity = listLayer.draggable.calculateVelocity().y;
      timeAfterDrag = (0.5 + Math.abs(scrollVelocity * 0.2)).toFixed(1);
      finalPositionAfterMomentum = quantize(listLayer.y + scrollVelocity * 400, defaults.tableRowHeight) + defaults.tableRowHeight / 2;
      distanceToTravel = finalPositionAfterMomentum - listLayer.y;
      listHeightWithoutEndBuffer = -listItems.length * defaults.tableRowHeight;
      bottomOverflow = Math.max(0, listHeightWithoutEndBuffer - finalPositionAfterMomentum);
      topOverflow = Math.max(0, finalPositionAfterMomentum);
      overflowDampening = 10;
      if (bottomOverflow > 0) {
        finalPositionAfterMomentum = listHeightWithoutEndBuffer - (bottomOverflow / overflowDampening);
        newDistanceToTravel = finalPositionAfterMomentum - listLayer.y;
        timeAfterDrag = timeAfterDrag * (newDistanceToTravel / distanceToTravel);
      }
      if (topOverflow > 0) {
        finalPositionAfterMomentum = 40 + (topOverflow / overflowDampening);
        newDistanceToTravel = finalPositionAfterMomentum - listLayer.y;
        timeAfterDrag = timeAfterDrag * (newDistanceToTravel / distanceToTravel);
      }
      listLayer.animate({
        properties: {
          y: finalPositionAfterMomentum
        },
        time: timeAfterDrag,
        curve: "ease-out"
      });
      return Utils.delay(timeAfterDrag, function() {
        return stopDrum();
      });
    };
  })(this));
  listLayer.on(Events.AnimationStart, function() {
    clearInterval(intervalToupdateDrumAppearance);
    return intervalToupdateDrumAppearance = Utils.interval(1 / 30, updateDrumAppearance);
  });
  listLayer.on(Events.AnimationEnd, (function(_this) {
    return function() {
      clearInterval(intervalToupdateDrumAppearance);
      return _this.drumContainer.emit("DrumFinishedChanging", {
        list: listName,
        index: _this.index,
        value: _this.val
      });
    };
  })(this));
  updateDrumAppearance = (function(_this) {
    return function() {
      var cappedListPosition, distanceFromMiddle, focusItem, itemsInDrum, k, listPosition, ref, ref1;
      itemsInDrum = 4;
      listPosition = listLayer.y / -defaults.tableRowHeight - 0.5;
      cappedListPosition = Math.max(0, Math.min(listLayer.y / -defaults.tableRowHeight - 0.5, listItems.length - 1));
      focusItem = Math.round(cappedListPosition);
      distanceFromMiddle = Math.abs(focusItem - cappedListPosition);
      for (i = k = ref = focusItem - itemsInDrum, ref1 = focusItem + itemsInDrum; ref <= ref1 ? k <= ref1 : k >= ref1; i = ref <= ref1 ? ++k : --k) {
        if (i >= 0 && i < listItems.length) {
          listLayer.subLayers[i].opacity = 1 - Math.abs(listPosition - i) / 5 - (i !== focusItem ? 0.3 : 0);
          listLayer.subLayers[i].scaleY = 1 - Math.min(1, Math.abs(listPosition - i) / 4);
          listLayer.subLayers[i].y = listLayer.subLayers[i].startY - (i - listPosition) * Math.abs(i - listPosition) * 10;
        }
      }
      if (_this.index !== focusItem) {
        return updateDrumValues(focusItem);
      }
    };
  })(this);
  stopDrum = (function(_this) {
    return function() {
      if (listLayer.y > listMinYPos) {
        listLayer.animate({
          properties: {
            y: listMinYPos
          },
          curve: "spring(400,50,0)"
        });
      }
      if (listLayer.y < listMaxYPos) {
        return listLayer.animate({
          properties: {
            y: listMaxYPos
          },
          curve: "spring(400,50,0)"
        });
      }
    };
  })(this);
  updateDrumValues = (function(_this) {
    return function(newIndex) {
      _this.index = newIndex;
      _this.val = listItems[_this.index];
      return _this.drumContainer.emit("DrumDidChange", {
        list: listName,
        index: _this.index,
        value: _this.val
      });
    };
  })(this);
  updateDrumAppearance();
  this.setIndex = (function(_this) {
    return function(index) {
      var yPositionForThisIndex;
      yPositionForThisIndex = -defaults.tableRowHeight / 2 - (index * defaults.tableRowHeight);
      return listLayer.animate({
        properties: {
          y: yPositionForThisIndex
        },
        time: 0.5,
        curve: "ease-out"
      });
    };
  })(this);
  this.setValue = (function(_this) {
    return function(val) {
      var index;
      index = listItems.indexOf(val);
      if (index !== -1) {
        return _this.setIndex(index);
      }
    };
  })(this);
  return this;
};


/*
	PICKER
	This contains the picker
 */

exports.Picker = function(params) {
  var drum, drumContainerHeight, j, len, newDrum, pickerDidChange, pickerFinishedChanging, pickerStartedMoving, ref;
  params = params || {};
  _.defaults(params, {
    x: 0,
    y: 0,
    width: defaults.screenWidth,
    defaultText: "",
    textColor: defaults.tint
  });
  drumContainerHeight = defaults.tableRowHeight * 5;
  this.pickerContainer = new Layer({
    x: params.x,
    y: params.y,
    width: params.width,
    height: drumContainerHeight + 88,
    backgroundColor: defaults.itemBackground
  });
  this.drum = new Layer({
    x: 0,
    y: 88,
    width: params.width,
    height: drumContainerHeight,
    backgroundColor: "none",
    superLayer: this.pickerContainer
  });
  this.selectedItem = new Layer({
    x: 0,
    y: drumContainerHeight / 2 - defaults.tableRowHeight / 2,
    width: params.width,
    height: defaults.tableRowHeight,
    backgroundColor: "none",
    superLayer: this.drum
  });
  this.pickerContainer.pickerHeader = new Layer({
    x: 0,
    y: 0,
    width: params.width,
    height: 88,
    backgroundColor: defaults.itemBackground,
    superLayer: this.pickerContainer
  });
  this.drum.style = {
    pointerEvents: "none",
    borderTop: "1px solid " + defaults.lineTint,
    borderBottom: "1px solid " + defaults.lineTint
  };
  this.selectedItem.style = {
    pointerEvents: "none",
    borderTop: "1px solid rgba(0,0,0,0.3)",
    borderBottom: "1px solid rgba(0,0,0,0.3)"
  };
  this.pickerContainer.pickerHeader.style = defaults.listItemTextStyle;
  this.pickerContainer.pickerHeader.style = {
    color: params.textColor,
    paddingLeft: "20px",
    borderTop: "1px solid " + defaults.lineTint
  };
  this.pickerContainer.pickerHeader.html = params.defaultText;
  this.pickerContainer.drums = [];
  this.pickerContainer.drumsByName = {};
  pickerStartedMoving = (function(_this) {
    return function() {
      var drum, drumValues, newValues;
      drumValues = {};
      newValues = (function() {
        var j, len, ref, results;
        ref = this.pickerContainer.drums;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          drum = ref[j];
          results.push(drumValues[drum.name] = {
            index: drum.index,
            val: drum.val,
            velocity: 0
          });
        }
        return results;
      }).call(_this);
      return _this.pickerContainer.emit("PickerStartedMoving");
    };
  })(this);
  pickerDidChange = (function(_this) {
    return function() {
      var drum, drumValues, newValues;
      drumValues = {};
      newValues = (function() {
        var j, len, ref, results;
        ref = this.pickerContainer.drums;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          drum = ref[j];
          results.push(drumValues[drum.name] = {
            index: drum.index,
            val: drum.val
          });
        }
        return results;
      }).call(_this);
      return _this.pickerContainer.emit("PickerDidChange", drumValues);
    };
  })(this);
  pickerFinishedChanging = (function(_this) {
    return function() {
      var drum, drumValues, newValues;
      drumValues = {};
      newValues = (function() {
        var j, len, ref, results;
        ref = this.pickerContainer.drums;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          drum = ref[j];
          results.push(drumValues[drum.name] = {
            index: drum.index,
            val: drum.val
          });
        }
        return results;
      }).call(_this);
      return _this.pickerContainer.emit("PickerFinishedChanging", drumValues);
    };
  })(this);
  if (params.drums && params.drums.length > 0) {
    ref = params.drums;
    for (j = 0, len = ref.length; j < len; j++) {
      drum = ref[j];
      newDrum = new Drum(this.drum, drum.name, drum.items, drum.params);
      this.pickerContainer.drums.push(newDrum);
      this.pickerContainer.drumsByName[drum.name] = newDrum;
      newDrum.drumContainer.on("DrumDidChange", pickerDidChange);
      newDrum.drumContainer.on("DrumFinishedChanging", pickerFinishedChanging);
      newDrum.drumContainer.on("DrumStartedMoving", pickerStartedMoving);
    }
  }
  return this.pickerContainer;
};



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcmFwaGRhbWljby9Eb2N1bWVudHMvR2l0L2ZyYW1lcktpdC9mcmFtZXJLaXQuZnJhbWVyL21vZHVsZXMvZnJhbWVyS2l0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQUE7Ozs7Ozs7Ozs7OztHQUFBO0FBaUJBO0FBQUE7Ozs7O0dBakJBO0FBQUEsSUFBQSxxREFBQTs7QUFBQSxRQXVCQSxHQUFXO0FBQUEsRUFDVixXQUFBLEVBQWEsR0FESDtDQXZCWCxDQUFBOztBQTJCQTtBQUFBOztHQTNCQTs7QUFBQSxRQThCUSxDQUFDLGNBQVQsR0FBMEIsRUE5QjFCLENBQUE7O0FBQUEsUUErQlEsQ0FBQyx5QkFBVCxHQUFxQyxFQS9CckMsQ0FBQTs7QUFBQSxRQWdDUSxDQUFDLElBQVQsR0FBZ0IsTUFoQ2hCLENBQUE7O0FBQUEsUUFpQ1EsQ0FBQyxRQUFULEdBQW9CLHFCQWpDcEIsQ0FBQTs7QUFBQSxRQWtDUSxDQUFDLGNBQVQsR0FBMEIsT0FsQzFCLENBQUE7O0FBQUEsUUFtQ1EsQ0FBQyxpQkFBVCxHQUE2QjtBQUFBLEVBQzVCLFFBQUEsRUFBVSxNQURrQjtBQUFBLEVBRTVCLFVBQUEsRUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFULEdBQXdCLENBQXpCLENBQUEsR0FBNEIsSUFGWjtBQUFBLEVBRzVCLFVBQUEsRUFBWSxnQkFIZ0I7QUFBQSxFQUk1QixVQUFBLEVBQVksS0FKZ0I7Q0FuQzdCLENBQUE7O0FBQUEsUUF5Q1EsQ0FBQyxvQkFBVCxHQUFnQztBQUFBLEVBQy9CLFFBQUEsRUFBVSxNQURxQjtBQUFBLEVBRS9CLFVBQUEsRUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFULEdBQXdCLENBQXpCLENBQUEsR0FBNEIsSUFGVDtBQUFBLEVBRy9CLFVBQUEsRUFBWSxnQkFIbUI7QUFBQSxFQUkvQixVQUFB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QTtBQXNHQSxTQUFPLElBQUMsQ0FBQSxlQUFSLENBeEdnQjtBQUFBLENBeHBCakIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIyNcbiAgRnJhbWVyS2l0IGZvciBGcmFtZXJcbiAgaHR0cHM6Ly9naXRodWIuY29tL3JhcGhkYW1pY28vZnJhbWVyS2l0XG5cbiAgQ29weXJpZ2h0IChjKSAyMDE1LCBSYXBoIEQnQW1pY28gaHR0cDovL3JhcGhkYW1pY28uY29tIChAcmFwaGRhbWljbylcbiAgTUlUIExpY2Vuc2VcblxuICBSZWFkbWU6XG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9yYXBoZGFtaWNvL2ZyYW1lcktpdFxuXG4gIExpY2Vuc2U6XG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9yYXBoZGFtaWNvL2ZyYW1lcktpdC9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4jIyNcblxuXG5cblxuIyMjXG5cdERFRkFVTFQgU1RZTEVTXG5cdE5vdGUgdGhlIHNjcmVlbndpZHRoIGNvbnN0YW50OiB0aGlzIGlzIHByb2JhYmx5IG9uZSBvZiB0aGVcblx0Zmlyc3QgdGhpbmdzIHlvdSB3YW50IHRvIGNoYW5nZSBzbyBpdCBtYXRjaGVzIHRoZSBkZXZpY2Vcblx0eW91J3JlIHByb3RvdHlwaW5nIG9uLlxuIyMjXG5kZWZhdWx0cyA9IHtcblx0c2NyZWVuV2lkdGg6IDc1MFxufVxuXG4jIyNcblx0TU9SRSBTVFlMRVNcbiMjI1xuZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgPSA4OFxuZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZyA9IDIwXG5kZWZhdWx0cy50aW50ID0gJ2dyZXknXG5kZWZhdWx0cy5saW5lVGludCA9IFwicmdiYSgyMDAsMjAwLDIwMCwxKVwiXG5kZWZhdWx0cy5pdGVtQmFja2dyb3VuZCA9ICd3aGl0ZSdcbmRlZmF1bHRzLmxpc3RJdGVtVGV4dFN0eWxlID0ge1xuXHRmb250U2l6ZTogXCIzMnB4XCJcblx0bGluZUhlaWdodDogKGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LTQpK1wicHhcIlx0XHRcblx0Zm9udEZhbWlseTogXCJIZWx2ZXRpY2EgTmV1ZVwiXG5cdGZvbnRXZWlnaHQ6IFwiMjAwXCJcbn1cbmRlZmF1bHRzLmRpdmlkZXJJdGVtVGV4dFN0eWxlID0ge1xuXHRmb250U2l6ZTogXCIyMnB4XCJcblx0bGluZUhlaWdodDogKGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LTQpK1wicHhcIlx0XHRcblx0Zm9udEZhbWlseTogXCJIZWx2ZXRpY2EgTmV1ZVwiXG5cdGZvbnRXZWlnaHQ6IFwiMjAwXCJcblx0dGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZSdcbn1cbmV4cG9ydHMuZGVmYXVsdHMgPSBkZWZhdWx0c1xuXG5cbiMjI1xuXHRUQUJMRSBWSUVXIEVMRU1FTlRTXG5cdChlLmcuIFwiVGh1bWJcIiBmb3IgdGhlIHN3aXRjaCBjb250cm9sKVxuIyMjXG5cblN3aXRjaCA9IChwYXJhbXMpIC0+XG5cdHBhcmFtcyA9IHBhcmFtcyBvciB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcywgXG5cdFx0c3dpdGNoVGludDogJyMxREMyNEInXG5cdFx0c2NyZWVuV2lkdGg6IGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0dGFibGVSb3dIZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0c3dpdGNoQ29udGFpbmVyQm9yZGVyOiA0XG5cdFx0c3dpdGNoQ29udGFpbmVySGVpZ2h0OiA1NFxuXHRcdHN3aXRjaENvbnRhaW5lcldpZHRoOiA5NFxuXHRcdGJvcmRlckNvbG9yOiBkZWZhdWx0cy5saW5lVGludCAjIEdyZXkgcm91bmRlZCBwaWxsICYgYm9yZGVycyBiZXR3ZWVuIGNlbGxzXG5cblx0QHNlbGVjdGVkID0gdHJ1ZVxuXHRcblx0IyBTb21lIG9mIHRoZSB2YWx1ZXMgYXJlIGJhc2VkIG9uIG90aGVyIGNvbnN0YW50cyxcblx0IyBzbyB5b3UgaGF2ZSB0byBjYWxjdWxhdGUgdGhlbSBpbiBhIHNlY29uZCBwYXNzXG5cdHN3aXRjaEJ1dHRvblJhZGl1cyA9IHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQvMlxuXHRzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlciA9IDJcblx0XG5cdCMgVGhpcyBpcyBvdXIgZmFuY3kgYW5pbWF0ZWQgc3dpdGNoIHN3aXRjaFxuXHQjIHdlIG5lZWQgdG8gbWFrZSBhIHJvdW5kZWQgcmVjdGFuZ2xlIHdpdGggYSBjaXJjbGUgaW5zaWRlIGl0LlxuXHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdFx0XHRcdDBcblx0XHR5OiBcdFx0XHRcdFx0MFxuXHRcdGNsaXA6IFx0XHRcdFx0ZmFsc2UgIyBDbGlwcGluZyBodXJ0cyB0aGUgc3VidGxlIHNoYWRvdyBvbiB0aGUgYnV0dG9uXG5cdFx0d2lkdGg6XHRcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVyV2lkdGggXG5cdFx0aGVpZ2h0Olx0XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIlwiXG5cdFx0b3BhY2l0eTogXHRcdFx0MVxuXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kID0gbmV3IExheWVyXG5cdFx0eDpcdFx0XHRcdFx0c3dpdGNoQnV0dG9uUmFkaXVzIC0gc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIvMlxuXHRcdHk6XHRcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyAtIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyLzIgLSA0XG5cdFx0d2lkdGg6IFx0XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoIC0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodCArIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyXG5cdFx0aGVpZ2h0OiBcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0IC0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodCArIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyXG5cdFx0Ym9yZGVyUmFkaXVzOiBcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdHNoYWRvd1NwcmVhZDpcdFx0c3dpdGNoQnV0dG9uUmFkaXVzIC0gc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIvMiArIHBhcmFtcy5zd2l0Y2hDb250YWluZXJCb3JkZXJcblx0XHRzaGFkb3dDb2xvcjogXHRcdHBhcmFtcy5zd2l0Y2hUaW50XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdCcnXG5cdFx0b3BhY2l0eTogXHRcdFx0MVxuXHRcdHN1cGVyTGF5ZXI6IFx0XHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyXG5cdFx0XG5cdEBzd2l0Y2hCdXR0b24gPSBuZXcgTGF5ZXJcblx0XHR4OiBwYXJhbXMuc3dpdGNoQ29udGFpbmVyV2lkdGggLSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0XG5cdFx0eTogLTRcblx0XHR3aWR0aDpcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyoyXG5cdFx0aGVpZ2h0Olx0XHRcdFx0c3dpdGNoQnV0dG9uUmFkaXVzKjJcblx0XHRib3JkZXJSYWRpdXM6IFx0XHRzd2l0Y2hCdXR0b25SYWRpdXNcblx0XHRzaGFkb3dZOlx0XHRcdDNcblx0XHRzaGFkb3dCbHVyOiBcdFx0NVxuXHRcdHNoYWRvd0NvbG9yOiBcdFx0J3JnYmEoMCwwLDAsMC4zKSdcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJ3aGl0ZVwiXG5cdFx0b3BhY2l0eTogXHRcdFx0MVxuXHRcdHN1cGVyTGF5ZXI6IFx0XHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyXG5cdFxuXHQjIFNFVCBVUCBBTklNQVRJT05TXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5hZGRcblx0XHRkZXNlbGVjdGVkOiBcblx0XHRcdHg6IFx0XHRcdFx0MFxuXHRcdFx0eTogXHRcdFx0XHQtNFxuXHRcdFx0d2lkdGg6XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoXG5cdFx0XHRoZWlnaHQ6XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdFx0c2hhZG93U3ByZWFkOiBcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJCb3JkZXJcblx0XHRcdHNhdHVyYXRlOiBcdFx0MFxuXHRcdFx0YnJpZ2h0bmVzczogXHQxNTNcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9XG5cdFx0Y3VydmU6IFwiZWFzZS1pbi1vdXRcIlxuXHRcdHRpbWU6IDAuMyBcblx0QHN3aXRjaEJhY2tncm91bmQub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cblx0XHRVdGlscy5kZWxheSAwLCA9PlxuXHQgXHRcdGlmIEBzZWxlY3RlZFxuIFx0XHRcdFx0QHN3aXRjaEJhY2tncm91bmQuYmFja2dyb3VuZENvbG9yID0gcGFyYW1zLnN3aXRjaFRpbnRcblxuXHRAc3dpdGNoQmFja2dyb3VuZC5vbiBFdmVudHMuQW5pbWF0aW9uU3RhcnQsID0+XG5cdFx0QHN3aXRjaEJhY2tncm91bmQuYmFja2dyb3VuZENvbG9yID0gJydcblxuXHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5hZGRcblx0XHRkZXNlbGVjdGVkOiB7eDogMH1cblx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9XG5cdFx0Y3VydmU6IFwic3ByaW5nKDQwMCwyNSwwKVwiXG5cdFx0XG5cdEBzd2l0Y2hCdXR0b25Db250YWluZXIuc2VsZWN0ID0gPT5cblx0XHRAc2VsZWN0ZWQgPSB0cnVlXG5cdFx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLnN3aXRjaChcImRlZmF1bHRcIilcblx0XHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5zd2l0Y2goXCJkZWZhdWx0XCIpXG5cdFx0XG5cdEBzd2l0Y2hCdXR0b25Db250YWluZXIuZGVzZWxlY3QgPSA9PlxuXHRcdEBzZWxlY3RlZCA9IGZhbHNlXG5cdFx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLnN3aXRjaChcImRlc2VsZWN0ZWRcIilcblx0XHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5zd2l0Y2goXCJkZXNlbGVjdGVkXCIpXG5cblx0aWYgQHNlbGVjdGVkID09IGZhbHNlXG5cdFx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLnN3aXRjaEluc3RhbnQoXCJkZXNlbGVjdGVkXCIpXG5cdFx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuc3dpdGNoSW5zdGFudChcImRlc2VsZWN0ZWRcIilcblx0ZWxzZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLmJhY2tncm91bmRDb2xvciA9IHBhcmFtcy5zd2l0Y2hUaW50XG5cblx0cmV0dXJuIEBzd2l0Y2hCdXR0b25Db250YWluZXJcblx0XG5Dcm9zcyA9IC0+XG5cdGNvbG9yID0gZGVmYXVsdHMudGludFxuXHRjcm9zc1RoaWNrbmVzcyA9IDRcblx0Y3Jvc3MgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogMzBcdFxuXHRcdGhlaWdodDogMzBcdFxuXHRcdGJhY2tncm91bmRDb2xvcjogJ25vbmUnXG5cdGNyb3NzVXBzdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNyb3NzVGhpY2tuZXNzXG5cdFx0d2lkdGg6IDIwXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdG9yaWdpblg6IDFcblx0XHRzdXBlckxheWVyOiBjcm9zc1xuXHRjcm9zc1Vwc3Ryb2tlLnkgPSAxNFxuXHRjcm9zc1Vwc3Ryb2tlLnJvdGF0aW9uWiA9IDQ1XG5cdGNyb3NzRG93bnN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY3Jvc3NUaGlja25lc3Ncblx0XHR3aWR0aDogMjBcblx0XHRvcmlnaW5YOiAxXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdHN1cGVyTGF5ZXI6IGNyb3NzXG5cdGNyb3NzRG93bnN0cm9rZS5yb3RhdGlvblogPSAtNDVcblx0Y3Jvc3Muc2VsZWN0ID0gLT5cblx0XHRjcm9zcy5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXG5cdGNyb3NzLmRlc2VsZWN0ID0gLT5cblx0XHRjcm9zcy5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHNjYWxlOiAwLjRcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcdFx0XG5cdHJldHVybiBjcm9zc1xuXHRcbkNhcmV0ID0gLT5cblx0Y29sb3IgPSBkZWZhdWx0cy50aW50XG5cdGNhcmV0VGhpY2tuZXNzID0gNFxuXHRjYXJldCA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiAzMFxuXHRcdGhlaWdodDogMzBcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1x0XHRcblx0Y2FyZXRVcHN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2FyZXRUaGlja25lc3Ncblx0XHR3aWR0aDogMThcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0b3JpZ2luWDogMVxuXHRcdHN1cGVyTGF5ZXI6IGNhcmV0XG5cdGNhcmV0VXBzdHJva2UueSA9IDE0XG5cdGNhcmV0VXBzdHJva2Uucm90YXRpb25aID0gNDVcblx0Y2FyZXREb3duc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjYXJldFRoaWNrbmVzc1xuXHRcdHdpZHRoOiAxOFxuXHRcdG9yaWdpblg6IDFcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0c3VwZXJMYXllcjogY2FyZXRcblx0Y2FyZXREb3duc3Ryb2tlLnkgPSAxMlx0XHRcblx0Y2FyZXREb3duc3Ryb2tlLnJvdGF0aW9uWiA9IC00NVxuXHRjYXJldC5zZWxlY3QgPSAtPlxuXHRcdGNhcmV0LmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcblx0Y2FyZXQuZGVzZWxlY3QgPSAtPlxuXHRcdGNhcmV0LmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0c2NhbGU6IDAuNFxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1x0XG5cdHJldHVybiBjYXJldFxuXHRcbkNoZWNrID0gLT5cblx0Y29sb3IgPSBkZWZhdWx0cy50aW50XG5cdGNoZWNrVGhpY2tuZXNzID0gNFxuXHRjaGVjayA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiAzMFxuXHRcdGhlaWdodDogMzBcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuXHRjaGVja1Vwc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjaGVja1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAxM1xuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRvcmlnaW5YOiAxXG5cdFx0c3VwZXJMYXllcjogY2hlY2tcblx0Y2hlY2tVcHN0cm9rZS55ID0gMTZcblx0Y2hlY2tVcHN0cm9rZS5yb3RhdGlvblogPSA0NVxuXHRjaGVja0Rvd25zdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNoZWNrVGhpY2tuZXNzXG5cdFx0d2lkdGg6IDIyXG5cdFx0b3JpZ2luWDogMVxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRzdXBlckxheWVyOiBjaGVja1x0XG5cdGNoZWNrRG93bnN0cm9rZS54ID0gNFxuXHRjaGVja0Rvd25zdHJva2Uucm90YXRpb25aID0gLTQ1XG5cdGNoZWNrLnNlbGVjdCA9IC0+XG5cdFx0Y2hlY2suYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRjaGVjay5kZXNlbGVjdCA9IC0+XG5cdFx0Y2hlY2suYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRzY2FsZTogMC40XG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXG5cdHJldHVybiBjaGVja1xuXG5cbiMjI1xuXHRUQUJMRSBWSUVXXG5cdFxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRUYWJsZVZpZXdSb3dcdFx0W0VsZW1lbnRzIGdvIGhlcmVdXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiMjI1xuXG5leHBvcnRzLlRhYmxlVmlld1JvdyA9IChwYXJhbXMpIC0+XG5cdFxuXHQjIFRoZSB0cmlja3kgdGhpbmcgYWJvdXQgcmV1c2FibGUgY29tcG9uZW50cyBpcyByZW1lbWJlcmluZ1xuXHQjIGhvdyB0byB1c2UgdGhlbSAocGFydGljdWxhcmx5IGlmIHRoZXkgaGF2ZSBsb3RzIG9mIGN1c3RvbWl6YWJsZVxuXHQjIHBhcmFtZXRlcnMpLiBTZXR0aW5nIHNlbnNpYmxlIGRlZmF1bHRzIG1ha2VzIGl0IHdheSBlYXNpZXIgdG8gZ2V0XG5cdCMgc3RhcnRlZCAoYW5kIHJlbWVtYmVyIGhvdyB0byB1c2UgdGhlIHRoaW5nIHlvdSBtYWRlKVxuXHRfLmRlZmF1bHRzIHBhcmFtcywgXG5cdFx0bmFtZTogJ0dpdmUgbWUgYSBuYW1lISdcblx0XHR4OiAwXG5cdFx0eTogMFxuXHRcdGVuYWJsZWQ6IHRydWVcblx0XHRzZWxlY3RlZDogdHJ1ZVxuXHRcdGljb246ICdjaGVjaydcblx0XHR0ZXh0Q29sb3I6IGRlZmF1bHRzLnRpbnRcblx0XHRzd2l0Y2hUaW50OiAnZ3JlZW4nXG5cdFx0Zmlyc3RJdGVtSW5MaXN0OiB0cnVlICMgY291bGQgYmUgZmlyc3Qgb3IgbGFzdFxuXHRcdGxhc3RJdGVtSW5MaXN0OiB0cnVlICMgY291bGQgYmUgZmlyc3Qgb3IgbGFzdFxuXHRcdFxuXHRcdCMgQ29uc3RhbnRzXG5cdFx0c2NyZWVuV2lkdGg6IGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0dGFibGVSb3dIb3Jpem9udGFsUGFkZGluZzogZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZ1xuXHRcdHRhYmxlUm93SGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGJvcmRlckNvbG9yOiBkZWZhdWx0cy5saW5lVGludCAjIEdyZXkgcm91bmRlZCBwaWxsICYgYm9yZGVycyBiZXR3ZWVuIGNlbGxzXG5cblx0IyBTb21lIG9mIHRoZSB2YWx1ZXMgYXJlIGJhc2VkIG9uIG90aGVyIGNvbnN0YW50cyxcblx0IyBzbyB5b3UgaGF2ZSB0byBjYWxjdWxhdGUgdGhlbSBpbiBhIHNlY29uZCBwYXNzXG5cdHN3aXRjaEJ1dHRvblJhZGl1cyA9IHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQvMlxuXHRzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlciA9IDJcblx0XHRcblx0IyBUaGlzIGlzIHRoZSByb290IG9iamVjdCBmb3IgdGhpcyBlbnRpcmUgY29tcG9uZW50LlxuXHQjIFdlIHdpbGwgYXR0YWNoIGFsbCBvdXIgZnVuY3Rpb25zIGRpcmVjdGx5IHRvIHRoaXMgbGF5ZXJcblx0QGxpc3RJdGVtQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogcGFyYW1zLnhcblx0XHR5OiBwYXJhbXMueVxuXHRcdHdpZHRoOiBcdGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGNsaXA6IGZhbHNlXG5cdFx0YmFja2dyb3VuZENvbG9yOiBkZWZhdWx0cy5pdGVtQmFja2dyb3VuZFxuXHRAbGlzdEl0ZW1Db250YWluZXIuc3R5bGUgPSBcblx0XHRib3JkZXJUb3A6IFx0XHRpZiBwYXJhbXMuZmlyc3RJdGVtSW5MaXN0IHRoZW4gXCIxcHggc29saWQgXCIgKyBwYXJhbXMuYm9yZGVyQ29sb3IgZWxzZSBcIlwiXG5cdFx0Ym9yZGVyQm90dG9tOiBcdGlmIHBhcmFtcy5sYXN0SXRlbUluTGlzdCB0aGVuIFwiMXB4IHNvbGlkIFwiICsgcGFyYW1zLmJvcmRlckNvbG9yIGVsc2UgXCJcIlxuXG5cdCMgVGhlc2Ugd2lsbCBiZSBhY2Nlc3NlZCB1c2luZyBmdW5jdGlvbnNcblx0QGVuYWJsZWQgPSBwYXJhbXMuZW5hYmxlZFxuXHRAc2VsZWN0ZWQgPSBwYXJhbXMuc2VsZWN0ZWRcblx0XG5cdEBsaXN0SXRlbSA9IG5ldyBMYXllciBcblx0XHR4OiBwYXJhbXMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZ1xuXHRcdHdpZHRoOiBcdGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdHN1cGVyTGF5ZXI6IEBsaXN0SXRlbUNvbnRhaW5lclxuXHRcdGJhY2tncm91bmRDb2xvcjogJ25vbmUnXHRcblx0QGxpc3RJdGVtLnN0eWxlID0gZGVmYXVsdHMubGlzdEl0ZW1UZXh0U3R5bGVcblx0QGxpc3RJdGVtLnN0eWxlID1cblx0XHRjb2xvcjogcGFyYW1zLnRleHRDb2xvclxuXHRcdGJvcmRlclRvcDogXHRpZiBwYXJhbXMuZmlyc3RJdGVtSW5MaXN0IHRoZW4gXCJcIiBlbHNlIFwiMXB4IHNvbGlkIFwiICsgcGFyYW1zLmJvcmRlckNvbG9yXG5cblx0IyBUaGlzIGlzIHdoZXJlIHRoZSBsYWJlbCBvZiB0aGUgbGlzdCBpdGVtIGxpdmVzXG5cdEBsaXN0SXRlbS5odG1sID0gcGFyYW1zLm5hbWUgXG5cblx0IyBBZGQgdGhlIGNoZWNrbWFyayBmb3IgdGhlIGxpc3Rcblx0dGhpbmdUb1N3aXRjaCA9IHN3aXRjaFxuXHRcdHdoZW4gcGFyYW1zLmljb24gPT0gJ2NoZWNrJyB0aGVuIG5ldyBDaGVjaygpXG5cdFx0d2hlbiBwYXJhbXMuaWNvbiA9PSAnY3Jvc3MnIHRoZW4gbmV3IENyb3NzKClcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdjYXJldCcgdGhlbiBuZXcgQ2FyZXQoKVxuXHRcdHdoZW4gcGFyYW1zLmljb24gPT0gJ3N3aXRjaCcgdGhlbiBuZXcgU3dpdGNoKClcblxuXHR0aGluZ1RvU3dpdGNoLnN1cGVyTGF5ZXIgPSBAbGlzdEl0ZW1Db250YWluZXJcblx0dGhpbmdUb1N3aXRjaC54ID0gZGVmYXVsdHMuc2NyZWVuV2lkdGggLSB0aGluZ1RvU3dpdGNoLndpZHRoIC0gZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZ1xuXHR0aGluZ1RvU3dpdGNoLmNlbnRlclkoMilcbiMgXHR0aGluZ1RvU3dpdGNoLnkgPSAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMiAtIHRoaW5nVG9Td2l0Y2guaGVpZ2h0LzJcblx0XG5cdCMgTUFLRSBJVCBBTEwgSU5URVJBQ1RJVkVcblx0IyBPbiBhIGNsaWNrLCBnbyB0byB0aGUgbmV4dCBzdGF0ZVxuXHRpZiBwYXJhbXMuaWNvbiA9PSAnc3dpdGNoJ1xuXHRcdHRoaW5nVG9Td2l0Y2gub24gRXZlbnRzLkNsaWNrLCA9PlxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLnN3aXRjaCgpXG5cdGVsc2UgXG5cdFx0QGxpc3RJdGVtLm9uIEV2ZW50cy5DbGljaywgPT5cblx0XHRcdEBsaXN0SXRlbUNvbnRhaW5lci5zd2l0Y2goKVxuXG5cdEBsaXN0SXRlbUNvbnRhaW5lci5zd2l0Y2ggPSA9PlxuXHRcdGlmIEBzZWxlY3RlZCB0aGVuIEBsaXN0SXRlbUNvbnRhaW5lci5kZXNlbGVjdCgpIGVsc2UgQGxpc3RJdGVtQ29udGFpbmVyLnNlbGVjdCgpXG5cdFx0XG5cdEBsaXN0SXRlbUNvbnRhaW5lci5zZWxlY3QgPSAob3B0aW9ucykgPT5cblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7c3VwcmVzc0V2ZW50czogZmFsc2V9XG5cdFx0aWYgQGVuYWJsZWQgXG5cdFx0XHR0aGluZ1RvU3dpdGNoLnNlbGVjdCgpXG5cdFx0XHRAc2VsZWN0ZWQgPSB0cnVlXG5cdFx0aWYgb3B0aW9ucy5zdXByZXNzRXZlbnRzID09IGZhbHNlXG5cdFx0XHRAbGlzdEl0ZW1Db250YWluZXIuZW1pdCBcIkRpZENoYW5nZVwiLCB7IHNlbGVjdGVkOiBAc2VsZWN0ZWQgfVxuXG5cdEBsaXN0SXRlbUNvbnRhaW5lci5kZXNlbGVjdCA9IChvcHRpb25zKSA9PlxuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHtzdXByZXNzRXZlbnRzOiBmYWxzZX1cblx0XHRpZiBAZW5hYmxlZCBcblx0XHRcdHRoaW5nVG9Td2l0Y2guZGVzZWxlY3QoKVx0XHRcblx0XHRcdEBzZWxlY3RlZCA9IGZhbHNlXG5cdFx0aWYgb3B0aW9ucy5zdXByZXNzRXZlbnRzID09IGZhbHNlXG5cdFx0XHRAbGlzdEl0ZW1Db250YWluZXIuZW1pdCBcIkRpZENoYW5nZVwiLCB7IHNlbGVjdGVkOiBAc2VsZWN0ZWQgfVxuXG5cdEBsaXN0SXRlbUNvbnRhaW5lci51cGRhdGVMYWJlbCA9IChuZXdUZXh0KSA9PlxuXHRcdEBsaXN0SXRlbS5odG1sID0gbmV3VGV4dFxuXHRcdFx0XG5cdEBsaXN0SXRlbUNvbnRhaW5lci51cGRhdGVMYWJlbChwYXJhbXMubmFtZSlcblxuXHRyZXR1cm4gQGxpc3RJdGVtQ29udGFpbmVyXG5cbmV4cG9ydHMuVGFibGVWaWV3ID0gKHBhcmFtcykgLT5cblx0cGFyYW1zID0gcGFyYW1zIG9yIHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLFxuXHRcdHk6IFx0XHQwXG5cdFx0d2lkdGg6XHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGl0ZW1zOiBbXCJJdCdzIGp1c3QgbWUhXCJdXG5cdFx0aWNvbjogJ2NoZWNrJ1xuXHRcdHZhbGlkYXRpb246ICdub25lJ1xuXHRcblx0QGJ1dHRvbkdyb3VwQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdDBcblx0XHR5Olx0XHRwYXJhbXMueVxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKiBwYXJhbXMuaXRlbXMubGVuZ3RoXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwibm9uZVwiXG5cdFx0XHRcdFx0XG5cdEBidXR0b25BcnJheSA9IFtdXG5cdGZvciBidXR0b25OYW1lLCBpIGluIHBhcmFtcy5pdGVtc1xuXHRcdGZpcnN0SXRlbUluTGlzdCA9IGlmIGkgPT0gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxuXHRcdGxhc3RJdGVtSW5MaXN0ID0gaWYgaSA9PSAocGFyYW1zLml0ZW1zLmxlbmd0aC0xKSB0aGVuIHRydWUgZWxzZSBmYWxzZVxuXHRcdG5ld0J1dHRvbiA9IG5ldyBleHBvcnRzLlRhYmxlVmlld1Jvdyh7XG5cdFx0XHR4OiAwLCBcblx0XHRcdHk6IGkqZGVmYXVsdHMudGFibGVSb3dIZWlnaHQsIFxuXHRcdFx0bmFtZTogYnV0dG9uTmFtZSwgXG5cdFx0XHRpY29uOiBwYXJhbXMuaWNvbixcblx0XHRcdGZpcnN0SXRlbUluTGlzdDogZmlyc3RJdGVtSW5MaXN0LFxuXHRcdFx0bGFzdEl0ZW1Jbkxpc3Q6IGxhc3RJdGVtSW5MaXN0XG5cdFx0fSlcblx0XHRAYnV0dG9uQXJyYXkucHVzaChuZXdCdXR0b24pXG5cdFx0bmV3QnV0dG9uLnN1cGVyTGF5ZXIgPSBAYnV0dG9uR3JvdXBDb250YWluZXJcblxuXHRhdHRhY2hSYWRpb0J1dHRvblZhbGlkYXRpb24gPSAoYnV0dG9uQXJyYXkpID0+XG5cdFx0Zm9yIGJ1dHRvbkNsaWNrZWQsIGluZGV4T2ZCdXR0b25DbGlja2VkIGluIGJ1dHRvbkFycmF5XG5cdFx0XHRidXR0b25DbGlja2VkLmRlc2VsZWN0KHtzdXByZXNzRXZlbnRzOiB0cnVlLCBpbnN0YW50OiB0cnVlfSlcblx0XHRcdCMgQ3JlYXRlcyBhIGNsb3N1cmUgdG8gc2F2ZSB0aGUgaW5kZXggb2YgdGhlIGJ1dHRvbiB3ZSdyZSBkZWFsaW5nIHdpdGhcblx0XHRcdGRvIChidXR0b25DbGlja2VkLCBpbmRleE9mQnV0dG9uQ2xpY2tlZCkgLT4gXG5cdFx0XHRcdCMgTGlzdGVuIGZvciBldmVudHMgYW5kIGNoYW5nZSBvdGhlciBidXR0b25zIGluIHJlc3BvbnNlXG5cdFx0XHRcdGJ1dHRvbkNsaWNrZWQub24gJ0RpZENoYW5nZScsIChldmVudCkgPT5cblx0XHRcdFx0XHRmb3Igb3RoZXJCdXR0b24sIG90aGVyQnV0dG9uSW5kZXggaW4gYnV0dG9uQXJyYXlcblx0XHRcdFx0XHRcdGlmIG90aGVyQnV0dG9uSW5kZXggIT0gaW5kZXhPZkJ1dHRvbkNsaWNrZWRcblx0XHRcdFx0XHRcdFx0IyBEbyBzdHVmZiB0byB0aGUgb3RoZXIgYnV0dG9uc1xuXHRcdFx0XHRcdFx0XHRvdGhlckJ1dHRvbi5kZXNlbGVjdCh7c3VwcHJlc3NFdmVudHM6IHRydWV9KVxuXG5cdGlmIHBhcmFtcy52YWxpZGF0aW9uID09ICdyYWRpbydcblx0XHRhdHRhY2hSYWRpb0J1dHRvblZhbGlkYXRpb24oQGJ1dHRvbkFycmF5KVxuXHRcdFxuXHRyZXR1cm4gQGJ1dHRvbkdyb3VwQ29udGFpbmVyXG5cblxuXG4jIyNcblx0VEFCTEUgVklFVyBIRUFERVJcblx0SW4gaU9TLCB0aGlzIGlzIHR5cGljYWxseSBhdHRhY2hlZCB0byB0aGUgdGFibGUgdmlldywgXG5cdGJ1dCBpdCdzIGluZGVwZW5kZW50IGhlcmUgc28geW91IGNhbiBwdXQgaXQgd2hlcmV2ZXIgeW91IHdhbnQuXG4jIyNcblxuZXhwb3J0cy5UYWJsZVZpZXdIZWFkZXIgPSAocGFyYW1zKSAtPlxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0dGV4dDogJ0kgYW0gYSBkaXZpZGVyJ1xuXHRcdHg6IDBcblx0XHR5OiAwXG5cdGxpc3REaXZpZGVyID0gbmV3IExheWVyXG5cdFx0eDogcGFyYW1zLnggKyBkZWZhdWx0cy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nXG5cdFx0eTogcGFyYW1zLnlcblx0XHR3aWR0aDogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuXHRsaXN0RGl2aWRlci5odG1sID0gcGFyYW1zLnRleHRcblx0bGlzdERpdmlkZXIuc3R5bGUgPSBkZWZhdWx0cy5kaXZpZGVySXRlbVRleHRTdHlsZVxuXHRsaXN0RGl2aWRlci5zdHlsZSA9IFxuXHRcdGNvbG9yOiBkZWZhdWx0cy50aW50XG5cdHJldHVybiBsaXN0RGl2aWRlclxuXG5cblxuIyMjXG5cdFBJQ0tFUlxuXHRJbiBpT1MsIHRoaXMgaXMgdHlwaWNhbGx5IGF0dGFjaGVkIHRvIHRoZSB0YWJsZSB2aWV3LCBcblx0YnV0IGl0J3MgaW5kZXBlbmRlbnQgaGVyZSBzbyB5b3UgY2FuIHB1dCBpdCB3aGVyZXZlciB5b3Ugd2FudC5cbiMjI1xuXG5cbiMjIFV0aWxpdHkgZnVuY3Rpb25zXG5cbnF1YW50aXplID0gKGlucHV0LCBzdGVwU2l6ZSkgLT5cblx0cmV0dXJuIE1hdGguZmxvb3IoaW5wdXQvc3RlcFNpemUpICogc3RlcFNpemVcblxuXG4jIyBUaGUgaXRlbXMgaW4gdGhlIHBpY2tlclxuXG5EcnVtID0gKHBhcmVudERydW1MYXllciwgbGlzdE5hbWUsIGxpc3RJdGVtcywgcGFyYW1zKSAtPlxuXHRcblx0IyBTZXR1cCB2YXJpYWJsZXNcblx0QHBhcmVudERydW1MYXllciA9IHBhcmVudERydW1MYXllclxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0ZW5hYmxlZDogdHJ1ZVxuXHRcdHhQY3Q6IDAgIFx0XHRcdFx0IyAwIHRvIDFcblx0XHR3aWR0aFBjdDogMVx0XHRcdFx0IyAwIHRvIDFcblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCJcdFx0IyBsZWZ0LCBjZW50ZXIsIHJpZ2h0XG5cdFx0dGV4dFBhZGRpbmc6IFwiMFwiXG5cdFx0dGV4dENvbG9yOiBkZWZhdWx0cy50aW50XG5cdFxuXHQjIFZhbHVlcyBkZXJpdmVkIGZyb20gcGFyYW1zXG5cdGRydW1Db250YWluZXJIZWlnaHQgPSBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCo1XG5cblx0IyBTZXQgdXAgY29udGVudCBvZiBsaXN0IFx0XHRcblx0bGlzdEl0ZW1zID0gbGlzdEl0ZW1zXG5cdEBuYW1lID0gbGlzdE5hbWVcblx0QGluZGV4ID0gMFxuXHRAdmFsID0gbGlzdEl0ZW1zW0BpbmRleF1cblx0QHZlbG9jaXR5ID0gMFxuXHRmaXJzdFRvdWNoQXZhaWxhYmxlID0gdHJ1ZSAgICAjIGlzIHRoaXMgdGhlIGZpcnN0IHRvdWNoIGluIGEgZ2l2ZW4gZ2VzdHVyZT9cblx0XG5cdGludGVydmFsVG91cGRhdGVEcnVtQXBwZWFyYW5jZSA9IDBcblx0XG5cdCMgQ2FsY3VsYXRlIGhlaWdodCBhbmQgdmVydGljYWwgYm91bmRzIG9mIHRoZSBsaXN0XG5cdGxpc3RNaW5ZUG9zIFx0PSAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRsaXN0TWF4WVBvcyBcdD0gLWxpc3RJdGVtcy5sZW5ndGgqZGVmYXVsdHMudGFibGVSb3dIZWlnaHQrZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRsaXN0SGVpZ2h0IFx0XHQ9IGxpc3RJdGVtcy5sZW5ndGgqZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKyBkcnVtQ29udGFpbmVySGVpZ2h0XG5cblx0QGRydW1Db250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0XHRcdFx0cGFyYW1zLnhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdHk6IFx0XHRcdFx0XHQwXG5cdFx0d2lkdGg6IFx0XHRcdFx0cGFyYW1zLndpZHRoUGN0ICogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRoZWlnaHQ6IFx0XHRcdGRydW1Db250YWluZXJIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJub25lXCJcblx0XHRzdXBlckxheWVyOiBcdFx0cGFyZW50RHJ1bUxheWVyXG5cdFxuXHRsaXN0TGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0XHRcdFx0MFxuXHRcdHk6IFx0XHRcdFx0XHQtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRcdHdpZHRoOiBcdFx0XHRcdHBhcmFtcy53aWR0aFBjdCAqIGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBcdFx0XHRsaXN0SGVpZ2h0XG5cdFx0c3VwZXJMYXllcjogXHRcdEBkcnVtQ29udGFpbmVyXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwibm9uZVwiXG5cdFxuXHQjIGxpc3RMYXllci5zY3JvbGwgPSB0cnVlXG5cdGxpc3RMYXllci5kcmFnZ2FibGUuZW5hYmxlZCA9IHBhcmFtcy5lbmFibGVkXG5cdGxpc3RMYXllci5kcmFnZ2FibGUuc3BlZWRYID0gMFxuXHRcblx0Zm9yIGxpLCBpIGluIGxpc3RJdGVtc1xuXHRcdGxpc3RJdGVtTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdHg6IFx0XHRcdFx0MFxuXHRcdFx0eTogXHRcdFx0XHRpICogZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKyBkcnVtQ29udGFpbmVySGVpZ2h0LzJcblx0XHRcdHdpZHRoOiBcdFx0XHRwYXJhbXMud2lkdGhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdFx0aGVpZ2h0OiBcdFx0ZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRcdHN1cGVyTGF5ZXI6IFx0bGlzdExheWVyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwibm9uZVwiI1V0aWxzLnJhbmRvbUNvbG9yKClcblx0XHRsaXN0SXRlbUxheWVyLmh0bWwgPSBsaVxuXHRcdGxpc3RJdGVtTGF5ZXIuc3R5bGUgPVxuXHRcdFx0Y29sb3I6IFx0XHRcdHBhcmFtcy50ZXh0Q29sb3Jcblx0XHRcdGZvbnRGYW1pbHk6IFx0XCJIZWx2ZXRpY2EgTmV1ZVwiXG5cdFx0XHRmb250V2VpZ2h0OiBcdFwiMjAwXCJcblx0XHRcdGZvbnRTaXplOiBcdFx0XCI0MnB4XCJcblx0XHRcdGxpbmVIZWlnaHQ6IFx0ZGVmYXVsdHMudGFibGVSb3dIZWlnaHQrXCJweFwiXG5cdFx0XHR0ZXh0QWxpZ246IFx0XHRwYXJhbXMudGV4dEFsaWduXG5cdFx0XHRwYWRkaW5nOiBcdFx0cGFyYW1zLnRleHRQYWRkaW5nXG5cblx0XHRsaXN0SXRlbUxheWVyLnN0YXJ0WSA9IGkgKiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCArIGRydW1Db250YWluZXJIZWlnaHQvMlxuXG5cdGxpc3RMYXllci5vbiBFdmVudHMuRHJhZ01vdmUsID0+XG5cdFx0aWYgZmlyc3RUb3VjaEF2YWlsYWJsZVxuXHRcdFx0QGRydW1Db250YWluZXIuZW1pdChcIkRydW1TdGFydGVkTW92aW5nXCIsIHtkcnVtOiBkcnVtTmFtZSwgaW5kZXg6IEBpbmRleCwgdmFsdWU6IEB2YWwsIHZlbG9jaXR5OiAwfSlcblx0XHRcdGZpcnN0VG91Y2hBdmFpbGFibGUgPSBmYWxzZVx0XHRcblx0XHRcdFxuXHRcdHVwZGF0ZURydW1BcHBlYXJhbmNlKClcblx0XHRcblx0IyBUbyBzaW11bGF0ZSBpT1MgbW9tZW50dW0gc2Nyb2xsaW5nICh3aGljaCBjYXVzZXMgdGhlIGRydW0gdG8ga2VlcCBzcGlubmluZyBcblx0IyBhZnRlciB5b3VyIGZpbmdlciBsaWZ0cyBvZmYgaXQpLCB3ZSB0cmlnZ2VyIGFuIGFuaW1hdGlvbiB0aGUgbW9tZW50IHlvdSBsaWZ0XG5cdCMgeW91ciBmaW5nZXIuIFRoZSBpbnRlbnNpdHkgb2YgdGhpcyBhbmltYXRpb24gaXMgcHJvcG9ydGlvbmFsIHRvIHRoZSBzcGVlZCB3aGVuXG5cdCMgb2YgdGhlIGRyYWdnaW5nIHdoZW4geW91ciBmaW5nZXIgd2FzIGxpZnRlZC5cblx0bGlzdExheWVyLm9uIEV2ZW50cy5EcmFnRW5kLCAoZSwgZikgPT5cblx0XHRcblx0XHQjIE5leHQgdG91Y2ggc2hvdWxkIHRyaWdnZXIgRHJ1bVN0YXJ0ZWRNb3Zpbmdcblx0XHRmaXJzdFRvdWNoQXZhaWxhYmxlID0gdHJ1ZVxuXHRcblx0XHQjIFRoaXMgY2FsY3VsYXRlcyB0aGUgYW5pbWF0aW9uXG5cdFx0c2Nyb2xsVmVsb2NpdHkgPSBsaXN0TGF5ZXIuZHJhZ2dhYmxlLmNhbGN1bGF0ZVZlbG9jaXR5KCkueVxuXHRcdHRpbWVBZnRlckRyYWcgPSAoMC41K01hdGguYWJzKHNjcm9sbFZlbG9jaXR5KjAuMikpLnRvRml4ZWQoMSlcblx0XHRmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSA9IHF1YW50aXplKGxpc3RMYXllci55ICsgc2Nyb2xsVmVsb2NpdHkqNDAwLCBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCkgKyBkZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yXG5cdFx0XG5cdFx0IyBBdCB0aGUgdG9wIGFuZCBib3R0b20sIHRoZSBtb21lbnR1bSBzaG91bGQgYmUgYWRqdXN0ZWQgc28gdGhlIFxuXHRcdCMgZmlyc3QgYW5kIGxhc3QgdmFsdWVzIG9uIHRoZSBkcnVtIGRvbid0IGdvIHRvbyBmYXIgb3V0IG9mIHZpZXdcblx0XHRkaXN0YW5jZVRvVHJhdmVsID0gZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gLSBsaXN0TGF5ZXIueVxuXHRcdGxpc3RIZWlnaHRXaXRob3V0RW5kQnVmZmVyID0gLWxpc3RJdGVtcy5sZW5ndGgqZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRib3R0b21PdmVyZmxvdyA9IE1hdGgubWF4KDAsIGxpc3RIZWlnaHRXaXRob3V0RW5kQnVmZmVyLWZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtIClcblx0XHR0b3BPdmVyZmxvdyA9IE1hdGgubWF4KDAsIGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtIClcblx0XHRvdmVyZmxvd0RhbXBlbmluZyA9IDEwXG5cdFx0XG5cdFx0aWYgYm90dG9tT3ZlcmZsb3cgPiAwXG5cdFx0XHRmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSA9IGxpc3RIZWlnaHRXaXRob3V0RW5kQnVmZmVyIC0gKGJvdHRvbU92ZXJmbG93IC8gb3ZlcmZsb3dEYW1wZW5pbmcpXG5cdFx0XHRuZXdEaXN0YW5jZVRvVHJhdmVsID0gZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gLSBsaXN0TGF5ZXIueVxuXHRcdFx0dGltZUFmdGVyRHJhZyA9IHRpbWVBZnRlckRyYWcgKiAobmV3RGlzdGFuY2VUb1RyYXZlbC9kaXN0YW5jZVRvVHJhdmVsKVxuXG5cdFx0aWYgdG9wT3ZlcmZsb3cgPiAwXG5cdFx0XHRmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSA9IDQwICsgKHRvcE92ZXJmbG93IC8gb3ZlcmZsb3dEYW1wZW5pbmcpXG5cdFx0XHRuZXdEaXN0YW5jZVRvVHJhdmVsID0gZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gLSBsaXN0TGF5ZXIueVxuXHRcdFx0dGltZUFmdGVyRHJhZyA9IHRpbWVBZnRlckRyYWcgKiAobmV3RGlzdGFuY2VUb1RyYXZlbC9kaXN0YW5jZVRvVHJhdmVsKVxuXG5cdFx0IyBUcmlnZ2VyIHRoZSBhbmltYXRpb24sIGFuZCBzY2hlZHVsZSBhbiBldmVudCB0aGF0IHdpbGxcblx0XHQjIHRyaWdnZXIgd2hlbiB0aGUgZHJ1bSBmaW5hbGx5IHN0b3BzIHNwaW5uaW5nLlxuXHRcdGxpc3RMYXllci5hbmltYXRlKHtcblx0XHRcdFx0cHJvcGVydGllczoge3k6IGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtfVxuXHRcdFx0XHR0aW1lOiB0aW1lQWZ0ZXJEcmFnXG5cdFx0XHRcdGN1cnZlOiBcImVhc2Utb3V0XCJcblx0XHRcdH0pXG5cdFx0VXRpbHMuZGVsYXkgdGltZUFmdGVyRHJhZywgLT5cblx0XHRcdHN0b3BEcnVtKClcblxuXHQjIFRoaXMgZW5zdXJlcyB0aGF0IGR1cmluZyB0aGUgYW5pbWF0aW9uIG9mIHRoZSBsaXN0IGxheWVyLCB0aGUgZHJ1bSdzIGFwcGVhcmFuY2UgY29udGludWVzXG5cdCMgdG8gYmUgdXBkYXRlZC4gQmVjYXVzZSBtdWx0aXBsZSBhbmltYXRpb25zIGNvdWxkIG92ZXJsYXAsIHdlIGVuc3VyZSB0aGF0IGV2ZXJ5IG5ldyBhbmltYXRpb25cblx0IyBlbmRzIHRoZSBpbnRlcnZhbCBhbmQgc3RhcnRzIGEgbmV3IG9uZSBzbyB0aGF0IHdlIG5ldmVyIGhhdmUgbW9yZSB0aGFuIG9uZSBydW5uaW5nIFxuXHRsaXN0TGF5ZXIub24gRXZlbnRzLkFuaW1hdGlvblN0YXJ0LCAtPlxuXHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlKVxuXHRcdGludGVydmFsVG91cGRhdGVEcnVtQXBwZWFyYW5jZSA9IFV0aWxzLmludGVydmFsIDEvMzAsIHVwZGF0ZURydW1BcHBlYXJhbmNlICAgIFxuXG5cdGxpc3RMYXllci5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9Plx0XHRcblx0XHRjbGVhckludGVydmFsKGludGVydmFsVG91cGRhdGVEcnVtQXBwZWFyYW5jZSlcblxuXHRcdCMgRW1pdCBhZnRlciBhbGwgbW92ZW1lbnQgZW5kcyBpbiB0aGUgbGlzdFxuXHRcdEBkcnVtQ29udGFpbmVyLmVtaXQoXCJEcnVtRmluaXNoZWRDaGFuZ2luZ1wiLCB7bGlzdDogbGlzdE5hbWUsIGluZGV4OiBAaW5kZXgsIHZhbHVlOiBAdmFsfSlcblxuXHR1cGRhdGVEcnVtQXBwZWFyYW5jZSA9ID0+XG5cdFx0aXRlbXNJbkRydW0gPSA0XG5cdFx0bGlzdFBvc2l0aW9uID0gbGlzdExheWVyLnkgLyAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgLSAwLjVcblx0XHRjYXBwZWRMaXN0UG9zaXRpb24gPSBNYXRoLm1heCgwLCBNYXRoLm1pbihsaXN0TGF5ZXIueSAvIC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodCAtIDAuNSwgbGlzdEl0ZW1zLmxlbmd0aCAtIDEpKVxuXHRcdGZvY3VzSXRlbSA9IE1hdGgucm91bmQoY2FwcGVkTGlzdFBvc2l0aW9uKVxuXHRcdGRpc3RhbmNlRnJvbU1pZGRsZSA9IE1hdGguYWJzKGZvY3VzSXRlbSAtIGNhcHBlZExpc3RQb3NpdGlvbilcblx0XHRmb3IgaSBpbiBbKGZvY3VzSXRlbS1pdGVtc0luRHJ1bSkuLihmb2N1c0l0ZW0raXRlbXNJbkRydW0pXVxuXHRcdFx0aWYgaSA+PSAwIGFuZCBpIDwgbGlzdEl0ZW1zLmxlbmd0aFxuXHRcdFx0XHRsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLm9wYWNpdHkgPSAxIC0gTWF0aC5hYnMobGlzdFBvc2l0aW9uIC0gaSkvNSAtIChpZiAoaSAhPSBmb2N1c0l0ZW0pIHRoZW4gMC4zIGVsc2UgMClcblx0XHRcdFx0bGlzdExheWVyLnN1YkxheWVyc1tpXS5zY2FsZVkgPSAxIC0gTWF0aC5taW4oMSwgTWF0aC5hYnMobGlzdFBvc2l0aW9uIC0gaSkvNClcblx0XHRcdFx0bGlzdExheWVyLnN1YkxheWVyc1tpXS55ID0gbGlzdExheWVyLnN1YkxheWVyc1tpXS5zdGFydFkgLSAoaS1saXN0UG9zaXRpb24pKk1hdGguYWJzKGktbGlzdFBvc2l0aW9uKSoxMFxuXG5cdFx0IyBVcGRhdGUgdGhlIHZhbHVlIG9mIHRoZSBkcnVtIG9ubHkgd2hlbiBhIG5ldyB2YWx1ZSBpcyByZWFjaGVkXG5cdFx0aWYgKEBpbmRleCAhPSBmb2N1c0l0ZW0pXG5cdFx0XHR1cGRhdGVEcnVtVmFsdWVzKGZvY3VzSXRlbSlcblx0XHRcblx0c3RvcERydW0gPSA9Plx0XHRcblx0XHQjIEVuc3VyZSB0aGUgZHJ1bSBuZXZlciBlbmRzIG91dCBvZiBib3VuZHNcblx0XHRpZiBsaXN0TGF5ZXIueSA+IGxpc3RNaW5ZUG9zIFxuXHRcdFx0bGlzdExheWVyLmFuaW1hdGUoe1xuXHRcdCAgICBcdHByb3BlcnRpZXM6IHt5Omxpc3RNaW5ZUG9zfVxuXHRcdCAgICBcdGN1cnZlOiBcInNwcmluZyg0MDAsNTAsMClcIlxuXHRcdFx0fSlcblx0XHRpZiBsaXN0TGF5ZXIueSA8IGxpc3RNYXhZUG9zXG5cdFx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt5OiBsaXN0TWF4WVBvc31cblx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDQwMCw1MCwwKVwiXG5cdFx0XHR9KVxuXHRcblx0IyBVcGRhdGUgdGhlIHZhbHVlcyBvZiB0aGUgZHJ1bXMgYW5kIGludm9rZSB0aGUgY2FsbGJhY2sgXG5cdHVwZGF0ZURydW1WYWx1ZXMgPSAobmV3SW5kZXgpID0+XG5cdFx0QGluZGV4ID0gbmV3SW5kZXhcblx0XHRAdmFsID0gbGlzdEl0ZW1zW0BpbmRleF1cblx0XHRAZHJ1bUNvbnRhaW5lci5lbWl0KFwiRHJ1bURpZENoYW5nZVwiLCB7bGlzdDogbGlzdE5hbWUsIGluZGV4OiBAaW5kZXgsIHZhbHVlOiBAdmFsfSlcblx0XG5cdCMgUmVuZGVyIGZvciB0aGUgZmlyc3QgdGltZVx0XHRcblx0dXBkYXRlRHJ1bUFwcGVhcmFuY2UoKVxuXHRcblx0QHNldEluZGV4ID0gKGluZGV4KSA9PlxuXHRcdHlQb3NpdGlvbkZvclRoaXNJbmRleCA9IC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yIC0gKGluZGV4ICogZGVmYXVsdHMudGFibGVSb3dIZWlnaHQpXG5cdFx0bGlzdExheWVyLmFuaW1hdGUoe1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eTogeVBvc2l0aW9uRm9yVGhpc0luZGV4fVxuXHRcdFx0XHR0aW1lOiAwLjVcblx0XHRcdFx0Y3VydmU6IFwiZWFzZS1vdXRcIlxuXHRcdFx0fSlcblxuXHRAc2V0VmFsdWUgPSAodmFsKSA9PlxuXHRcdGluZGV4ID0gbGlzdEl0ZW1zLmluZGV4T2YodmFsKVxuXHRcdGlmIGluZGV4ICE9IC0xXG5cdFx0XHRAc2V0SW5kZXgoaW5kZXgpXG5cblx0IyBSZXR1cm4gdGhlIGRydW0gb2JqZWN0IHNvIHdlIGNhbiBhY2Nlc3MgaXRzIHZhbHVlc1xuXHRyZXR1cm4gQFxuXG5cbiMjI1xuXHRQSUNLRVJcblx0VGhpcyBjb250YWlucyB0aGUgcGlja2VyIFxuIyMjIFxuZXhwb3J0cy5QaWNrZXIgPSAocGFyYW1zKSAtPlxuXHRcblx0cGFyYW1zID0gcGFyYW1zIHx8IHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLFxuXHRcdHg6IFx0XHQwXG5cdFx0eTogXHRcdDBcblx0XHR3aWR0aDpcdGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0ZGVmYXVsdFRleHQ6IFwiXCJcblx0XHR0ZXh0Q29sb3I6IGRlZmF1bHRzLnRpbnRcblxuXHRkcnVtQ29udGFpbmVySGVpZ2h0ID0gZGVmYXVsdHMudGFibGVSb3dIZWlnaHQqNVxuXG5cdEBwaWNrZXJDb250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0cGFyYW1zLnhcblx0XHR5Olx0XHRwYXJhbXMueVxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZHJ1bUNvbnRhaW5lckhlaWdodCs4OFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRkZWZhdWx0cy5pdGVtQmFja2dyb3VuZFxuXHRcdFx0XG5cdEBkcnVtID0gbmV3IExheWVyXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0ODhcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6IGRydW1Db250YWluZXJIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwibm9uZVwiXG5cdFx0c3VwZXJMYXllcjogQHBpY2tlckNvbnRhaW5lclx0XHRcblx0XHRcblx0QHNlbGVjdGVkSXRlbSA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTogXHRcdGRydW1Db250YWluZXJIZWlnaHQvMiAtIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIm5vbmVcIlxuXHRcdHN1cGVyTGF5ZXI6IEBkcnVtXG5cblx0QHBpY2tlckNvbnRhaW5lci5waWNrZXJIZWFkZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0MFxuXHRcdHk6IFx0XHQwXG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0Olx0ODhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGRlZmF1bHRzLml0ZW1CYWNrZ3JvdW5kXG5cdFx0c3VwZXJMYXllcjogQHBpY2tlckNvbnRhaW5lclxuXHRcdFxuXHQjIFN0eWxlc1xuXHRAZHJ1bS5zdHlsZSA9XG5cdFx0cG9pbnRlckV2ZW50czogXCJub25lXCJcblx0XHRib3JkZXJUb3A6IFwiMXB4IHNvbGlkIFwiICsgZGVmYXVsdHMubGluZVRpbnRcblx0XHRib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIFwiICsgZGVmYXVsdHMubGluZVRpbnRcblx0XG5cdEBzZWxlY3RlZEl0ZW0uc3R5bGUgPVxuXHRcdHBvaW50ZXJFdmVudHM6IFwibm9uZVwiXG5cdFx0Ym9yZGVyVG9wOiBcIjFweCBzb2xpZCByZ2JhKDAsMCwwLDAuMylcIlxuXHRcdGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgwLDAsMCwwLjMpXCJcblx0XHRcblx0QHBpY2tlckNvbnRhaW5lci5waWNrZXJIZWFkZXIuc3R5bGUgPSBkZWZhdWx0cy5saXN0SXRlbVRleHRTdHlsZVxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlci5zdHlsZSA9IFxuXHRcdGNvbG9yOiBwYXJhbXMudGV4dENvbG9yXG5cdFx0cGFkZGluZ0xlZnQ6IFwiMjBweFwiXG5cdFx0Ym9yZGVyVG9wOiBcIjFweCBzb2xpZCBcIiArIGRlZmF1bHRzLmxpbmVUaW50XG5cdFx0XHRcblx0QHBpY2tlckNvbnRhaW5lci5waWNrZXJIZWFkZXIuaHRtbCA9IHBhcmFtcy5kZWZhdWx0VGV4dFxuXHRcdFxuXHRcdFxuXHQjIEFkZCBkcnVtc1xuXHRAcGlja2VyQ29udGFpbmVyLmRydW1zID0gW11cblx0QHBpY2tlckNvbnRhaW5lci5kcnVtc0J5TmFtZSA9IHt9XG5cdFxuXHRwaWNrZXJTdGFydGVkTW92aW5nID0gKCk9PlxuXHRcdGRydW1WYWx1ZXMgPSB7fVxuXHRcdG5ld1ZhbHVlcyA9IGZvciBkcnVtIGluIEBwaWNrZXJDb250YWluZXIuZHJ1bXNcblx0XHRcdGRydW1WYWx1ZXNbZHJ1bS5uYW1lXSA9IHtpbmRleDogZHJ1bS5pbmRleCwgdmFsOiBkcnVtLnZhbCwgdmVsb2NpdHk6IDB9XHRcblx0XHRAcGlja2VyQ29udGFpbmVyLmVtaXQoXCJQaWNrZXJTdGFydGVkTW92aW5nXCIgKVxuXHRcdFxuXHRwaWNrZXJEaWRDaGFuZ2UgPSAoKT0+XG5cdFx0ZHJ1bVZhbHVlcyA9IHt9XG5cdFx0bmV3VmFsdWVzID0gZm9yIGRydW0gaW4gQHBpY2tlckNvbnRhaW5lci5kcnVtc1xuXHRcdFx0ZHJ1bVZhbHVlc1tkcnVtLm5hbWVdID0ge2luZGV4OiBkcnVtLmluZGV4LCB2YWw6IGRydW0udmFsfVxuXG5cdFx0QHBpY2tlckNvbnRhaW5lci5lbWl0KFwiUGlja2VyRGlkQ2hhbmdlXCIsIGRydW1WYWx1ZXMgKVxuXHRcblx0cGlja2VyRmluaXNoZWRDaGFuZ2luZyA9ICgpPT5cblx0XHRkcnVtVmFsdWVzID0ge31cblx0XHRuZXdWYWx1ZXMgPSBmb3IgZHJ1bSBpbiBAcGlja2VyQ29udGFpbmVyLmRydW1zXG5cdFx0XHRkcnVtVmFsdWVzW2RydW0ubmFtZV0gPSB7aW5kZXg6IGRydW0uaW5kZXgsIHZhbDogZHJ1bS52YWx9XG5cblx0XHRAcGlja2VyQ29udGFpbmVyLmVtaXQoXCJQaWNrZXJGaW5pc2hlZENoYW5naW5nXCIsIGRydW1WYWx1ZXMgKVx0XG5cdGlmIChwYXJhbXMuZHJ1bXMgYW5kIHBhcmFtcy5kcnVtcy5sZW5ndGggPiAwKVxuXHRcdGZvciBkcnVtIGluIHBhcmFtcy5kcnVtc1xuXHRcdFx0bmV3RHJ1bSA9IG5ldyBEcnVtKEBkcnVtLCBkcnVtLm5hbWUsIGRydW0uaXRlbXMsIGRydW0ucGFyYW1zKVxuXG5cdFx0XHQjIyBTdG9yZSBkcnVtcyBpbnNpZGUgdGhlIHBpY2tlclxuXHRcdFx0QHBpY2tlckNvbnRhaW5lci5kcnVtcy5wdXNoKG5ld0RydW0pXG5cdFx0XHRAcGlja2VyQ29udGFpbmVyLmRydW1zQnlOYW1lW2RydW0ubmFtZV0gPSBuZXdEcnVtIFxuXG5cdFx0XHQjIyBFbnN1cmUgdGhhdCBjaGFuZ2VzIHRvIHRoZSBkcnVtIGJ1YmJsZSB1cCB0byB0aGUgcGlja2VyXG5cdFx0XHRuZXdEcnVtLmRydW1Db250YWluZXIub24gXCJEcnVtRGlkQ2hhbmdlXCIsIHBpY2tlckRpZENoYW5nZVxuXHRcdFx0XG5cdFx0XHQjIyBFbWl0IGFuIGV2ZW50IHdoZW4gZHJ1bXMgc3RvcCBtb3ZpbmcgYWx0b2dldGhlclxuXHRcdFx0bmV3RHJ1bS5kcnVtQ29udGFpbmVyLm9uIFwiRHJ1bUZpbmlzaGVkQ2hhbmdpbmdcIiwgcGlja2VyRmluaXNoZWRDaGFuZ2luZ1xuXG5cdFx0XHQjIyBFbWl0IGFuIGV2ZW50IHdoZW4gbGlzdHMgc3RvcCBtb3ZpbmcgYWx0b2dldGhlclxuXHRcdFx0bmV3RHJ1bS5kcnVtQ29udGFpbmVyLm9uIFwiRHJ1bVN0YXJ0ZWRNb3ZpbmdcIiwgcGlja2VyU3RhcnRlZE1vdmluZ1xuXG5cblx0cmV0dXJuIEBwaWNrZXJDb250YWluZXJcbiJdfQ==
