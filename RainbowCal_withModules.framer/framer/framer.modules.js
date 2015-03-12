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

defaults.switchTint = '#1DC24B';

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

defaults.pickerTextStyle = {
  fontSize: "42px",
  fontFamily: "Helvetica Neue",
  fontWeight: "200"
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
    switchTint: defaults.switchTint,
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
    switchTint: defaults.switchTint,
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
  this.listItemContainer.selected = (function(_this) {
    return function() {
      return _this.selected;
    };
  })(this);
  this.listItemContainer.updateLabel(params.name);
  return this.listItemContainer;
};

exports.TableView = function(params) {
  var attachDefaultValidation, attachRadioButtonValidation, buttonName, firstItemInList, i, j, lastItemInList, len, newButton, ref;
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
      var buttonClicked, buttonGroupContainer, indexOfButtonClicked, k, len1, results;
      buttonGroupContainer = _this.buttonGroupContainer;
      results = [];
      for (indexOfButtonClicked = k = 0, len1 = buttonArray.length; k < len1; indexOfButtonClicked = ++k) {
        buttonClicked = buttonArray[indexOfButtonClicked];
        buttonClicked.deselect({
          supressEvents: true
        });
        results.push((function(buttonClicked, indexOfButtonClicked) {
          return buttonClicked.on('DidChange', (function(_this) {
            return function(event) {
              var l, len2, otherButton, otherButtonIndex;
              for (otherButtonIndex = l = 0, len2 = buttonArray.length; l < len2; otherButtonIndex = ++l) {
                otherButton = buttonArray[otherButtonIndex];
                if (otherButtonIndex !== indexOfButtonClicked) {
                  otherButton.deselect({
                    suppressEvents: true
                  });
                }
              }
              return buttonGroupContainer.emit("DidChange", {
                selected: indexOfButtonClicked,
                numSelected: 1,
                buttons: buttonArray
              });
            };
          })(this));
        })(buttonClicked, indexOfButtonClicked));
      }
      return results;
    };
  })(this);
  attachDefaultValidation = (function(_this) {
    return function(buttonArray) {
      var buttonClicked, buttonGroupContainer, indexOfButtonClicked, k, len1, results;
      buttonGroupContainer = _this.buttonGroupContainer;
      results = [];
      for (indexOfButtonClicked = k = 0, len1 = buttonArray.length; k < len1; indexOfButtonClicked = ++k) {
        buttonClicked = buttonArray[indexOfButtonClicked];
        buttonClicked.deselect({
          supressEvents: true
        });
        results.push((function(buttonClicked, indexOfButtonClicked) {
          return buttonClicked.on('DidChange', (function(_this) {
            return function(event) {
              var button, l, len2, numSelected, tableViewStates;
              numSelected = 0;
              tableViewStates = [];
              for (l = 0, len2 = buttonArray.length; l < len2; l++) {
                button = buttonArray[l];
                tableViewStates.push(button.selected());
                if (button.selected()) {
                  numSelected++;
                }
              }
              return buttonGroupContainer.emit("DidChange", {
                selected: tableViewStates,
                numSelected: numSelected,
                buttons: buttonArray
              });
            };
          })(this));
        })(buttonClicked, indexOfButtonClicked));
      }
      return results;
    };
  })(this);
  if (params.validation === 'radio') {
    attachRadioButtonValidation(this.buttonArray);
  } else {
    attachDefaultValidation(this.buttonArray);
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

Drum = function(parentDrumLayer, drumName, listItems, params) {
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
  this.name = drumName;
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
      fontFamily: defaults.pickerTextStyle.fontFamily,
      fontWeight: defaults.pickerTextStyle.fontWeight,
      fontSize: defaults.pickerTextStyle.fontSize,
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
        list: drumName,
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
        list: drumName,
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



},{}],"moment":[function(require,module,exports){
(function (global){
//! moment.js
//! version : 2.9.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {
    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = '2.9.0',
        // the global-scope this is NOT the global object in Node.js
        globalScope = (typeof global !== 'undefined' && (typeof window === 'undefined' || window === global.window)) ? global : this,
        oldGlobalMoment,
        round = Math.round,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for locale config files
        locales = {},

        // extra moment internal properties (plugins register props here)
        momentProperties = [],

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module && module.exports),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenOffsetMs = /[\+\-]?\d+/, // 1234567890123
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker '+10:00' > ['10', '00'] or '-1530' > ['-', '15', '30']
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            W : 'isoWeek',
            M : 'month',
            Q : 'quarter',
            y : 'year',
            DDD : 'dayOfYear',
            e : 'weekday',
            E : 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear : 'dayOfYear',
            isoweekday : 'isoWeekday',
            isoweek : 'isoWeek',
            weekyear : 'weekYear',
            isoweekyear : 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // default relative time thresholds
        relativeTimeThresholds = {
            s: 45,  // seconds to minute
            m: 45,  // minutes to hour
            h: 22,  // hours to day
            d: 26,  // days to month
            M: 11   // months to year
        },

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.localeData().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.localeData().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.localeData().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.localeData().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.localeData().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY : function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = this.utcOffset(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ':' + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = this.utcOffset(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            x    : function () {
                return this.valueOf();
            },
            X    : function () {
                return this.unix();
            },
            Q : function () {
                return this.quarter();
            }
        },

        deprecations = {},

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'],

        updateInProgress = false;

    // Pick the first defined of two or three arguments. dfl comes from
    // default.
    function dfl(a, b, c) {
        switch (arguments.length) {
            case 2: return a != null ? a : b;
            case 3: return a != null ? a : b != null ? b : c;
            default: throw new Error('Implement me');
        }
    }

    function hasOwnProp(a, b) {
        return hasOwnProperty.call(a, b);
    }

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function printMsg(msg) {
        if (moment.suppressDeprecationWarnings === false &&
                typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function () {
            if (firstTime) {
                printMsg(msg);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            printMsg(msg);
            deprecations[name] = true;
        }
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.localeData().ordinal(func.call(this, a), period);
        };
    }

    function monthDiff(a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // thie is not supposed to happen
            return hour;
        }
    }

    /************************************
        Constructors
    ************************************/

    function Locale() {
    }

    // Moment prototype object
    function Moment(config, skipOverflow) {
        if (skipOverflow !== false) {
            checkOverflow(config);
        }
        copyConfig(this, config);
        this._d = new Date(+config._d);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            moment.updateOffset(this);
            updateInProgress = false;
        }
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = moment.localeData();

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = from._pf;
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = makeAs(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = moment.duration(val, period);
            addOrSubtractDurationFromMoment(this, dur, direction);
            return this;
        };
    }

    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);
        }
        if (months) {
            rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            moment.updateOffset(mom, days || months);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return Object.prototype.toString.call(input) === '[object Date]' ||
            input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment._locale[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment._locale, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function weeksInYear(year, dow, doy) {
        return weekOfYear(moment([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 24 ||
                    (m._a[HOUR] === 24 && (m._a[MINUTE] !== 0 ||
                                           m._a[SECOND] !== 0 ||
                                           m._a[MILLISECOND] !== 0)) ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0 &&
                    m._pf.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        if (!locales[name] && hasModule) {
            try {
                oldLocale = moment.locale();
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we want to undo that for lazy loaded locales
                moment.locale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // Return a moment from input, that is local/utc/utcOffset equivalent to
    // model.
    function makeAs(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (moment.isMoment(input) || isDate(input) ?
                    +input : +moment(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            moment.updateOffset(res, false);
            return res;
        } else {
            return moment(input).local();
        }
    }

    /************************************
        Locale
    ************************************/


    extend(Locale.prototype, {

        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
            // Lenient ordinal parsing accepts just a number in addition to
            // number + (possibly) stuff coming from _ordinalParseLenient.
            this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + /\d{1,2}/.source);
        },

        _months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName, format, strict) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
                this._longMonthsParse = [];
                this._shortMonthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                mom = moment.utc([2000, i]);
                if (strict && !this._longMonthsParse[i]) {
                    this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                    this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
                }
                if (!strict && !this._monthsParse[i]) {
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                    return i;
                } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                    return i;
                } else if (!strict && this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LTS : 'h:mm:ss A',
            LT : 'h:mm A',
            L : 'MM/DD/YYYY',
            LL : 'MMMM D, YYYY',
            LLL : 'MMMM D, YYYY LT',
            LLLL : 'dddd, MMMM D, YYYY LT'
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },


        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom, now) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom, [now]) : output;
        },

        _relativeTime : {
            future : 'in %s',
            past : '%s ago',
            s : 'a few seconds',
            m : 'a minute',
            mm : '%d minutes',
            h : 'an hour',
            hh : '%d hours',
            d : 'a day',
            dd : '%d days',
            M : 'a month',
            MM : '%d months',
            y : 'a year',
            yy : '%d years'
        },

        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },

        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace('%d', number);
        },
        _ordinal : '%d',
        _ordinalParse : /\d{1,2}/,

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        firstDayOfWeek : function () {
            return this._week.dow;
        },

        firstDayOfYear : function () {
            return this._week.doy;
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
        case 'Q':
            return parseTokenOneDigit;
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
        case 'GGGG':
        case 'gggg':
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
        case 'Y':
        case 'G':
        case 'g':
            return parseTokenSignedNumber;
        case 'YYYYYY':
        case 'YYYYY':
        case 'GGGGG':
        case 'ggggg':
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
        case 'S':
            if (strict) {
                return parseTokenOneDigit;
            }
            /* falls through */
        case 'SS':
            if (strict) {
                return parseTokenTwoDigits;
            }
            /* falls through */
        case 'SSS':
            if (strict) {
                return parseTokenThreeDigits;
            }
            /* falls through */
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
            return parseTokenWord;
        case 'a':
        case 'A':
            return config._locale._meridiemParse;
        case 'x':
            return parseTokenOffsetMs;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'SSSS':
            return parseTokenDigits;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'GG':
        case 'gg':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'ww':
        case 'WW':
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'W':
        case 'e':
        case 'E':
            return parseTokenOneOrTwoDigits;
        case 'Do':
            return strict ? config._locale._ordinalParse : config._locale._ordinalParseLenient;
        default :
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), 'i'));
            return a;
        }
    }

    function utcOffsetFromString(string) {
        string = string || '';
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
        // QUARTER
        case 'Q':
            if (input != null) {
                datePartArray[MONTH] = (toInt(input) - 1) * 3;
            }
            break;
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            if (input != null) {
                datePartArray[MONTH] = toInt(input) - 1;
            }
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = config._locale.monthsParse(input, token, config._strict);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[MONTH] = a;
            } else {
                config._pf.invalidMonth = input;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DD
        case 'DD' :
            if (input != null) {
                datePartArray[DATE] = toInt(input);
            }
            break;
        case 'Do' :
            if (input != null) {
                datePartArray[DATE] = toInt(parseInt(
                            input.match(/\d{1,2}/)[0], 10));
            }
            break;
        // DAY OF YEAR
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                config._dayOfYear = toInt(input);
            }

            break;
        // YEAR
        case 'YY' :
            datePartArray[YEAR] = moment.parseTwoDigitYear(input);
            break;
        case 'YYYY' :
        case 'YYYYY' :
        case 'YYYYYY' :
            datePartArray[YEAR] = toInt(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._meridiem = input;
            // config._isPm = config._locale.isPM(input);
            break;
        // HOUR
        case 'h' : // fall through to hh
        case 'hh' :
            config._pf.bigHour = true;
            /* falls through */
        case 'H' : // fall through to HH
        case 'HH' :
            datePartArray[HOUR] = toInt(input);
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[MINUTE] = toInt(input);
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[SECOND] = toInt(input);
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
        case 'SSSS' :
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
            break;
        // UNIX OFFSET (MILLISECONDS)
        case 'x':
            config._d = new Date(toInt(input));
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = utcOffsetFromString(input);
            break;
        // WEEKDAY - human
        case 'dd':
        case 'ddd':
        case 'dddd':
            a = config._locale.weekdaysParse(input);
            // if we didn't get a weekday name, mark the date as invalid
            if (a != null) {
                config._w = config._w || {};
                config._w['d'] = a;
            } else {
                config._pf.invalidWeekday = input;
            }
            break;
        // WEEK, WEEK DAY - numeric
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'e':
        case 'E':
            token = token.substr(0, 1);
            /* falls through */
        case 'gggg':
        case 'GGGG':
        case 'GGGGG':
            token = token.substr(0, 2);
            if (input) {
                config._w = config._w || {};
                config._w[token] = toInt(input);
            }
            break;
        case 'gg':
        case 'GG':
            config._w = config._w || {};
            config._w[token] = moment.parseTwoDigitYear(input);
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year);
            week = dfl(w.W, 1);
            weekday = dfl(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year);
            week = dfl(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day || normalizedInput.date,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {
        if (config._f === moment.ISO_8601) {
            parseISO(config);
            return;
        }

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._pf.bigHour === true && config._a[HOUR] <= 12) {
            config._pf.bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR],
                config._meridiem);
        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function parseISO(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be 'T' or undefined
                    config._f = isoDates[i][0] + (match[6] || ' ');
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += 'Z';
            }
            makeDateFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function makeDateFromString(config) {
        parseISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            moment.createFromInputFallback(config);
        }
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function makeDateFromInput(config) {
        var input = config._i, matched;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if ((matched = aspNetJsonRegex.exec(input)) !== null) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            dateFromConfig(config);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            moment.createFromInputFallback(config);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, locale) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = locale.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(posNegDuration, withoutSuffix, locale) {
        var duration = moment.duration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            years = round(duration.as('y')),

            args = seconds < relativeTimeThresholds.s && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < relativeTimeThresholds.m && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < relativeTimeThresholds.h && ['hh', hours] ||
                days === 1 && ['d'] ||
                days < relativeTimeThresholds.d && ['dd', days] ||
                months === 1 && ['M'] ||
                months < relativeTimeThresholds.M && ['MM', months] ||
                years === 1 && ['y'] || ['yy', years];

        args[2] = withoutSuffix;
        args[3] = +posNegDuration > 0;
        args[4] = locale;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        d = d === 0 ? 7 : d;
        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f,
            res;

        config._locale = config._locale || moment.localeData(config._l);

        if (input === null || (format === undefined && input === '')) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (moment.isMoment(input)) {
            return new Moment(input, true);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        res = new Moment(config);
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    moment = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = locale;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    moment.suppressDeprecationWarnings = false;

    moment.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return moment();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    moment.min = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    };

    moment.max = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    };

    // creating with utc
    moment.utc = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso,
            diffRes;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' &&
                ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(moment(duration.from), moment(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // constant that refers to the ISO standard
    moment.ISO_8601 = function () {};

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    moment.momentProperties = momentProperties;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function allows you to set a threshold for relative time strings
    moment.relativeTimeThreshold = function (threshold, limit) {
        if (relativeTimeThresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return relativeTimeThresholds[threshold];
        }
        relativeTimeThresholds[threshold] = limit;
        return true;
    };

    moment.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        function (key, value) {
            return moment.locale(key, value);
        }
    );

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    moment.locale = function (key, values) {
        var data;
        if (key) {
            if (typeof(values) !== 'undefined') {
                data = moment.defineLocale(key, values);
            }
            else {
                data = moment.localeData(key);
            }

            if (data) {
                moment.duration._locale = moment._locale = data;
            }
        }

        return moment._locale._abbr;
    };

    moment.defineLocale = function (name, values) {
        if (values !== null) {
            values.abbr = name;
            if (!locales[name]) {
                locales[name] = new Locale();
            }
            locales[name].set(values);

            // backwards compat for now: also set the locale
            moment.locale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    };

    moment.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        function (key) {
            return moment.localeData(key);
        }
    );

    // returns locale data
    moment.localeData = function (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return moment._locale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null && hasOwnProp(obj, '_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function () {
        return moment.apply(null, arguments).parseZone();
    };

    moment.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    moment.isDate = isDate;

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d - ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                if ('function' === typeof Date.prototype.toISOString) {
                    // native implementation is ~50x faster, use it when we can
                    return this.toDate().toISOString();
                } else {
                    return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
                }
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        isDSTShifted : function () {
            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function (keepLocalTime) {
            return this.utcOffset(0, keepLocalTime);
        },

        local : function (keepLocalTime) {
            if (this._isUTC) {
                this.utcOffset(0, keepLocalTime);
                this._isUTC = false;

                if (keepLocalTime) {
                    this.subtract(this._dateUtcOffset(), 'm');
                }
            }
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.localeData().postformat(output);
        },

        add : createAdder(1, 'add'),

        subtract : createAdder(-1, 'subtract'),

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (that.utcOffset() - this.utcOffset()) * 6e4,
                anchor, diff, output, daysAdjust;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month' || units === 'quarter') {
                output = monthDiff(this, that);
                if (units === 'quarter') {
                    output = output / 3;
                } else if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = this - that;
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function (time) {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're locat/utc/offset
            // or not.
            var now = time || moment(),
                sod = makeAs(now, this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                    diff < 2 ? 'nextDay' :
                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.localeData().calendar(format, this, moment(now)));
        },

        isLeapYear : function () {
            return isLeapYear(this.year());
        },

        isDST : function () {
            return (this.utcOffset() > this.clone().month(0).utcOffset() ||
                this.utcOffset() > this.clone().month(5).utcOffset());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.localeData());
                return this.add(input - day, 'd');
            } else {
                return day;
            }
        },

        month : makeAccessor('Month', true),

        startOf : function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            // quarters are also special
            if (units === 'quarter') {
                this.month(Math.floor(this.month() / 3) * 3);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            if (units === undefined || units === 'millisecond') {
                return this;
            }
            return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
        },

        isAfter: function (input, units) {
            var inputMs;
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this > +input;
            } else {
                inputMs = moment.isMoment(input) ? +input : +moment(input);
                return inputMs < +this.clone().startOf(units);
            }
        },

        isBefore: function (input, units) {
            var inputMs;
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this < +input;
            } else {
                inputMs = moment.isMoment(input) ? +input : +moment(input);
                return +this.clone().endOf(units) < inputMs;
            }
        },

        isBetween: function (from, to, units) {
            return this.isAfter(from, units) && this.isBefore(to, units);
        },

        isSame: function (input, units) {
            var inputMs;
            units = normalizeUnits(units || 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this === +input;
            } else {
                inputMs = +moment(input);
                return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
            }
        },

        min: deprecate(
                 'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
                 function (other) {
                     other = moment.apply(null, arguments);
                     return other < this ? this : other;
                 }
         ),

        max: deprecate(
                'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
                function (other) {
                    other = moment.apply(null, arguments);
                    return other > this ? this : other;
                }
        ),

        zone : deprecate(
                'moment().zone is deprecated, use moment().utcOffset instead. ' +
                'https://github.com/moment/moment/issues/1779',
                function (input, keepLocalTime) {
                    if (input != null) {
                        if (typeof input !== 'string') {
                            input = -input;
                        }

                        this.utcOffset(input, keepLocalTime);

                        return this;
                    } else {
                        return -this.utcOffset();
                    }
                }
        ),

        // keepLocalTime = true means only change the timezone, without
        // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
        // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
        // +0200, so we adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.
        utcOffset : function (input, keepLocalTime) {
            var offset = this._offset || 0,
                localAdjust;
            if (input != null) {
                if (typeof input === 'string') {
                    input = utcOffsetFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                if (!this._isUTC && keepLocalTime) {
                    localAdjust = this._dateUtcOffset();
                }
                this._offset = input;
                this._isUTC = true;
                if (localAdjust != null) {
                    this.add(localAdjust, 'm');
                }
                if (offset !== input) {
                    if (!keepLocalTime || this._changeInProgress) {
                        addOrSubtractDurationFromMoment(this,
                                moment.duration(input - offset, 'm'), 1, false);
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        moment.updateOffset(this, true);
                        this._changeInProgress = null;
                    }
                }

                return this;
            } else {
                return this._isUTC ? offset : this._dateUtcOffset();
            }
        },

        isLocal : function () {
            return !this._isUTC;
        },

        isUtcOffset : function () {
            return this._isUTC;
        },

        isUtc : function () {
            return this._isUTC && this._offset === 0;
        },

        zoneAbbr : function () {
            return this._isUTC ? 'UTC' : '';
        },

        zoneName : function () {
            return this._isUTC ? 'Coordinated Universal Time' : '';
        },

        parseZone : function () {
            if (this._tzm) {
                this.utcOffset(this._tzm);
            } else if (typeof this._i === 'string') {
                this.utcOffset(utcOffsetFromString(this._i));
            }
            return this;
        },

        hasAlignedHourOffset : function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).utcOffset();
            }

            return (this.utcOffset() - input) % 60 === 0;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
        },

        quarter : function (input) {
            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        week : function (input) {
            var week = this.localeData().week(this);
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return input == null ? weekday : this.add(input - weekday, 'd');
        },

        isoWeekday : function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        isoWeeksInYear : function () {
            return weeksInYear(this.year(), 1, 4);
        },

        weeksInYear : function () {
            var weekInfo = this.localeData()._week;
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            var unit;
            if (typeof units === 'object') {
                for (unit in units) {
                    this.set(unit, units[unit]);
                }
            }
            else {
                units = normalizeUnits(units);
                if (typeof this[units] === 'function') {
                    this[units](value);
                }
            }
            return this;
        },

        // If passed a locale key, it will set the locale for this
        // instance.  Otherwise, it will return the locale configuration
        // variables for this instance.
        locale : function (key) {
            var newLocaleData;

            if (key === undefined) {
                return this._locale._abbr;
            } else {
                newLocaleData = moment.localeData(key);
                if (newLocaleData != null) {
                    this._locale = newLocaleData;
                }
                return this;
            }
        },

        lang : deprecate(
            'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
            function (key) {
                if (key === undefined) {
                    return this.localeData();
                } else {
                    return this.locale(key);
                }
            }
        ),

        localeData : function () {
            return this._locale;
        },

        _dateUtcOffset : function () {
            // On Firefox.24 Date#getTimezoneOffset returns a floating point.
            // https://github.com/moment/moment/pull/1871
            return -Math.round(this._d.getTimezoneOffset() / 15) * 15;
        }

    });

    function rawMonthSetter(mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(),
                daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function rawGetter(mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function rawSetter(mom, unit, value) {
        if (unit === 'Month') {
            return rawMonthSetter(mom, value);
        } else {
            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    function makeAccessor(unit, keepTime) {
        return function (value) {
            if (value != null) {
                rawSetter(this, unit, value);
                moment.updateOffset(this, keepTime);
                return this;
            } else {
                return rawGetter(this, unit);
            }
        };
    }

    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
    // moment.fn.month is defined separately
    moment.fn.date = makeAccessor('Date', true);
    moment.fn.dates = deprecate('dates accessor is deprecated. Use date instead.', makeAccessor('Date', true));
    moment.fn.year = makeAccessor('FullYear', true);
    moment.fn.years = deprecate('years accessor is deprecated. Use year instead.', makeAccessor('FullYear', true));

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;
    moment.fn.quarters = moment.fn.quarter;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    // alias isUtc for dev-friendliness
    moment.fn.isUTC = moment.fn.isUtc;

    /************************************
        Duration Prototype
    ************************************/


    function daysToYears (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        return days * 400 / 146097;
    }

    function yearsToDays (years) {
        // years * 365 + absRound(years / 4) -
        //     absRound(years / 100) + absRound(years / 400);
        return years * 146097 / 400;
    }

    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years = 0;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);

            // Accurately convert days to years, assume start from year 0.
            years = absRound(daysToYears(days));
            days -= absRound(yearsToDays(years));

            // 30 days to a month
            // TODO (iskren): Use anchor date (like 1st Jan) to compute this.
            months += absRound(days / 30);
            days %= 30;

            // 12 months -> 1 year
            years += absRound(months / 12);
            months %= 12;

            data.days = days;
            data.months = months;
            data.years = years;
        },

        abs : function () {
            this._milliseconds = Math.abs(this._milliseconds);
            this._days = Math.abs(this._days);
            this._months = Math.abs(this._months);

            this._data.milliseconds = Math.abs(this._data.milliseconds);
            this._data.seconds = Math.abs(this._data.seconds);
            this._data.minutes = Math.abs(this._data.minutes);
            this._data.hours = Math.abs(this._data.hours);
            this._data.months = Math.abs(this._data.months);
            this._data.years = Math.abs(this._data.years);

            return this;
        },

        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var output = relativeTime(this, !withSuffix, this.localeData());

            if (withSuffix) {
                output = this.localeData().pastFuture(+this, output);
            }

            return this.localeData().postformat(output);
        },

        add : function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract : function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            var days, months;
            units = normalizeUnits(units);

            if (units === 'month' || units === 'year') {
                days = this._days + this._milliseconds / 864e5;
                months = this._months + daysToYears(days) * 12;
                return units === 'month' ? months : months / 12;
            } else {
                // handle milliseconds separately because of floating point math errors (issue #1867)
                days = this._days + Math.round(yearsToDays(this._months / 12));
                switch (units) {
                    case 'week': return days / 7 + this._milliseconds / 6048e5;
                    case 'day': return days + this._milliseconds / 864e5;
                    case 'hour': return days * 24 + this._milliseconds / 36e5;
                    case 'minute': return days * 24 * 60 + this._milliseconds / 6e4;
                    case 'second': return days * 24 * 60 * 60 + this._milliseconds / 1000;
                    // Math.floor prevents floating point math errors here
                    case 'millisecond': return Math.floor(days * 24 * 60 * 60 * 1000) + this._milliseconds;
                    default: throw new Error('Unknown unit ' + units);
                }
            }
        },

        lang : moment.fn.lang,
        locale : moment.fn.locale,

        toIsoString : deprecate(
            'toIsoString() is deprecated. Please use toISOString() instead ' +
            '(notice the capitals)',
            function () {
                return this.toISOString();
            }
        ),

        toISOString : function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        },

        localeData : function () {
            return this._locale;
        },

        toJSON : function () {
            return this.toISOString();
        }
    });

    moment.duration.fn.toString = moment.duration.fn.toISOString;

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    for (i in unitMillisecondFactors) {
        if (hasOwnProp(unitMillisecondFactors, i)) {
            makeDurationGetter(i.toLowerCase());
        }
    }

    moment.duration.fn.asMilliseconds = function () {
        return this.as('ms');
    };
    moment.duration.fn.asSeconds = function () {
        return this.as('s');
    };
    moment.duration.fn.asMinutes = function () {
        return this.as('m');
    };
    moment.duration.fn.asHours = function () {
        return this.as('h');
    };
    moment.duration.fn.asDays = function () {
        return this.as('d');
    };
    moment.duration.fn.asWeeks = function () {
        return this.as('weeks');
    };
    moment.duration.fn.asMonths = function () {
        return this.as('M');
    };
    moment.duration.fn.asYears = function () {
        return this.as('y');
    };

    /************************************
        Default Locale
    ************************************/


    // Set default locale, other locale will inherit from English.
    moment.locale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LOCALES */

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(shouldDeprecate) {
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        oldGlobalMoment = globalScope.moment;
        if (shouldDeprecate) {
            globalScope.moment = deprecate(
                    'Accessing Moment through the global scope is ' +
                    'deprecated, and will be removed in an upcoming ' +
                    'release.',
                    moment);
        } else {
            globalScope.moment = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    } else if (typeof define === 'function' && define.amd) {
        define(function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal === true) {
                // release the global variable
                globalScope.moment = oldGlobalMoment;
            }

            return moment;
        });
        makeGlobal(true);
    } else {
        makeGlobal();
    }
}).call(this);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcmFwaGRhbWljby9Eb2N1bWVudHMvR2l0L2ZyYW1lcktpdC9SYWluYm93Q2FsX3dpdGhNb2R1bGVzLmZyYW1lci9tb2R1bGVzL2ZyYW1lcktpdC5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9yYXBoZGFtaWNvL0RvY3VtZW50cy9HaXQvZnJhbWVyS2l0L1JhaW5ib3dDYWxfd2l0aE1vZHVsZXMuZnJhbWVyL21vZHVsZXMvbW9tZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFBQTs7Ozs7Ozs7Ozs7O0dBQUE7QUFpQkE7QUFBQTs7Ozs7R0FqQkE7QUFBQSxJQUFBLHFEQUFBOztBQUFBLFFBdUJBLEdBQVc7QUFBQSxFQUNWLFdBQUEsRUFBYSxHQURIO0NBdkJYLENBQUE7O0FBMkJBO0FBQUE7O0dBM0JBOztBQUFBLFFBOEJRLENBQUMsY0FBVCxHQUEwQixFQTlCMUIsQ0FBQTs7QUFBQSxRQStCUSxDQUFDLHlCQUFULEdBQXFDLEVBL0JyQyxDQUFBOztBQUFBLFFBZ0NRLENBQUMsSUFBVCxHQUFnQixNQWhDaEIsQ0FBQTs7QUFBQSxRQWlDUSxDQUFDLFFBQVQsR0FBb0IscUJBakNwQixDQUFBOztBQUFBLFFBa0NRLENBQUMsVUFBVCxHQUFzQixTQWxDdEIsQ0FBQTs7QUFBQSxRQW1DUSxDQUFDLGNBQVQsR0FBMEIsT0FuQzFCLENBQUE7O0FBQUEsUUFvQ1EsQ0FBQyxpQkFBVCxHQUE2QjtBQUFBLEVBQzVCLFFBQUEsRUFBVSxNQURrQjtBQUFBLEVBRTVCLFVBQUEsRUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFULEdBQXdCLENBQXpCLENBQUEsR0FBNEIsSUFGWjtBQUFBLEVBRzVCLFVBQUEsRUFBWSxnQkFIZ0I7QUFBQSxFQUk1QixVQUFBLEVBQVksS0FKZ0I7Q0FwQzdCLENBQUE7O0FBQUEsUUEw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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIyNcbiAgRnJhbWVyS2l0IGZvciBGcmFtZXJcbiAgaHR0cHM6Ly9naXRodWIuY29tL3JhcGhkYW1pY28vZnJhbWVyS2l0XG5cbiAgQ29weXJpZ2h0IChjKSAyMDE1LCBSYXBoIEQnQW1pY28gaHR0cDovL3JhcGhkYW1pY28uY29tIChAcmFwaGRhbWljbylcbiAgTUlUIExpY2Vuc2VcblxuICBSZWFkbWU6XG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9yYXBoZGFtaWNvL2ZyYW1lcktpdFxuXG4gIExpY2Vuc2U6XG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9yYXBoZGFtaWNvL2ZyYW1lcktpdC9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4jIyNcblxuXG5cblxuIyMjXG5cdERFRkFVTFQgU1RZTEVTXG5cdE5vdGUgdGhlIHNjcmVlbndpZHRoIGNvbnN0YW50OiB0aGlzIGlzIHByb2JhYmx5IG9uZSBvZiB0aGVcblx0Zmlyc3QgdGhpbmdzIHlvdSB3YW50IHRvIGNoYW5nZSBzbyBpdCBtYXRjaGVzIHRoZSBkZXZpY2Vcblx0eW91J3JlIHByb3RvdHlwaW5nIG9uLlxuIyMjXG5kZWZhdWx0cyA9IHtcblx0c2NyZWVuV2lkdGg6IDc1MFxufVxuXG4jIyNcblx0TU9SRSBTVFlMRVNcbiMjI1xuZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgPSA4OFxuZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZyA9IDIwXG5kZWZhdWx0cy50aW50ID0gJ2dyZXknXG5kZWZhdWx0cy5saW5lVGludCA9IFwicmdiYSgyMDAsMjAwLDIwMCwxKVwiXG5kZWZhdWx0cy5zd2l0Y2hUaW50ID0gJyMxREMyNEInXG5kZWZhdWx0cy5pdGVtQmFja2dyb3VuZCA9ICd3aGl0ZSdcbmRlZmF1bHRzLmxpc3RJdGVtVGV4dFN0eWxlID0ge1xuXHRmb250U2l6ZTogXCIzMnB4XCJcblx0bGluZUhlaWdodDogKGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LTQpK1wicHhcIlx0XHRcblx0Zm9udEZhbWlseTogXCJIZWx2ZXRpY2EgTmV1ZVwiXG5cdGZvbnRXZWlnaHQ6IFwiMjAwXCJcbn1cbmRlZmF1bHRzLmRpdmlkZXJJdGVtVGV4dFN0eWxlID0ge1xuXHRmb250U2l6ZTogXCIyMnB4XCJcblx0bGluZUhlaWdodDogKGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LTQpK1wicHhcIlx0XHRcblx0Zm9udEZhbWlseTogXCJIZWx2ZXRpY2EgTmV1ZVwiXG5cdGZvbnRXZWlnaHQ6IFwiMjAwXCJcblx0dGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZSdcbn1cbmRlZmF1bHRzLnBpY2tlclRleHRTdHlsZSA9IHtcblx0Zm9udFNpemU6IFx0XHRcIjQycHhcIlxuXHRmb250RmFtaWx5OiBcdFwiSGVsdmV0aWNhIE5ldWVcIlxuXHRmb250V2VpZ2h0OiBcdFwiMjAwXCJcbn1cbmV4cG9ydHMuZGVmYXVsdHMgPSBkZWZhdWx0c1xuXG5cbiMjI1xuXHRUQUJMRSBWSUVXIEVMRU1FTlRTXG5cdChlLmcuIFwiVGh1bWJcIiBmb3IgdGhlIHN3aXRjaCBjb250cm9sKVxuIyMjXG5cblN3aXRjaCA9IChwYXJhbXMpIC0+XG5cdHBhcmFtcyA9IHBhcmFtcyBvciB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcywgXG5cdFx0c3dpdGNoVGludDogZGVmYXVsdHMuc3dpdGNoVGludFxuXHRcdHNjcmVlbldpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdHRhYmxlUm93SGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdHN3aXRjaENvbnRhaW5lckJvcmRlcjogNFxuXHRcdHN3aXRjaENvbnRhaW5lckhlaWdodDogNTRcblx0XHRzd2l0Y2hDb250YWluZXJXaWR0aDogOTRcblx0XHRib3JkZXJDb2xvcjogZGVmYXVsdHMubGluZVRpbnQgIyBHcmV5IHJvdW5kZWQgcGlsbCAmIGJvcmRlcnMgYmV0d2VlbiBjZWxsc1xuXG5cdEBzZWxlY3RlZCA9IHRydWVcblx0XG5cdCMgU29tZSBvZiB0aGUgdmFsdWVzIGFyZSBiYXNlZCBvbiBvdGhlciBjb25zdGFudHMsXG5cdCMgc28geW91IGhhdmUgdG8gY2FsY3VsYXRlIHRoZW0gaW4gYSBzZWNvbmQgcGFzc1xuXHRzd2l0Y2hCdXR0b25SYWRpdXMgPSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0LzJcblx0c2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIgPSAyXG5cdFxuXHQjIFRoaXMgaXMgb3VyIGZhbmN5IGFuaW1hdGVkIHN3aXRjaCBzd2l0Y2hcblx0IyB3ZSBuZWVkIHRvIG1ha2UgYSByb3VuZGVkIHJlY3RhbmdsZSB3aXRoIGEgY2lyY2xlIGluc2lkZSBpdC5cblx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRcdFx0XHQwXG5cdFx0eTogXHRcdFx0XHRcdDBcblx0XHRjbGlwOiBcdFx0XHRcdGZhbHNlICMgQ2xpcHBpbmcgaHVydHMgdGhlIHN1YnRsZSBzaGFkb3cgb24gdGhlIGJ1dHRvblxuXHRcdHdpZHRoOlx0XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoIFxuXHRcdGhlaWdodDpcdFx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJcIlxuXHRcdG9wYWNpdHk6IFx0XHRcdDFcblxuXHRAc3dpdGNoQmFja2dyb3VuZCA9IG5ldyBMYXllclxuXHRcdHg6XHRcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyAtIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyLzJcblx0XHR5Olx0XHRcdFx0XHRzd2l0Y2hCdXR0b25SYWRpdXMgLSBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlci8yIC0gNFxuXHRcdHdpZHRoOiBcdFx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJXaWR0aCAtIHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQgKyBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlclxuXHRcdGhlaWdodDogXHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodCAtIHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQgKyBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlclxuXHRcdGJvcmRlclJhZGl1czogXHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHRzaGFkb3dTcHJlYWQ6XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyAtIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyLzIgKyBwYXJhbXMuc3dpdGNoQ29udGFpbmVyQm9yZGVyXG5cdFx0c2hhZG93Q29sb3I6IFx0XHRwYXJhbXMuc3dpdGNoVGludFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHQnJ1xuXHRcdG9wYWNpdHk6IFx0XHRcdDFcblx0XHRzdXBlckxheWVyOiBcdFx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lclxuXHRcdFxuXHRAc3dpdGNoQnV0dG9uID0gbmV3IExheWVyXG5cdFx0eDogcGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoIC0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdHk6IC00XG5cdFx0d2lkdGg6XHRcdFx0XHRzd2l0Y2hCdXR0b25SYWRpdXMqMlxuXHRcdGhlaWdodDpcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyoyXG5cdFx0Ym9yZGVyUmFkaXVzOiBcdFx0c3dpdGNoQnV0dG9uUmFkaXVzXG5cdFx0c2hhZG93WTpcdFx0XHQzXG5cdFx0c2hhZG93Qmx1cjogXHRcdDVcblx0XHRzaGFkb3dDb2xvcjogXHRcdCdyZ2JhKDAsMCwwLDAuMyknXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwid2hpdGVcIlxuXHRcdG9wYWNpdHk6IFx0XHRcdDFcblx0XHRzdXBlckxheWVyOiBcdFx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lclxuXHRcblx0IyBTRVQgVVAgQU5JTUFUSU9OU1xuXHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuYWRkXG5cdFx0ZGVzZWxlY3RlZDogXG5cdFx0XHR4OiBcdFx0XHRcdDBcblx0XHRcdHk6IFx0XHRcdFx0LTRcblx0XHRcdHdpZHRoOlx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJXaWR0aFxuXHRcdFx0aGVpZ2h0Olx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHRcdHNoYWRvd1NwcmVhZDogXHRwYXJhbXMuc3dpdGNoQ29udGFpbmVyQm9yZGVyXG5cdFx0XHRzYXR1cmF0ZTogXHRcdDBcblx0XHRcdGJyaWdodG5lc3M6IFx0MTUzXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiXCJcblx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdGN1cnZlOiBcImVhc2UtaW4tb3V0XCJcblx0XHR0aW1lOiAwLjMgXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XG5cdFx0VXRpbHMuZGVsYXkgMCwgPT5cblx0IFx0XHRpZiBAc2VsZWN0ZWRcbiBcdFx0XHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLmJhY2tncm91bmRDb2xvciA9IHBhcmFtcy5zd2l0Y2hUaW50XG5cblx0QHN3aXRjaEJhY2tncm91bmQub24gRXZlbnRzLkFuaW1hdGlvblN0YXJ0LCA9PlxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLmJhY2tncm91bmRDb2xvciA9ICcnXG5cblx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuYWRkXG5cdFx0ZGVzZWxlY3RlZDoge3g6IDB9XG5cdEBzd2l0Y2hCdXR0b24uc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdGN1cnZlOiBcInNwcmluZyg0MDAsMjUsMClcIlxuXHRcdFxuXHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyLnNlbGVjdCA9ID0+XG5cdFx0QHNlbGVjdGVkID0gdHJ1ZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5zd2l0Y2goXCJkZWZhdWx0XCIpXG5cdFx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuc3dpdGNoKFwiZGVmYXVsdFwiKVxuXHRcdFxuXHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyLmRlc2VsZWN0ID0gPT5cblx0XHRAc2VsZWN0ZWQgPSBmYWxzZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5zd2l0Y2goXCJkZXNlbGVjdGVkXCIpXG5cdFx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuc3dpdGNoKFwiZGVzZWxlY3RlZFwiKVxuXG5cdGlmIEBzZWxlY3RlZCA9PSBmYWxzZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5zd2l0Y2hJbnN0YW50KFwiZGVzZWxlY3RlZFwiKVxuXHRcdEBzd2l0Y2hCdXR0b24uc3RhdGVzLnN3aXRjaEluc3RhbnQoXCJkZXNlbGVjdGVkXCIpXG5cdGVsc2Vcblx0XHRAc3dpdGNoQmFja2dyb3VuZC5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbXMuc3dpdGNoVGludFxuXG5cdHJldHVybiBAc3dpdGNoQnV0dG9uQ29udGFpbmVyXG5cdFxuQ3Jvc3MgPSAtPlxuXHRjb2xvciA9IGRlZmF1bHRzLnRpbnRcblx0Y3Jvc3NUaGlja25lc3MgPSA0XG5cdGNyb3NzID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IDMwXHRcblx0XHRoZWlnaHQ6IDMwXHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuXHRjcm9zc1Vwc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjcm9zc1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAyMFxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRvcmlnaW5YOiAxXG5cdFx0c3VwZXJMYXllcjogY3Jvc3Ncblx0Y3Jvc3NVcHN0cm9rZS55ID0gMTRcblx0Y3Jvc3NVcHN0cm9rZS5yb3RhdGlvblogPSA0NVxuXHRjcm9zc0Rvd25zdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNyb3NzVGhpY2tuZXNzXG5cdFx0d2lkdGg6IDIwXG5cdFx0b3JpZ2luWDogMVxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRzdXBlckxheWVyOiBjcm9zc1xuXHRjcm9zc0Rvd25zdHJva2Uucm90YXRpb25aID0gLTQ1XG5cdGNyb3NzLnNlbGVjdCA9IC0+XG5cdFx0Y3Jvc3MuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRjcm9zcy5kZXNlbGVjdCA9IC0+XG5cdFx0Y3Jvc3MuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRzY2FsZTogMC40XG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXHRcdFxuXHRyZXR1cm4gY3Jvc3Ncblx0XG5DYXJldCA9IC0+XG5cdGNvbG9yID0gZGVmYXVsdHMudGludFxuXHRjYXJldFRoaWNrbmVzcyA9IDRcblx0Y2FyZXQgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogMzBcblx0XHRoZWlnaHQ6IDMwXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcdFx0XG5cdGNhcmV0VXBzdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNhcmV0VGhpY2tuZXNzXG5cdFx0d2lkdGg6IDE4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdG9yaWdpblg6IDFcblx0XHRzdXBlckxheWVyOiBjYXJldFxuXHRjYXJldFVwc3Ryb2tlLnkgPSAxNFxuXHRjYXJldFVwc3Ryb2tlLnJvdGF0aW9uWiA9IDQ1XG5cdGNhcmV0RG93bnN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2FyZXRUaGlja25lc3Ncblx0XHR3aWR0aDogMThcblx0XHRvcmlnaW5YOiAxXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdHN1cGVyTGF5ZXI6IGNhcmV0XG5cdGNhcmV0RG93bnN0cm9rZS55ID0gMTJcdFx0XG5cdGNhcmV0RG93bnN0cm9rZS5yb3RhdGlvblogPSAtNDVcblx0Y2FyZXQuc2VsZWN0ID0gLT5cblx0XHRjYXJldC5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXG5cdGNhcmV0LmRlc2VsZWN0ID0gLT5cblx0XHRjYXJldC5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHNjYWxlOiAwLjRcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcdFxuXHRyZXR1cm4gY2FyZXRcblx0XG5DaGVjayA9IC0+XG5cdGNvbG9yID0gZGVmYXVsdHMudGludFxuXHRjaGVja1RoaWNrbmVzcyA9IDRcblx0Y2hlY2sgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogMzBcblx0XHRoZWlnaHQ6IDMwXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcblx0Y2hlY2tVcHN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2hlY2tUaGlja25lc3Ncblx0XHR3aWR0aDogMTNcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0b3JpZ2luWDogMVxuXHRcdHN1cGVyTGF5ZXI6IGNoZWNrXG5cdGNoZWNrVXBzdHJva2UueSA9IDE2XG5cdGNoZWNrVXBzdHJva2Uucm90YXRpb25aID0gNDVcblx0Y2hlY2tEb3duc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjaGVja1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAyMlxuXHRcdG9yaWdpblg6IDFcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0c3VwZXJMYXllcjogY2hlY2tcdFxuXHRjaGVja0Rvd25zdHJva2UueCA9IDRcblx0Y2hlY2tEb3duc3Ryb2tlLnJvdGF0aW9uWiA9IC00NVxuXHRjaGVjay5zZWxlY3QgPSAtPlxuXHRcdGNoZWNrLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcblx0Y2hlY2suZGVzZWxlY3QgPSAtPlxuXHRcdGNoZWNrLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0c2NhbGU6IDAuNFxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRyZXR1cm4gY2hlY2tcblxuXG4jIyNcblx0VEFCTEUgVklFV1xuXHRcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0VGFibGVWaWV3Um93XHRcdFtFbGVtZW50cyBnbyBoZXJlXVxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4jIyNcblxuZXhwb3J0cy5UYWJsZVZpZXdSb3cgPSAocGFyYW1zKSAtPlxuXHRcblx0IyBUaGUgdHJpY2t5IHRoaW5nIGFib3V0IHJldXNhYmxlIGNvbXBvbmVudHMgaXMgcmVtZW1iZXJpbmdcblx0IyBob3cgdG8gdXNlIHRoZW0gKHBhcnRpY3VsYXJseSBpZiB0aGV5IGhhdmUgbG90cyBvZiBjdXN0b21pemFibGVcblx0IyBwYXJhbWV0ZXJzKS4gU2V0dGluZyBzZW5zaWJsZSBkZWZhdWx0cyBtYWtlcyBpdCB3YXkgZWFzaWVyIHRvIGdldFxuXHQjIHN0YXJ0ZWQgKGFuZCByZW1lbWJlciBob3cgdG8gdXNlIHRoZSB0aGluZyB5b3UgbWFkZSlcblx0Xy5kZWZhdWx0cyBwYXJhbXMsIFxuXHRcdG5hbWU6ICdHaXZlIG1lIGEgbmFtZSEnXG5cdFx0eDogMFxuXHRcdHk6IDBcblx0XHRlbmFibGVkOiB0cnVlXG5cdFx0c2VsZWN0ZWQ6IHRydWVcblx0XHRpY29uOiAnY2hlY2snXG5cdFx0dGV4dENvbG9yOiBkZWZhdWx0cy50aW50XG5cdFx0c3dpdGNoVGludDogZGVmYXVsdHMuc3dpdGNoVGludFxuXHRcdGZpcnN0SXRlbUluTGlzdDogdHJ1ZSAjIGNvdWxkIGJlIGZpcnN0IG9yIGxhc3Rcblx0XHRsYXN0SXRlbUluTGlzdDogdHJ1ZSAjIGNvdWxkIGJlIGZpcnN0IG9yIGxhc3Rcblx0XHRcblx0XHQjIENvbnN0YW50c1xuXHRcdHNjcmVlbldpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdHRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmc6IGRlZmF1bHRzLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0XHR0YWJsZVJvd0hlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRib3JkZXJDb2xvcjogZGVmYXVsdHMubGluZVRpbnQgIyBHcmV5IHJvdW5kZWQgcGlsbCAmIGJvcmRlcnMgYmV0d2VlbiBjZWxsc1xuXG5cdCMgU29tZSBvZiB0aGUgdmFsdWVzIGFyZSBiYXNlZCBvbiBvdGhlciBjb25zdGFudHMsXG5cdCMgc28geW91IGhhdmUgdG8gY2FsY3VsYXRlIHRoZW0gaW4gYSBzZWNvbmQgcGFzc1xuXHRzd2l0Y2hCdXR0b25SYWRpdXMgPSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0LzJcblx0c2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIgPSAyXG5cdFx0XG5cdCMgVGhpcyBpcyB0aGUgcm9vdCBvYmplY3QgZm9yIHRoaXMgZW50aXJlIGNvbXBvbmVudC5cblx0IyBXZSB3aWxsIGF0dGFjaCBhbGwgb3VyIGZ1bmN0aW9ucyBkaXJlY3RseSB0byB0aGlzIGxheWVyXG5cdEBsaXN0SXRlbUNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IHBhcmFtcy54XG5cdFx0eTogcGFyYW1zLnlcblx0XHR3aWR0aDogXHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRjbGlwOiBmYWxzZVxuXHRcdGJhY2tncm91bmRDb2xvcjogZGVmYXVsdHMuaXRlbUJhY2tncm91bmRcblx0QGxpc3RJdGVtQ29udGFpbmVyLnN0eWxlID0gXG5cdFx0Ym9yZGVyVG9wOiBcdFx0aWYgcGFyYW1zLmZpcnN0SXRlbUluTGlzdCB0aGVuIFwiMXB4IHNvbGlkIFwiICsgcGFyYW1zLmJvcmRlckNvbG9yIGVsc2UgXCJcIlxuXHRcdGJvcmRlckJvdHRvbTogXHRpZiBwYXJhbXMubGFzdEl0ZW1Jbkxpc3QgdGhlbiBcIjFweCBzb2xpZCBcIiArIHBhcmFtcy5ib3JkZXJDb2xvciBlbHNlIFwiXCJcblxuXHQjIFRoZXNlIHdpbGwgYmUgYWNjZXNzZWQgdXNpbmcgZnVuY3Rpb25zXG5cdEBlbmFibGVkID0gcGFyYW1zLmVuYWJsZWRcblx0QHNlbGVjdGVkID0gcGFyYW1zLnNlbGVjdGVkXG5cdFxuXHRAbGlzdEl0ZW0gPSBuZXcgTGF5ZXIgXG5cdFx0eDogcGFyYW1zLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0XHR3aWR0aDogXHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRzdXBlckxheWVyOiBAbGlzdEl0ZW1Db250YWluZXJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1x0XG5cdEBsaXN0SXRlbS5zdHlsZSA9IGRlZmF1bHRzLmxpc3RJdGVtVGV4dFN0eWxlXG5cdEBsaXN0SXRlbS5zdHlsZSA9XG5cdFx0Y29sb3I6IHBhcmFtcy50ZXh0Q29sb3Jcblx0XHRib3JkZXJUb3A6IFx0aWYgcGFyYW1zLmZpcnN0SXRlbUluTGlzdCB0aGVuIFwiXCIgZWxzZSBcIjFweCBzb2xpZCBcIiArIHBhcmFtcy5ib3JkZXJDb2xvclxuXG5cdCMgVGhpcyBpcyB3aGVyZSB0aGUgbGFiZWwgb2YgdGhlIGxpc3QgaXRlbSBsaXZlc1xuXHRAbGlzdEl0ZW0uaHRtbCA9IHBhcmFtcy5uYW1lIFxuXG5cdCMgQWRkIHRoZSBjaGVja21hcmsgZm9yIHRoZSBsaXN0XG5cdHRoaW5nVG9Td2l0Y2ggPSBzd2l0Y2hcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdjaGVjaycgdGhlbiBuZXcgQ2hlY2soKVxuXHRcdHdoZW4gcGFyYW1zLmljb24gPT0gJ2Nyb3NzJyB0aGVuIG5ldyBDcm9zcygpXG5cdFx0d2hlbiBwYXJhbXMuaWNvbiA9PSAnY2FyZXQnIHRoZW4gbmV3IENhcmV0KClcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdzd2l0Y2gnIHRoZW4gbmV3IFN3aXRjaCgpXG5cblx0dGhpbmdUb1N3aXRjaC5zdXBlckxheWVyID0gQGxpc3RJdGVtQ29udGFpbmVyXG5cdHRoaW5nVG9Td2l0Y2gueCA9IGRlZmF1bHRzLnNjcmVlbldpZHRoIC0gdGhpbmdUb1N3aXRjaC53aWR0aCAtIGRlZmF1bHRzLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0dGhpbmdUb1N3aXRjaC5jZW50ZXJZKDIpXG4jIFx0dGhpbmdUb1N3aXRjaC55ID0gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzIgLSB0aGluZ1RvU3dpdGNoLmhlaWdodC8yXG5cdFxuXHQjIE1BS0UgSVQgQUxMIElOVEVSQUNUSVZFXG5cdCMgT24gYSBjbGljaywgZ28gdG8gdGhlIG5leHQgc3RhdGVcblx0aWYgcGFyYW1zLmljb24gPT0gJ3N3aXRjaCdcblx0XHR0aGluZ1RvU3dpdGNoLm9uIEV2ZW50cy5DbGljaywgPT5cblx0XHRcdEBsaXN0SXRlbUNvbnRhaW5lci5zd2l0Y2goKVxuXHRlbHNlIFxuXHRcdEBsaXN0SXRlbS5vbiBFdmVudHMuQ2xpY2ssID0+XG5cdFx0XHRAbGlzdEl0ZW1Db250YWluZXIuc3dpdGNoKClcblxuXHRAbGlzdEl0ZW1Db250YWluZXIuc3dpdGNoID0gPT5cblx0XHRpZiBAc2VsZWN0ZWQgdGhlbiBAbGlzdEl0ZW1Db250YWluZXIuZGVzZWxlY3QoKSBlbHNlIEBsaXN0SXRlbUNvbnRhaW5lci5zZWxlY3QoKVxuXHRcdFxuXHRAbGlzdEl0ZW1Db250YWluZXIuc2VsZWN0ID0gKG9wdGlvbnMpID0+XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge3N1cHJlc3NFdmVudHM6IGZhbHNlfVxuXHRcdGlmIEBlbmFibGVkIFxuXHRcdFx0dGhpbmdUb1N3aXRjaC5zZWxlY3QoKVxuXHRcdFx0QHNlbGVjdGVkID0gdHJ1ZVxuXHRcdGlmIG9wdGlvbnMuc3VwcmVzc0V2ZW50cyA9PSBmYWxzZVxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLmVtaXQgXCJEaWRDaGFuZ2VcIiwgeyBzZWxlY3RlZDogQHNlbGVjdGVkIH1cblxuXHRAbGlzdEl0ZW1Db250YWluZXIuZGVzZWxlY3QgPSAob3B0aW9ucykgPT5cblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7c3VwcmVzc0V2ZW50czogZmFsc2V9XG5cdFx0aWYgQGVuYWJsZWQgXG5cdFx0XHR0aGluZ1RvU3dpdGNoLmRlc2VsZWN0KClcdFx0XG5cdFx0XHRAc2VsZWN0ZWQgPSBmYWxzZVxuXHRcdGlmIG9wdGlvbnMuc3VwcmVzc0V2ZW50cyA9PSBmYWxzZVxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLmVtaXQgXCJEaWRDaGFuZ2VcIiwgeyBzZWxlY3RlZDogQHNlbGVjdGVkIH1cblxuXHRAbGlzdEl0ZW1Db250YWluZXIudXBkYXRlTGFiZWwgPSAobmV3VGV4dCkgPT5cblx0XHRAbGlzdEl0ZW0uaHRtbCA9IG5ld1RleHRcblxuXHRAbGlzdEl0ZW1Db250YWluZXIuc2VsZWN0ZWQgPSAoKSA9PlxuXHRcdHJldHVybiBAc2VsZWN0ZWRcblx0XHRcdFxuXHRAbGlzdEl0ZW1Db250YWluZXIudXBkYXRlTGFiZWwocGFyYW1zLm5hbWUpXG5cblx0cmV0dXJuIEBsaXN0SXRlbUNvbnRhaW5lclxuXG5leHBvcnRzLlRhYmxlVmlldyA9IChwYXJhbXMpIC0+XG5cdHBhcmFtcyA9IHBhcmFtcyBvciB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcyxcblx0XHR5OiBcdFx0MFxuXHRcdHdpZHRoOlx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRpdGVtczogW1wiSXQncyBqdXN0IG1lIVwiXVxuXHRcdGljb246ICdjaGVjaydcblx0XHR2YWxpZGF0aW9uOiAnbm9uZSdcblx0XG5cdEBidXR0b25Hcm91cENvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTpcdFx0cGFyYW1zLnlcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICogcGFyYW1zLml0ZW1zLmxlbmd0aFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIm5vbmVcIlxuXHRcdFx0XHRcdFxuXHRAYnV0dG9uQXJyYXkgPSBbXVxuXHRmb3IgYnV0dG9uTmFtZSwgaSBpbiBwYXJhbXMuaXRlbXNcblx0XHRmaXJzdEl0ZW1Jbkxpc3QgPSBpZiBpID09IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2Vcblx0XHRsYXN0SXRlbUluTGlzdCA9IGlmIGkgPT0gKHBhcmFtcy5pdGVtcy5sZW5ndGgtMSkgdGhlbiB0cnVlIGVsc2UgZmFsc2Vcblx0XHRuZXdCdXR0b24gPSBuZXcgZXhwb3J0cy5UYWJsZVZpZXdSb3coe1xuXHRcdFx0eDogMCwgXG5cdFx0XHR5OiBpKmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LCBcblx0XHRcdG5hbWU6IGJ1dHRvbk5hbWUsIFxuXHRcdFx0aWNvbjogcGFyYW1zLmljb24sXG5cdFx0XHRmaXJzdEl0ZW1Jbkxpc3Q6IGZpcnN0SXRlbUluTGlzdCxcblx0XHRcdGxhc3RJdGVtSW5MaXN0OiBsYXN0SXRlbUluTGlzdFxuXHRcdH0pXG5cdFx0QGJ1dHRvbkFycmF5LnB1c2gobmV3QnV0dG9uKVxuXHRcdG5ld0J1dHRvbi5zdXBlckxheWVyID0gQGJ1dHRvbkdyb3VwQ29udGFpbmVyXG5cblx0YXR0YWNoUmFkaW9CdXR0b25WYWxpZGF0aW9uID0gKGJ1dHRvbkFycmF5KSA9PlxuXHRcdGJ1dHRvbkdyb3VwQ29udGFpbmVyID0gQGJ1dHRvbkdyb3VwQ29udGFpbmVyXG5cdFx0Zm9yIGJ1dHRvbkNsaWNrZWQsIGluZGV4T2ZCdXR0b25DbGlja2VkIGluIGJ1dHRvbkFycmF5XG5cdFx0XHRidXR0b25DbGlja2VkLmRlc2VsZWN0KHtzdXByZXNzRXZlbnRzOiB0cnVlfSlcblx0XHRcdCMgQ3JlYXRlcyBhIGNsb3N1cmUgdG8gc2F2ZSB0aGUgaW5kZXggb2YgdGhlIGJ1dHRvbiB3ZSdyZSBkZWFsaW5nIHdpdGhcblx0XHRcdGRvIChidXR0b25DbGlja2VkLCBpbmRleE9mQnV0dG9uQ2xpY2tlZCkgLT4gXG5cdFx0XHRcdCMgTGlzdGVuIGZvciBldmVudHMgYW5kIGNoYW5nZSBvdGhlciBidXR0b25zIGluIHJlc3BvbnNlXG5cdFx0XHRcdGJ1dHRvbkNsaWNrZWQub24gJ0RpZENoYW5nZScsIChldmVudCkgPT5cblx0XHRcdFx0XHRmb3Igb3RoZXJCdXR0b24sIG90aGVyQnV0dG9uSW5kZXggaW4gYnV0dG9uQXJyYXlcblx0XHRcdFx0XHRcdGlmIG90aGVyQnV0dG9uSW5kZXggIT0gaW5kZXhPZkJ1dHRvbkNsaWNrZWRcblx0XHRcdFx0XHRcdFx0IyBEbyBzdHVmZiB0byB0aGUgb3RoZXIgYnV0dG9uc1xuXHRcdFx0XHRcdFx0XHRvdGhlckJ1dHRvbi5kZXNlbGVjdCh7c3VwcHJlc3NFdmVudHM6IHRydWV9KVxuXHRcdFx0XHRcdGJ1dHRvbkdyb3VwQ29udGFpbmVyLmVtaXQgXCJEaWRDaGFuZ2VcIiwgeyBzZWxlY3RlZDogaW5kZXhPZkJ1dHRvbkNsaWNrZWQsIG51bVNlbGVjdGVkOiAxLCBidXR0b25zOiBidXR0b25BcnJheSB9XG5cblx0YXR0YWNoRGVmYXVsdFZhbGlkYXRpb24gPSAoYnV0dG9uQXJyYXkpID0+XG5cdFx0IyBKdXN0IGVtaXRzIHRoZSBuZXcgdmFsdWVzXG5cdFx0YnV0dG9uR3JvdXBDb250YWluZXIgPSBAYnV0dG9uR3JvdXBDb250YWluZXJcblx0XHRmb3IgYnV0dG9uQ2xpY2tlZCwgaW5kZXhPZkJ1dHRvbkNsaWNrZWQgaW4gYnV0dG9uQXJyYXlcblx0XHRcdGJ1dHRvbkNsaWNrZWQuZGVzZWxlY3Qoe3N1cHJlc3NFdmVudHM6IHRydWV9KVxuXHRcdFx0IyBDcmVhdGVzIGEgY2xvc3VyZSB0byBzYXZlIHRoZSBpbmRleCBvZiB0aGUgYnV0dG9uIHdlJ3JlIGRlYWxpbmcgd2l0aFxuXHRcdFx0ZG8gKGJ1dHRvbkNsaWNrZWQsIGluZGV4T2ZCdXR0b25DbGlja2VkKSAtPiBcblx0XHRcdFx0IyBMaXN0ZW4gZm9yIGV2ZW50cyBhbmQgY2hhbmdlIG90aGVyIGJ1dHRvbnMgaW4gcmVzcG9uc2Vcblx0XHRcdFx0YnV0dG9uQ2xpY2tlZC5vbiAnRGlkQ2hhbmdlJywgKGV2ZW50KSA9PlxuXHRcdFx0XHRcdG51bVNlbGVjdGVkID0gMFxuXHRcdFx0XHRcdHRhYmxlVmlld1N0YXRlcyA9IFtdXHRcdFxuXHRcdFx0XHRcdGZvciBidXR0b24gaW4gYnV0dG9uQXJyYXlcblx0XHRcdFx0XHRcdHRhYmxlVmlld1N0YXRlcy5wdXNoKGJ1dHRvbi5zZWxlY3RlZCgpKVxuXHRcdFx0XHRcdFx0aWYgYnV0dG9uLnNlbGVjdGVkKCkgdGhlbiBudW1TZWxlY3RlZCsrXG5cdFx0XHRcdFx0YnV0dG9uR3JvdXBDb250YWluZXIuZW1pdCBcIkRpZENoYW5nZVwiLCB7IHNlbGVjdGVkOiB0YWJsZVZpZXdTdGF0ZXMsIG51bVNlbGVjdGVkOiBudW1TZWxlY3RlZCwgYnV0dG9uczogYnV0dG9uQXJyYXkgfVxuXG5cdGlmIHBhcmFtcy52YWxpZGF0aW9uID09ICdyYWRpbydcblx0XHRhdHRhY2hSYWRpb0J1dHRvblZhbGlkYXRpb24oQGJ1dHRvbkFycmF5KVxuXHRlbHNlIFxuXHRcdGF0dGFjaERlZmF1bHRWYWxpZGF0aW9uKEBidXR0b25BcnJheSlcblx0XHRcblx0cmV0dXJuIEBidXR0b25Hcm91cENvbnRhaW5lclxuXG5cblxuIyMjXG5cdFRBQkxFIFZJRVcgSEVBREVSXG5cdEluIGlPUywgdGhpcyBpcyB0eXBpY2FsbHkgYXR0YWNoZWQgdG8gdGhlIHRhYmxlIHZpZXcsIFxuXHRidXQgaXQncyBpbmRlcGVuZGVudCBoZXJlIHNvIHlvdSBjYW4gcHV0IGl0IHdoZXJldmVyIHlvdSB3YW50LlxuIyMjXG5cbmV4cG9ydHMuVGFibGVWaWV3SGVhZGVyID0gKHBhcmFtcykgLT5cblx0cGFyYW1zID0gcGFyYW1zIHx8IHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLFxuXHRcdHRleHQ6ICdJIGFtIGEgZGl2aWRlcidcblx0XHR4OiAwXG5cdFx0eTogMFxuXHRsaXN0RGl2aWRlciA9IG5ldyBMYXllclxuXHRcdHg6IHBhcmFtcy54ICsgZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZ1xuXHRcdHk6IHBhcmFtcy55XG5cdFx0d2lkdGg6IGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcblx0bGlzdERpdmlkZXIuaHRtbCA9IHBhcmFtcy50ZXh0XG5cdGxpc3REaXZpZGVyLnN0eWxlID0gZGVmYXVsdHMuZGl2aWRlckl0ZW1UZXh0U3R5bGVcblx0bGlzdERpdmlkZXIuc3R5bGUgPSBcblx0XHRjb2xvcjogZGVmYXVsdHMudGludFxuXHRyZXR1cm4gbGlzdERpdmlkZXJcblxuXG5cbiMjI1xuXHRQSUNLRVJcblx0SW4gaU9TLCB0aGlzIGlzIHR5cGljYWxseSBhdHRhY2hlZCB0byB0aGUgdGFibGUgdmlldywgXG5cdGJ1dCBpdCdzIGluZGVwZW5kZW50IGhlcmUgc28geW91IGNhbiBwdXQgaXQgd2hlcmV2ZXIgeW91IHdhbnQuXG4jIyNcblxuXG4jIyBVdGlsaXR5IGZ1bmN0aW9uc1xuXG5xdWFudGl6ZSA9IChpbnB1dCwgc3RlcFNpemUpIC0+XG5cdHJldHVybiBNYXRoLmZsb29yKGlucHV0L3N0ZXBTaXplKSAqIHN0ZXBTaXplXG5cblxuIyMgVGhlIGl0ZW1zIGluIHRoZSBwaWNrZXJcblxuRHJ1bSA9IChwYXJlbnREcnVtTGF5ZXIsIGRydW1OYW1lLCBsaXN0SXRlbXMsIHBhcmFtcykgLT5cblx0XG5cdCMgU2V0dXAgdmFyaWFibGVzXG5cdEBwYXJlbnREcnVtTGF5ZXIgPSBwYXJlbnREcnVtTGF5ZXJcblx0cGFyYW1zID0gcGFyYW1zIHx8IHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLFxuXHRcdGVuYWJsZWQ6IHRydWVcblx0XHR4UGN0OiAwICBcdFx0XHRcdCMgMCB0byAxXG5cdFx0d2lkdGhQY3Q6IDFcdFx0XHRcdCMgMCB0byAxXG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiXHRcdCMgbGVmdCwgY2VudGVyLCByaWdodFxuXHRcdHRleHRQYWRkaW5nOiBcIjBcIlxuXHRcdHRleHRDb2xvcjogZGVmYXVsdHMudGludFxuXHRcblx0IyBWYWx1ZXMgZGVyaXZlZCBmcm9tIHBhcmFtc1xuXHRkcnVtQ29udGFpbmVySGVpZ2h0ID0gZGVmYXVsdHMudGFibGVSb3dIZWlnaHQqNVxuXG5cdCMgU2V0IHVwIGNvbnRlbnQgb2YgbGlzdCBcdFx0XG5cdGxpc3RJdGVtcyA9IGxpc3RJdGVtc1xuXHRAbmFtZSA9IGRydW1OYW1lXG5cdEBpbmRleCA9IDBcblx0QHZhbCA9IGxpc3RJdGVtc1tAaW5kZXhdXG5cdEB2ZWxvY2l0eSA9IDBcblx0Zmlyc3RUb3VjaEF2YWlsYWJsZSA9IHRydWUgICAgIyBpcyB0aGlzIHRoZSBmaXJzdCB0b3VjaCBpbiBhIGdpdmVuIGdlc3R1cmU/XG5cdFxuXHRpbnRlcnZhbFRvdXBkYXRlRHJ1bUFwcGVhcmFuY2UgPSAwXG5cdFxuXHQjIENhbGN1bGF0ZSBoZWlnaHQgYW5kIHZlcnRpY2FsIGJvdW5kcyBvZiB0aGUgbGlzdFxuXHRsaXN0TWluWVBvcyBcdD0gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0bGlzdE1heFlQb3MgXHQ9IC1saXN0SXRlbXMubGVuZ3RoKmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0K2RlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0bGlzdEhlaWdodCBcdFx0PSBsaXN0SXRlbXMubGVuZ3RoKmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICsgZHJ1bUNvbnRhaW5lckhlaWdodFxuXG5cdEBkcnVtQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdFx0XHRcdHBhcmFtcy54UGN0ICogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHR5OiBcdFx0XHRcdFx0MFxuXHRcdHdpZHRoOiBcdFx0XHRcdHBhcmFtcy53aWR0aFBjdCAqIGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBcdFx0XHRkcnVtQ29udGFpbmVySGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwibm9uZVwiXG5cdFx0c3VwZXJMYXllcjogXHRcdHBhcmVudERydW1MYXllclxuXHRcblx0bGlzdExheWVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdFx0XHRcdDBcblx0XHR5OiBcdFx0XHRcdFx0LWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0XHR3aWR0aDogXHRcdFx0XHRwYXJhbXMud2lkdGhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogXHRcdFx0bGlzdEhlaWdodFxuXHRcdHN1cGVyTGF5ZXI6IFx0XHRAZHJ1bUNvbnRhaW5lclxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIm5vbmVcIlxuXHRcblx0IyBsaXN0TGF5ZXIuc2Nyb2xsID0gdHJ1ZVxuXHRsaXN0TGF5ZXIuZHJhZ2dhYmxlLmVuYWJsZWQgPSBwYXJhbXMuZW5hYmxlZFxuXHRsaXN0TGF5ZXIuZHJhZ2dhYmxlLnNwZWVkWCA9IDBcblx0XG5cdGZvciBsaSwgaSBpbiBsaXN0SXRlbXNcblx0XHRsaXN0SXRlbUxheWVyID0gbmV3IExheWVyXG5cdFx0XHR4OiBcdFx0XHRcdDBcblx0XHRcdHk6IFx0XHRcdFx0aSAqIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICsgZHJ1bUNvbnRhaW5lckhlaWdodC8yXG5cdFx0XHR3aWR0aDogXHRcdFx0cGFyYW1zLndpZHRoUGN0ICogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRcdGhlaWdodDogXHRcdGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0XHRzdXBlckxheWVyOiBcdGxpc3RMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIm5vbmVcIiNVdGlscy5yYW5kb21Db2xvcigpXG5cdFx0bGlzdEl0ZW1MYXllci5odG1sID0gbGlcblx0XHRsaXN0SXRlbUxheWVyLnN0eWxlID1cblx0XHRcdGNvbG9yOiBcdFx0XHRwYXJhbXMudGV4dENvbG9yXG5cdFx0XHRmb250RmFtaWx5OiBcdGRlZmF1bHRzLnBpY2tlclRleHRTdHlsZS5mb250RmFtaWx5XG5cdFx0XHRmb250V2VpZ2h0OiBcdGRlZmF1bHRzLnBpY2tlclRleHRTdHlsZS5mb250V2VpZ2h0XG5cdFx0XHRmb250U2l6ZTogXHRcdGRlZmF1bHRzLnBpY2tlclRleHRTdHlsZS5mb250U2l6ZVxuXHRcdFx0bGluZUhlaWdodDogXHRkZWZhdWx0cy50YWJsZVJvd0hlaWdodCtcInB4XCJcblx0XHRcdHRleHRBbGlnbjogXHRcdHBhcmFtcy50ZXh0QWxpZ25cblx0XHRcdHBhZGRpbmc6IFx0XHRwYXJhbXMudGV4dFBhZGRpbmdcblxuXHRcdGxpc3RJdGVtTGF5ZXIuc3RhcnRZID0gaSAqIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICsgZHJ1bUNvbnRhaW5lckhlaWdodC8yXG5cblx0bGlzdExheWVyLm9uIEV2ZW50cy5EcmFnTW92ZSwgPT5cblx0XHRpZiBmaXJzdFRvdWNoQXZhaWxhYmxlXG5cdFx0XHRAZHJ1bUNvbnRhaW5lci5lbWl0KFwiRHJ1bVN0YXJ0ZWRNb3ZpbmdcIiwge2RydW06IGRydW1OYW1lLCBpbmRleDogQGluZGV4LCB2YWx1ZTogQHZhbCwgdmVsb2NpdHk6IDB9KVxuXHRcdFx0Zmlyc3RUb3VjaEF2YWlsYWJsZSA9IGZhbHNlXHRcdFxuXHRcdFx0XG5cdFx0dXBkYXRlRHJ1bUFwcGVhcmFuY2UoKVxuXHRcdFxuXHQjIFRvIHNpbXVsYXRlIGlPUyBtb21lbnR1bSBzY3JvbGxpbmcgKHdoaWNoIGNhdXNlcyB0aGUgZHJ1bSB0byBrZWVwIHNwaW5uaW5nIFxuXHQjIGFmdGVyIHlvdXIgZmluZ2VyIGxpZnRzIG9mZiBpdCksIHdlIHRyaWdnZXIgYW4gYW5pbWF0aW9uIHRoZSBtb21lbnQgeW91IGxpZnRcblx0IyB5b3VyIGZpbmdlci4gVGhlIGludGVuc2l0eSBvZiB0aGlzIGFuaW1hdGlvbiBpcyBwcm9wb3J0aW9uYWwgdG8gdGhlIHNwZWVkIHdoZW5cblx0IyBvZiB0aGUgZHJhZ2dpbmcgd2hlbiB5b3VyIGZpbmdlciB3YXMgbGlmdGVkLlxuXHRsaXN0TGF5ZXIub24gRXZlbnRzLkRyYWdFbmQsIChlLCBmKSA9PlxuXHRcdFxuXHRcdCMgTmV4dCB0b3VjaCBzaG91bGQgdHJpZ2dlciBEcnVtU3RhcnRlZE1vdmluZ1xuXHRcdGZpcnN0VG91Y2hBdmFpbGFibGUgPSB0cnVlXG5cdFxuXHRcdCMgVGhpcyBjYWxjdWxhdGVzIHRoZSBhbmltYXRpb25cblx0XHRzY3JvbGxWZWxvY2l0eSA9IGxpc3RMYXllci5kcmFnZ2FibGUuY2FsY3VsYXRlVmVsb2NpdHkoKS55XG5cdFx0dGltZUFmdGVyRHJhZyA9ICgwLjUrTWF0aC5hYnMoc2Nyb2xsVmVsb2NpdHkqMC4yKSkudG9GaXhlZCgxKVxuXHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gcXVhbnRpemUobGlzdExheWVyLnkgKyBzY3JvbGxWZWxvY2l0eSo0MDAsIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0KSArIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0XHRcblx0XHQjIEF0IHRoZSB0b3AgYW5kIGJvdHRvbSwgdGhlIG1vbWVudHVtIHNob3VsZCBiZSBhZGp1c3RlZCBzbyB0aGUgXG5cdFx0IyBmaXJzdCBhbmQgbGFzdCB2YWx1ZXMgb24gdGhlIGRydW0gZG9uJ3QgZ28gdG9vIGZhciBvdXQgb2Ygdmlld1xuXHRcdGRpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0bGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXIgPSAtbGlzdEl0ZW1zLmxlbmd0aCpkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGJvdHRvbU92ZXJmbG93ID0gTWF0aC5tYXgoMCwgbGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXItZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gKVxuXHRcdHRvcE92ZXJmbG93ID0gTWF0aC5tYXgoMCwgZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gKVxuXHRcdG92ZXJmbG93RGFtcGVuaW5nID0gMTBcblx0XHRcblx0XHRpZiBib3R0b21PdmVyZmxvdyA+IDBcblx0XHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gbGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXIgLSAoYm90dG9tT3ZlcmZsb3cgLyBvdmVyZmxvd0RhbXBlbmluZylcblx0XHRcdG5ld0Rpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0XHR0aW1lQWZ0ZXJEcmFnID0gdGltZUFmdGVyRHJhZyAqIChuZXdEaXN0YW5jZVRvVHJhdmVsL2Rpc3RhbmNlVG9UcmF2ZWwpXG5cblx0XHRpZiB0b3BPdmVyZmxvdyA+IDBcblx0XHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gNDAgKyAodG9wT3ZlcmZsb3cgLyBvdmVyZmxvd0RhbXBlbmluZylcblx0XHRcdG5ld0Rpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0XHR0aW1lQWZ0ZXJEcmFnID0gdGltZUFmdGVyRHJhZyAqIChuZXdEaXN0YW5jZVRvVHJhdmVsL2Rpc3RhbmNlVG9UcmF2ZWwpXG5cblx0XHQjIFRyaWdnZXIgdGhlIGFuaW1hdGlvbiwgYW5kIHNjaGVkdWxlIGFuIGV2ZW50IHRoYXQgd2lsbFxuXHRcdCMgdHJpZ2dlciB3aGVuIHRoZSBkcnVtIGZpbmFsbHkgc3RvcHMgc3Bpbm5pbmcuXG5cdFx0bGlzdExheWVyLmFuaW1hdGUoe1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eTogZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW19XG5cdFx0XHRcdHRpbWU6IHRpbWVBZnRlckRyYWdcblx0XHRcdFx0Y3VydmU6IFwiZWFzZS1vdXRcIlxuXHRcdFx0fSlcblx0XHRVdGlscy5kZWxheSB0aW1lQWZ0ZXJEcmFnLCAtPlxuXHRcdFx0c3RvcERydW0oKVxuXG5cdCMgVGhpcyBlbnN1cmVzIHRoYXQgZHVyaW5nIHRoZSBhbmltYXRpb24gb2YgdGhlIGxpc3QgbGF5ZXIsIHRoZSBkcnVtJ3MgYXBwZWFyYW5jZSBjb250aW51ZXNcblx0IyB0byBiZSB1cGRhdGVkLiBCZWNhdXNlIG11bHRpcGxlIGFuaW1hdGlvbnMgY291bGQgb3ZlcmxhcCwgd2UgZW5zdXJlIHRoYXQgZXZlcnkgbmV3IGFuaW1hdGlvblxuXHQjIGVuZHMgdGhlIGludGVydmFsIGFuZCBzdGFydHMgYSBuZXcgb25lIHNvIHRoYXQgd2UgbmV2ZXIgaGF2ZSBtb3JlIHRoYW4gb25lIHJ1bm5pbmcgXG5cdGxpc3RMYXllci5vbiBFdmVudHMuQW5pbWF0aW9uU3RhcnQsIC0+XG5cdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbFRvdXBkYXRlRHJ1bUFwcGVhcmFuY2UpXG5cdFx0aW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlID0gVXRpbHMuaW50ZXJ2YWwgMS8zMCwgdXBkYXRlRHJ1bUFwcGVhcmFuY2UgICAgXG5cblx0bGlzdExheWVyLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XHRcdFxuXHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlKVxuXG5cdFx0IyBFbWl0IGFmdGVyIGFsbCBtb3ZlbWVudCBlbmRzIGluIHRoZSBsaXN0XG5cdFx0QGRydW1Db250YWluZXIuZW1pdChcIkRydW1GaW5pc2hlZENoYW5naW5nXCIsIHtsaXN0OiBkcnVtTmFtZSwgaW5kZXg6IEBpbmRleCwgdmFsdWU6IEB2YWx9KVxuXG5cdHVwZGF0ZURydW1BcHBlYXJhbmNlID0gPT5cblx0XHRpdGVtc0luRHJ1bSA9IDRcblx0XHRsaXN0UG9zaXRpb24gPSBsaXN0TGF5ZXIueSAvIC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodCAtIDAuNVxuXHRcdGNhcHBlZExpc3RQb3NpdGlvbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKGxpc3RMYXllci55IC8gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0IC0gMC41LCBsaXN0SXRlbXMubGVuZ3RoIC0gMSkpXG5cdFx0Zm9jdXNJdGVtID0gTWF0aC5yb3VuZChjYXBwZWRMaXN0UG9zaXRpb24pXG5cdFx0ZGlzdGFuY2VGcm9tTWlkZGxlID0gTWF0aC5hYnMoZm9jdXNJdGVtIC0gY2FwcGVkTGlzdFBvc2l0aW9uKVxuXHRcdGZvciBpIGluIFsoZm9jdXNJdGVtLWl0ZW1zSW5EcnVtKS4uKGZvY3VzSXRlbStpdGVtc0luRHJ1bSldXG5cdFx0XHRpZiBpID49IDAgYW5kIGkgPCBsaXN0SXRlbXMubGVuZ3RoXG5cdFx0XHRcdGxpc3RMYXllci5zdWJMYXllcnNbaV0ub3BhY2l0eSA9IDEgLSBNYXRoLmFicyhsaXN0UG9zaXRpb24gLSBpKS81IC0gKGlmIChpICE9IGZvY3VzSXRlbSkgdGhlbiAwLjMgZWxzZSAwKVxuXHRcdFx0XHRsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnNjYWxlWSA9IDEgLSBNYXRoLm1pbigxLCBNYXRoLmFicyhsaXN0UG9zaXRpb24gLSBpKS80KVxuXHRcdFx0XHRsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnkgPSBsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnN0YXJ0WSAtIChpLWxpc3RQb3NpdGlvbikqTWF0aC5hYnMoaS1saXN0UG9zaXRpb24pKjEwXG5cblx0XHQjIFVwZGF0ZSB0aGUgdmFsdWUgb2YgdGhlIGRydW0gb25seSB3aGVuIGEgbmV3IHZhbHVlIGlzIHJlYWNoZWRcblx0XHRpZiAoQGluZGV4ICE9IGZvY3VzSXRlbSlcblx0XHRcdHVwZGF0ZURydW1WYWx1ZXMoZm9jdXNJdGVtKVxuXHRcdFxuXHRzdG9wRHJ1bSA9ID0+XHRcdFxuXHRcdCMgRW5zdXJlIHRoZSBkcnVtIG5ldmVyIGVuZHMgb3V0IG9mIGJvdW5kc1xuXHRcdGlmIGxpc3RMYXllci55ID4gbGlzdE1pbllQb3MgXG5cdFx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0ICAgIFx0cHJvcGVydGllczoge3k6bGlzdE1pbllQb3N9XG5cdFx0ICAgIFx0Y3VydmU6IFwic3ByaW5nKDQwMCw1MCwwKVwiXG5cdFx0XHR9KVxuXHRcdGlmIGxpc3RMYXllci55IDwgbGlzdE1heFlQb3Ncblx0XHRcdGxpc3RMYXllci5hbmltYXRlKHtcblx0XHRcdFx0cHJvcGVydGllczoge3k6IGxpc3RNYXhZUG9zfVxuXHRcdFx0XHRjdXJ2ZTogXCJzcHJpbmcoNDAwLDUwLDApXCJcblx0XHRcdH0pXG5cdFxuXHQjIFVwZGF0ZSB0aGUgdmFsdWVzIG9mIHRoZSBkcnVtcyBhbmQgaW52b2tlIHRoZSBjYWxsYmFjayBcblx0dXBkYXRlRHJ1bVZhbHVlcyA9IChuZXdJbmRleCkgPT5cblx0XHRAaW5kZXggPSBuZXdJbmRleFxuXHRcdEB2YWwgPSBsaXN0SXRlbXNbQGluZGV4XVxuXHRcdEBkcnVtQ29udGFpbmVyLmVtaXQoXCJEcnVtRGlkQ2hhbmdlXCIsIHtsaXN0OiBkcnVtTmFtZSwgaW5kZXg6IEBpbmRleCwgdmFsdWU6IEB2YWx9KVxuXHRcblx0IyBSZW5kZXIgZm9yIHRoZSBmaXJzdCB0aW1lXHRcdFxuXHR1cGRhdGVEcnVtQXBwZWFyYW5jZSgpXG5cdFxuXHRAc2V0SW5kZXggPSAoaW5kZXgpID0+XG5cdFx0eVBvc2l0aW9uRm9yVGhpc0luZGV4ID0gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzIgLSAoaW5kZXggKiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodClcblx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt5OiB5UG9zaXRpb25Gb3JUaGlzSW5kZXh9XG5cdFx0XHRcdHRpbWU6IDAuNVxuXHRcdFx0XHRjdXJ2ZTogXCJlYXNlLW91dFwiXG5cdFx0XHR9KVxuXG5cdEBzZXRWYWx1ZSA9ICh2YWwpID0+XG5cdFx0aW5kZXggPSBsaXN0SXRlbXMuaW5kZXhPZih2YWwpXG5cdFx0aWYgaW5kZXggIT0gLTFcblx0XHRcdEBzZXRJbmRleChpbmRleClcblxuXHQjIFJldHVybiB0aGUgZHJ1bSBvYmplY3Qgc28gd2UgY2FuIGFjY2VzcyBpdHMgdmFsdWVzXG5cdHJldHVybiBAXG5cblxuIyMjXG5cdFBJQ0tFUlxuXHRUaGlzIGNvbnRhaW5zIHRoZSBwaWNrZXIgXG4jIyMgXG5leHBvcnRzLlBpY2tlciA9IChwYXJhbXMpIC0+XG5cdFxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0MFxuXHRcdHdpZHRoOlx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRkZWZhdWx0VGV4dDogXCJcIlxuXHRcdHRleHRDb2xvcjogZGVmYXVsdHMudGludFxuXG5cdGRydW1Db250YWluZXJIZWlnaHQgPSBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCo1XG5cblx0QHBpY2tlckNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRwYXJhbXMueFxuXHRcdHk6XHRcdHBhcmFtcy55XG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0OiBkcnVtQ29udGFpbmVySGVpZ2h0Kzg4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdGRlZmF1bHRzLml0ZW1CYWNrZ3JvdW5kXG5cdFx0XHRcblx0QGRydW0gPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0MFxuXHRcdHk6IFx0XHQ4OFxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZHJ1bUNvbnRhaW5lckhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJub25lXCJcblx0XHRzdXBlckxheWVyOiBAcGlja2VyQ29udGFpbmVyXHRcdFxuXHRcdFxuXHRAc2VsZWN0ZWRJdGVtID0gbmV3IExheWVyXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0ZHJ1bUNvbnRhaW5lckhlaWdodC8yIC0gZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwibm9uZVwiXG5cdFx0c3VwZXJMYXllcjogQGRydW1cblxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTogXHRcdDBcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6XHQ4OFxuXHRcdGJhY2tncm91bmRDb2xvcjogZGVmYXVsdHMuaXRlbUJhY2tncm91bmRcblx0XHRzdXBlckxheWVyOiBAcGlja2VyQ29udGFpbmVyXG5cdFx0XG5cdCMgU3R5bGVzXG5cdEBkcnVtLnN0eWxlID1cblx0XHRwb2ludGVyRXZlbnRzOiBcIm5vbmVcIlxuXHRcdGJvcmRlclRvcDogXCIxcHggc29saWQgXCIgKyBkZWZhdWx0cy5saW5lVGludFxuXHRcdGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgXCIgKyBkZWZhdWx0cy5saW5lVGludFxuXHRcblx0QHNlbGVjdGVkSXRlbS5zdHlsZSA9XG5cdFx0cG9pbnRlckV2ZW50czogXCJub25lXCJcblx0XHRib3JkZXJUb3A6IFwiMXB4IHNvbGlkIHJnYmEoMCwwLDAsMC4zKVwiXG5cdFx0Ym9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDAsMCwwLDAuMylcIlxuXHRcdFxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlci5zdHlsZSA9IGRlZmF1bHRzLmxpc3RJdGVtVGV4dFN0eWxlXG5cdEBwaWNrZXJDb250YWluZXIucGlja2VySGVhZGVyLnN0eWxlID0gXG5cdFx0Y29sb3I6IHBhcmFtcy50ZXh0Q29sb3Jcblx0XHRwYWRkaW5nTGVmdDogXCIyMHB4XCJcblx0XHRib3JkZXJUb3A6IFwiMXB4IHNvbGlkIFwiICsgZGVmYXVsdHMubGluZVRpbnRcblx0XHRcdFxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlci5odG1sID0gcGFyYW1zLmRlZmF1bHRUZXh0XG5cdFx0XG5cdFx0XG5cdCMgQWRkIGRydW1zXG5cdEBwaWNrZXJDb250YWluZXIuZHJ1bXMgPSBbXVxuXHRAcGlja2VyQ29udGFpbmVyLmRydW1zQnlOYW1lID0ge31cblx0XG5cdHBpY2tlclN0YXJ0ZWRNb3ZpbmcgPSAoKT0+XG5cdFx0ZHJ1bVZhbHVlcyA9IHt9XG5cdFx0bmV3VmFsdWVzID0gZm9yIGRydW0gaW4gQHBpY2tlckNvbnRhaW5lci5kcnVtc1xuXHRcdFx0ZHJ1bVZhbHVlc1tkcnVtLm5hbWVdID0ge2luZGV4OiBkcnVtLmluZGV4LCB2YWw6IGRydW0udmFsLCB2ZWxvY2l0eTogMH1cdFxuXHRcdEBwaWNrZXJDb250YWluZXIuZW1pdChcIlBpY2tlclN0YXJ0ZWRNb3ZpbmdcIiApXG5cdFx0XG5cdHBpY2tlckRpZENoYW5nZSA9ICgpPT5cblx0XHRkcnVtVmFsdWVzID0ge31cblx0XHRuZXdWYWx1ZXMgPSBmb3IgZHJ1bSBpbiBAcGlja2VyQ29udGFpbmVyLmRydW1zXG5cdFx0XHRkcnVtVmFsdWVzW2RydW0ubmFtZV0gPSB7aW5kZXg6IGRydW0uaW5kZXgsIHZhbDogZHJ1bS52YWx9XG5cblx0XHRAcGlja2VyQ29udGFpbmVyLmVtaXQoXCJQaWNrZXJEaWRDaGFuZ2VcIiwgZHJ1bVZhbHVlcyApXG5cdFxuXHRwaWNrZXJGaW5pc2hlZENoYW5naW5nID0gKCk9PlxuXHRcdGRydW1WYWx1ZXMgPSB7fVxuXHRcdG5ld1ZhbHVlcyA9IGZvciBkcnVtIGluIEBwaWNrZXJDb250YWluZXIuZHJ1bXNcblx0XHRcdGRydW1WYWx1ZXNbZHJ1bS5uYW1lXSA9IHtpbmRleDogZHJ1bS5pbmRleCwgdmFsOiBkcnVtLnZhbH1cblxuXHRcdEBwaWNrZXJDb250YWluZXIuZW1pdChcIlBpY2tlckZpbmlzaGVkQ2hhbmdpbmdcIiwgZHJ1bVZhbHVlcyApXHRcblx0aWYgKHBhcmFtcy5kcnVtcyBhbmQgcGFyYW1zLmRydW1zLmxlbmd0aCA+IDApXG5cdFx0Zm9yIGRydW0gaW4gcGFyYW1zLmRydW1zXG5cdFx0XHRuZXdEcnVtID0gbmV3IERydW0oQGRydW0sIGRydW0ubmFtZSwgZHJ1bS5pdGVtcywgZHJ1bS5wYXJhbXMpXG5cblx0XHRcdCMjIFN0b3JlIGRydW1zIGluc2lkZSB0aGUgcGlja2VyXG5cdFx0XHRAcGlja2VyQ29udGFpbmVyLmRydW1zLnB1c2gobmV3RHJ1bSlcblx0XHRcdEBwaWNrZXJDb250YWluZXIuZHJ1bXNCeU5hbWVbZHJ1bS5uYW1lXSA9IG5ld0RydW0gXG5cblx0XHRcdCMjIEVuc3VyZSB0aGF0IGNoYW5nZXMgdG8gdGhlIGRydW0gYnViYmxlIHVwIHRvIHRoZSBwaWNrZXJcblx0XHRcdG5ld0RydW0uZHJ1bUNvbnRhaW5lci5vbiBcIkRydW1EaWRDaGFuZ2VcIiwgcGlja2VyRGlkQ2hhbmdlXG5cdFx0XHRcblx0XHRcdCMjIEVtaXQgYW4gZXZlbnQgd2hlbiBkcnVtcyBzdG9wIG1vdmluZyBhbHRvZ2V0aGVyXG5cdFx0XHRuZXdEcnVtLmRydW1Db250YWluZXIub24gXCJEcnVtRmluaXNoZWRDaGFuZ2luZ1wiLCBwaWNrZXJGaW5pc2hlZENoYW5naW5nXG5cblx0XHRcdCMjIEVtaXQgYW4gZXZlbnQgd2hlbiBsaXN0cyBzdG9wIG1vdmluZyBhbHRvZ2V0aGVyXG5cdFx0XHRuZXdEcnVtLmRydW1Db250YWluZXIub24gXCJEcnVtU3RhcnRlZE1vdmluZ1wiLCBwaWNrZXJTdGFydGVkTW92aW5nXG5cblxuXHRyZXR1cm4gQHBpY2tlckNvbnRhaW5lclxuIiwiLy8hIG1vbWVudC5qc1xuLy8hIHZlcnNpb24gOiAyLjkuMFxuLy8hIGF1dGhvcnMgOiBUaW0gV29vZCwgSXNrcmVuIENoZXJuZXYsIE1vbWVudC5qcyBjb250cmlidXRvcnNcbi8vISBsaWNlbnNlIDogTUlUXG4vLyEgbW9tZW50anMuY29tXG5cbihmdW5jdGlvbiAodW5kZWZpbmVkKSB7XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBDb25zdGFudHNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICB2YXIgbW9tZW50LFxuICAgICAgICBWRVJTSU9OID0gJzIuOS4wJyxcbiAgICAgICAgLy8gdGhlIGdsb2JhbC1zY29wZSB0aGlzIGlzIE5PVCB0aGUgZ2xvYmFsIG9iamVjdCBpbiBOb2RlLmpzXG4gICAgICAgIGdsb2JhbFNjb3BlID0gKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnICYmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCB3aW5kb3cgPT09IGdsb2JhbC53aW5kb3cpKSA/IGdsb2JhbCA6IHRoaXMsXG4gICAgICAgIG9sZEdsb2JhbE1vbWVudCxcbiAgICAgICAgcm91bmQgPSBNYXRoLnJvdW5kLFxuICAgICAgICBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksXG4gICAgICAgIGksXG5cbiAgICAgICAgWUVBUiA9IDAsXG4gICAgICAgIE1PTlRIID0gMSxcbiAgICAgICAgREFURSA9IDIsXG4gICAgICAgIEhPVVIgPSAzLFxuICAgICAgICBNSU5VVEUgPSA0LFxuICAgICAgICBTRUNPTkQgPSA1LFxuICAgICAgICBNSUxMSVNFQ09ORCA9IDYsXG5cbiAgICAgICAgLy8gaW50ZXJuYWwgc3RvcmFnZSBmb3IgbG9jYWxlIGNvbmZpZyBmaWxlc1xuICAgICAgICBsb2NhbGVzID0ge30sXG5cbiAgICAgICAgLy8gZXh0cmEgbW9tZW50IGludGVybmFsIHByb3BlcnRpZXMgKHBsdWdpbnMgcmVnaXN0ZXIgcHJvcHMgaGVyZSlcbiAgICAgICAgbW9tZW50UHJvcGVydGllcyA9IFtdLFxuXG4gICAgICAgIC8vIGNoZWNrIGZvciBub2RlSlNcbiAgICAgICAgaGFzTW9kdWxlID0gKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cyksXG5cbiAgICAgICAgLy8gQVNQLk5FVCBqc29uIGRhdGUgZm9ybWF0IHJlZ2V4XG4gICAgICAgIGFzcE5ldEpzb25SZWdleCA9IC9eXFwvP0RhdGVcXCgoXFwtP1xcZCspL2ksXG4gICAgICAgIGFzcE5ldFRpbWVTcGFuSnNvblJlZ2V4ID0gLyhcXC0pPyg/OihcXGQqKVxcLik/KFxcZCspXFw6KFxcZCspKD86XFw6KFxcZCspXFwuPyhcXGR7M30pPyk/LyxcblxuICAgICAgICAvLyBmcm9tIGh0dHA6Ly9kb2NzLmNsb3N1cmUtbGlicmFyeS5nb29nbGVjb2RlLmNvbS9naXQvY2xvc3VyZV9nb29nX2RhdGVfZGF0ZS5qcy5zb3VyY2UuaHRtbFxuICAgICAgICAvLyBzb21ld2hhdCBtb3JlIGluIGxpbmUgd2l0aCA0LjQuMy4yIDIwMDQgc3BlYywgYnV0IGFsbG93cyBkZWNpbWFsIGFueXdoZXJlXG4gICAgICAgIGlzb0R1cmF0aW9uUmVnZXggPSAvXigtKT9QKD86KD86KFswLTksLl0qKVkpPyg/OihbMC05LC5dKilNKT8oPzooWzAtOSwuXSopRCk/KD86VCg/OihbMC05LC5dKilIKT8oPzooWzAtOSwuXSopTSk/KD86KFswLTksLl0qKVMpPyk/fChbMC05LC5dKilXKSQvLFxuXG4gICAgICAgIC8vIGZvcm1hdCB0b2tlbnNcbiAgICAgICAgZm9ybWF0dGluZ1Rva2VucyA9IC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhNb3xNTT9NP00/fERvfERERG98REQ/RD9EP3xkZGQ/ZD98ZG8/fHdbb3x3XT98V1tvfFddP3xRfFlZWVlZWXxZWVlZWXxZWVlZfFlZfGdnKGdnZz8pP3xHRyhHR0c/KT98ZXxFfGF8QXxoaD98SEg/fG1tP3xzcz98U3sxLDR9fHh8WHx6ej98Wlo/fC4pL2csXG4gICAgICAgIGxvY2FsRm9ybWF0dGluZ1Rva2VucyA9IC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhMVFN8TFR8TEw/TD9MP3xsezEsNH0pL2csXG5cbiAgICAgICAgLy8gcGFyc2luZyB0b2tlbiByZWdleGVzXG4gICAgICAgIHBhcnNlVG9rZW5PbmVPclR3b0RpZ2l0cyA9IC9cXGRcXGQ/LywgLy8gMCAtIDk5XG4gICAgICAgIHBhcnNlVG9rZW5PbmVUb1RocmVlRGlnaXRzID0gL1xcZHsxLDN9LywgLy8gMCAtIDk5OVxuICAgICAgICBwYXJzZVRva2VuT25lVG9Gb3VyRGlnaXRzID0gL1xcZHsxLDR9LywgLy8gMCAtIDk5OTlcbiAgICAgICAgcGFyc2VUb2tlbk9uZVRvU2l4RGlnaXRzID0gL1srXFwtXT9cXGR7MSw2fS8sIC8vIC05OTksOTk5IC0gOTk5LDk5OVxuICAgICAgICBwYXJzZVRva2VuRGlnaXRzID0gL1xcZCsvLCAvLyBub256ZXJvIG51bWJlciBvZiBkaWdpdHNcbiAgICAgICAgcGFyc2VUb2tlbldvcmQgPSAvWzAtOV0qWydhLXpcXHUwMEEwLVxcdTA1RkZcXHUwNzAwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdK3xbXFx1MDYwMC1cXHUwNkZGXFwvXSsoXFxzKj9bXFx1MDYwMC1cXHUwNkZGXSspezEsMn0vaSwgLy8gYW55IHdvcmQgKG9yIHR3bykgY2hhcmFjdGVycyBvciBudW1iZXJzIGluY2x1ZGluZyB0d28vdGhyZWUgd29yZCBtb250aCBpbiBhcmFiaWMuXG4gICAgICAgIHBhcnNlVG9rZW5UaW1lem9uZSA9IC9afFtcXCtcXC1dXFxkXFxkOj9cXGRcXGQvZ2ksIC8vICswMDowMCAtMDA6MDAgKzAwMDAgLTAwMDAgb3IgWlxuICAgICAgICBwYXJzZVRva2VuVCA9IC9UL2ksIC8vIFQgKElTTyBzZXBhcmF0b3IpXG4gICAgICAgIHBhcnNlVG9rZW5PZmZzZXRNcyA9IC9bXFwrXFwtXT9cXGQrLywgLy8gMTIzNDU2Nzg5MDEyM1xuICAgICAgICBwYXJzZVRva2VuVGltZXN0YW1wTXMgPSAvW1xcK1xcLV0/XFxkKyhcXC5cXGR7MSwzfSk/LywgLy8gMTIzNDU2Nzg5IDEyMzQ1Njc4OS4xMjNcblxuICAgICAgICAvL3N0cmljdCBwYXJzaW5nIHJlZ2V4ZXNcbiAgICAgICAgcGFyc2VUb2tlbk9uZURpZ2l0ID0gL1xcZC8sIC8vIDAgLSA5XG4gICAgICAgIHBhcnNlVG9rZW5Ud29EaWdpdHMgPSAvXFxkXFxkLywgLy8gMDAgLSA5OVxuICAgICAgICBwYXJzZVRva2VuVGhyZWVEaWdpdHMgPSAvXFxkezN9LywgLy8gMDAwIC0gOTk5XG4gICAgICAgIHBhcnNlVG9rZW5Gb3VyRGlnaXRzID0gL1xcZHs0fS8sIC8vIDAwMDAgLSA5OTk5XG4gICAgICAgIHBhcnNlVG9rZW5TaXhEaWdpdHMgPSAvWystXT9cXGR7Nn0vLCAvLyAtOTk5LDk5OSAtIDk5OSw5OTlcbiAgICAgICAgcGFyc2VUb2tlblNpZ25lZE51bWJlciA9IC9bKy1dP1xcZCsvLCAvLyAtaW5mIC0gaW5mXG5cbiAgICAgICAgLy8gaXNvIDg2MDEgcmVnZXhcbiAgICAgICAgLy8gMDAwMC0wMC0wMCAwMDAwLVcwMCBvciAwMDAwLVcwMC0wICsgVCArIDAwIG9yIDAwOjAwIG9yIDAwOjAwOjAwIG9yIDAwOjAwOjAwLjAwMCArICswMDowMCBvciArMDAwMCBvciArMDApXG4gICAgICAgIGlzb1JlZ2V4ID0gL15cXHMqKD86WystXVxcZHs2fXxcXGR7NH0pLSg/OihcXGRcXGQtXFxkXFxkKXwoV1xcZFxcZCQpfChXXFxkXFxkLVxcZCl8KFxcZFxcZFxcZCkpKChUfCApKFxcZFxcZCg6XFxkXFxkKDpcXGRcXGQoXFwuXFxkKyk/KT8pPyk/KFtcXCtcXC1dXFxkXFxkKD86Oj9cXGRcXGQpP3xcXHMqWik/KT8kLyxcblxuICAgICAgICBpc29Gb3JtYXQgPSAnWVlZWS1NTS1ERFRISDptbTpzc1onLFxuXG4gICAgICAgIGlzb0RhdGVzID0gW1xuICAgICAgICAgICAgWydZWVlZWVktTU0tREQnLCAvWystXVxcZHs2fS1cXGR7Mn0tXFxkezJ9L10sXG4gICAgICAgICAgICBbJ1lZWVktTU0tREQnLCAvXFxkezR9LVxcZHsyfS1cXGR7Mn0vXSxcbiAgICAgICAgICAgIFsnR0dHRy1bV11XVy1FJywgL1xcZHs0fS1XXFxkezJ9LVxcZC9dLFxuICAgICAgICAgICAgWydHR0dHLVtXXVdXJywgL1xcZHs0fS1XXFxkezJ9L10sXG4gICAgICAgICAgICBbJ1lZWVktREREJywgL1xcZHs0fS1cXGR7M30vXVxuICAgICAgICBdLFxuXG4gICAgICAgIC8vIGlzbyB0aW1lIGZvcm1hdHMgYW5kIHJlZ2V4ZXNcbiAgICAgICAgaXNvVGltZXMgPSBbXG4gICAgICAgICAgICBbJ0hIOm1tOnNzLlNTU1MnLCAvKFR8IClcXGRcXGQ6XFxkXFxkOlxcZFxcZFxcLlxcZCsvXSxcbiAgICAgICAgICAgIFsnSEg6bW06c3MnLCAvKFR8IClcXGRcXGQ6XFxkXFxkOlxcZFxcZC9dLFxuICAgICAgICAgICAgWydISDptbScsIC8oVHwgKVxcZFxcZDpcXGRcXGQvXSxcbiAgICAgICAgICAgIFsnSEgnLCAvKFR8IClcXGRcXGQvXVxuICAgICAgICBdLFxuXG4gICAgICAgIC8vIHRpbWV6b25lIGNodW5rZXIgJysxMDowMCcgPiBbJzEwJywgJzAwJ10gb3IgJy0xNTMwJyA+IFsnLScsICcxNScsICczMCddXG4gICAgICAgIHBhcnNlVGltZXpvbmVDaHVua2VyID0gLyhbXFwrXFwtXXxcXGRcXGQpL2dpLFxuXG4gICAgICAgIC8vIGdldHRlciBhbmQgc2V0dGVyIG5hbWVzXG4gICAgICAgIHByb3h5R2V0dGVyc0FuZFNldHRlcnMgPSAnRGF0ZXxIb3Vyc3xNaW51dGVzfFNlY29uZHN8TWlsbGlzZWNvbmRzJy5zcGxpdCgnfCcpLFxuICAgICAgICB1bml0TWlsbGlzZWNvbmRGYWN0b3JzID0ge1xuICAgICAgICAgICAgJ01pbGxpc2Vjb25kcycgOiAxLFxuICAgICAgICAgICAgJ1NlY29uZHMnIDogMWUzLFxuICAgICAgICAgICAgJ01pbnV0ZXMnIDogNmU0LFxuICAgICAgICAgICAgJ0hvdXJzJyA6IDM2ZTUsXG4gICAgICAgICAgICAnRGF5cycgOiA4NjRlNSxcbiAgICAgICAgICAgICdNb250aHMnIDogMjU5MmU2LFxuICAgICAgICAgICAgJ1llYXJzJyA6IDMxNTM2ZTZcbiAgICAgICAgfSxcblxuICAgICAgICB1bml0QWxpYXNlcyA9IHtcbiAgICAgICAgICAgIG1zIDogJ21pbGxpc2Vjb25kJyxcbiAgICAgICAgICAgIHMgOiAnc2Vjb25kJyxcbiAgICAgICAgICAgIG0gOiAnbWludXRlJyxcbiAgICAgICAgICAgIGggOiAnaG91cicsXG4gICAgICAgICAgICBkIDogJ2RheScsXG4gICAgICAgICAgICBEIDogJ2RhdGUnLFxuICAgICAgICAgICAgdyA6ICd3ZWVrJyxcbiAgICAgICAgICAgIFcgOiAnaXNvV2VlaycsXG4gICAgICAgICAgICBNIDogJ21vbnRoJyxcbiAgICAgICAgICAgIFEgOiAncXVhcnRlcicsXG4gICAgICAgICAgICB5IDogJ3llYXInLFxuICAgICAgICAgICAgREREIDogJ2RheU9mWWVhcicsXG4gICAgICAgICAgICBlIDogJ3dlZWtkYXknLFxuICAgICAgICAgICAgRSA6ICdpc29XZWVrZGF5JyxcbiAgICAgICAgICAgIGdnOiAnd2Vla1llYXInLFxuICAgICAgICAgICAgR0c6ICdpc29XZWVrWWVhcidcbiAgICAgICAgfSxcblxuICAgICAgICBjYW1lbEZ1bmN0aW9ucyA9IHtcbiAgICAgICAgICAgIGRheW9meWVhciA6ICdkYXlPZlllYXInLFxuICAgICAgICAgICAgaXNvd2Vla2RheSA6ICdpc29XZWVrZGF5JyxcbiAgICAgICAgICAgIGlzb3dlZWsgOiAnaXNvV2VlaycsXG4gICAgICAgICAgICB3ZWVreWVhciA6ICd3ZWVrWWVhcicsXG4gICAgICAgICAgICBpc293ZWVreWVhciA6ICdpc29XZWVrWWVhcidcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBmb3JtYXQgZnVuY3Rpb24gc3RyaW5nc1xuICAgICAgICBmb3JtYXRGdW5jdGlvbnMgPSB7fSxcblxuICAgICAgICAvLyBkZWZhdWx0IHJlbGF0aXZlIHRpbWUgdGhyZXNob2xkc1xuICAgICAgICByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzID0ge1xuICAgICAgICAgICAgczogNDUsICAvLyBzZWNvbmRzIHRvIG1pbnV0ZVxuICAgICAgICAgICAgbTogNDUsICAvLyBtaW51dGVzIHRvIGhvdXJcbiAgICAgICAgICAgIGg6IDIyLCAgLy8gaG91cnMgdG8gZGF5XG4gICAgICAgICAgICBkOiAyNiwgIC8vIGRheXMgdG8gbW9udGhcbiAgICAgICAgICAgIE06IDExICAgLy8gbW9udGhzIHRvIHllYXJcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB0b2tlbnMgdG8gb3JkaW5hbGl6ZSBhbmQgcGFkXG4gICAgICAgIG9yZGluYWxpemVUb2tlbnMgPSAnREREIHcgVyBNIEQgZCcuc3BsaXQoJyAnKSxcbiAgICAgICAgcGFkZGVkVG9rZW5zID0gJ00gRCBIIGggbSBzIHcgVycuc3BsaXQoJyAnKSxcblxuICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9ucyA9IHtcbiAgICAgICAgICAgIE0gICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubW9udGgoKSArIDE7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTU1NICA6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubW9udGhzU2hvcnQodGhpcywgZm9ybWF0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBNTU1NIDogZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tb250aHModGhpcywgZm9ybWF0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBEICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBEREQgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRheU9mWWVhcigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGQgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGQgICA6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXNNaW4odGhpcywgZm9ybWF0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZGQgIDogZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5c1Nob3J0KHRoaXMsIGZvcm1hdCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGRkZCA6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXModGhpcywgZm9ybWF0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3ICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLndlZWsoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBXICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlzb1dlZWsoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBZWSAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy55ZWFyKCkgJSAxMDAsIDIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFlZWVkgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLnllYXIoKSwgNCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWVlZWVkgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLnllYXIoKSwgNSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWVlZWVlZIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciB5ID0gdGhpcy55ZWFyKCksIHNpZ24gPSB5ID49IDAgPyAnKycgOiAnLSc7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpZ24gKyBsZWZ0WmVyb0ZpbGwoTWF0aC5hYnMoeSksIDYpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdnICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLndlZWtZZWFyKCkgJSAxMDAsIDIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdnZ2cgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLndlZWtZZWFyKCksIDQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdnZ2dnIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy53ZWVrWWVhcigpLCA1KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBHRyAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy5pc29XZWVrWWVhcigpICUgMTAwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBHR0dHIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy5pc29XZWVrWWVhcigpLCA0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBHR0dHRyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMuaXNvV2Vla1llYXIoKSwgNSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy53ZWVrZGF5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pc29XZWVrZGF5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYSAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubWVyaWRpZW0odGhpcy5ob3VycygpLCB0aGlzLm1pbnV0ZXMoKSwgdHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQSAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubWVyaWRpZW0odGhpcy5ob3VycygpLCB0aGlzLm1pbnV0ZXMoKSwgZmFsc2UpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEggICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaG91cnMoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhvdXJzKCkgJSAxMiB8fCAxMjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1pbnV0ZXMoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlY29uZHMoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0b0ludCh0aGlzLm1pbGxpc2Vjb25kcygpIC8gMTAwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTUyAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodG9JbnQodGhpcy5taWxsaXNlY29uZHMoKSAvIDEwKSwgMik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU1NTICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMubWlsbGlzZWNvbmRzKCksIDMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNTU1MgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLm1pbGxpc2Vjb25kcygpLCAzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBaICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhID0gdGhpcy51dGNPZmZzZXQoKSxcbiAgICAgICAgICAgICAgICAgICAgYiA9ICcrJztcbiAgICAgICAgICAgICAgICBpZiAoYSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYSA9IC1hO1xuICAgICAgICAgICAgICAgICAgICBiID0gJy0nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYiArIGxlZnRaZXJvRmlsbCh0b0ludChhIC8gNjApLCAyKSArICc6JyArIGxlZnRaZXJvRmlsbCh0b0ludChhKSAlIDYwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBaWiAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhID0gdGhpcy51dGNPZmZzZXQoKSxcbiAgICAgICAgICAgICAgICAgICAgYiA9ICcrJztcbiAgICAgICAgICAgICAgICBpZiAoYSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYSA9IC1hO1xuICAgICAgICAgICAgICAgICAgICBiID0gJy0nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYiArIGxlZnRaZXJvRmlsbCh0b0ludChhIC8gNjApLCAyKSArIGxlZnRaZXJvRmlsbCh0b0ludChhKSAlIDYwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB6IDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnpvbmVBYmJyKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgenogOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuem9uZU5hbWUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB4ICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBYICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnVuaXgoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBRIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnF1YXJ0ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkZXByZWNhdGlvbnMgPSB7fSxcblxuICAgICAgICBsaXN0cyA9IFsnbW9udGhzJywgJ21vbnRoc1Nob3J0JywgJ3dlZWtkYXlzJywgJ3dlZWtkYXlzU2hvcnQnLCAnd2Vla2RheXNNaW4nXSxcblxuICAgICAgICB1cGRhdGVJblByb2dyZXNzID0gZmFsc2U7XG5cbiAgICAvLyBQaWNrIHRoZSBmaXJzdCBkZWZpbmVkIG9mIHR3byBvciB0aHJlZSBhcmd1bWVudHMuIGRmbCBjb21lcyBmcm9tXG4gICAgLy8gZGVmYXVsdC5cbiAgICBmdW5jdGlvbiBkZmwoYSwgYiwgYykge1xuICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIGEgIT0gbnVsbCA/IGEgOiBiO1xuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gYSAhPSBudWxsID8gYSA6IGIgIT0gbnVsbCA/IGIgOiBjO1xuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKCdJbXBsZW1lbnQgbWUnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhc093blByb3AoYSwgYikge1xuICAgICAgICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChhLCBiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZhdWx0UGFyc2luZ0ZsYWdzKCkge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIGRlZXAgY2xvbmUgdGhpcyBvYmplY3QsIGFuZCBlczUgc3RhbmRhcmQgaXMgbm90IHZlcnlcbiAgICAgICAgLy8gaGVscGZ1bC5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVtcHR5IDogZmFsc2UsXG4gICAgICAgICAgICB1bnVzZWRUb2tlbnMgOiBbXSxcbiAgICAgICAgICAgIHVudXNlZElucHV0IDogW10sXG4gICAgICAgICAgICBvdmVyZmxvdyA6IC0yLFxuICAgICAgICAgICAgY2hhcnNMZWZ0T3ZlciA6IDAsXG4gICAgICAgICAgICBudWxsSW5wdXQgOiBmYWxzZSxcbiAgICAgICAgICAgIGludmFsaWRNb250aCA6IG51bGwsXG4gICAgICAgICAgICBpbnZhbGlkRm9ybWF0IDogZmFsc2UsXG4gICAgICAgICAgICB1c2VySW52YWxpZGF0ZWQgOiBmYWxzZSxcbiAgICAgICAgICAgIGlzbzogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmludE1zZyhtc2cpIHtcbiAgICAgICAgaWYgKG1vbWVudC5zdXBwcmVzc0RlcHJlY2F0aW9uV2FybmluZ3MgPT09IGZhbHNlICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdEZXByZWNhdGlvbiB3YXJuaW5nOiAnICsgbXNnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlcHJlY2F0ZShtc2csIGZuKSB7XG4gICAgICAgIHZhciBmaXJzdFRpbWUgPSB0cnVlO1xuICAgICAgICByZXR1cm4gZXh0ZW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgICAgICAgICBwcmludE1zZyhtc2cpO1xuICAgICAgICAgICAgICAgIGZpcnN0VGltZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sIGZuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXByZWNhdGVTaW1wbGUobmFtZSwgbXNnKSB7XG4gICAgICAgIGlmICghZGVwcmVjYXRpb25zW25hbWVdKSB7XG4gICAgICAgICAgICBwcmludE1zZyhtc2cpO1xuICAgICAgICAgICAgZGVwcmVjYXRpb25zW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhZFRva2VuKGZ1bmMsIGNvdW50KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbChmdW5jLmNhbGwodGhpcywgYSksIGNvdW50KTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb3JkaW5hbGl6ZVRva2VuKGZ1bmMsIHBlcmlvZCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5vcmRpbmFsKGZ1bmMuY2FsbCh0aGlzLCBhKSwgcGVyaW9kKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb250aERpZmYoYSwgYikge1xuICAgICAgICAvLyBkaWZmZXJlbmNlIGluIG1vbnRoc1xuICAgICAgICB2YXIgd2hvbGVNb250aERpZmYgPSAoKGIueWVhcigpIC0gYS55ZWFyKCkpICogMTIpICsgKGIubW9udGgoKSAtIGEubW9udGgoKSksXG4gICAgICAgICAgICAvLyBiIGlzIGluIChhbmNob3IgLSAxIG1vbnRoLCBhbmNob3IgKyAxIG1vbnRoKVxuICAgICAgICAgICAgYW5jaG9yID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiwgJ21vbnRocycpLFxuICAgICAgICAgICAgYW5jaG9yMiwgYWRqdXN0O1xuXG4gICAgICAgIGlmIChiIC0gYW5jaG9yIDwgMCkge1xuICAgICAgICAgICAgYW5jaG9yMiA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYgLSAxLCAnbW9udGhzJyk7XG4gICAgICAgICAgICAvLyBsaW5lYXIgYWNyb3NzIHRoZSBtb250aFxuICAgICAgICAgICAgYWRqdXN0ID0gKGIgLSBhbmNob3IpIC8gKGFuY2hvciAtIGFuY2hvcjIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYW5jaG9yMiA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYgKyAxLCAnbW9udGhzJyk7XG4gICAgICAgICAgICAvLyBsaW5lYXIgYWNyb3NzIHRoZSBtb250aFxuICAgICAgICAgICAgYWRqdXN0ID0gKGIgLSBhbmNob3IpIC8gKGFuY2hvcjIgLSBhbmNob3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0od2hvbGVNb250aERpZmYgKyBhZGp1c3QpO1xuICAgIH1cblxuICAgIHdoaWxlIChvcmRpbmFsaXplVG9rZW5zLmxlbmd0aCkge1xuICAgICAgICBpID0gb3JkaW5hbGl6ZVRva2Vucy5wb3AoKTtcbiAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbaSArICdvJ10gPSBvcmRpbmFsaXplVG9rZW4oZm9ybWF0VG9rZW5GdW5jdGlvbnNbaV0sIGkpO1xuICAgIH1cbiAgICB3aGlsZSAocGFkZGVkVG9rZW5zLmxlbmd0aCkge1xuICAgICAgICBpID0gcGFkZGVkVG9rZW5zLnBvcCgpO1xuICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1tpICsgaV0gPSBwYWRUb2tlbihmb3JtYXRUb2tlbkZ1bmN0aW9uc1tpXSwgMik7XG4gICAgfVxuICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zLkREREQgPSBwYWRUb2tlbihmb3JtYXRUb2tlbkZ1bmN0aW9ucy5EREQsIDMpO1xuXG5cbiAgICBmdW5jdGlvbiBtZXJpZGllbUZpeFdyYXAobG9jYWxlLCBob3VyLCBtZXJpZGllbSkge1xuICAgICAgICB2YXIgaXNQbTtcblxuICAgICAgICBpZiAobWVyaWRpZW0gPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gbm90aGluZyB0byBkb1xuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvY2FsZS5tZXJpZGllbUhvdXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZS5tZXJpZGllbUhvdXIoaG91ciwgbWVyaWRpZW0pO1xuICAgICAgICB9IGVsc2UgaWYgKGxvY2FsZS5pc1BNICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIEZhbGxiYWNrXG4gICAgICAgICAgICBpc1BtID0gbG9jYWxlLmlzUE0obWVyaWRpZW0pO1xuICAgICAgICAgICAgaWYgKGlzUG0gJiYgaG91ciA8IDEyKSB7XG4gICAgICAgICAgICAgICAgaG91ciArPSAxMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNQbSAmJiBob3VyID09PSAxMikge1xuICAgICAgICAgICAgICAgIGhvdXIgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aGllIGlzIG5vdCBzdXBwb3NlZCB0byBoYXBwZW5cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBDb25zdHJ1Y3RvcnNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICBmdW5jdGlvbiBMb2NhbGUoKSB7XG4gICAgfVxuXG4gICAgLy8gTW9tZW50IHByb3RvdHlwZSBvYmplY3RcbiAgICBmdW5jdGlvbiBNb21lbnQoY29uZmlnLCBza2lwT3ZlcmZsb3cpIHtcbiAgICAgICAgaWYgKHNraXBPdmVyZmxvdyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNoZWNrT3ZlcmZsb3coY29uZmlnKTtcbiAgICAgICAgfVxuICAgICAgICBjb3B5Q29uZmlnKHRoaXMsIGNvbmZpZyk7XG4gICAgICAgIHRoaXMuX2QgPSBuZXcgRGF0ZSgrY29uZmlnLl9kKTtcbiAgICAgICAgLy8gUHJldmVudCBpbmZpbml0ZSBsb29wIGluIGNhc2UgdXBkYXRlT2Zmc2V0IGNyZWF0ZXMgbmV3IG1vbWVudFxuICAgICAgICAvLyBvYmplY3RzLlxuICAgICAgICBpZiAodXBkYXRlSW5Qcm9ncmVzcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHVwZGF0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgbW9tZW50LnVwZGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgICAgIHVwZGF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIER1cmF0aW9uIENvbnN0cnVjdG9yXG4gICAgZnVuY3Rpb24gRHVyYXRpb24oZHVyYXRpb24pIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGR1cmF0aW9uKSxcbiAgICAgICAgICAgIHllYXJzID0gbm9ybWFsaXplZElucHV0LnllYXIgfHwgMCxcbiAgICAgICAgICAgIHF1YXJ0ZXJzID0gbm9ybWFsaXplZElucHV0LnF1YXJ0ZXIgfHwgMCxcbiAgICAgICAgICAgIG1vbnRocyA9IG5vcm1hbGl6ZWRJbnB1dC5tb250aCB8fCAwLFxuICAgICAgICAgICAgd2Vla3MgPSBub3JtYWxpemVkSW5wdXQud2VlayB8fCAwLFxuICAgICAgICAgICAgZGF5cyA9IG5vcm1hbGl6ZWRJbnB1dC5kYXkgfHwgMCxcbiAgICAgICAgICAgIGhvdXJzID0gbm9ybWFsaXplZElucHV0LmhvdXIgfHwgMCxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSBub3JtYWxpemVkSW5wdXQubWludXRlIHx8IDAsXG4gICAgICAgICAgICBzZWNvbmRzID0gbm9ybWFsaXplZElucHV0LnNlY29uZCB8fCAwLFxuICAgICAgICAgICAgbWlsbGlzZWNvbmRzID0gbm9ybWFsaXplZElucHV0Lm1pbGxpc2Vjb25kIHx8IDA7XG5cbiAgICAgICAgLy8gcmVwcmVzZW50YXRpb24gZm9yIGRhdGVBZGRSZW1vdmVcbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gK21pbGxpc2Vjb25kcyArXG4gICAgICAgICAgICBzZWNvbmRzICogMWUzICsgLy8gMTAwMFxuICAgICAgICAgICAgbWludXRlcyAqIDZlNCArIC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgaG91cnMgKiAzNmU1OyAvLyAxMDAwICogNjAgKiA2MFxuICAgICAgICAvLyBCZWNhdXNlIG9mIGRhdGVBZGRSZW1vdmUgdHJlYXRzIDI0IGhvdXJzIGFzIGRpZmZlcmVudCBmcm9tIGFcbiAgICAgICAgLy8gZGF5IHdoZW4gd29ya2luZyBhcm91bmQgRFNULCB3ZSBuZWVkIHRvIHN0b3JlIHRoZW0gc2VwYXJhdGVseVxuICAgICAgICB0aGlzLl9kYXlzID0gK2RheXMgK1xuICAgICAgICAgICAgd2Vla3MgKiA3O1xuICAgICAgICAvLyBJdCBpcyBpbXBvc3NpYmxlIHRyYW5zbGF0ZSBtb250aHMgaW50byBkYXlzIHdpdGhvdXQga25vd2luZ1xuICAgICAgICAvLyB3aGljaCBtb250aHMgeW91IGFyZSBhcmUgdGFsa2luZyBhYm91dCwgc28gd2UgaGF2ZSB0byBzdG9yZVxuICAgICAgICAvLyBpdCBzZXBhcmF0ZWx5LlxuICAgICAgICB0aGlzLl9tb250aHMgPSArbW9udGhzICtcbiAgICAgICAgICAgIHF1YXJ0ZXJzICogMyArXG4gICAgICAgICAgICB5ZWFycyAqIDEyO1xuXG4gICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcblxuICAgICAgICB0aGlzLl9sb2NhbGUgPSBtb21lbnQubG9jYWxlRGF0YSgpO1xuXG4gICAgICAgIHRoaXMuX2J1YmJsZSgpO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgSGVscGVyc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgZnVuY3Rpb24gZXh0ZW5kKGEsIGIpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBiKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChiLCBpKSkge1xuICAgICAgICAgICAgICAgIGFbaV0gPSBiW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3RvU3RyaW5nJykpIHtcbiAgICAgICAgICAgIGEudG9TdHJpbmcgPSBiLnRvU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3ZhbHVlT2YnKSkge1xuICAgICAgICAgICAgYS52YWx1ZU9mID0gYi52YWx1ZU9mO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29weUNvbmZpZyh0bywgZnJvbSkge1xuICAgICAgICB2YXIgaSwgcHJvcCwgdmFsO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5faXNBTW9tZW50T2JqZWN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2lzQU1vbWVudE9iamVjdCA9IGZyb20uX2lzQU1vbWVudE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2kgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5faSA9IGZyb20uX2k7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9mICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2YgPSBmcm9tLl9mO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9sID0gZnJvbS5fbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX3N0cmljdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9zdHJpY3QgPSBmcm9tLl9zdHJpY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl90em0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fdHptID0gZnJvbS5fdHptO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5faXNVVEMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5faXNVVEMgPSBmcm9tLl9pc1VUQztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX29mZnNldCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9vZmZzZXQgPSBmcm9tLl9vZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9wZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9wZiA9IGZyb20uX3BmO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fbG9jYWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2xvY2FsZSA9IGZyb20uX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb21lbnRQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAoaSBpbiBtb21lbnRQcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgcHJvcCA9IG1vbWVudFByb3BlcnRpZXNbaV07XG4gICAgICAgICAgICAgICAgdmFsID0gZnJvbVtwcm9wXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9bcHJvcF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFic1JvdW5kKG51bWJlcikge1xuICAgICAgICBpZiAobnVtYmVyIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbChudW1iZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobnVtYmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGxlZnQgemVybyBmaWxsIGEgbnVtYmVyXG4gICAgLy8gc2VlIGh0dHA6Ly9qc3BlcmYuY29tL2xlZnQtemVyby1maWxsaW5nIGZvciBwZXJmb3JtYW5jZSBjb21wYXJpc29uXG4gICAgZnVuY3Rpb24gbGVmdFplcm9GaWxsKG51bWJlciwgdGFyZ2V0TGVuZ3RoLCBmb3JjZVNpZ24pIHtcbiAgICAgICAgdmFyIG91dHB1dCA9ICcnICsgTWF0aC5hYnMobnVtYmVyKSxcbiAgICAgICAgICAgIHNpZ24gPSBudW1iZXIgPj0gMDtcblxuICAgICAgICB3aGlsZSAob3V0cHV0Lmxlbmd0aCA8IHRhcmdldExlbmd0aCkge1xuICAgICAgICAgICAgb3V0cHV0ID0gJzAnICsgb3V0cHV0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoc2lnbiA/IChmb3JjZVNpZ24gPyAnKycgOiAnJykgOiAnLScpICsgb3V0cHV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcyA9IHttaWxsaXNlY29uZHM6IDAsIG1vbnRoczogMH07XG5cbiAgICAgICAgcmVzLm1vbnRocyA9IG90aGVyLm1vbnRoKCkgLSBiYXNlLm1vbnRoKCkgK1xuICAgICAgICAgICAgKG90aGVyLnllYXIoKSAtIGJhc2UueWVhcigpKSAqIDEyO1xuICAgICAgICBpZiAoYmFzZS5jbG9uZSgpLmFkZChyZXMubW9udGhzLCAnTScpLmlzQWZ0ZXIob3RoZXIpKSB7XG4gICAgICAgICAgICAtLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gK290aGVyIC0gKyhiYXNlLmNsb25lKCkuYWRkKHJlcy5tb250aHMsICdNJykpO1xuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcztcbiAgICAgICAgb3RoZXIgPSBtYWtlQXMob3RoZXIsIGJhc2UpO1xuICAgICAgICBpZiAoYmFzZS5pc0JlZm9yZShvdGhlcikpIHtcbiAgICAgICAgICAgIHJlcyA9IHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShvdGhlciwgYmFzZSk7XG4gICAgICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gLXJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICByZXMubW9udGhzID0gLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHJlbW92ZSAnbmFtZScgYXJnIGFmdGVyIGRlcHJlY2F0aW9uIGlzIHJlbW92ZWRcbiAgICBmdW5jdGlvbiBjcmVhdGVBZGRlcihkaXJlY3Rpb24sIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWwsIHBlcmlvZCkge1xuICAgICAgICAgICAgdmFyIGR1ciwgdG1wO1xuICAgICAgICAgICAgLy9pbnZlcnQgdGhlIGFyZ3VtZW50cywgYnV0IGNvbXBsYWluIGFib3V0IGl0XG4gICAgICAgICAgICBpZiAocGVyaW9kICE9PSBudWxsICYmICFpc05hTigrcGVyaW9kKSkge1xuICAgICAgICAgICAgICAgIGRlcHJlY2F0ZVNpbXBsZShuYW1lLCAnbW9tZW50KCkuJyArIG5hbWUgICsgJyhwZXJpb2QsIG51bWJlcikgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBtb21lbnQoKS4nICsgbmFtZSArICcobnVtYmVyLCBwZXJpb2QpLicpO1xuICAgICAgICAgICAgICAgIHRtcCA9IHZhbDsgdmFsID0gcGVyaW9kOyBwZXJpb2QgPSB0bXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbCA9IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnID8gK3ZhbCA6IHZhbDtcbiAgICAgICAgICAgIGR1ciA9IG1vbWVudC5kdXJhdGlvbih2YWwsIHBlcmlvZCk7XG4gICAgICAgICAgICBhZGRPclN1YnRyYWN0RHVyYXRpb25Gcm9tTW9tZW50KHRoaXMsIGR1ciwgZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZE9yU3VidHJhY3REdXJhdGlvbkZyb21Nb21lbnQobW9tLCBkdXJhdGlvbiwgaXNBZGRpbmcsIHVwZGF0ZU9mZnNldCkge1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gZHVyYXRpb24uX21pbGxpc2Vjb25kcyxcbiAgICAgICAgICAgIGRheXMgPSBkdXJhdGlvbi5fZGF5cyxcbiAgICAgICAgICAgIG1vbnRocyA9IGR1cmF0aW9uLl9tb250aHM7XG4gICAgICAgIHVwZGF0ZU9mZnNldCA9IHVwZGF0ZU9mZnNldCA9PSBudWxsID8gdHJ1ZSA6IHVwZGF0ZU9mZnNldDtcblxuICAgICAgICBpZiAobWlsbGlzZWNvbmRzKSB7XG4gICAgICAgICAgICBtb20uX2Quc2V0VGltZSgrbW9tLl9kICsgbWlsbGlzZWNvbmRzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXlzKSB7XG4gICAgICAgICAgICByYXdTZXR0ZXIobW9tLCAnRGF0ZScsIHJhd0dldHRlcihtb20sICdEYXRlJykgKyBkYXlzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtb250aHMpIHtcbiAgICAgICAgICAgIHJhd01vbnRoU2V0dGVyKG1vbSwgcmF3R2V0dGVyKG1vbSwgJ01vbnRoJykgKyBtb250aHMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZU9mZnNldCkge1xuICAgICAgICAgICAgbW9tZW50LnVwZGF0ZU9mZnNldChtb20sIGRheXMgfHwgbW9udGhzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIGlzIGFuIGFycmF5XG4gICAgZnVuY3Rpb24gaXNBcnJheShpbnB1dCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RhdGUoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IERhdGVdJyB8fFxuICAgICAgICAgICAgaW5wdXQgaW5zdGFuY2VvZiBEYXRlO1xuICAgIH1cblxuICAgIC8vIGNvbXBhcmUgdHdvIGFycmF5cywgcmV0dXJuIHRoZSBudW1iZXIgb2YgZGlmZmVyZW5jZXNcbiAgICBmdW5jdGlvbiBjb21wYXJlQXJyYXlzKGFycmF5MSwgYXJyYXkyLCBkb250Q29udmVydCkge1xuICAgICAgICB2YXIgbGVuID0gTWF0aC5taW4oYXJyYXkxLmxlbmd0aCwgYXJyYXkyLmxlbmd0aCksXG4gICAgICAgICAgICBsZW5ndGhEaWZmID0gTWF0aC5hYnMoYXJyYXkxLmxlbmd0aCAtIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICAgICAgZGlmZnMgPSAwLFxuICAgICAgICAgICAgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoKGRvbnRDb252ZXJ0ICYmIGFycmF5MVtpXSAhPT0gYXJyYXkyW2ldKSB8fFxuICAgICAgICAgICAgICAgICghZG9udENvbnZlcnQgJiYgdG9JbnQoYXJyYXkxW2ldKSAhPT0gdG9JbnQoYXJyYXkyW2ldKSkpIHtcbiAgICAgICAgICAgICAgICBkaWZmcysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaWZmcyArIGxlbmd0aERpZmY7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplVW5pdHModW5pdHMpIHtcbiAgICAgICAgaWYgKHVuaXRzKSB7XG4gICAgICAgICAgICB2YXIgbG93ZXJlZCA9IHVuaXRzLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvKC4pcyQvLCAnJDEnKTtcbiAgICAgICAgICAgIHVuaXRzID0gdW5pdEFsaWFzZXNbdW5pdHNdIHx8IGNhbWVsRnVuY3Rpb25zW2xvd2VyZWRdIHx8IGxvd2VyZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuaXRzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZU9iamVjdFVuaXRzKGlucHV0T2JqZWN0KSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkSW5wdXQgPSB7fSxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wLFxuICAgICAgICAgICAgcHJvcDtcblxuICAgICAgICBmb3IgKHByb3AgaW4gaW5wdXRPYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKGlucHV0T2JqZWN0LCBwcm9wKSkge1xuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wID0gbm9ybWFsaXplVW5pdHMocHJvcCk7XG4gICAgICAgICAgICAgICAgaWYgKG5vcm1hbGl6ZWRQcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dFtub3JtYWxpemVkUHJvcF0gPSBpbnB1dE9iamVjdFtwcm9wXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9ybWFsaXplZElucHV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VMaXN0KGZpZWxkKSB7XG4gICAgICAgIHZhciBjb3VudCwgc2V0dGVyO1xuXG4gICAgICAgIGlmIChmaWVsZC5pbmRleE9mKCd3ZWVrJykgPT09IDApIHtcbiAgICAgICAgICAgIGNvdW50ID0gNztcbiAgICAgICAgICAgIHNldHRlciA9ICdkYXknO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZpZWxkLmluZGV4T2YoJ21vbnRoJykgPT09IDApIHtcbiAgICAgICAgICAgIGNvdW50ID0gMTI7XG4gICAgICAgICAgICBzZXR0ZXIgPSAnbW9udGgnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbW9tZW50W2ZpZWxkXSA9IGZ1bmN0aW9uIChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgaSwgZ2V0dGVyLFxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IG1vbWVudC5fbG9jYWxlW2ZpZWxkXSxcbiAgICAgICAgICAgICAgICByZXN1bHRzID0gW107XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgZm9ybWF0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgICAgIGZvcm1hdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ2V0dGVyID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgbSA9IG1vbWVudCgpLnV0YygpLnNldChzZXR0ZXIsIGkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXRob2QuY2FsbChtb21lbnQuX2xvY2FsZSwgbSwgZm9ybWF0IHx8ICcnKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldHRlcihpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZ2V0dGVyKGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9JbnQoYXJndW1lbnRGb3JDb2VyY2lvbikge1xuICAgICAgICB2YXIgY29lcmNlZE51bWJlciA9ICthcmd1bWVudEZvckNvZXJjaW9uLFxuICAgICAgICAgICAgdmFsdWUgPSAwO1xuXG4gICAgICAgIGlmIChjb2VyY2VkTnVtYmVyICE9PSAwICYmIGlzRmluaXRlKGNvZXJjZWROdW1iZXIpKSB7XG4gICAgICAgICAgICBpZiAoY29lcmNlZE51bWJlciA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBNYXRoLmZsb29yKGNvZXJjZWROdW1iZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IE1hdGguY2VpbChjb2VyY2VkTnVtYmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlzSW5Nb250aCh5ZWFyLCBtb250aCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoeWVhciwgbW9udGggKyAxLCAwKSkuZ2V0VVRDRGF0ZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdlZWtzSW5ZZWFyKHllYXIsIGRvdywgZG95KSB7XG4gICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKG1vbWVudChbeWVhciwgMTEsIDMxICsgZG93IC0gZG95XSksIGRvdywgZG95KS53ZWVrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheXNJblllYXIoeWVhcikge1xuICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih5ZWFyKSA/IDM2NiA6IDM2NTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0xlYXBZZWFyKHllYXIpIHtcbiAgICAgICAgcmV0dXJuICh5ZWFyICUgNCA9PT0gMCAmJiB5ZWFyICUgMTAwICE9PSAwKSB8fCB5ZWFyICUgNDAwID09PSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrT3ZlcmZsb3cobSkge1xuICAgICAgICB2YXIgb3ZlcmZsb3c7XG4gICAgICAgIGlmIChtLl9hICYmIG0uX3BmLm92ZXJmbG93ID09PSAtMikge1xuICAgICAgICAgICAgb3ZlcmZsb3cgPVxuICAgICAgICAgICAgICAgIG0uX2FbTU9OVEhdIDwgMCB8fCBtLl9hW01PTlRIXSA+IDExID8gTU9OVEggOlxuICAgICAgICAgICAgICAgIG0uX2FbREFURV0gPCAxIHx8IG0uX2FbREFURV0gPiBkYXlzSW5Nb250aChtLl9hW1lFQVJdLCBtLl9hW01PTlRIXSkgPyBEQVRFIDpcbiAgICAgICAgICAgICAgICBtLl9hW0hPVVJdIDwgMCB8fCBtLl9hW0hPVVJdID4gMjQgfHxcbiAgICAgICAgICAgICAgICAgICAgKG0uX2FbSE9VUl0gPT09IDI0ICYmIChtLl9hW01JTlVURV0gIT09IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtLl9hW1NFQ09ORF0gIT09IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtLl9hW01JTExJU0VDT05EXSAhPT0gMCkpID8gSE9VUiA6XG4gICAgICAgICAgICAgICAgbS5fYVtNSU5VVEVdIDwgMCB8fCBtLl9hW01JTlVURV0gPiA1OSA/IE1JTlVURSA6XG4gICAgICAgICAgICAgICAgbS5fYVtTRUNPTkRdIDwgMCB8fCBtLl9hW1NFQ09ORF0gPiA1OSA/IFNFQ09ORCA6XG4gICAgICAgICAgICAgICAgbS5fYVtNSUxMSVNFQ09ORF0gPCAwIHx8IG0uX2FbTUlMTElTRUNPTkRdID4gOTk5ID8gTUlMTElTRUNPTkQgOlxuICAgICAgICAgICAgICAgIC0xO1xuXG4gICAgICAgICAgICBpZiAobS5fcGYuX292ZXJmbG93RGF5T2ZZZWFyICYmIChvdmVyZmxvdyA8IFlFQVIgfHwgb3ZlcmZsb3cgPiBEQVRFKSkge1xuICAgICAgICAgICAgICAgIG92ZXJmbG93ID0gREFURTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbS5fcGYub3ZlcmZsb3cgPSBvdmVyZmxvdztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVmFsaWQobSkge1xuICAgICAgICBpZiAobS5faXNWYWxpZCA9PSBudWxsKSB7XG4gICAgICAgICAgICBtLl9pc1ZhbGlkID0gIWlzTmFOKG0uX2QuZ2V0VGltZSgpKSAmJlxuICAgICAgICAgICAgICAgIG0uX3BmLm92ZXJmbG93IDwgMCAmJlxuICAgICAgICAgICAgICAgICFtLl9wZi5lbXB0eSAmJlxuICAgICAgICAgICAgICAgICFtLl9wZi5pbnZhbGlkTW9udGggJiZcbiAgICAgICAgICAgICAgICAhbS5fcGYubnVsbElucHV0ICYmXG4gICAgICAgICAgICAgICAgIW0uX3BmLmludmFsaWRGb3JtYXQgJiZcbiAgICAgICAgICAgICAgICAhbS5fcGYudXNlckludmFsaWRhdGVkO1xuXG4gICAgICAgICAgICBpZiAobS5fc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgbS5faXNWYWxpZCA9IG0uX2lzVmFsaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgbS5fcGYuY2hhcnNMZWZ0T3ZlciA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgICBtLl9wZi51bnVzZWRUb2tlbnMubGVuZ3RoID09PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIG0uX3BmLmJpZ0hvdXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbS5faXNWYWxpZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVMb2NhbGUoa2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkgPyBrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCdfJywgJy0nKSA6IGtleTtcbiAgICB9XG5cbiAgICAvLyBwaWNrIHRoZSBsb2NhbGUgZnJvbSB0aGUgYXJyYXlcbiAgICAvLyB0cnkgWydlbi1hdScsICdlbi1nYiddIGFzICdlbi1hdScsICdlbi1nYicsICdlbicsIGFzIGluIG1vdmUgdGhyb3VnaCB0aGUgbGlzdCB0cnlpbmcgZWFjaFxuICAgIC8vIHN1YnN0cmluZyBmcm9tIG1vc3Qgc3BlY2lmaWMgdG8gbGVhc3QsIGJ1dCBtb3ZlIHRvIHRoZSBuZXh0IGFycmF5IGl0ZW0gaWYgaXQncyBhIG1vcmUgc3BlY2lmaWMgdmFyaWFudCB0aGFuIHRoZSBjdXJyZW50IHJvb3RcbiAgICBmdW5jdGlvbiBjaG9vc2VMb2NhbGUobmFtZXMpIHtcbiAgICAgICAgdmFyIGkgPSAwLCBqLCBuZXh0LCBsb2NhbGUsIHNwbGl0O1xuXG4gICAgICAgIHdoaWxlIChpIDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzcGxpdCA9IG5vcm1hbGl6ZUxvY2FsZShuYW1lc1tpXSkuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgIGogPSBzcGxpdC5sZW5ndGg7XG4gICAgICAgICAgICBuZXh0ID0gbm9ybWFsaXplTG9jYWxlKG5hbWVzW2kgKyAxXSk7XG4gICAgICAgICAgICBuZXh0ID0gbmV4dCA/IG5leHQuc3BsaXQoJy0nKSA6IG51bGw7XG4gICAgICAgICAgICB3aGlsZSAoaiA+IDApIHtcbiAgICAgICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKHNwbGl0LnNsaWNlKDAsIGopLmpvaW4oJy0nKSk7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmV4dCAmJiBuZXh0Lmxlbmd0aCA+PSBqICYmIGNvbXBhcmVBcnJheXMoc3BsaXQsIG5leHQsIHRydWUpID49IGogLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdGhlIG5leHQgYXJyYXkgaXRlbSBpcyBiZXR0ZXIgdGhhbiBhIHNoYWxsb3dlciBzdWJzdHJpbmcgb2YgdGhpcyBvbmVcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGotLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkTG9jYWxlKG5hbWUpIHtcbiAgICAgICAgdmFyIG9sZExvY2FsZSA9IG51bGw7XG4gICAgICAgIGlmICghbG9jYWxlc1tuYW1lXSAmJiBoYXNNb2R1bGUpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2xkTG9jYWxlID0gbW9tZW50LmxvY2FsZSgpO1xuICAgICAgICAgICAgICAgIHJlcXVpcmUoJy4vbG9jYWxlLycgKyBuYW1lKTtcbiAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIGRlZmluZUxvY2FsZSBjdXJyZW50bHkgYWxzbyBzZXRzIHRoZSBnbG9iYWwgbG9jYWxlLCB3ZSB3YW50IHRvIHVuZG8gdGhhdCBmb3IgbGF6eSBsb2FkZWQgbG9jYWxlc1xuICAgICAgICAgICAgICAgIG1vbWVudC5sb2NhbGUob2xkTG9jYWxlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhIG1vbWVudCBmcm9tIGlucHV0LCB0aGF0IGlzIGxvY2FsL3V0Yy91dGNPZmZzZXQgZXF1aXZhbGVudCB0b1xuICAgIC8vIG1vZGVsLlxuICAgIGZ1bmN0aW9uIG1ha2VBcyhpbnB1dCwgbW9kZWwpIHtcbiAgICAgICAgdmFyIHJlcywgZGlmZjtcbiAgICAgICAgaWYgKG1vZGVsLl9pc1VUQykge1xuICAgICAgICAgICAgcmVzID0gbW9kZWwuY2xvbmUoKTtcbiAgICAgICAgICAgIGRpZmYgPSAobW9tZW50LmlzTW9tZW50KGlucHV0KSB8fCBpc0RhdGUoaW5wdXQpID9cbiAgICAgICAgICAgICAgICAgICAgK2lucHV0IDogK21vbWVudChpbnB1dCkpIC0gKCtyZXMpO1xuICAgICAgICAgICAgLy8gVXNlIGxvdy1sZXZlbCBhcGksIGJlY2F1c2UgdGhpcyBmbiBpcyBsb3ctbGV2ZWwgYXBpLlxuICAgICAgICAgICAgcmVzLl9kLnNldFRpbWUoK3Jlcy5fZCArIGRpZmYpO1xuICAgICAgICAgICAgbW9tZW50LnVwZGF0ZU9mZnNldChyZXMsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50KGlucHV0KS5sb2NhbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBMb2NhbGVcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIGV4dGVuZChMb2NhbGUucHJvdG90eXBlLCB7XG5cbiAgICAgICAgc2V0IDogZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgdmFyIHByb3AsIGk7XG4gICAgICAgICAgICBmb3IgKGkgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcHJvcCA9IGNvbmZpZ1tpXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1tpXSA9IHByb3A7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1snXycgKyBpXSA9IHByb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTGVuaWVudCBvcmRpbmFsIHBhcnNpbmcgYWNjZXB0cyBqdXN0IGEgbnVtYmVyIGluIGFkZGl0aW9uIHRvXG4gICAgICAgICAgICAvLyBudW1iZXIgKyAocG9zc2libHkpIHN0dWZmIGNvbWluZyBmcm9tIF9vcmRpbmFsUGFyc2VMZW5pZW50LlxuICAgICAgICAgICAgdGhpcy5fb3JkaW5hbFBhcnNlTGVuaWVudCA9IG5ldyBSZWdFeHAodGhpcy5fb3JkaW5hbFBhcnNlLnNvdXJjZSArICd8JyArIC9cXGR7MSwyfS8uc291cmNlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfbW9udGhzIDogJ0phbnVhcnlfRmVicnVhcnlfTWFyY2hfQXByaWxfTWF5X0p1bmVfSnVseV9BdWd1c3RfU2VwdGVtYmVyX09jdG9iZXJfTm92ZW1iZXJfRGVjZW1iZXInLnNwbGl0KCdfJyksXG4gICAgICAgIG1vbnRocyA6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzW20ubW9udGgoKV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgX21vbnRoc1Nob3J0IDogJ0phbl9GZWJfTWFyX0Fwcl9NYXlfSnVuX0p1bF9BdWdfU2VwX09jdF9Ob3ZfRGVjJy5zcGxpdCgnXycpLFxuICAgICAgICBtb250aHNTaG9ydCA6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRbbS5tb250aCgpXTtcbiAgICAgICAgfSxcblxuICAgICAgICBtb250aHNQYXJzZSA6IGZ1bmN0aW9uIChtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICAgICAgICAgIG1vbSA9IG1vbWVudC51dGMoWzIwMDAsIGldKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RyaWN0ICYmICF0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKS5yZXBsYWNlKCcuJywgJycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnJykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghc3RyaWN0ICYmICF0aGlzLl9tb250aHNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgICAgICByZWdleCA9ICdeJyArIHRoaXMubW9udGhzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMubW9udGhzU2hvcnQobW9tLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgICAgIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnTU1NTScgJiYgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdNTU0nICYmIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0udGVzdChtb250aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCAmJiB0aGlzLl9tb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF93ZWVrZGF5cyA6ICdTdW5kYXlfTW9uZGF5X1R1ZXNkYXlfV2VkbmVzZGF5X1RodXJzZGF5X0ZyaWRheV9TYXR1cmRheScuc3BsaXQoJ18nKSxcbiAgICAgICAgd2Vla2RheXMgOiBmdW5jdGlvbiAobSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzW20uZGF5KCldO1xuICAgICAgICB9LFxuXG4gICAgICAgIF93ZWVrZGF5c1Nob3J0IDogJ1N1bl9Nb25fVHVlX1dlZF9UaHVfRnJpX1NhdCcuc3BsaXQoJ18nKSxcbiAgICAgICAgd2Vla2RheXNTaG9ydCA6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNTaG9ydFttLmRheSgpXTtcbiAgICAgICAgfSxcblxuICAgICAgICBfd2Vla2RheXNNaW4gOiAnU3VfTW9fVHVfV2VfVGhfRnJfU2EnLnNwbGl0KCdfJyksXG4gICAgICAgIHdlZWtkYXlzTWluIDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblttLmRheSgpXTtcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrZGF5c1BhcnNlIDogZnVuY3Rpb24gKHdlZWtkYXlOYW1lKSB7XG4gICAgICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vbSA9IG1vbWVudChbMjAwMCwgMV0pLmRheShpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLndlZWtkYXlzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKSArICd8XicgKyB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl93ZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfbG9uZ0RhdGVGb3JtYXQgOiB7XG4gICAgICAgICAgICBMVFMgOiAnaDptbTpzcyBBJyxcbiAgICAgICAgICAgIExUIDogJ2g6bW0gQScsXG4gICAgICAgICAgICBMIDogJ01NL0REL1lZWVknLFxuICAgICAgICAgICAgTEwgOiAnTU1NTSBELCBZWVlZJyxcbiAgICAgICAgICAgIExMTCA6ICdNTU1NIEQsIFlZWVkgTFQnLFxuICAgICAgICAgICAgTExMTCA6ICdkZGRkLCBNTU1NIEQsIFlZWVkgTFQnXG4gICAgICAgIH0sXG4gICAgICAgIGxvbmdEYXRlRm9ybWF0IDogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV07XG4gICAgICAgICAgICBpZiAoIW91dHB1dCAmJiB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXkudG9VcHBlckNhc2UoKV0pIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXkudG9VcHBlckNhc2UoKV0ucmVwbGFjZSgvTU1NTXxNTXxERHxkZGRkL2csIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbC5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldID0gb3V0cHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1BNIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICAvLyBJRTggUXVpcmtzIE1vZGUgJiBJRTcgU3RhbmRhcmRzIE1vZGUgZG8gbm90IGFsbG93IGFjY2Vzc2luZyBzdHJpbmdzIGxpa2UgYXJyYXlzXG4gICAgICAgICAgICAvLyBVc2luZyBjaGFyQXQgc2hvdWxkIGJlIG1vcmUgY29tcGF0aWJsZS5cbiAgICAgICAgICAgIHJldHVybiAoKGlucHV0ICsgJycpLnRvTG93ZXJDYXNlKCkuY2hhckF0KDApID09PSAncCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9tZXJpZGllbVBhcnNlIDogL1thcF1cXC4/bT9cXC4/L2ksXG4gICAgICAgIG1lcmlkaWVtIDogZnVuY3Rpb24gKGhvdXJzLCBtaW51dGVzLCBpc0xvd2VyKSB7XG4gICAgICAgICAgICBpZiAoaG91cnMgPiAxMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpc0xvd2VyID8gJ3BtJyA6ICdQTSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBpc0xvd2VyID8gJ2FtJyA6ICdBTSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cblxuICAgICAgICBfY2FsZW5kYXIgOiB7XG4gICAgICAgICAgICBzYW1lRGF5IDogJ1tUb2RheSBhdF0gTFQnLFxuICAgICAgICAgICAgbmV4dERheSA6ICdbVG9tb3Jyb3cgYXRdIExUJyxcbiAgICAgICAgICAgIG5leHRXZWVrIDogJ2RkZGQgW2F0XSBMVCcsXG4gICAgICAgICAgICBsYXN0RGF5IDogJ1tZZXN0ZXJkYXkgYXRdIExUJyxcbiAgICAgICAgICAgIGxhc3RXZWVrIDogJ1tMYXN0XSBkZGRkIFthdF0gTFQnLFxuICAgICAgICAgICAgc2FtZUVsc2UgOiAnTCdcbiAgICAgICAgfSxcbiAgICAgICAgY2FsZW5kYXIgOiBmdW5jdGlvbiAoa2V5LCBtb20sIG5vdykge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX2NhbGVuZGFyW2tleV07XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIG91dHB1dCA9PT0gJ2Z1bmN0aW9uJyA/IG91dHB1dC5hcHBseShtb20sIFtub3ddKSA6IG91dHB1dDtcbiAgICAgICAgfSxcblxuICAgICAgICBfcmVsYXRpdmVUaW1lIDoge1xuICAgICAgICAgICAgZnV0dXJlIDogJ2luICVzJyxcbiAgICAgICAgICAgIHBhc3QgOiAnJXMgYWdvJyxcbiAgICAgICAgICAgIHMgOiAnYSBmZXcgc2Vjb25kcycsXG4gICAgICAgICAgICBtIDogJ2EgbWludXRlJyxcbiAgICAgICAgICAgIG1tIDogJyVkIG1pbnV0ZXMnLFxuICAgICAgICAgICAgaCA6ICdhbiBob3VyJyxcbiAgICAgICAgICAgIGhoIDogJyVkIGhvdXJzJyxcbiAgICAgICAgICAgIGQgOiAnYSBkYXknLFxuICAgICAgICAgICAgZGQgOiAnJWQgZGF5cycsXG4gICAgICAgICAgICBNIDogJ2EgbW9udGgnLFxuICAgICAgICAgICAgTU0gOiAnJWQgbW9udGhzJyxcbiAgICAgICAgICAgIHkgOiAnYSB5ZWFyJyxcbiAgICAgICAgICAgIHl5IDogJyVkIHllYXJzJ1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbGF0aXZlVGltZSA6IGZ1bmN0aW9uIChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbc3RyaW5nXTtcbiAgICAgICAgICAgIHJldHVybiAodHlwZW9mIG91dHB1dCA9PT0gJ2Z1bmN0aW9uJykgP1xuICAgICAgICAgICAgICAgIG91dHB1dChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIDpcbiAgICAgICAgICAgICAgICBvdXRwdXQucmVwbGFjZSgvJWQvaSwgbnVtYmVyKTtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXN0RnV0dXJlIDogZnVuY3Rpb24gKGRpZmYsIG91dHB1dCkge1xuICAgICAgICAgICAgdmFyIGZvcm1hdCA9IHRoaXMuX3JlbGF0aXZlVGltZVtkaWZmID4gMCA/ICdmdXR1cmUnIDogJ3Bhc3QnXTtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgZm9ybWF0ID09PSAnZnVuY3Rpb24nID8gZm9ybWF0KG91dHB1dCkgOiBmb3JtYXQucmVwbGFjZSgvJXMvaSwgb3V0cHV0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBvcmRpbmFsIDogZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29yZGluYWwucmVwbGFjZSgnJWQnLCBudW1iZXIpO1xuICAgICAgICB9LFxuICAgICAgICBfb3JkaW5hbCA6ICclZCcsXG4gICAgICAgIF9vcmRpbmFsUGFyc2UgOiAvXFxkezEsMn0vLFxuXG4gICAgICAgIHByZXBhcnNlIDogZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICAgICAgfSxcblxuICAgICAgICBwb3N0Zm9ybWF0IDogZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrIDogZnVuY3Rpb24gKG1vbSkge1xuICAgICAgICAgICAgcmV0dXJuIHdlZWtPZlllYXIobW9tLCB0aGlzLl93ZWVrLmRvdywgdGhpcy5fd2Vlay5kb3kpLndlZWs7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3dlZWsgOiB7XG4gICAgICAgICAgICBkb3cgOiAwLCAvLyBTdW5kYXkgaXMgdGhlIGZpcnN0IGRheSBvZiB0aGUgd2Vlay5cbiAgICAgICAgICAgIGRveSA6IDYgIC8vIFRoZSB3ZWVrIHRoYXQgY29udGFpbnMgSmFuIDFzdCBpcyB0aGUgZmlyc3Qgd2VlayBvZiB0aGUgeWVhci5cbiAgICAgICAgfSxcblxuICAgICAgICBmaXJzdERheU9mV2VlayA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrLmRvdztcbiAgICAgICAgfSxcblxuICAgICAgICBmaXJzdERheU9mWWVhciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrLmRveTtcbiAgICAgICAgfSxcblxuICAgICAgICBfaW52YWxpZERhdGU6ICdJbnZhbGlkIGRhdGUnLFxuICAgICAgICBpbnZhbGlkRGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ludmFsaWREYXRlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEZvcm1hdHRpbmdcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUZvcm1hdHRpbmdUb2tlbnMoaW5wdXQpIHtcbiAgICAgICAgaWYgKGlucHV0Lm1hdGNoKC9cXFtbXFxzXFxTXS8pKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXlxcW3xcXF0kL2csICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXFxcXC9nLCAnJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUZvcm1hdEZ1bmN0aW9uKGZvcm1hdCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBmb3JtYXQubWF0Y2goZm9ybWF0dGluZ1Rva2VucyksIGksIGxlbmd0aDtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZvcm1hdFRva2VuRnVuY3Rpb25zW2FycmF5W2ldXSkge1xuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IHJlbW92ZUZvcm1hdHRpbmdUb2tlbnMoYXJyYXlbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtb20pIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBhcnJheVtpXSBpbnN0YW5jZW9mIEZ1bmN0aW9uID8gYXJyYXlbaV0uY2FsbChtb20sIGZvcm1hdCkgOiBhcnJheVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gZm9ybWF0IGRhdGUgdXNpbmcgbmF0aXZlIGRhdGUgb2JqZWN0XG4gICAgZnVuY3Rpb24gZm9ybWF0TW9tZW50KG0sIGZvcm1hdCkge1xuICAgICAgICBpZiAoIW0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbS5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdCA9IGV4cGFuZEZvcm1hdChmb3JtYXQsIG0ubG9jYWxlRGF0YSgpKTtcblxuICAgICAgICBpZiAoIWZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdKSB7XG4gICAgICAgICAgICBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSA9IG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdKG0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4cGFuZEZvcm1hdChmb3JtYXQsIGxvY2FsZSkge1xuICAgICAgICB2YXIgaSA9IDU7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVwbGFjZUxvbmdEYXRlRm9ybWF0VG9rZW5zKGlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlLmxvbmdEYXRlRm9ybWF0KGlucHV0KSB8fCBpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy5sYXN0SW5kZXggPSAwO1xuICAgICAgICB3aGlsZSAoaSA+PSAwICYmIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy50ZXN0KGZvcm1hdCkpIHtcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKGxvY2FsRm9ybWF0dGluZ1Rva2VucywgcmVwbGFjZUxvbmdEYXRlRm9ybWF0VG9rZW5zKTtcbiAgICAgICAgICAgIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgaSAtPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdDtcbiAgICB9XG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgUGFyc2luZ1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgLy8gZ2V0IHRoZSByZWdleCB0byBmaW5kIHRoZSBuZXh0IHRva2VuXG4gICAgZnVuY3Rpb24gZ2V0UGFyc2VSZWdleEZvclRva2VuKHRva2VuLCBjb25maWcpIHtcbiAgICAgICAgdmFyIGEsIHN0cmljdCA9IGNvbmZpZy5fc3RyaWN0O1xuICAgICAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAgIGNhc2UgJ1EnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5PbmVEaWdpdDtcbiAgICAgICAgY2FzZSAnRERERCc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlblRocmVlRGlnaXRzO1xuICAgICAgICBjYXNlICdZWVlZJzpcbiAgICAgICAgY2FzZSAnR0dHRyc6XG4gICAgICAgIGNhc2UgJ2dnZ2cnOlxuICAgICAgICAgICAgcmV0dXJuIHN0cmljdCA/IHBhcnNlVG9rZW5Gb3VyRGlnaXRzIDogcGFyc2VUb2tlbk9uZVRvRm91ckRpZ2l0cztcbiAgICAgICAgY2FzZSAnWSc6XG4gICAgICAgIGNhc2UgJ0cnOlxuICAgICAgICBjYXNlICdnJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuU2lnbmVkTnVtYmVyO1xuICAgICAgICBjYXNlICdZWVlZWVknOlxuICAgICAgICBjYXNlICdZWVlZWSc6XG4gICAgICAgIGNhc2UgJ0dHR0dHJzpcbiAgICAgICAgY2FzZSAnZ2dnZ2cnOlxuICAgICAgICAgICAgcmV0dXJuIHN0cmljdCA/IHBhcnNlVG9rZW5TaXhEaWdpdHMgOiBwYXJzZVRva2VuT25lVG9TaXhEaWdpdHM7XG4gICAgICAgIGNhc2UgJ1MnOlxuICAgICAgICAgICAgaWYgKHN0cmljdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuT25lRGlnaXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ1NTJzpcbiAgICAgICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlblR3b0RpZ2l0cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnU1NTJzpcbiAgICAgICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlblRocmVlRGlnaXRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdEREQnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5PbmVUb1RocmVlRGlnaXRzO1xuICAgICAgICBjYXNlICdNTU0nOlxuICAgICAgICBjYXNlICdNTU1NJzpcbiAgICAgICAgY2FzZSAnZGQnOlxuICAgICAgICBjYXNlICdkZGQnOlxuICAgICAgICBjYXNlICdkZGRkJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuV29yZDtcbiAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgIGNhc2UgJ0EnOlxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy5fbG9jYWxlLl9tZXJpZGllbVBhcnNlO1xuICAgICAgICBjYXNlICd4JzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuT2Zmc2V0TXM7XG4gICAgICAgIGNhc2UgJ1gnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5UaW1lc3RhbXBNcztcbiAgICAgICAgY2FzZSAnWic6XG4gICAgICAgIGNhc2UgJ1paJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuVGltZXpvbmU7XG4gICAgICAgIGNhc2UgJ1QnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5UO1xuICAgICAgICBjYXNlICdTU1NTJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuRGlnaXRzO1xuICAgICAgICBjYXNlICdNTSc6XG4gICAgICAgIGNhc2UgJ0REJzpcbiAgICAgICAgY2FzZSAnWVknOlxuICAgICAgICBjYXNlICdHRyc6XG4gICAgICAgIGNhc2UgJ2dnJzpcbiAgICAgICAgY2FzZSAnSEgnOlxuICAgICAgICBjYXNlICdoaCc6XG4gICAgICAgIGNhc2UgJ21tJzpcbiAgICAgICAgY2FzZSAnc3MnOlxuICAgICAgICBjYXNlICd3dyc6XG4gICAgICAgIGNhc2UgJ1dXJzpcbiAgICAgICAgICAgIHJldHVybiBzdHJpY3QgPyBwYXJzZVRva2VuVHdvRGlnaXRzIDogcGFyc2VUb2tlbk9uZU9yVHdvRGlnaXRzO1xuICAgICAgICBjYXNlICdNJzpcbiAgICAgICAgY2FzZSAnRCc6XG4gICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICBjYXNlICdIJzpcbiAgICAgICAgY2FzZSAnaCc6XG4gICAgICAgIGNhc2UgJ20nOlxuICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgY2FzZSAndyc6XG4gICAgICAgIGNhc2UgJ1cnOlxuICAgICAgICBjYXNlICdlJzpcbiAgICAgICAgY2FzZSAnRSc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbk9uZU9yVHdvRGlnaXRzO1xuICAgICAgICBjYXNlICdEbyc6XG4gICAgICAgICAgICByZXR1cm4gc3RyaWN0ID8gY29uZmlnLl9sb2NhbGUuX29yZGluYWxQYXJzZSA6IGNvbmZpZy5fbG9jYWxlLl9vcmRpbmFsUGFyc2VMZW5pZW50O1xuICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICAgIGEgPSBuZXcgUmVnRXhwKHJlZ2V4cEVzY2FwZSh1bmVzY2FwZUZvcm1hdCh0b2tlbi5yZXBsYWNlKCdcXFxcJywgJycpKSwgJ2knKSk7XG4gICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHV0Y09mZnNldEZyb21TdHJpbmcoc3RyaW5nKSB7XG4gICAgICAgIHN0cmluZyA9IHN0cmluZyB8fCAnJztcbiAgICAgICAgdmFyIHBvc3NpYmxlVHpNYXRjaGVzID0gKHN0cmluZy5tYXRjaChwYXJzZVRva2VuVGltZXpvbmUpIHx8IFtdKSxcbiAgICAgICAgICAgIHR6Q2h1bmsgPSBwb3NzaWJsZVR6TWF0Y2hlc1twb3NzaWJsZVR6TWF0Y2hlcy5sZW5ndGggLSAxXSB8fCBbXSxcbiAgICAgICAgICAgIHBhcnRzID0gKHR6Q2h1bmsgKyAnJykubWF0Y2gocGFyc2VUaW1lem9uZUNodW5rZXIpIHx8IFsnLScsIDAsIDBdLFxuICAgICAgICAgICAgbWludXRlcyA9ICsocGFydHNbMV0gKiA2MCkgKyB0b0ludChwYXJ0c1syXSk7XG5cbiAgICAgICAgcmV0dXJuIHBhcnRzWzBdID09PSAnKycgPyBtaW51dGVzIDogLW1pbnV0ZXM7XG4gICAgfVxuXG4gICAgLy8gZnVuY3Rpb24gdG8gY29udmVydCBzdHJpbmcgaW5wdXQgdG8gZGF0ZVxuICAgIGZ1bmN0aW9uIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBpbnB1dCwgY29uZmlnKSB7XG4gICAgICAgIHZhciBhLCBkYXRlUGFydEFycmF5ID0gY29uZmlnLl9hO1xuXG4gICAgICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgICAgLy8gUVVBUlRFUlxuICAgICAgICBjYXNlICdRJzpcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtNT05USF0gPSAodG9JbnQoaW5wdXQpIC0gMSkgKiAzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIE1PTlRIXG4gICAgICAgIGNhc2UgJ00nIDogLy8gZmFsbCB0aHJvdWdoIHRvIE1NXG4gICAgICAgIGNhc2UgJ01NJyA6XG4gICAgICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbTU9OVEhdID0gdG9JbnQoaW5wdXQpIC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdNTU0nIDogLy8gZmFsbCB0aHJvdWdoIHRvIE1NTU1cbiAgICAgICAgY2FzZSAnTU1NTScgOlxuICAgICAgICAgICAgYSA9IGNvbmZpZy5fbG9jYWxlLm1vbnRoc1BhcnNlKGlucHV0LCB0b2tlbiwgY29uZmlnLl9zdHJpY3QpO1xuICAgICAgICAgICAgLy8gaWYgd2UgZGlkbid0IGZpbmQgYSBtb250aCBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWQuXG4gICAgICAgICAgICBpZiAoYSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtNT05USF0gPSBhO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX3BmLmludmFsaWRNb250aCA9IGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIERBWSBPRiBNT05USFxuICAgICAgICBjYXNlICdEJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBERFxuICAgICAgICBjYXNlICdERCcgOlxuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRlUGFydEFycmF5W0RBVEVdID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0RvJyA6XG4gICAgICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbREFURV0gPSB0b0ludChwYXJzZUludChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5tYXRjaCgvXFxkezEsMn0vKVswXSwgMTApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBEQVkgT0YgWUVBUlxuICAgICAgICBjYXNlICdEREQnIDogLy8gZmFsbCB0aHJvdWdoIHRvIERERERcbiAgICAgICAgY2FzZSAnRERERCcgOlxuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX2RheU9mWWVhciA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFlFQVJcbiAgICAgICAgY2FzZSAnWVknIDpcbiAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbWUVBUl0gPSBtb21lbnQucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1lZWVknIDpcbiAgICAgICAgY2FzZSAnWVlZWVknIDpcbiAgICAgICAgY2FzZSAnWVlZWVlZJyA6XG4gICAgICAgICAgICBkYXRlUGFydEFycmF5W1lFQVJdID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIEFNIC8gUE1cbiAgICAgICAgY2FzZSAnYScgOiAvLyBmYWxsIHRocm91Z2ggdG8gQVxuICAgICAgICBjYXNlICdBJyA6XG4gICAgICAgICAgICBjb25maWcuX21lcmlkaWVtID0gaW5wdXQ7XG4gICAgICAgICAgICAvLyBjb25maWcuX2lzUG0gPSBjb25maWcuX2xvY2FsZS5pc1BNKGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBIT1VSXG4gICAgICAgIGNhc2UgJ2gnIDogLy8gZmFsbCB0aHJvdWdoIHRvIGhoXG4gICAgICAgIGNhc2UgJ2hoJyA6XG4gICAgICAgICAgICBjb25maWcuX3BmLmJpZ0hvdXIgPSB0cnVlO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdIJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBISFxuICAgICAgICBjYXNlICdISCcgOlxuICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtIT1VSXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBNSU5VVEVcbiAgICAgICAgY2FzZSAnbScgOiAvLyBmYWxsIHRocm91Z2ggdG8gbW1cbiAgICAgICAgY2FzZSAnbW0nIDpcbiAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbTUlOVVRFXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBTRUNPTkRcbiAgICAgICAgY2FzZSAncycgOiAvLyBmYWxsIHRocm91Z2ggdG8gc3NcbiAgICAgICAgY2FzZSAnc3MnIDpcbiAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbU0VDT05EXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBNSUxMSVNFQ09ORFxuICAgICAgICBjYXNlICdTJyA6XG4gICAgICAgIGNhc2UgJ1NTJyA6XG4gICAgICAgIGNhc2UgJ1NTUycgOlxuICAgICAgICBjYXNlICdTU1NTJyA6XG4gICAgICAgICAgICBkYXRlUGFydEFycmF5W01JTExJU0VDT05EXSA9IHRvSW50KCgnMC4nICsgaW5wdXQpICogMTAwMCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gVU5JWCBPRkZTRVQgKE1JTExJU0VDT05EUylcbiAgICAgICAgY2FzZSAneCc6XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSh0b0ludChpbnB1dCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFVOSVggVElNRVNUQU1QIFdJVEggTVNcbiAgICAgICAgY2FzZSAnWCc6XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShwYXJzZUZsb2F0KGlucHV0KSAqIDEwMDApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFRJTUVaT05FXG4gICAgICAgIGNhc2UgJ1onIDogLy8gZmFsbCB0aHJvdWdoIHRvIFpaXG4gICAgICAgIGNhc2UgJ1paJyA6XG4gICAgICAgICAgICBjb25maWcuX3VzZVVUQyA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX3R6bSA9IHV0Y09mZnNldEZyb21TdHJpbmcoaW5wdXQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFdFRUtEQVkgLSBodW1hblxuICAgICAgICBjYXNlICdkZCc6XG4gICAgICAgIGNhc2UgJ2RkZCc6XG4gICAgICAgIGNhc2UgJ2RkZGQnOlxuICAgICAgICAgICAgYSA9IGNvbmZpZy5fbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpO1xuICAgICAgICAgICAgLy8gaWYgd2UgZGlkbid0IGdldCBhIHdlZWtkYXkgbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkXG4gICAgICAgICAgICBpZiAoYSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl93ID0gY29uZmlnLl93IHx8IHt9O1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fd1snZCddID0gYTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9wZi5pbnZhbGlkV2Vla2RheSA9IGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFdFRUssIFdFRUsgREFZIC0gbnVtZXJpY1xuICAgICAgICBjYXNlICd3JzpcbiAgICAgICAgY2FzZSAnd3cnOlxuICAgICAgICBjYXNlICdXJzpcbiAgICAgICAgY2FzZSAnV1cnOlxuICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgY2FzZSAnZSc6XG4gICAgICAgIGNhc2UgJ0UnOlxuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbi5zdWJzdHIoMCwgMSk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ2dnZ2cnOlxuICAgICAgICBjYXNlICdHR0dHJzpcbiAgICAgICAgY2FzZSAnR0dHR0cnOlxuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbi5zdWJzdHIoMCwgMik7XG4gICAgICAgICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX3cgPSBjb25maWcuX3cgfHwge307XG4gICAgICAgICAgICAgICAgY29uZmlnLl93W3Rva2VuXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdnZyc6XG4gICAgICAgIGNhc2UgJ0dHJzpcbiAgICAgICAgICAgIGNvbmZpZy5fdyA9IGNvbmZpZy5fdyB8fCB7fTtcbiAgICAgICAgICAgIGNvbmZpZy5fd1t0b2tlbl0gPSBtb21lbnQucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF5T2ZZZWFyRnJvbVdlZWtJbmZvKGNvbmZpZykge1xuICAgICAgICB2YXIgdywgd2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRvdywgZG95LCB0ZW1wO1xuXG4gICAgICAgIHcgPSBjb25maWcuX3c7XG4gICAgICAgIGlmICh3LkdHICE9IG51bGwgfHwgdy5XICE9IG51bGwgfHwgdy5FICE9IG51bGwpIHtcbiAgICAgICAgICAgIGRvdyA9IDE7XG4gICAgICAgICAgICBkb3kgPSA0O1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBXZSBuZWVkIHRvIHRha2UgdGhlIGN1cnJlbnQgaXNvV2Vla1llYXIsIGJ1dCB0aGF0IGRlcGVuZHMgb25cbiAgICAgICAgICAgIC8vIGhvdyB3ZSBpbnRlcnByZXQgbm93IChsb2NhbCwgdXRjLCBmaXhlZCBvZmZzZXQpLiBTbyBjcmVhdGVcbiAgICAgICAgICAgIC8vIGEgbm93IHZlcnNpb24gb2YgY3VycmVudCBjb25maWcgKHRha2UgbG9jYWwvdXRjL29mZnNldCBmbGFncywgYW5kXG4gICAgICAgICAgICAvLyBjcmVhdGUgbm93KS5cbiAgICAgICAgICAgIHdlZWtZZWFyID0gZGZsKHcuR0csIGNvbmZpZy5fYVtZRUFSXSwgd2Vla09mWWVhcihtb21lbnQoKSwgMSwgNCkueWVhcik7XG4gICAgICAgICAgICB3ZWVrID0gZGZsKHcuVywgMSk7XG4gICAgICAgICAgICB3ZWVrZGF5ID0gZGZsKHcuRSwgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb3cgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3c7XG4gICAgICAgICAgICBkb3kgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3k7XG5cbiAgICAgICAgICAgIHdlZWtZZWFyID0gZGZsKHcuZ2csIGNvbmZpZy5fYVtZRUFSXSwgd2Vla09mWWVhcihtb21lbnQoKSwgZG93LCBkb3kpLnllYXIpO1xuICAgICAgICAgICAgd2VlayA9IGRmbCh3LncsIDEpO1xuXG4gICAgICAgICAgICBpZiAody5kICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyB3ZWVrZGF5IC0tIGxvdyBkYXkgbnVtYmVycyBhcmUgY29uc2lkZXJlZCBuZXh0IHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gdy5kO1xuICAgICAgICAgICAgICAgIGlmICh3ZWVrZGF5IDwgZG93KSB7XG4gICAgICAgICAgICAgICAgICAgICsrd2VlaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHcuZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gbG9jYWwgd2Vla2RheSAtLSBjb3VudGluZyBzdGFydHMgZnJvbSBiZWdpbmluZyBvZiB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IHcuZSArIGRvdztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCB0byBiZWdpbmluZyBvZiB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IGRvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wID0gZGF5T2ZZZWFyRnJvbVdlZWtzKHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3ksIGRvdyk7XG5cbiAgICAgICAgY29uZmlnLl9hW1lFQVJdID0gdGVtcC55ZWFyO1xuICAgICAgICBjb25maWcuX2RheU9mWWVhciA9IHRlbXAuZGF5T2ZZZWFyO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgYW4gYXJyYXkgdG8gYSBkYXRlLlxuICAgIC8vIHRoZSBhcnJheSBzaG91bGQgbWlycm9yIHRoZSBwYXJhbWV0ZXJzIGJlbG93XG4gICAgLy8gbm90ZTogYWxsIHZhbHVlcyBwYXN0IHRoZSB5ZWFyIGFyZSBvcHRpb25hbCBhbmQgd2lsbCBkZWZhdWx0IHRvIHRoZSBsb3dlc3QgcG9zc2libGUgdmFsdWUuXG4gICAgLy8gW3llYXIsIG1vbnRoLCBkYXkgLCBob3VyLCBtaW51dGUsIHNlY29uZCwgbWlsbGlzZWNvbmRdXG4gICAgZnVuY3Rpb24gZGF0ZUZyb21Db25maWcoY29uZmlnKSB7XG4gICAgICAgIHZhciBpLCBkYXRlLCBpbnB1dCA9IFtdLCBjdXJyZW50RGF0ZSwgeWVhclRvVXNlO1xuXG4gICAgICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnREYXRlID0gY3VycmVudERhdGVBcnJheShjb25maWcpO1xuXG4gICAgICAgIC8vY29tcHV0ZSBkYXkgb2YgdGhlIHllYXIgZnJvbSB3ZWVrcyBhbmQgd2Vla2RheXNcbiAgICAgICAgaWYgKGNvbmZpZy5fdyAmJiBjb25maWcuX2FbREFURV0gPT0gbnVsbCAmJiBjb25maWcuX2FbTU9OVEhdID09IG51bGwpIHtcbiAgICAgICAgICAgIGRheU9mWWVhckZyb21XZWVrSW5mbyhjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9pZiB0aGUgZGF5IG9mIHRoZSB5ZWFyIGlzIHNldCwgZmlndXJlIG91dCB3aGF0IGl0IGlzXG4gICAgICAgIGlmIChjb25maWcuX2RheU9mWWVhcikge1xuICAgICAgICAgICAgeWVhclRvVXNlID0gZGZsKGNvbmZpZy5fYVtZRUFSXSwgY3VycmVudERhdGVbWUVBUl0pO1xuXG4gICAgICAgICAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIgPiBkYXlzSW5ZZWFyKHllYXJUb1VzZSkpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX3BmLl9vdmVyZmxvd0RheU9mWWVhciA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGUgPSBtYWtlVVRDRGF0ZSh5ZWFyVG9Vc2UsIDAsIGNvbmZpZy5fZGF5T2ZZZWFyKTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtNT05USF0gPSBkYXRlLmdldFVUQ01vbnRoKCk7XG4gICAgICAgICAgICBjb25maWcuX2FbREFURV0gPSBkYXRlLmdldFVUQ0RhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERlZmF1bHQgdG8gY3VycmVudCBkYXRlLlxuICAgICAgICAvLyAqIGlmIG5vIHllYXIsIG1vbnRoLCBkYXkgb2YgbW9udGggYXJlIGdpdmVuLCBkZWZhdWx0IHRvIHRvZGF5XG4gICAgICAgIC8vICogaWYgZGF5IG9mIG1vbnRoIGlzIGdpdmVuLCBkZWZhdWx0IG1vbnRoIGFuZCB5ZWFyXG4gICAgICAgIC8vICogaWYgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgb25seSB5ZWFyXG4gICAgICAgIC8vICogaWYgeWVhciBpcyBnaXZlbiwgZG9uJ3QgZGVmYXVsdCBhbnl0aGluZ1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMyAmJiBjb25maWcuX2FbaV0gPT0gbnVsbDsgKytpKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbaV0gPSBpbnB1dFtpXSA9IGN1cnJlbnREYXRlW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gWmVybyBvdXQgd2hhdGV2ZXIgd2FzIG5vdCBkZWZhdWx0ZWQsIGluY2x1ZGluZyB0aW1lXG4gICAgICAgIGZvciAoOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbaV0gPSBpbnB1dFtpXSA9IChjb25maWcuX2FbaV0gPT0gbnVsbCkgPyAoaSA9PT0gMiA/IDEgOiAwKSA6IGNvbmZpZy5fYVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGZvciAyNDowMDowMC4wMDBcbiAgICAgICAgaWYgKGNvbmZpZy5fYVtIT1VSXSA9PT0gMjQgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbTUlOVVRFXSA9PT0gMCAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtTRUNPTkRdID09PSAwICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW01JTExJU0VDT05EXSA9PT0gMCkge1xuICAgICAgICAgICAgY29uZmlnLl9uZXh0RGF5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcuX2QgPSAoY29uZmlnLl91c2VVVEMgPyBtYWtlVVRDRGF0ZSA6IG1ha2VEYXRlKS5hcHBseShudWxsLCBpbnB1dCk7XG4gICAgICAgIC8vIEFwcGx5IHRpbWV6b25lIG9mZnNldCBmcm9tIGlucHV0LiBUaGUgYWN0dWFsIHV0Y09mZnNldCBjYW4gYmUgY2hhbmdlZFxuICAgICAgICAvLyB3aXRoIHBhcnNlWm9uZS5cbiAgICAgICAgaWYgKGNvbmZpZy5fdHptICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZC5zZXRVVENNaW51dGVzKGNvbmZpZy5fZC5nZXRVVENNaW51dGVzKCkgLSBjb25maWcuX3R6bSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLl9uZXh0RGF5KSB7XG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPSAyNDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRhdGVGcm9tT2JqZWN0KGNvbmZpZykge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0O1xuXG4gICAgICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vcm1hbGl6ZWRJbnB1dCA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGNvbmZpZy5faSk7XG4gICAgICAgIGNvbmZpZy5fYSA9IFtcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC55ZWFyLFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0Lm1vbnRoLFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0LmRheSB8fCBub3JtYWxpemVkSW5wdXQuZGF0ZSxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC5ob3VyLFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0Lm1pbnV0ZSxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC5zZWNvbmQsXG4gICAgICAgICAgICBub3JtYWxpemVkSW5wdXQubWlsbGlzZWNvbmRcbiAgICAgICAgXTtcblxuICAgICAgICBkYXRlRnJvbUNvbmZpZyhjb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBpZiAoY29uZmlnLl91c2VVVEMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgbm93LmdldFVUQ0Z1bGxZZWFyKCksXG4gICAgICAgICAgICAgICAgbm93LmdldFVUQ01vbnRoKCksXG4gICAgICAgICAgICAgICAgbm93LmdldFVUQ0RhdGUoKVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbbm93LmdldEZ1bGxZZWFyKCksIG5vdy5nZXRNb250aCgpLCBub3cuZ2V0RGF0ZSgpXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBzdHJpbmcgYW5kIGZvcm1hdCBzdHJpbmdcbiAgICBmdW5jdGlvbiBtYWtlRGF0ZUZyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcuX2YgPT09IG1vbWVudC5JU09fODYwMSkge1xuICAgICAgICAgICAgcGFyc2VJU08oY29uZmlnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZy5fYSA9IFtdO1xuICAgICAgICBjb25maWcuX3BmLmVtcHR5ID0gdHJ1ZTtcblxuICAgICAgICAvLyBUaGlzIGFycmF5IGlzIHVzZWQgdG8gbWFrZSBhIERhdGUsIGVpdGhlciB3aXRoIGBuZXcgRGF0ZWAgb3IgYERhdGUuVVRDYFxuICAgICAgICB2YXIgc3RyaW5nID0gJycgKyBjb25maWcuX2ksXG4gICAgICAgICAgICBpLCBwYXJzZWRJbnB1dCwgdG9rZW5zLCB0b2tlbiwgc2tpcHBlZCxcbiAgICAgICAgICAgIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGgsXG4gICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoID0gMDtcblxuICAgICAgICB0b2tlbnMgPSBleHBhbmRGb3JtYXQoY29uZmlnLl9mLCBjb25maWcuX2xvY2FsZSkubWF0Y2goZm9ybWF0dGluZ1Rva2VucykgfHwgW107XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICBwYXJzZWRJbnB1dCA9IChzdHJpbmcubWF0Y2goZ2V0UGFyc2VSZWdleEZvclRva2VuKHRva2VuLCBjb25maWcpKSB8fCBbXSlbMF07XG4gICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBza2lwcGVkID0gc3RyaW5nLnN1YnN0cigwLCBzdHJpbmcuaW5kZXhPZihwYXJzZWRJbnB1dCkpO1xuICAgICAgICAgICAgICAgIGlmIChza2lwcGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9wZi51bnVzZWRJbnB1dC5wdXNoKHNraXBwZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc2xpY2Uoc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpICsgcGFyc2VkSW5wdXQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoICs9IHBhcnNlZElucHV0Lmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRvbid0IHBhcnNlIGlmIGl0J3Mgbm90IGEga25vd24gdG9rZW5cbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9wZi5lbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9wZi51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBwYXJzZWRJbnB1dCwgY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbmZpZy5fc3RyaWN0ICYmICFwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHJlbWFpbmluZyB1bnBhcnNlZCBpbnB1dCBsZW5ndGggdG8gdGhlIHN0cmluZ1xuICAgICAgICBjb25maWcuX3BmLmNoYXJzTGVmdE92ZXIgPSBzdHJpbmdMZW5ndGggLSB0b3RhbFBhcnNlZElucHV0TGVuZ3RoO1xuICAgICAgICBpZiAoc3RyaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbmZpZy5fcGYudW51c2VkSW5wdXQucHVzaChzdHJpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2xlYXIgXzEyaCBmbGFnIGlmIGhvdXIgaXMgPD0gMTJcbiAgICAgICAgaWYgKGNvbmZpZy5fcGYuYmlnSG91ciA9PT0gdHJ1ZSAmJiBjb25maWcuX2FbSE9VUl0gPD0gMTIpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fcGYuYmlnSG91ciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBoYW5kbGUgbWVyaWRpZW1cbiAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gbWVyaWRpZW1GaXhXcmFwKGNvbmZpZy5fbG9jYWxlLCBjb25maWcuX2FbSE9VUl0sXG4gICAgICAgICAgICAgICAgY29uZmlnLl9tZXJpZGllbSk7XG4gICAgICAgIGRhdGVGcm9tQ29uZmlnKGNvbmZpZyk7XG4gICAgICAgIGNoZWNrT3ZlcmZsb3coY29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bmVzY2FwZUZvcm1hdChzKSB7XG4gICAgICAgIHJldHVybiBzLnJlcGxhY2UoL1xcXFwoXFxbKXxcXFxcKFxcXSl8XFxbKFteXFxdXFxbXSopXFxdfFxcXFwoLikvZywgZnVuY3Rpb24gKG1hdGNoZWQsIHAxLCBwMiwgcDMsIHA0KSB7XG4gICAgICAgICAgICByZXR1cm4gcDEgfHwgcDIgfHwgcDMgfHwgcDQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIENvZGUgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM1NjE0OTMvaXMtdGhlcmUtYS1yZWdleHAtZXNjYXBlLWZ1bmN0aW9uLWluLWphdmFzY3JpcHRcbiAgICBmdW5jdGlvbiByZWdleHBFc2NhcGUocykge1xuICAgICAgICByZXR1cm4gcy5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbiAgICB9XG5cbiAgICAvLyBkYXRlIGZyb20gc3RyaW5nIGFuZCBhcnJheSBvZiBmb3JtYXQgc3RyaW5nc1xuICAgIGZ1bmN0aW9uIG1ha2VEYXRlRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZykge1xuICAgICAgICB2YXIgdGVtcENvbmZpZyxcbiAgICAgICAgICAgIGJlc3RNb21lbnQsXG5cbiAgICAgICAgICAgIHNjb3JlVG9CZWF0LFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9mLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uZmlnLl9wZi5pbnZhbGlkRm9ybWF0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKE5hTik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29uZmlnLl9mLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgPSAwO1xuICAgICAgICAgICAgdGVtcENvbmZpZyA9IGNvcHlDb25maWcoe30sIGNvbmZpZyk7XG4gICAgICAgICAgICBpZiAoY29uZmlnLl91c2VVVEMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRlbXBDb25maWcuX3VzZVVUQyA9IGNvbmZpZy5fdXNlVVRDO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGVtcENvbmZpZy5fcGYgPSBkZWZhdWx0UGFyc2luZ0ZsYWdzKCk7XG4gICAgICAgICAgICB0ZW1wQ29uZmlnLl9mID0gY29uZmlnLl9mW2ldO1xuICAgICAgICAgICAgbWFrZURhdGVGcm9tU3RyaW5nQW5kRm9ybWF0KHRlbXBDb25maWcpO1xuXG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQodGVtcENvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYW55IGlucHV0IHRoYXQgd2FzIG5vdCBwYXJzZWQgYWRkIGEgcGVuYWx0eSBmb3IgdGhhdCBmb3JtYXRcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSArPSB0ZW1wQ29uZmlnLl9wZi5jaGFyc0xlZnRPdmVyO1xuXG4gICAgICAgICAgICAvL29yIHRva2Vuc1xuICAgICAgICAgICAgY3VycmVudFNjb3JlICs9IHRlbXBDb25maWcuX3BmLnVudXNlZFRva2Vucy5sZW5ndGggKiAxMDtcblxuICAgICAgICAgICAgdGVtcENvbmZpZy5fcGYuc2NvcmUgPSBjdXJyZW50U2NvcmU7XG5cbiAgICAgICAgICAgIGlmIChzY29yZVRvQmVhdCA9PSBudWxsIHx8IGN1cnJlbnRTY29yZSA8IHNjb3JlVG9CZWF0KSB7XG4gICAgICAgICAgICAgICAgc2NvcmVUb0JlYXQgPSBjdXJyZW50U2NvcmU7XG4gICAgICAgICAgICAgICAgYmVzdE1vbWVudCA9IHRlbXBDb25maWc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHRlbmQoY29uZmlnLCBiZXN0TW9tZW50IHx8IHRlbXBDb25maWcpO1xuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBpc28gZm9ybWF0XG4gICAgZnVuY3Rpb24gcGFyc2VJU08oY29uZmlnKSB7XG4gICAgICAgIHZhciBpLCBsLFxuICAgICAgICAgICAgc3RyaW5nID0gY29uZmlnLl9pLFxuICAgICAgICAgICAgbWF0Y2ggPSBpc29SZWdleC5leGVjKHN0cmluZyk7XG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICBjb25maWcuX3BmLmlzbyA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsID0gaXNvRGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzb0RhdGVzW2ldWzFdLmV4ZWMoc3RyaW5nKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaFs1XSBzaG91bGQgYmUgJ1QnIG9yIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICBjb25maWcuX2YgPSBpc29EYXRlc1tpXVswXSArIChtYXRjaFs2XSB8fCAnICcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsID0gaXNvVGltZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzb1RpbWVzW2ldWzFdLmV4ZWMoc3RyaW5nKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuX2YgKz0gaXNvVGltZXNbaV1bMF07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdHJpbmcubWF0Y2gocGFyc2VUb2tlblRpbWV6b25lKSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fZiArPSAnWic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYWtlRGF0ZUZyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXQgb3IgZmFsbGJhY2tcbiAgICBmdW5jdGlvbiBtYWtlRGF0ZUZyb21TdHJpbmcoY29uZmlnKSB7XG4gICAgICAgIHBhcnNlSVNPKGNvbmZpZyk7XG4gICAgICAgIGlmIChjb25maWcuX2lzVmFsaWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBkZWxldGUgY29uZmlnLl9pc1ZhbGlkO1xuICAgICAgICAgICAgbW9tZW50LmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXAoYXJyLCBmbikge1xuICAgICAgICB2YXIgcmVzID0gW10sIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKGZuKGFycltpXSwgaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZURhdGVGcm9tSW5wdXQoY29uZmlnKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faSwgbWF0Y2hlZDtcbiAgICAgICAgaWYgKGlucHV0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNEYXRlKGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoK2lucHV0KTtcbiAgICAgICAgfSBlbHNlIGlmICgobWF0Y2hlZCA9IGFzcE5ldEpzb25SZWdleC5leGVjKGlucHV0KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCttYXRjaGVkWzFdKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBtYWtlRGF0ZUZyb21TdHJpbmcoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9hID0gbWFwKGlucHV0LnNsaWNlKDApLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG9iaiwgMTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkYXRlRnJvbUNvbmZpZyhjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZihpbnB1dCkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBkYXRlRnJvbU9iamVjdChjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZihpbnB1dCkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAvLyBmcm9tIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoaW5wdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbW9tZW50LmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRGF0ZSh5LCBtLCBkLCBoLCBNLCBzLCBtcykge1xuICAgICAgICAvL2Nhbid0IGp1c3QgYXBwbHkoKSB0byBjcmVhdGUgYSBkYXRlOlxuICAgICAgICAvL2h0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTgxMzQ4L2luc3RhbnRpYXRpbmctYS1qYXZhc2NyaXB0LW9iamVjdC1ieS1jYWxsaW5nLXByb3RvdHlwZS1jb25zdHJ1Y3Rvci1hcHBseVxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHksIG0sIGQsIGgsIE0sIHMsIG1zKTtcblxuICAgICAgICAvL3RoZSBkYXRlIGNvbnN0cnVjdG9yIGRvZXNuJ3QgYWNjZXB0IHllYXJzIDwgMTk3MFxuICAgICAgICBpZiAoeSA8IDE5NzApIHtcbiAgICAgICAgICAgIGRhdGUuc2V0RnVsbFllYXIoeSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZVVUQ0RhdGUoeSkge1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDLmFwcGx5KG51bGwsIGFyZ3VtZW50cykpO1xuICAgICAgICBpZiAoeSA8IDE5NzApIHtcbiAgICAgICAgICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoeSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VXZWVrZGF5KGlucHV0LCBsb2NhbGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmICghaXNOYU4oaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBwYXJzZUludChpbnB1dCwgMTApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBsb2NhbGUud2Vla2RheXNQYXJzZShpbnB1dCk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIFJlbGF0aXZlIFRpbWVcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIC8vIGhlbHBlciBmdW5jdGlvbiBmb3IgbW9tZW50LmZuLmZyb20sIG1vbWVudC5mbi5mcm9tTm93LCBhbmQgbW9tZW50LmR1cmF0aW9uLmZuLmh1bWFuaXplXG4gICAgZnVuY3Rpb24gc3Vic3RpdHV0ZVRpbWVBZ28oc3RyaW5nLCBudW1iZXIsIHdpdGhvdXRTdWZmaXgsIGlzRnV0dXJlLCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5yZWxhdGl2ZVRpbWUobnVtYmVyIHx8IDEsICEhd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVsYXRpdmVUaW1lKHBvc05lZ0R1cmF0aW9uLCB3aXRob3V0U3VmZml4LCBsb2NhbGUpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gbW9tZW50LmR1cmF0aW9uKHBvc05lZ0R1cmF0aW9uKS5hYnMoKSxcbiAgICAgICAgICAgIHNlY29uZHMgPSByb3VuZChkdXJhdGlvbi5hcygncycpKSxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSByb3VuZChkdXJhdGlvbi5hcygnbScpKSxcbiAgICAgICAgICAgIGhvdXJzID0gcm91bmQoZHVyYXRpb24uYXMoJ2gnKSksXG4gICAgICAgICAgICBkYXlzID0gcm91bmQoZHVyYXRpb24uYXMoJ2QnKSksXG4gICAgICAgICAgICBtb250aHMgPSByb3VuZChkdXJhdGlvbi5hcygnTScpKSxcbiAgICAgICAgICAgIHllYXJzID0gcm91bmQoZHVyYXRpb24uYXMoJ3knKSksXG5cbiAgICAgICAgICAgIGFyZ3MgPSBzZWNvbmRzIDwgcmVsYXRpdmVUaW1lVGhyZXNob2xkcy5zICYmIFsncycsIHNlY29uZHNdIHx8XG4gICAgICAgICAgICAgICAgbWludXRlcyA9PT0gMSAmJiBbJ20nXSB8fFxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPCByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzLm0gJiYgWydtbScsIG1pbnV0ZXNdIHx8XG4gICAgICAgICAgICAgICAgaG91cnMgPT09IDEgJiYgWydoJ10gfHxcbiAgICAgICAgICAgICAgICBob3VycyA8IHJlbGF0aXZlVGltZVRocmVzaG9sZHMuaCAmJiBbJ2hoJywgaG91cnNdIHx8XG4gICAgICAgICAgICAgICAgZGF5cyA9PT0gMSAmJiBbJ2QnXSB8fFxuICAgICAgICAgICAgICAgIGRheXMgPCByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzLmQgJiYgWydkZCcsIGRheXNdIHx8XG4gICAgICAgICAgICAgICAgbW9udGhzID09PSAxICYmIFsnTSddIHx8XG4gICAgICAgICAgICAgICAgbW9udGhzIDwgcmVsYXRpdmVUaW1lVGhyZXNob2xkcy5NICYmIFsnTU0nLCBtb250aHNdIHx8XG4gICAgICAgICAgICAgICAgeWVhcnMgPT09IDEgJiYgWyd5J10gfHwgWyd5eScsIHllYXJzXTtcblxuICAgICAgICBhcmdzWzJdID0gd2l0aG91dFN1ZmZpeDtcbiAgICAgICAgYXJnc1szXSA9ICtwb3NOZWdEdXJhdGlvbiA+IDA7XG4gICAgICAgIGFyZ3NbNF0gPSBsb2NhbGU7XG4gICAgICAgIHJldHVybiBzdWJzdGl0dXRlVGltZUFnby5hcHBseSh7fSwgYXJncyk7XG4gICAgfVxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIFdlZWsgb2YgWWVhclxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgLy8gZmlyc3REYXlPZldlZWsgICAgICAgMCA9IHN1biwgNiA9IHNhdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIHRoZSBkYXkgb2YgdGhlIHdlZWsgdGhhdCBzdGFydHMgdGhlIHdlZWtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAodXN1YWxseSBzdW5kYXkgb3IgbW9uZGF5KVxuICAgIC8vIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyIDAgPSBzdW4sIDYgPSBzYXRcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICB0aGUgZmlyc3Qgd2VlayBpcyB0aGUgd2VlayB0aGF0IGNvbnRhaW5zIHRoZSBmaXJzdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIG9mIHRoaXMgZGF5IG9mIHRoZSB3ZWVrXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgKGVnLiBJU08gd2Vla3MgdXNlIHRodXJzZGF5ICg0KSlcbiAgICBmdW5jdGlvbiB3ZWVrT2ZZZWFyKG1vbSwgZmlyc3REYXlPZldlZWssIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyKSB7XG4gICAgICAgIHZhciBlbmQgPSBmaXJzdERheU9mV2Vla09mWWVhciAtIGZpcnN0RGF5T2ZXZWVrLFxuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrID0gZmlyc3REYXlPZldlZWtPZlllYXIgLSBtb20uZGF5KCksXG4gICAgICAgICAgICBhZGp1c3RlZE1vbWVudDtcblxuXG4gICAgICAgIGlmIChkYXlzVG9EYXlPZldlZWsgPiBlbmQpIHtcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayAtPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRheXNUb0RheU9mV2VlayA8IGVuZCAtIDcpIHtcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayArPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgYWRqdXN0ZWRNb21lbnQgPSBtb21lbnQobW9tKS5hZGQoZGF5c1RvRGF5T2ZXZWVrLCAnZCcpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2VlazogTWF0aC5jZWlsKGFkanVzdGVkTW9tZW50LmRheU9mWWVhcigpIC8gNyksXG4gICAgICAgICAgICB5ZWFyOiBhZGp1c3RlZE1vbWVudC55ZWFyKClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvL2h0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPX3dlZWtfZGF0ZSNDYWxjdWxhdGluZ19hX2RhdGVfZ2l2ZW5fdGhlX3llYXIuMkNfd2Vla19udW1iZXJfYW5kX3dlZWtkYXlcbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla3MoeWVhciwgd2Vlaywgd2Vla2RheSwgZmlyc3REYXlPZldlZWtPZlllYXIsIGZpcnN0RGF5T2ZXZWVrKSB7XG4gICAgICAgIHZhciBkID0gbWFrZVVUQ0RhdGUoeWVhciwgMCwgMSkuZ2V0VVRDRGF5KCksIGRheXNUb0FkZCwgZGF5T2ZZZWFyO1xuXG4gICAgICAgIGQgPSBkID09PSAwID8gNyA6IGQ7XG4gICAgICAgIHdlZWtkYXkgPSB3ZWVrZGF5ICE9IG51bGwgPyB3ZWVrZGF5IDogZmlyc3REYXlPZldlZWs7XG4gICAgICAgIGRheXNUb0FkZCA9IGZpcnN0RGF5T2ZXZWVrIC0gZCArIChkID4gZmlyc3REYXlPZldlZWtPZlllYXIgPyA3IDogMCkgLSAoZCA8IGZpcnN0RGF5T2ZXZWVrID8gNyA6IDApO1xuICAgICAgICBkYXlPZlllYXIgPSA3ICogKHdlZWsgLSAxKSArICh3ZWVrZGF5IC0gZmlyc3REYXlPZldlZWspICsgZGF5c1RvQWRkICsgMTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeWVhcjogZGF5T2ZZZWFyID4gMCA/IHllYXIgOiB5ZWFyIC0gMSxcbiAgICAgICAgICAgIGRheU9mWWVhcjogZGF5T2ZZZWFyID4gMCA/ICBkYXlPZlllYXIgOiBkYXlzSW5ZZWFyKHllYXIgLSAxKSArIGRheU9mWWVhclxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgVG9wIExldmVsIEZ1bmN0aW9uc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGZ1bmN0aW9uIG1ha2VNb21lbnQoY29uZmlnKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIGZvcm1hdCA9IGNvbmZpZy5fZixcbiAgICAgICAgICAgIHJlcztcblxuICAgICAgICBjb25maWcuX2xvY2FsZSA9IGNvbmZpZy5fbG9jYWxlIHx8IG1vbWVudC5sb2NhbGVEYXRhKGNvbmZpZy5fbCk7XG5cbiAgICAgICAgaWYgKGlucHV0ID09PSBudWxsIHx8IChmb3JtYXQgPT09IHVuZGVmaW5lZCAmJiBpbnB1dCA9PT0gJycpKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50LmludmFsaWQoe251bGxJbnB1dDogdHJ1ZX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbmZpZy5faSA9IGlucHV0ID0gY29uZmlnLl9sb2NhbGUucHJlcGFyc2UoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vbWVudC5pc01vbWVudChpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9tZW50KGlucHV0LCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQpIHtcbiAgICAgICAgICAgIGlmIChpc0FycmF5KGZvcm1hdCkpIHtcbiAgICAgICAgICAgICAgICBtYWtlRGF0ZUZyb21TdHJpbmdBbmRBcnJheShjb25maWcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtYWtlRGF0ZUZyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1ha2VEYXRlRnJvbUlucHV0KGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXMgPSBuZXcgTW9tZW50KGNvbmZpZyk7XG4gICAgICAgIGlmIChyZXMuX25leHREYXkpIHtcbiAgICAgICAgICAgIC8vIEFkZGluZyBpcyBzbWFydCBlbm91Z2ggYXJvdW5kIERTVFxuICAgICAgICAgICAgcmVzLmFkZCgxLCAnZCcpO1xuICAgICAgICAgICAgcmVzLl9uZXh0RGF5ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBtb21lbnQgPSBmdW5jdGlvbiAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGM7XG5cbiAgICAgICAgaWYgKHR5cGVvZihsb2NhbGUpID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHN0cmljdCA9IGxvY2FsZTtcbiAgICAgICAgICAgIGxvY2FsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBvYmplY3QgY29uc3RydWN0aW9uIG11c3QgYmUgZG9uZSB0aGlzIHdheS5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE0MjNcbiAgICAgICAgYyA9IHt9O1xuICAgICAgICBjLl9pc0FNb21lbnRPYmplY3QgPSB0cnVlO1xuICAgICAgICBjLl9pID0gaW5wdXQ7XG4gICAgICAgIGMuX2YgPSBmb3JtYXQ7XG4gICAgICAgIGMuX2wgPSBsb2NhbGU7XG4gICAgICAgIGMuX3N0cmljdCA9IHN0cmljdDtcbiAgICAgICAgYy5faXNVVEMgPSBmYWxzZTtcbiAgICAgICAgYy5fcGYgPSBkZWZhdWx0UGFyc2luZ0ZsYWdzKCk7XG5cbiAgICAgICAgcmV0dXJuIG1ha2VNb21lbnQoYyk7XG4gICAgfTtcblxuICAgIG1vbWVudC5zdXBwcmVzc0RlcHJlY2F0aW9uV2FybmluZ3MgPSBmYWxzZTtcblxuICAgIG1vbWVudC5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ21vbWVudCBjb25zdHJ1Y3Rpb24gZmFsbHMgYmFjayB0byBqcyBEYXRlLiBUaGlzIGlzICcgK1xuICAgICAgICAnZGlzY291cmFnZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB1cGNvbWluZyBtYWpvciAnICtcbiAgICAgICAgJ3JlbGVhc2UuIFBsZWFzZSByZWZlciB0byAnICtcbiAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNDA3IGZvciBtb3JlIGluZm8uJyxcbiAgICAgICAgZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoY29uZmlnLl9pICsgKGNvbmZpZy5fdXNlVVRDID8gJyBVVEMnIDogJycpKTtcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICAvLyBQaWNrIGEgbW9tZW50IG0gZnJvbSBtb21lbnRzIHNvIHRoYXQgbVtmbl0ob3RoZXIpIGlzIHRydWUgZm9yIGFsbFxuICAgIC8vIG90aGVyLiBUaGlzIHJlbGllcyBvbiB0aGUgZnVuY3Rpb24gZm4gdG8gYmUgdHJhbnNpdGl2ZS5cbiAgICAvL1xuICAgIC8vIG1vbWVudHMgc2hvdWxkIGVpdGhlciBiZSBhbiBhcnJheSBvZiBtb21lbnQgb2JqZWN0cyBvciBhbiBhcnJheSwgd2hvc2VcbiAgICAvLyBmaXJzdCBlbGVtZW50IGlzIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzLlxuICAgIGZ1bmN0aW9uIHBpY2tCeShmbiwgbW9tZW50cykge1xuICAgICAgICB2YXIgcmVzLCBpO1xuICAgICAgICBpZiAobW9tZW50cy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShtb21lbnRzWzBdKSkge1xuICAgICAgICAgICAgbW9tZW50cyA9IG1vbWVudHNbMF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtb21lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlcyA9IG1vbWVudHNbMF07XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBtb21lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAobW9tZW50c1tpXVtmbl0ocmVzKSkge1xuICAgICAgICAgICAgICAgIHJlcyA9IG1vbWVudHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBtb21lbnQubWluID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0JlZm9yZScsIGFyZ3MpO1xuICAgIH07XG5cbiAgICBtb21lbnQubWF4ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0FmdGVyJywgYXJncyk7XG4gICAgfTtcblxuICAgIC8vIGNyZWF0aW5nIHdpdGggdXRjXG4gICAgbW9tZW50LnV0YyA9IGZ1bmN0aW9uIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgICAgICB2YXIgYztcblxuICAgICAgICBpZiAodHlwZW9mKGxvY2FsZSkgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgc3RyaWN0ID0gbG9jYWxlO1xuICAgICAgICAgICAgbG9jYWxlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9iamVjdCBjb25zdHJ1Y3Rpb24gbXVzdCBiZSBkb25lIHRoaXMgd2F5LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTQyM1xuICAgICAgICBjID0ge307XG4gICAgICAgIGMuX2lzQU1vbWVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGMuX3VzZVVUQyA9IHRydWU7XG4gICAgICAgIGMuX2lzVVRDID0gdHJ1ZTtcbiAgICAgICAgYy5fbCA9IGxvY2FsZTtcbiAgICAgICAgYy5faSA9IGlucHV0O1xuICAgICAgICBjLl9mID0gZm9ybWF0O1xuICAgICAgICBjLl9zdHJpY3QgPSBzdHJpY3Q7XG4gICAgICAgIGMuX3BmID0gZGVmYXVsdFBhcnNpbmdGbGFncygpO1xuXG4gICAgICAgIHJldHVybiBtYWtlTW9tZW50KGMpLnV0YygpO1xuICAgIH07XG5cbiAgICAvLyBjcmVhdGluZyB3aXRoIHVuaXggdGltZXN0YW1wIChpbiBzZWNvbmRzKVxuICAgIG1vbWVudC51bml4ID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBtb21lbnQoaW5wdXQgKiAxMDAwKTtcbiAgICB9O1xuXG4gICAgLy8gZHVyYXRpb25cbiAgICBtb21lbnQuZHVyYXRpb24gPSBmdW5jdGlvbiAoaW5wdXQsIGtleSkge1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBpbnB1dCxcbiAgICAgICAgICAgIC8vIG1hdGNoaW5nIGFnYWluc3QgcmVnZXhwIGlzIGV4cGVuc2l2ZSwgZG8gaXQgb24gZGVtYW5kXG4gICAgICAgICAgICBtYXRjaCA9IG51bGwsXG4gICAgICAgICAgICBzaWduLFxuICAgICAgICAgICAgcmV0LFxuICAgICAgICAgICAgcGFyc2VJc28sXG4gICAgICAgICAgICBkaWZmUmVzO1xuXG4gICAgICAgIGlmIChtb21lbnQuaXNEdXJhdGlvbihpbnB1dCkpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIG1zOiBpbnB1dC5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgICAgIGQ6IGlucHV0Ll9kYXlzLFxuICAgICAgICAgICAgICAgIE06IGlucHV0Ll9tb250aHNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbltrZXldID0gaW5wdXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uLm1pbGxpc2Vjb25kcyA9IGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCEhKG1hdGNoID0gYXNwTmV0VGltZVNwYW5Kc29uUmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gKG1hdGNoWzFdID09PSAnLScpID8gLTEgOiAxO1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgeTogMCxcbiAgICAgICAgICAgICAgICBkOiB0b0ludChtYXRjaFtEQVRFXSkgKiBzaWduLFxuICAgICAgICAgICAgICAgIGg6IHRvSW50KG1hdGNoW0hPVVJdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgbTogdG9JbnQobWF0Y2hbTUlOVVRFXSkgKiBzaWduLFxuICAgICAgICAgICAgICAgIHM6IHRvSW50KG1hdGNoW1NFQ09ORF0pICogc2lnbixcbiAgICAgICAgICAgICAgICBtczogdG9JbnQobWF0Y2hbTUlMTElTRUNPTkRdKSAqIHNpZ25cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoISEobWF0Y2ggPSBpc29EdXJhdGlvblJlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICAgICAgc2lnbiA9IChtYXRjaFsxXSA9PT0gJy0nKSA/IC0xIDogMTtcbiAgICAgICAgICAgIHBhcnNlSXNvID0gZnVuY3Rpb24gKGlucCkge1xuICAgICAgICAgICAgICAgIC8vIFdlJ2Qgbm9ybWFsbHkgdXNlIH5+aW5wIGZvciB0aGlzLCBidXQgdW5mb3J0dW5hdGVseSBpdCBhbHNvXG4gICAgICAgICAgICAgICAgLy8gY29udmVydHMgZmxvYXRzIHRvIGludHMuXG4gICAgICAgICAgICAgICAgLy8gaW5wIG1heSBiZSB1bmRlZmluZWQsIHNvIGNhcmVmdWwgY2FsbGluZyByZXBsYWNlIG9uIGl0LlxuICAgICAgICAgICAgICAgIHZhciByZXMgPSBpbnAgJiYgcGFyc2VGbG9hdChpbnAucmVwbGFjZSgnLCcsICcuJykpO1xuICAgICAgICAgICAgICAgIC8vIGFwcGx5IHNpZ24gd2hpbGUgd2UncmUgYXQgaXRcbiAgICAgICAgICAgICAgICByZXR1cm4gKGlzTmFOKHJlcykgPyAwIDogcmVzKSAqIHNpZ247XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgeTogcGFyc2VJc28obWF0Y2hbMl0pLFxuICAgICAgICAgICAgICAgIE06IHBhcnNlSXNvKG1hdGNoWzNdKSxcbiAgICAgICAgICAgICAgICBkOiBwYXJzZUlzbyhtYXRjaFs0XSksXG4gICAgICAgICAgICAgICAgaDogcGFyc2VJc28obWF0Y2hbNV0pLFxuICAgICAgICAgICAgICAgIG06IHBhcnNlSXNvKG1hdGNoWzZdKSxcbiAgICAgICAgICAgICAgICBzOiBwYXJzZUlzbyhtYXRjaFs3XSksXG4gICAgICAgICAgICAgICAgdzogcGFyc2VJc28obWF0Y2hbOF0pXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKGR1cmF0aW9uID09IG51bGwpIHsvLyBjaGVja3MgZm9yIG51bGwgb3IgdW5kZWZpbmVkXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkdXJhdGlvbiA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgICAgICAoJ2Zyb20nIGluIGR1cmF0aW9uIHx8ICd0bycgaW4gZHVyYXRpb24pKSB7XG4gICAgICAgICAgICBkaWZmUmVzID0gbW9tZW50c0RpZmZlcmVuY2UobW9tZW50KGR1cmF0aW9uLmZyb20pLCBtb21lbnQoZHVyYXRpb24udG8pKTtcblxuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgICAgIGR1cmF0aW9uLm1zID0gZGlmZlJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICBkdXJhdGlvbi5NID0gZGlmZlJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXQgPSBuZXcgRHVyYXRpb24oZHVyYXRpb24pO1xuXG4gICAgICAgIGlmIChtb21lbnQuaXNEdXJhdGlvbihpbnB1dCkgJiYgaGFzT3duUHJvcChpbnB1dCwgJ19sb2NhbGUnKSkge1xuICAgICAgICAgICAgcmV0Ll9sb2NhbGUgPSBpbnB1dC5fbG9jYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuXG4gICAgLy8gdmVyc2lvbiBudW1iZXJcbiAgICBtb21lbnQudmVyc2lvbiA9IFZFUlNJT047XG5cbiAgICAvLyBkZWZhdWx0IGZvcm1hdFxuICAgIG1vbWVudC5kZWZhdWx0Rm9ybWF0ID0gaXNvRm9ybWF0O1xuXG4gICAgLy8gY29uc3RhbnQgdGhhdCByZWZlcnMgdG8gdGhlIElTTyBzdGFuZGFyZFxuICAgIG1vbWVudC5JU09fODYwMSA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gUGx1Z2lucyB0aGF0IGFkZCBwcm9wZXJ0aWVzIHNob3VsZCBhbHNvIGFkZCB0aGUga2V5IGhlcmUgKG51bGwgdmFsdWUpLFxuICAgIC8vIHNvIHdlIGNhbiBwcm9wZXJseSBjbG9uZSBvdXJzZWx2ZXMuXG4gICAgbW9tZW50Lm1vbWVudFByb3BlcnRpZXMgPSBtb21lbnRQcm9wZXJ0aWVzO1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuZXZlciBhIG1vbWVudCBpcyBtdXRhdGVkLlxuICAgIC8vIEl0IGlzIGludGVuZGVkIHRvIGtlZXAgdGhlIG9mZnNldCBpbiBzeW5jIHdpdGggdGhlIHRpbWV6b25lLlxuICAgIG1vbWVudC51cGRhdGVPZmZzZXQgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gYWxsb3dzIHlvdSB0byBzZXQgYSB0aHJlc2hvbGQgZm9yIHJlbGF0aXZlIHRpbWUgc3RyaW5nc1xuICAgIG1vbWVudC5yZWxhdGl2ZVRpbWVUaHJlc2hvbGQgPSBmdW5jdGlvbiAodGhyZXNob2xkLCBsaW1pdCkge1xuICAgICAgICBpZiAocmVsYXRpdmVUaW1lVGhyZXNob2xkc1t0aHJlc2hvbGRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGltaXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0aXZlVGltZVRocmVzaG9sZHNbdGhyZXNob2xkXTtcbiAgICAgICAgfVxuICAgICAgICByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzW3RocmVzaG9sZF0gPSBsaW1pdDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIG1vbWVudC5sYW5nID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50LmxhbmcgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbWVudC5sb2NhbGUgaW5zdGVhZC4nLFxuICAgICAgICBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudC5sb2NhbGUoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGxvYWQgbG9jYWxlIGFuZCB0aGVuIHNldCB0aGUgZ2xvYmFsIGxvY2FsZS4gIElmXG4gICAgLy8gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4sIGl0IHdpbGwgc2ltcGx5IHJldHVybiB0aGUgY3VycmVudCBnbG9iYWxcbiAgICAvLyBsb2NhbGUga2V5LlxuICAgIG1vbWVudC5sb2NhbGUgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgdmFyIGRhdGE7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YodmFsdWVzKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gbW9tZW50LmRlZmluZUxvY2FsZShrZXksIHZhbHVlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gbW9tZW50LmxvY2FsZURhdGEoa2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBtb21lbnQuZHVyYXRpb24uX2xvY2FsZSA9IG1vbWVudC5fbG9jYWxlID0gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtb21lbnQuX2xvY2FsZS5fYWJicjtcbiAgICB9O1xuXG4gICAgbW9tZW50LmRlZmluZUxvY2FsZSA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZXMpIHtcbiAgICAgICAgaWYgKHZhbHVlcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWVzLmFiYnIgPSBuYW1lO1xuICAgICAgICAgICAgaWYgKCFsb2NhbGVzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxlc1tuYW1lXSA9IG5ldyBMb2NhbGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0uc2V0KHZhbHVlcyk7XG5cbiAgICAgICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXQgZm9yIG5vdzogYWxzbyBzZXQgdGhlIGxvY2FsZVxuICAgICAgICAgICAgbW9tZW50LmxvY2FsZShuYW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB1c2VmdWwgZm9yIHRlc3RpbmdcbiAgICAgICAgICAgIGRlbGV0ZSBsb2NhbGVzW25hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbW9tZW50LmxhbmdEYXRhID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50LmxhbmdEYXRhIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb21lbnQubG9jYWxlRGF0YSBpbnN0ZWFkLicsXG4gICAgICAgIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQubG9jYWxlRGF0YShrZXkpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIC8vIHJldHVybnMgbG9jYWxlIGRhdGFcbiAgICBtb21lbnQubG9jYWxlRGF0YSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIGxvY2FsZTtcblxuICAgICAgICBpZiAoa2V5ICYmIGtleS5fbG9jYWxlICYmIGtleS5fbG9jYWxlLl9hYmJyKSB7XG4gICAgICAgICAgICBrZXkgPSBrZXkuX2xvY2FsZS5fYWJicjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50Ll9sb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgICAgLy9zaG9ydC1jaXJjdWl0IGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICAgICAgbG9jYWxlID0gbG9hZExvY2FsZShrZXkpO1xuICAgICAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXkgPSBba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaG9vc2VMb2NhbGUoa2V5KTtcbiAgICB9O1xuXG4gICAgLy8gY29tcGFyZSBtb21lbnQgb2JqZWN0XG4gICAgbW9tZW50LmlzTW9tZW50ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgTW9tZW50IHx8XG4gICAgICAgICAgICAob2JqICE9IG51bGwgJiYgaGFzT3duUHJvcChvYmosICdfaXNBTW9tZW50T2JqZWN0JykpO1xuICAgIH07XG5cbiAgICAvLyBmb3IgdHlwZWNoZWNraW5nIER1cmF0aW9uIG9iamVjdHNcbiAgICBtb21lbnQuaXNEdXJhdGlvbiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIER1cmF0aW9uO1xuICAgIH07XG5cbiAgICBmb3IgKGkgPSBsaXN0cy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICBtYWtlTGlzdChsaXN0c1tpXSk7XG4gICAgfVxuXG4gICAgbW9tZW50Lm5vcm1hbGl6ZVVuaXRzID0gZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgIHJldHVybiBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgfTtcblxuICAgIG1vbWVudC5pbnZhbGlkID0gZnVuY3Rpb24gKGZsYWdzKSB7XG4gICAgICAgIHZhciBtID0gbW9tZW50LnV0YyhOYU4pO1xuICAgICAgICBpZiAoZmxhZ3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZXh0ZW5kKG0uX3BmLCBmbGFncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtLl9wZi51c2VySW52YWxpZGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfTtcblxuICAgIG1vbWVudC5wYXJzZVpvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBtb21lbnQuYXBwbHkobnVsbCwgYXJndW1lbnRzKS5wYXJzZVpvbmUoKTtcbiAgICB9O1xuXG4gICAgbW9tZW50LnBhcnNlVHdvRGlnaXRZZWFyID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0b0ludChpbnB1dCkgKyAodG9JbnQoaW5wdXQpID4gNjggPyAxOTAwIDogMjAwMCk7XG4gICAgfTtcblxuICAgIG1vbWVudC5pc0RhdGUgPSBpc0RhdGU7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIE1vbWVudCBQcm90b3R5cGVcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIGV4dGVuZChtb21lbnQuZm4gPSBNb21lbnQucHJvdG90eXBlLCB7XG5cbiAgICAgICAgY2xvbmUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50KHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHZhbHVlT2YgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gK3RoaXMuX2QgLSAoKHRoaXMuX29mZnNldCB8fCAwKSAqIDYwMDAwKTtcbiAgICAgICAgfSxcblxuICAgICAgICB1bml4IDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoK3RoaXMgLyAxMDAwKTtcbiAgICAgICAgfSxcblxuICAgICAgICB0b1N0cmluZyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubG9jYWxlKCdlbicpLmZvcm1hdCgnZGRkIE1NTSBERCBZWVlZIEhIOm1tOnNzIFtHTVRdWlonKTtcbiAgICAgICAgfSxcblxuICAgICAgICB0b0RhdGUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0ID8gbmV3IERhdGUoK3RoaXMpIDogdGhpcy5fZDtcbiAgICAgICAgfSxcblxuICAgICAgICB0b0lTT1N0cmluZyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtID0gbW9tZW50KHRoaXMpLnV0YygpO1xuICAgICAgICAgICAgaWYgKDAgPCBtLnllYXIoKSAmJiBtLnllYXIoKSA8PSA5OTk5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZykge1xuICAgICAgICAgICAgICAgICAgICAvLyBuYXRpdmUgaW1wbGVtZW50YXRpb24gaXMgfjUweCBmYXN0ZXIsIHVzZSBpdCB3aGVuIHdlIGNhblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b0RhdGUoKS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgJ1lZWVktTU0tRERbVF1ISDptbTpzcy5TU1NbWl0nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgJ1lZWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHRvQXJyYXkgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbSA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIG0ueWVhcigpLFxuICAgICAgICAgICAgICAgIG0ubW9udGgoKSxcbiAgICAgICAgICAgICAgICBtLmRhdGUoKSxcbiAgICAgICAgICAgICAgICBtLmhvdXJzKCksXG4gICAgICAgICAgICAgICAgbS5taW51dGVzKCksXG4gICAgICAgICAgICAgICAgbS5zZWNvbmRzKCksXG4gICAgICAgICAgICAgICAgbS5taWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1ZhbGlkIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNEU1RTaGlmdGVkIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2EpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgJiYgY29tcGFyZUFycmF5cyh0aGlzLl9hLCAodGhpcy5faXNVVEMgPyBtb21lbnQudXRjKHRoaXMuX2EpIDogbW9tZW50KHRoaXMuX2EpKS50b0FycmF5KCkpID4gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNpbmdGbGFncyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBleHRlbmQoe30sIHRoaXMuX3BmKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbnZhbGlkQXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wZi5vdmVyZmxvdztcbiAgICAgICAgfSxcblxuICAgICAgICB1dGMgOiBmdW5jdGlvbiAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXRjT2Zmc2V0KDAsIGtlZXBMb2NhbFRpbWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGxvY2FsIDogZnVuY3Rpb24gKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc1VUQykge1xuICAgICAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KDAsIGtlZXBMb2NhbFRpbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzVVRDID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZiAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YnRyYWN0KHRoaXMuX2RhdGVVdGNPZmZzZXQoKSwgJ20nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmb3JtYXQgOiBmdW5jdGlvbiAoaW5wdXRTdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBmb3JtYXRNb21lbnQodGhpcywgaW5wdXRTdHJpbmcgfHwgbW9tZW50LmRlZmF1bHRGb3JtYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLnBvc3Rmb3JtYXQob3V0cHV0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGQgOiBjcmVhdGVBZGRlcigxLCAnYWRkJyksXG5cbiAgICAgICAgc3VidHJhY3QgOiBjcmVhdGVBZGRlcigtMSwgJ3N1YnRyYWN0JyksXG5cbiAgICAgICAgZGlmZiA6IGZ1bmN0aW9uIChpbnB1dCwgdW5pdHMsIGFzRmxvYXQpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gbWFrZUFzKGlucHV0LCB0aGlzKSxcbiAgICAgICAgICAgICAgICB6b25lRGlmZiA9ICh0aGF0LnV0Y09mZnNldCgpIC0gdGhpcy51dGNPZmZzZXQoKSkgKiA2ZTQsXG4gICAgICAgICAgICAgICAgYW5jaG9yLCBkaWZmLCBvdXRwdXQsIGRheXNBZGp1c3Q7XG5cbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICd5ZWFyJyB8fCB1bml0cyA9PT0gJ21vbnRoJyB8fCB1bml0cyA9PT0gJ3F1YXJ0ZXInKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gbW9udGhEaWZmKHRoaXMsIHRoYXQpO1xuICAgICAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ3F1YXJ0ZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dCAvIDM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh1bml0cyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dCAvIDEyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGlmZiA9IHRoaXMgLSB0aGF0O1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IHVuaXRzID09PSAnc2Vjb25kJyA/IGRpZmYgLyAxZTMgOiAvLyAxMDAwXG4gICAgICAgICAgICAgICAgICAgIHVuaXRzID09PSAnbWludXRlJyA/IGRpZmYgLyA2ZTQgOiAvLyAxMDAwICogNjBcbiAgICAgICAgICAgICAgICAgICAgdW5pdHMgPT09ICdob3VyJyA/IGRpZmYgLyAzNmU1IDogLy8gMTAwMCAqIDYwICogNjBcbiAgICAgICAgICAgICAgICAgICAgdW5pdHMgPT09ICdkYXknID8gKGRpZmYgLSB6b25lRGlmZikgLyA4NjRlNSA6IC8vIDEwMDAgKiA2MCAqIDYwICogMjQsIG5lZ2F0ZSBkc3RcbiAgICAgICAgICAgICAgICAgICAgdW5pdHMgPT09ICd3ZWVrJyA/IChkaWZmIC0gem9uZURpZmYpIC8gNjA0OGU1IDogLy8gMTAwMCAqIDYwICogNjAgKiAyNCAqIDcsIG5lZ2F0ZSBkc3RcbiAgICAgICAgICAgICAgICAgICAgZGlmZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhc0Zsb2F0ID8gb3V0cHV0IDogYWJzUm91bmQob3V0cHV0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBmcm9tIDogZnVuY3Rpb24gKHRpbWUsIHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQuZHVyYXRpb24oe3RvOiB0aGlzLCBmcm9tOiB0aW1lfSkubG9jYWxlKHRoaXMubG9jYWxlKCkpLmh1bWFuaXplKCF3aXRob3V0U3VmZml4KTtcbiAgICAgICAgfSxcblxuICAgICAgICBmcm9tTm93IDogZnVuY3Rpb24gKHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZyb20obW9tZW50KCksIHdpdGhvdXRTdWZmaXgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhbGVuZGFyIDogZnVuY3Rpb24gKHRpbWUpIHtcbiAgICAgICAgICAgIC8vIFdlIHdhbnQgdG8gY29tcGFyZSB0aGUgc3RhcnQgb2YgdG9kYXksIHZzIHRoaXMuXG4gICAgICAgICAgICAvLyBHZXR0aW5nIHN0YXJ0LW9mLXRvZGF5IGRlcGVuZHMgb24gd2hldGhlciB3ZSdyZSBsb2NhdC91dGMvb2Zmc2V0XG4gICAgICAgICAgICAvLyBvciBub3QuXG4gICAgICAgICAgICB2YXIgbm93ID0gdGltZSB8fCBtb21lbnQoKSxcbiAgICAgICAgICAgICAgICBzb2QgPSBtYWtlQXMobm93LCB0aGlzKS5zdGFydE9mKCdkYXknKSxcbiAgICAgICAgICAgICAgICBkaWZmID0gdGhpcy5kaWZmKHNvZCwgJ2RheXMnLCB0cnVlKSxcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBkaWZmIDwgLTYgPyAnc2FtZUVsc2UnIDpcbiAgICAgICAgICAgICAgICAgICAgZGlmZiA8IC0xID8gJ2xhc3RXZWVrJyA6XG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPCAwID8gJ2xhc3REYXknIDpcbiAgICAgICAgICAgICAgICAgICAgZGlmZiA8IDEgPyAnc2FtZURheScgOlxuICAgICAgICAgICAgICAgICAgICBkaWZmIDwgMiA/ICduZXh0RGF5JyA6XG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPCA3ID8gJ25leHRXZWVrJyA6ICdzYW1lRWxzZSc7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQodGhpcy5sb2NhbGVEYXRhKCkuY2FsZW5kYXIoZm9ybWF0LCB0aGlzLCBtb21lbnQobm93KSkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzTGVhcFllYXIgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih0aGlzLnllYXIoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNEU1QgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMudXRjT2Zmc2V0KCkgPiB0aGlzLmNsb25lKCkubW9udGgoMCkudXRjT2Zmc2V0KCkgfHxcbiAgICAgICAgICAgICAgICB0aGlzLnV0Y09mZnNldCgpID4gdGhpcy5jbG9uZSgpLm1vbnRoKDUpLnV0Y09mZnNldCgpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkYXkgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciBkYXkgPSB0aGlzLl9pc1VUQyA/IHRoaXMuX2QuZ2V0VVRDRGF5KCkgOiB0aGlzLl9kLmdldERheSgpO1xuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IHBhcnNlV2Vla2RheShpbnB1dCwgdGhpcy5sb2NhbGVEYXRhKCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZChpbnB1dCAtIGRheSwgJ2QnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBtb250aCA6IG1ha2VBY2Nlc3NvcignTW9udGgnLCB0cnVlKSxcblxuICAgICAgICBzdGFydE9mIDogZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIC8vIHRoZSBmb2xsb3dpbmcgc3dpdGNoIGludGVudGlvbmFsbHkgb21pdHMgYnJlYWsga2V5d29yZHNcbiAgICAgICAgICAgIC8vIHRvIHV0aWxpemUgZmFsbGluZyB0aHJvdWdoIHRoZSBjYXNlcy5cbiAgICAgICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICAgICAgICAgIHRoaXMubW9udGgoMCk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAncXVhcnRlcic6XG4gICAgICAgICAgICBjYXNlICdtb250aCc6XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlKDEpO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ3dlZWsnOlxuICAgICAgICAgICAgY2FzZSAnaXNvV2Vlayc6XG4gICAgICAgICAgICBjYXNlICdkYXknOlxuICAgICAgICAgICAgICAgIHRoaXMuaG91cnMoMCk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAnaG91cic6XG4gICAgICAgICAgICAgICAgdGhpcy5taW51dGVzKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRzKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5taWxsaXNlY29uZHMoMCk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB3ZWVrcyBhcmUgYSBzcGVjaWFsIGNhc2VcbiAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ3dlZWsnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53ZWVrZGF5KDApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh1bml0cyA9PT0gJ2lzb1dlZWsnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc29XZWVrZGF5KDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBxdWFydGVycyBhcmUgYWxzbyBzcGVjaWFsXG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICdxdWFydGVyJykge1xuICAgICAgICAgICAgICAgIHRoaXMubW9udGgoTWF0aC5mbG9vcih0aGlzLm1vbnRoKCkgLyAzKSAqIDMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBlbmRPZjogZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIGlmICh1bml0cyA9PT0gdW5kZWZpbmVkIHx8IHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFydE9mKHVuaXRzKS5hZGQoMSwgKHVuaXRzID09PSAnaXNvV2VlaycgPyAnd2VlaycgOiB1bml0cykpLnN1YnRyYWN0KDEsICdtcycpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzQWZ0ZXI6IGZ1bmN0aW9uIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgICAgIHZhciBpbnB1dE1zO1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh0eXBlb2YgdW5pdHMgIT09ICd1bmRlZmluZWQnID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gbW9tZW50LmlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogbW9tZW50KGlucHV0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gK3RoaXMgPiAraW5wdXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlucHV0TXMgPSBtb21lbnQuaXNNb21lbnQoaW5wdXQpID8gK2lucHV0IDogK21vbWVudChpbnB1dCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0TXMgPCArdGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGlzQmVmb3JlOiBmdW5jdGlvbiAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXRNcztcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModHlwZW9mIHVuaXRzICE9PSAndW5kZWZpbmVkJyA/IHVuaXRzIDogJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG1vbWVudC5pc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IG1vbWVudChpbnB1dCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICt0aGlzIDwgK2lucHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnB1dE1zID0gbW9tZW50LmlzTW9tZW50KGlucHV0KSA/ICtpbnB1dCA6ICttb21lbnQoaW5wdXQpO1xuICAgICAgICAgICAgICAgIHJldHVybiArdGhpcy5jbG9uZSgpLmVuZE9mKHVuaXRzKSA8IGlucHV0TXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNCZXR3ZWVuOiBmdW5jdGlvbiAoZnJvbSwgdG8sIHVuaXRzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc0FmdGVyKGZyb20sIHVuaXRzKSAmJiB0aGlzLmlzQmVmb3JlKHRvLCB1bml0cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNTYW1lOiBmdW5jdGlvbiAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXRNcztcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMgfHwgJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG1vbWVudC5pc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IG1vbWVudChpbnB1dCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICt0aGlzID09PSAraW5wdXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlucHV0TXMgPSArbW9tZW50KGlucHV0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKyh0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cykpIDw9IGlucHV0TXMgJiYgaW5wdXRNcyA8PSArKHRoaXMuY2xvbmUoKS5lbmRPZih1bml0cykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG1pbjogZGVwcmVjYXRlKFxuICAgICAgICAgICAgICAgICAnbW9tZW50KCkubWluIGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQubWluIGluc3RlYWQuIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNTQ4JyxcbiAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKG90aGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICBvdGhlciA9IG1vbWVudC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyIDwgdGhpcyA/IHRoaXMgOiBvdGhlcjtcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgKSxcblxuICAgICAgICBtYXg6IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICAgICAnbW9tZW50KCkubWF4IGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQubWF4IGluc3RlYWQuIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNTQ4JyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAob3RoZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgb3RoZXIgPSBtb21lbnQuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyID4gdGhpcyA/IHRoaXMgOiBvdGhlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICksXG5cbiAgICAgICAgem9uZSA6IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICAgICAnbW9tZW50KCkuem9uZSBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50KCkudXRjT2Zmc2V0IGluc3RlYWQuICcgK1xuICAgICAgICAgICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTc3OScsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGlucHV0LCBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0ID0gLWlucHV0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnV0Y09mZnNldChpbnB1dCwga2VlcExvY2FsVGltZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC10aGlzLnV0Y09mZnNldCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICApLFxuXG4gICAgICAgIC8vIGtlZXBMb2NhbFRpbWUgPSB0cnVlIG1lYW5zIG9ubHkgY2hhbmdlIHRoZSB0aW1lem9uZSwgd2l0aG91dFxuICAgICAgICAvLyBhZmZlY3RpbmcgdGhlIGxvY2FsIGhvdXIuIFNvIDU6MzE6MjYgKzAzMDAgLS1bdXRjT2Zmc2V0KDIsIHRydWUpXS0tPlxuICAgICAgICAvLyA1OjMxOjI2ICswMjAwIEl0IGlzIHBvc3NpYmxlIHRoYXQgNTozMToyNiBkb2Vzbid0IGV4aXN0IHdpdGggb2Zmc2V0XG4gICAgICAgIC8vICswMjAwLCBzbyB3ZSBhZGp1c3QgdGhlIHRpbWUgYXMgbmVlZGVkLCB0byBiZSB2YWxpZC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gS2VlcGluZyB0aGUgdGltZSBhY3R1YWxseSBhZGRzL3N1YnRyYWN0cyAob25lIGhvdXIpXG4gICAgICAgIC8vIGZyb20gdGhlIGFjdHVhbCByZXByZXNlbnRlZCB0aW1lLiBUaGF0IGlzIHdoeSB3ZSBjYWxsIHVwZGF0ZU9mZnNldFxuICAgICAgICAvLyBhIHNlY29uZCB0aW1lLiBJbiBjYXNlIGl0IHdhbnRzIHVzIHRvIGNoYW5nZSB0aGUgb2Zmc2V0IGFnYWluXG4gICAgICAgIC8vIF9jaGFuZ2VJblByb2dyZXNzID09IHRydWUgY2FzZSwgdGhlbiB3ZSBoYXZlIHRvIGFkanVzdCwgYmVjYXVzZVxuICAgICAgICAvLyB0aGVyZSBpcyBubyBzdWNoIHRpbWUgaW4gdGhlIGdpdmVuIHRpbWV6b25lLlxuICAgICAgICB1dGNPZmZzZXQgOiBmdW5jdGlvbiAoaW5wdXQsIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLl9vZmZzZXQgfHwgMCxcbiAgICAgICAgICAgICAgICBsb2NhbEFkanVzdDtcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSB1dGNPZmZzZXRGcm9tU3RyaW5nKGlucHV0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGlucHV0KSA8IDE2KSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQgKiA2MDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9pc1VUQyAmJiBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsQWRqdXN0ID0gdGhpcy5fZGF0ZVV0Y09mZnNldCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9vZmZzZXQgPSBpbnB1dDtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc1VUQyA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsQWRqdXN0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGQobG9jYWxBZGp1c3QsICdtJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvZmZzZXQgIT09IGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgha2VlcExvY2FsVGltZSB8fCB0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRPclN1YnRyYWN0RHVyYXRpb25Gcm9tTW9tZW50KHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbWVudC5kdXJhdGlvbihpbnB1dCAtIG9mZnNldCwgJ20nKSwgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbWVudC51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VJblByb2dyZXNzID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyBvZmZzZXQgOiB0aGlzLl9kYXRlVXRjT2Zmc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNMb2NhbCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy5faXNVVEM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNVdGNPZmZzZXQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNVVEM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNVdGMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgJiYgdGhpcy5fb2Zmc2V0ID09PSAwO1xuICAgICAgICB9LFxuXG4gICAgICAgIHpvbmVBYmJyIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gJ1VUQycgOiAnJztcbiAgICAgICAgfSxcblxuICAgICAgICB6b25lTmFtZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/ICdDb29yZGluYXRlZCBVbml2ZXJzYWwgVGltZScgOiAnJztcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZVpvbmUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fdHptKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQodGhpcy5fdHptKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuX2kgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQodXRjT2Zmc2V0RnJvbVN0cmluZyh0aGlzLl9pKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBoYXNBbGlnbmVkSG91ck9mZnNldCA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gbW9tZW50KGlucHV0KS51dGNPZmZzZXQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnV0Y09mZnNldCgpIC0gaW5wdXQpICUgNjAgPT09IDA7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGF5c0luTW9udGggOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF5c0luTW9udGgodGhpcy55ZWFyKCksIHRoaXMubW9udGgoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGF5T2ZZZWFyIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgZGF5T2ZZZWFyID0gcm91bmQoKG1vbWVudCh0aGlzKS5zdGFydE9mKCdkYXknKSAtIG1vbWVudCh0aGlzKS5zdGFydE9mKCd5ZWFyJykpIC8gODY0ZTUpICsgMTtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gZGF5T2ZZZWFyIDogdGhpcy5hZGQoKGlucHV0IC0gZGF5T2ZZZWFyKSwgJ2QnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBxdWFydGVyIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IE1hdGguY2VpbCgodGhpcy5tb250aCgpICsgMSkgLyAzKSA6IHRoaXMubW9udGgoKGlucHV0IC0gMSkgKiAzICsgdGhpcy5tb250aCgpICUgMyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2Vla1llYXIgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB5ZWFyID0gd2Vla09mWWVhcih0aGlzLCB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3csIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRveSkueWVhcjtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8geWVhciA6IHRoaXMuYWRkKChpbnB1dCAtIHllYXIpLCAneScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzb1dlZWtZZWFyIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgeWVhciA9IHdlZWtPZlllYXIodGhpcywgMSwgNCkueWVhcjtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8geWVhciA6IHRoaXMuYWRkKChpbnB1dCAtIHllYXIpLCAneScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdlZWsgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrID0gdGhpcy5sb2NhbGVEYXRhKCkud2Vlayh0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKChpbnB1dCAtIHdlZWspICogNywgJ2QnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc29XZWVrIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgd2VlayA9IHdlZWtPZlllYXIodGhpcywgMSwgNCkud2VlaztcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKChpbnB1dCAtIHdlZWspICogNywgJ2QnKTtcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrZGF5IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgd2Vla2RheSA9ICh0aGlzLmRheSgpICsgNyAtIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRvdykgJSA3O1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrZGF5IDogdGhpcy5hZGQoaW5wdXQgLSB3ZWVrZGF5LCAnZCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzb1dlZWtkYXkgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIC8vIGJlaGF2ZXMgdGhlIHNhbWUgYXMgbW9tZW50I2RheSBleGNlcHRcbiAgICAgICAgICAgIC8vIGFzIGEgZ2V0dGVyLCByZXR1cm5zIDcgaW5zdGVhZCBvZiAwICgxLTcgcmFuZ2UgaW5zdGVhZCBvZiAwLTYpXG4gICAgICAgICAgICAvLyBhcyBhIHNldHRlciwgc3VuZGF5IHNob3VsZCBiZWxvbmcgdG8gdGhlIHByZXZpb3VzIHdlZWsuXG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHRoaXMuZGF5KCkgfHwgNyA6IHRoaXMuZGF5KHRoaXMuZGF5KCkgJSA3ID8gaW5wdXQgOiBpbnB1dCAtIDcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzb1dlZWtzSW5ZZWFyIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCAxLCA0KTtcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrc0luWWVhciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrSW5mbyA9IHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrO1xuICAgICAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCB3ZWVrSW5mby5kb3csIHdlZWtJbmZvLmRveSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0IDogZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzXSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldCA6IGZ1bmN0aW9uICh1bml0cywgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB1bml0O1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB1bml0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHVuaXQgaW4gdW5pdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQodW5pdCwgdW5pdHNbdW5pdF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpc1t1bml0c10gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1t1bml0c10odmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIElmIHBhc3NlZCBhIGxvY2FsZSBrZXksIGl0IHdpbGwgc2V0IHRoZSBsb2NhbGUgZm9yIHRoaXNcbiAgICAgICAgLy8gaW5zdGFuY2UuICBPdGhlcndpc2UsIGl0IHdpbGwgcmV0dXJuIHRoZSBsb2NhbGUgY29uZmlndXJhdGlvblxuICAgICAgICAvLyB2YXJpYWJsZXMgZm9yIHRoaXMgaW5zdGFuY2UuXG4gICAgICAgIGxvY2FsZSA6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHZhciBuZXdMb2NhbGVEYXRhO1xuXG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlLl9hYmJyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdMb2NhbGVEYXRhID0gbW9tZW50LmxvY2FsZURhdGEoa2V5KTtcbiAgICAgICAgICAgICAgICBpZiAobmV3TG9jYWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvY2FsZSA9IG5ld0xvY2FsZURhdGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGxhbmcgOiBkZXByZWNhdGUoXG4gICAgICAgICAgICAnbW9tZW50KCkubGFuZygpIGlzIGRlcHJlY2F0ZWQuIEluc3RlYWQsIHVzZSBtb21lbnQoKS5sb2NhbGVEYXRhKCkgdG8gZ2V0IHRoZSBsYW5ndWFnZSBjb25maWd1cmF0aW9uLiBVc2UgbW9tZW50KCkubG9jYWxlKCkgdG8gY2hhbmdlIGxhbmd1YWdlcy4nLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlKGtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApLFxuXG4gICAgICAgIGxvY2FsZURhdGEgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9kYXRlVXRjT2Zmc2V0IDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gT24gRmlyZWZveC4yNCBEYXRlI2dldFRpbWV6b25lT2Zmc2V0IHJldHVybnMgYSBmbG9hdGluZyBwb2ludC5cbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L3B1bGwvMTg3MVxuICAgICAgICAgICAgcmV0dXJuIC1NYXRoLnJvdW5kKHRoaXMuX2QuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDE1KSAqIDE1O1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHJhd01vbnRoU2V0dGVyKG1vbSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIGRheU9mTW9udGg7XG5cbiAgICAgICAgLy8gVE9ETzogTW92ZSB0aGlzIG91dCBvZiBoZXJlIVxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFsdWUgPSBtb20ubG9jYWxlRGF0YSgpLm1vbnRoc1BhcnNlKHZhbHVlKTtcbiAgICAgICAgICAgIC8vIFRPRE86IEFub3RoZXIgc2lsZW50IGZhaWx1cmU/XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb207XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkYXlPZk1vbnRoID0gTWF0aC5taW4obW9tLmRhdGUoKSxcbiAgICAgICAgICAgICAgICBkYXlzSW5Nb250aChtb20ueWVhcigpLCB2YWx1ZSkpO1xuICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgJ01vbnRoJ10odmFsdWUsIGRheU9mTW9udGgpO1xuICAgICAgICByZXR1cm4gbW9tO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJhd0dldHRlcihtb20sIHVuaXQpIHtcbiAgICAgICAgcmV0dXJuIG1vbS5fZFsnZ2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJhd1NldHRlcihtb20sIHVuaXQsIHZhbHVlKSB7XG4gICAgICAgIGlmICh1bml0ID09PSAnTW9udGgnKSB7XG4gICAgICAgICAgICByZXR1cm4gcmF3TW9udGhTZXR0ZXIobW9tLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VBY2Nlc3Nvcih1bml0LCBrZWVwVGltZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJhd1NldHRlcih0aGlzLCB1bml0LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgbW9tZW50LnVwZGF0ZU9mZnNldCh0aGlzLCBrZWVwVGltZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiByYXdHZXR0ZXIodGhpcywgdW5pdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgbW9tZW50LmZuLm1pbGxpc2Vjb25kID0gbW9tZW50LmZuLm1pbGxpc2Vjb25kcyA9IG1ha2VBY2Nlc3NvcignTWlsbGlzZWNvbmRzJywgZmFsc2UpO1xuICAgIG1vbWVudC5mbi5zZWNvbmQgPSBtb21lbnQuZm4uc2Vjb25kcyA9IG1ha2VBY2Nlc3NvcignU2Vjb25kcycsIGZhbHNlKTtcbiAgICBtb21lbnQuZm4ubWludXRlID0gbW9tZW50LmZuLm1pbnV0ZXMgPSBtYWtlQWNjZXNzb3IoJ01pbnV0ZXMnLCBmYWxzZSk7XG4gICAgLy8gU2V0dGluZyB0aGUgaG91ciBzaG91bGQga2VlcCB0aGUgdGltZSwgYmVjYXVzZSB0aGUgdXNlciBleHBsaWNpdGx5XG4gICAgLy8gc3BlY2lmaWVkIHdoaWNoIGhvdXIgaGUgd2FudHMuIFNvIHRyeWluZyB0byBtYWludGFpbiB0aGUgc2FtZSBob3VyIChpblxuICAgIC8vIGEgbmV3IHRpbWV6b25lKSBtYWtlcyBzZW5zZS4gQWRkaW5nL3N1YnRyYWN0aW5nIGhvdXJzIGRvZXMgbm90IGZvbGxvd1xuICAgIC8vIHRoaXMgcnVsZS5cbiAgICBtb21lbnQuZm4uaG91ciA9IG1vbWVudC5mbi5ob3VycyA9IG1ha2VBY2Nlc3NvcignSG91cnMnLCB0cnVlKTtcbiAgICAvLyBtb21lbnQuZm4ubW9udGggaXMgZGVmaW5lZCBzZXBhcmF0ZWx5XG4gICAgbW9tZW50LmZuLmRhdGUgPSBtYWtlQWNjZXNzb3IoJ0RhdGUnLCB0cnVlKTtcbiAgICBtb21lbnQuZm4uZGF0ZXMgPSBkZXByZWNhdGUoJ2RhdGVzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSBkYXRlIGluc3RlYWQuJywgbWFrZUFjY2Vzc29yKCdEYXRlJywgdHJ1ZSkpO1xuICAgIG1vbWVudC5mbi55ZWFyID0gbWFrZUFjY2Vzc29yKCdGdWxsWWVhcicsIHRydWUpO1xuICAgIG1vbWVudC5mbi55ZWFycyA9IGRlcHJlY2F0ZSgneWVhcnMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIHllYXIgaW5zdGVhZC4nLCBtYWtlQWNjZXNzb3IoJ0Z1bGxZZWFyJywgdHJ1ZSkpO1xuXG4gICAgLy8gYWRkIHBsdXJhbCBtZXRob2RzXG4gICAgbW9tZW50LmZuLmRheXMgPSBtb21lbnQuZm4uZGF5O1xuICAgIG1vbWVudC5mbi5tb250aHMgPSBtb21lbnQuZm4ubW9udGg7XG4gICAgbW9tZW50LmZuLndlZWtzID0gbW9tZW50LmZuLndlZWs7XG4gICAgbW9tZW50LmZuLmlzb1dlZWtzID0gbW9tZW50LmZuLmlzb1dlZWs7XG4gICAgbW9tZW50LmZuLnF1YXJ0ZXJzID0gbW9tZW50LmZuLnF1YXJ0ZXI7XG5cbiAgICAvLyBhZGQgYWxpYXNlZCBmb3JtYXQgbWV0aG9kc1xuICAgIG1vbWVudC5mbi50b0pTT04gPSBtb21lbnQuZm4udG9JU09TdHJpbmc7XG5cbiAgICAvLyBhbGlhcyBpc1V0YyBmb3IgZGV2LWZyaWVuZGxpbmVzc1xuICAgIG1vbWVudC5mbi5pc1VUQyA9IG1vbWVudC5mbi5pc1V0YztcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRHVyYXRpb24gUHJvdG90eXBlXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBmdW5jdGlvbiBkYXlzVG9ZZWFycyAoZGF5cykge1xuICAgICAgICAvLyA0MDAgeWVhcnMgaGF2ZSAxNDYwOTcgZGF5cyAodGFraW5nIGludG8gYWNjb3VudCBsZWFwIHllYXIgcnVsZXMpXG4gICAgICAgIHJldHVybiBkYXlzICogNDAwIC8gMTQ2MDk3O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHllYXJzVG9EYXlzICh5ZWFycykge1xuICAgICAgICAvLyB5ZWFycyAqIDM2NSArIGFic1JvdW5kKHllYXJzIC8gNCkgLVxuICAgICAgICAvLyAgICAgYWJzUm91bmQoeWVhcnMgLyAxMDApICsgYWJzUm91bmQoeWVhcnMgLyA0MDApO1xuICAgICAgICByZXR1cm4geWVhcnMgKiAxNDYwOTcgLyA0MDA7XG4gICAgfVxuXG4gICAgZXh0ZW5kKG1vbWVudC5kdXJhdGlvbi5mbiA9IER1cmF0aW9uLnByb3RvdHlwZSwge1xuXG4gICAgICAgIF9idWJibGUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgICAgIGRheXMgPSB0aGlzLl9kYXlzLFxuICAgICAgICAgICAgICAgIG1vbnRocyA9IHRoaXMuX21vbnRocyxcbiAgICAgICAgICAgICAgICBkYXRhID0gdGhpcy5fZGF0YSxcbiAgICAgICAgICAgICAgICBzZWNvbmRzLCBtaW51dGVzLCBob3VycywgeWVhcnMgPSAwO1xuXG4gICAgICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGNvZGUgYnViYmxlcyB1cCB2YWx1ZXMsIHNlZSB0aGUgdGVzdHMgZm9yXG4gICAgICAgICAgICAvLyBleGFtcGxlcyBvZiB3aGF0IHRoYXQgbWVhbnMuXG4gICAgICAgICAgICBkYXRhLm1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcyAlIDEwMDA7XG5cbiAgICAgICAgICAgIHNlY29uZHMgPSBhYnNSb3VuZChtaWxsaXNlY29uZHMgLyAxMDAwKTtcbiAgICAgICAgICAgIGRhdGEuc2Vjb25kcyA9IHNlY29uZHMgJSA2MDtcblxuICAgICAgICAgICAgbWludXRlcyA9IGFic1JvdW5kKHNlY29uZHMgLyA2MCk7XG4gICAgICAgICAgICBkYXRhLm1pbnV0ZXMgPSBtaW51dGVzICUgNjA7XG5cbiAgICAgICAgICAgIGhvdXJzID0gYWJzUm91bmQobWludXRlcyAvIDYwKTtcbiAgICAgICAgICAgIGRhdGEuaG91cnMgPSBob3VycyAlIDI0O1xuXG4gICAgICAgICAgICBkYXlzICs9IGFic1JvdW5kKGhvdXJzIC8gMjQpO1xuXG4gICAgICAgICAgICAvLyBBY2N1cmF0ZWx5IGNvbnZlcnQgZGF5cyB0byB5ZWFycywgYXNzdW1lIHN0YXJ0IGZyb20geWVhciAwLlxuICAgICAgICAgICAgeWVhcnMgPSBhYnNSb3VuZChkYXlzVG9ZZWFycyhkYXlzKSk7XG4gICAgICAgICAgICBkYXlzIC09IGFic1JvdW5kKHllYXJzVG9EYXlzKHllYXJzKSk7XG5cbiAgICAgICAgICAgIC8vIDMwIGRheXMgdG8gYSBtb250aFxuICAgICAgICAgICAgLy8gVE9ETyAoaXNrcmVuKTogVXNlIGFuY2hvciBkYXRlIChsaWtlIDFzdCBKYW4pIHRvIGNvbXB1dGUgdGhpcy5cbiAgICAgICAgICAgIG1vbnRocyArPSBhYnNSb3VuZChkYXlzIC8gMzApO1xuICAgICAgICAgICAgZGF5cyAlPSAzMDtcblxuICAgICAgICAgICAgLy8gMTIgbW9udGhzIC0+IDEgeWVhclxuICAgICAgICAgICAgeWVhcnMgKz0gYWJzUm91bmQobW9udGhzIC8gMTIpO1xuICAgICAgICAgICAgbW9udGhzICU9IDEyO1xuXG4gICAgICAgICAgICBkYXRhLmRheXMgPSBkYXlzO1xuICAgICAgICAgICAgZGF0YS5tb250aHMgPSBtb250aHM7XG4gICAgICAgICAgICBkYXRhLnllYXJzID0geWVhcnM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWJzIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gTWF0aC5hYnModGhpcy5fbWlsbGlzZWNvbmRzKTtcbiAgICAgICAgICAgIHRoaXMuX2RheXMgPSBNYXRoLmFicyh0aGlzLl9kYXlzKTtcbiAgICAgICAgICAgIHRoaXMuX21vbnRocyA9IE1hdGguYWJzKHRoaXMuX21vbnRocyk7XG5cbiAgICAgICAgICAgIHRoaXMuX2RhdGEubWlsbGlzZWNvbmRzID0gTWF0aC5hYnModGhpcy5fZGF0YS5taWxsaXNlY29uZHMpO1xuICAgICAgICAgICAgdGhpcy5fZGF0YS5zZWNvbmRzID0gTWF0aC5hYnModGhpcy5fZGF0YS5zZWNvbmRzKTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGEubWludXRlcyA9IE1hdGguYWJzKHRoaXMuX2RhdGEubWludXRlcyk7XG4gICAgICAgICAgICB0aGlzLl9kYXRhLmhvdXJzID0gTWF0aC5hYnModGhpcy5fZGF0YS5ob3Vycyk7XG4gICAgICAgICAgICB0aGlzLl9kYXRhLm1vbnRocyA9IE1hdGguYWJzKHRoaXMuX2RhdGEubW9udGhzKTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGEueWVhcnMgPSBNYXRoLmFicyh0aGlzLl9kYXRhLnllYXJzKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2Vla3MgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gYWJzUm91bmQodGhpcy5kYXlzKCkgLyA3KTtcbiAgICAgICAgfSxcblxuICAgICAgICB2YWx1ZU9mIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21pbGxpc2Vjb25kcyArXG4gICAgICAgICAgICAgIHRoaXMuX2RheXMgKiA4NjRlNSArXG4gICAgICAgICAgICAgICh0aGlzLl9tb250aHMgJSAxMikgKiAyNTkyZTYgK1xuICAgICAgICAgICAgICB0b0ludCh0aGlzLl9tb250aHMgLyAxMikgKiAzMTUzNmU2O1xuICAgICAgICB9LFxuXG4gICAgICAgIGh1bWFuaXplIDogZnVuY3Rpb24gKHdpdGhTdWZmaXgpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSByZWxhdGl2ZVRpbWUodGhpcywgIXdpdGhTdWZmaXgsIHRoaXMubG9jYWxlRGF0YSgpKTtcblxuICAgICAgICAgICAgaWYgKHdpdGhTdWZmaXgpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSB0aGlzLmxvY2FsZURhdGEoKS5wYXN0RnV0dXJlKCt0aGlzLCBvdXRwdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZCA6IGZ1bmN0aW9uIChpbnB1dCwgdmFsKSB7XG4gICAgICAgICAgICAvLyBzdXBwb3J0cyBvbmx5IDIuMC1zdHlsZSBhZGQoMSwgJ3MnKSBvciBhZGQobW9tZW50KVxuICAgICAgICAgICAgdmFyIGR1ciA9IG1vbWVudC5kdXJhdGlvbihpbnB1dCwgdmFsKTtcblxuICAgICAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzICs9IGR1ci5fbWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgdGhpcy5fZGF5cyArPSBkdXIuX2RheXM7XG4gICAgICAgICAgICB0aGlzLl9tb250aHMgKz0gZHVyLl9tb250aHM7XG5cbiAgICAgICAgICAgIHRoaXMuX2J1YmJsZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBzdWJ0cmFjdCA6IGZ1bmN0aW9uIChpbnB1dCwgdmFsKSB7XG4gICAgICAgICAgICB2YXIgZHVyID0gbW9tZW50LmR1cmF0aW9uKGlucHV0LCB2YWwpO1xuXG4gICAgICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgLT0gZHVyLl9taWxsaXNlY29uZHM7XG4gICAgICAgICAgICB0aGlzLl9kYXlzIC09IGR1ci5fZGF5cztcbiAgICAgICAgICAgIHRoaXMuX21vbnRocyAtPSBkdXIuX21vbnRocztcblxuICAgICAgICAgICAgdGhpcy5fYnViYmxlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldCA6IGZ1bmN0aW9uICh1bml0cykge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1t1bml0cy50b0xvd2VyQ2FzZSgpICsgJ3MnXSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFzIDogZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgICAgICB2YXIgZGF5cywgbW9udGhzO1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ21vbnRoJyB8fCB1bml0cyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgICAgICAgZGF5cyA9IHRoaXMuX2RheXMgKyB0aGlzLl9taWxsaXNlY29uZHMgLyA4NjRlNTtcbiAgICAgICAgICAgICAgICBtb250aHMgPSB0aGlzLl9tb250aHMgKyBkYXlzVG9ZZWFycyhkYXlzKSAqIDEyO1xuICAgICAgICAgICAgICAgIHJldHVybiB1bml0cyA9PT0gJ21vbnRoJyA/IG1vbnRocyA6IG1vbnRocyAvIDEyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBoYW5kbGUgbWlsbGlzZWNvbmRzIHNlcGFyYXRlbHkgYmVjYXVzZSBvZiBmbG9hdGluZyBwb2ludCBtYXRoIGVycm9ycyAoaXNzdWUgIzE4NjcpXG4gICAgICAgICAgICAgICAgZGF5cyA9IHRoaXMuX2RheXMgKyBNYXRoLnJvdW5kKHllYXJzVG9EYXlzKHRoaXMuX21vbnRocyAvIDEyKSk7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd3ZWVrJzogcmV0dXJuIGRheXMgLyA3ICsgdGhpcy5fbWlsbGlzZWNvbmRzIC8gNjA0OGU1O1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdkYXknOiByZXR1cm4gZGF5cyArIHRoaXMuX21pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdob3VyJzogcmV0dXJuIGRheXMgKiAyNCArIHRoaXMuX21pbGxpc2Vjb25kcyAvIDM2ZTU7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ21pbnV0ZSc6IHJldHVybiBkYXlzICogMjQgKiA2MCArIHRoaXMuX21pbGxpc2Vjb25kcyAvIDZlNDtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2Vjb25kJzogcmV0dXJuIGRheXMgKiAyNCAqIDYwICogNjAgKyB0aGlzLl9taWxsaXNlY29uZHMgLyAxMDAwO1xuICAgICAgICAgICAgICAgICAgICAvLyBNYXRoLmZsb29yIHByZXZlbnRzIGZsb2F0aW5nIHBvaW50IG1hdGggZXJyb3JzIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbWlsbGlzZWNvbmQnOiByZXR1cm4gTWF0aC5mbG9vcihkYXlzICogMjQgKiA2MCAqIDYwICogMTAwMCkgKyB0aGlzLl9taWxsaXNlY29uZHM7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignVW5rbm93biB1bml0ICcgKyB1bml0cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGxhbmcgOiBtb21lbnQuZm4ubGFuZyxcbiAgICAgICAgbG9jYWxlIDogbW9tZW50LmZuLmxvY2FsZSxcblxuICAgICAgICB0b0lzb1N0cmluZyA6IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICd0b0lzb1N0cmluZygpIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgdG9JU09TdHJpbmcoKSBpbnN0ZWFkICcgK1xuICAgICAgICAgICAgJyhub3RpY2UgdGhlIGNhcGl0YWxzKScsXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9JU09TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKSxcblxuICAgICAgICB0b0lTT1N0cmluZyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIGluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9kb3JkaWxsZS9tb21lbnQtaXNvZHVyYXRpb24vYmxvYi9tYXN0ZXIvbW9tZW50Lmlzb2R1cmF0aW9uLmpzXG4gICAgICAgICAgICB2YXIgeWVhcnMgPSBNYXRoLmFicyh0aGlzLnllYXJzKCkpLFxuICAgICAgICAgICAgICAgIG1vbnRocyA9IE1hdGguYWJzKHRoaXMubW9udGhzKCkpLFxuICAgICAgICAgICAgICAgIGRheXMgPSBNYXRoLmFicyh0aGlzLmRheXMoKSksXG4gICAgICAgICAgICAgICAgaG91cnMgPSBNYXRoLmFicyh0aGlzLmhvdXJzKCkpLFxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSBNYXRoLmFicyh0aGlzLm1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHRoaXMuc2Vjb25kcygpICsgdGhpcy5taWxsaXNlY29uZHMoKSAvIDEwMDApO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuYXNTZWNvbmRzKCkpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIHRoZSBzYW1lIGFzIEMjJ3MgKE5vZGEpIGFuZCBweXRob24gKGlzb2RhdGUpLi4uXG4gICAgICAgICAgICAgICAgLy8gYnV0IG5vdCBvdGhlciBKUyAoZ29vZy5kYXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiAnUDBEJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLmFzU2Vjb25kcygpIDwgMCA/ICctJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgJ1AnICtcbiAgICAgICAgICAgICAgICAoeWVhcnMgPyB5ZWFycyArICdZJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgKG1vbnRocyA/IG1vbnRocyArICdNJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgKGRheXMgPyBkYXlzICsgJ0QnIDogJycpICtcbiAgICAgICAgICAgICAgICAoKGhvdXJzIHx8IG1pbnV0ZXMgfHwgc2Vjb25kcykgPyAnVCcgOiAnJykgK1xuICAgICAgICAgICAgICAgIChob3VycyA/IGhvdXJzICsgJ0gnIDogJycpICtcbiAgICAgICAgICAgICAgICAobWludXRlcyA/IG1pbnV0ZXMgKyAnTScgOiAnJykgK1xuICAgICAgICAgICAgICAgIChzZWNvbmRzID8gc2Vjb25kcyArICdTJyA6ICcnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBsb2NhbGVEYXRhIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgICAgICAgfSxcblxuICAgICAgICB0b0pTT04gOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b0lTT1N0cmluZygpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBtb21lbnQuZHVyYXRpb24uZm4udG9TdHJpbmcgPSBtb21lbnQuZHVyYXRpb24uZm4udG9JU09TdHJpbmc7XG5cbiAgICBmdW5jdGlvbiBtYWtlRHVyYXRpb25HZXR0ZXIobmFtZSkge1xuICAgICAgICBtb21lbnQuZHVyYXRpb24uZm5bbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtuYW1lXTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmb3IgKGkgaW4gdW5pdE1pbGxpc2Vjb25kRmFjdG9ycykge1xuICAgICAgICBpZiAoaGFzT3duUHJvcCh1bml0TWlsbGlzZWNvbmRGYWN0b3JzLCBpKSkge1xuICAgICAgICAgICAgbWFrZUR1cmF0aW9uR2V0dGVyKGkudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNNaWxsaXNlY29uZHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKCdtcycpO1xuICAgIH07XG4gICAgbW9tZW50LmR1cmF0aW9uLmZuLmFzU2Vjb25kcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXMoJ3MnKTtcbiAgICB9O1xuICAgIG1vbWVudC5kdXJhdGlvbi5mbi5hc01pbnV0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKCdtJyk7XG4gICAgfTtcbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNIb3VycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXMoJ2gnKTtcbiAgICB9O1xuICAgIG1vbWVudC5kdXJhdGlvbi5mbi5hc0RheXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKCdkJyk7XG4gICAgfTtcbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNXZWVrcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXMoJ3dlZWtzJyk7XG4gICAgfTtcbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNNb250aHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKCdNJyk7XG4gICAgfTtcbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNZZWFycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXMoJ3knKTtcbiAgICB9O1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBEZWZhdWx0IExvY2FsZVxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgLy8gU2V0IGRlZmF1bHQgbG9jYWxlLCBvdGhlciBsb2NhbGUgd2lsbCBpbmhlcml0IGZyb20gRW5nbGlzaC5cbiAgICBtb21lbnQubG9jYWxlKCdlbicsIHtcbiAgICAgICAgb3JkaW5hbFBhcnNlOiAvXFxkezEsMn0odGh8c3R8bmR8cmQpLyxcbiAgICAgICAgb3JkaW5hbCA6IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciBiID0gbnVtYmVyICUgMTAsXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gKHRvSW50KG51bWJlciAlIDEwMCAvIDEwKSA9PT0gMSkgPyAndGgnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMSkgPyAnc3QnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMikgPyAnbmQnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMykgPyAncmQnIDogJ3RoJztcbiAgICAgICAgICAgIHJldHVybiBudW1iZXIgKyBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qIEVNQkVEX0xPQ0FMRVMgKi9cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRXhwb3NpbmcgTW9tZW50XG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgZnVuY3Rpb24gbWFrZUdsb2JhbChzaG91bGREZXByZWNhdGUpIHtcbiAgICAgICAgLypnbG9iYWwgZW5kZXI6ZmFsc2UgKi9cbiAgICAgICAgaWYgKHR5cGVvZiBlbmRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBvbGRHbG9iYWxNb21lbnQgPSBnbG9iYWxTY29wZS5tb21lbnQ7XG4gICAgICAgIGlmIChzaG91bGREZXByZWNhdGUpIHtcbiAgICAgICAgICAgIGdsb2JhbFNjb3BlLm1vbWVudCA9IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICAgICAgICAgJ0FjY2Vzc2luZyBNb21lbnQgdGhyb3VnaCB0aGUgZ2xvYmFsIHNjb3BlIGlzICcgK1xuICAgICAgICAgICAgICAgICAgICAnZGVwcmVjYXRlZCwgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBhbiB1cGNvbWluZyAnICtcbiAgICAgICAgICAgICAgICAgICAgJ3JlbGVhc2UuJyxcbiAgICAgICAgICAgICAgICAgICAgbW9tZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbFNjb3BlLm1vbWVudCA9IG1vbWVudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIENvbW1vbkpTIG1vZHVsZSBpcyBkZWZpbmVkXG4gICAgaWYgKGhhc01vZHVsZSkge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IG1vbWVudDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKHJlcXVpcmUsIGV4cG9ydHMsIG1vZHVsZSkge1xuICAgICAgICAgICAgaWYgKG1vZHVsZS5jb25maWcgJiYgbW9kdWxlLmNvbmZpZygpICYmIG1vZHVsZS5jb25maWcoKS5ub0dsb2JhbCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIC8vIHJlbGVhc2UgdGhlIGdsb2JhbCB2YXJpYWJsZVxuICAgICAgICAgICAgICAgIGdsb2JhbFNjb3BlLm1vbWVudCA9IG9sZEdsb2JhbE1vbWVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1vbWVudDtcbiAgICAgICAgfSk7XG4gICAgICAgIG1ha2VHbG9iYWwodHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbWFrZUdsb2JhbCgpO1xuICAgIH1cbn0pLmNhbGwodGhpcyk7Il19
