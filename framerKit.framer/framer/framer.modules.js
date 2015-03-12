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



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcmFwaGRhbWljby9Eb2N1bWVudHMvR2l0L2ZyYW1lcktpdC9mcmFtZXJLaXQuZnJhbWVyL21vZHVsZXMvZnJhbWVyS2l0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQUE7Ozs7Ozs7Ozs7OztHQUFBO0FBaUJBO0FBQUE7Ozs7O0dBakJBO0FBQUEsSUFBQSxxREFBQTs7QUFBQSxRQXVCQSxHQUFXO0FBQUEsRUFDVixXQUFBLEVBQWEsR0FESDtDQXZCWCxDQUFBOztBQTJCQTtBQUFBOztHQTNCQTs7QUFBQSxRQThCUSxDQUFDLGNBQVQsR0FBMEIsRUE5QjFCLENBQUE7O0FBQUEsUUErQlEsQ0FBQyx5QkFBVCxHQUFxQyxFQS9CckMsQ0FBQTs7QUFBQSxRQWdDUSxDQUFDLElBQVQsR0FBZ0IsTUFoQ2hCLENBQUE7O0FBQUEsUUFpQ1EsQ0FBQyxRQUFULEdBQW9CLHFCQWpDcEIsQ0FBQTs7QUFBQSxRQWtDUSxDQUFDLFVBQVQsR0FBc0IsU0FsQ3RCLENBQUE7O0FBQUEsUUFtQ1EsQ0FBQyxjQUFULEdBQTBCLE9BbkMxQixDQUFBOztBQUFBLFFBb0NRLENBQUMsaUJBQVQsR0FBNkI7QUFBQSxFQUM1QixRQUFBLEVBQVUsTUFEa0I7QUFBQSxFQUU1QixVQUFBLEVBQVksQ0FBQyxRQUFRLENBQUMsY0FBVCxHQUF3QixDQUF6QixDQUFBLEdBQTRCLElBRlo7QUFBQSxFQUc1QixVQUFBLEVBQVksZ0JBSGdCO0FBQUEsRUFJNUIsVUFBQSxFQUFZLEtBSmdCO0NBcEM3QixDQUFBOztBQUFBLFFBMENRLENBQUMsb0JBQVQsR0FBZ0M7QUFBQSxFQUMvQixRQUFBLEVBQVUsTUFEcUI7QUFBQSxFQUUvQixVQUFBLEVBQVksQ0FBQyxRQUFRLENBQUMsY0FBVCxHQUF3QixDQUF6QixDQUFBLEdBQTRCLElBRlQ7QUFB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RUFBQSxJQUFJLE1BQU0sQ0FBQyxLQUFQLElBQWlCLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBYixHQUFzQixDQUEzQztBQUNDO0FBQUEsU0FBQSxxQ0FBQTtvQkFBQTtBQUNDLE1BQUEsT0FBQSxHQUFjLElBQUEsSUFBQSxDQUFLLElBQUMsQ0FBQSxJQUFOLEVBQVksSUFBSSxDQUFDLElBQWpCLEVBQXVCLElBQUksQ0FBQyxLQUE1QixFQUFtQyxJQUFJLENBQUMsTUFBeEMsQ0FBZCxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUF2QixDQUE0QixPQUE1QixDQUhBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxlQUFlLENBQUMsV0FBWSxDQUFBLElBQUksQ0FBQyxJQUFMLENBQTdCLEdBQTBDLE9BSjFDLENBQUE7QUFBQSxNQU9BLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBdEIsQ0FBeUIsZUFBekIsRUFBMEMsZUFBMUMsQ0FQQSxDQUFBO0FBQUEsTUFVQSxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQXRCLENBQXlCLHNCQUF6QixFQUFpRCxzQkFBakQsQ0FWQSxDQUFBO0FBQUEsTUFhQSxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQXRCLENBQXlCLG1CQUF6QixFQUE4QyxtQkFBOUMsQ0FiQSxDQUREO0FBQUEsS0FERDtHQXBGQTtBQXNHQSxTQUFPLElBQUMsQ0FBQSxlQUFSLENBeEdnQjtBQUFBLENBcnJCakIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIyNcbiAgRnJhbWVyS2l0IGZvciBGcmFtZXJcbiAgaHR0cHM6Ly9naXRodWIuY29tL3JhcGhkYW1pY28vZnJhbWVyS2l0XG5cbiAgQ29weXJpZ2h0IChjKSAyMDE1LCBSYXBoIEQnQW1pY28gaHR0cDovL3JhcGhkYW1pY28uY29tIChAcmFwaGRhbWljbylcbiAgTUlUIExpY2Vuc2VcblxuICBSZWFkbWU6XG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9yYXBoZGFtaWNvL2ZyYW1lcktpdFxuXG4gIExpY2Vuc2U6XG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9yYXBoZGFtaWNvL2ZyYW1lcktpdC9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4jIyNcblxuXG5cblxuIyMjXG5cdERFRkFVTFQgU1RZTEVTXG5cdE5vdGUgdGhlIHNjcmVlbndpZHRoIGNvbnN0YW50OiB0aGlzIGlzIHByb2JhYmx5IG9uZSBvZiB0aGVcblx0Zmlyc3QgdGhpbmdzIHlvdSB3YW50IHRvIGNoYW5nZSBzbyBpdCBtYXRjaGVzIHRoZSBkZXZpY2Vcblx0eW91J3JlIHByb3RvdHlwaW5nIG9uLlxuIyMjXG5kZWZhdWx0cyA9IHtcblx0c2NyZWVuV2lkdGg6IDc1MFxufVxuXG4jIyNcblx0TU9SRSBTVFlMRVNcbiMjI1xuZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgPSA4OFxuZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZyA9IDIwXG5kZWZhdWx0cy50aW50ID0gJ2dyZXknXG5kZWZhdWx0cy5saW5lVGludCA9IFwicmdiYSgyMDAsMjAwLDIwMCwxKVwiXG5kZWZhdWx0cy5zd2l0Y2hUaW50ID0gJyMxREMyNEInXG5kZWZhdWx0cy5pdGVtQmFja2dyb3VuZCA9ICd3aGl0ZSdcbmRlZmF1bHRzLmxpc3RJdGVtVGV4dFN0eWxlID0ge1xuXHRmb250U2l6ZTogXCIzMnB4XCJcblx0bGluZUhlaWdodDogKGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LTQpK1wicHhcIlx0XHRcblx0Zm9udEZhbWlseTogXCJIZWx2ZXRpY2EgTmV1ZVwiXG5cdGZvbnRXZWlnaHQ6IFwiMjAwXCJcbn1cbmRlZmF1bHRzLmRpdmlkZXJJdGVtVGV4dFN0eWxlID0ge1xuXHRmb250U2l6ZTogXCIyMnB4XCJcblx0bGluZUhlaWdodDogKGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LTQpK1wicHhcIlx0XHRcblx0Zm9udEZhbWlseTogXCJIZWx2ZXRpY2EgTmV1ZVwiXG5cdGZvbnRXZWlnaHQ6IFwiMjAwXCJcblx0dGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZSdcbn1cbmRlZmF1bHRzLnBpY2tlclRleHRTdHlsZSA9IHtcblx0Zm9udFNpemU6IFx0XHRcIjQycHhcIlxuXHRmb250RmFtaWx5OiBcdFwiSGVsdmV0aWNhIE5ldWVcIlxuXHRmb250V2VpZ2h0OiBcdFwiMjAwXCJcbn1cbmV4cG9ydHMuZGVmYXVsdHMgPSBkZWZhdWx0c1xuXG5cbiMjI1xuXHRUQUJMRSBWSUVXIEVMRU1FTlRTXG5cdChlLmcuIFwiVGh1bWJcIiBmb3IgdGhlIHN3aXRjaCBjb250cm9sKVxuIyMjXG5cblN3aXRjaCA9IChwYXJhbXMpIC0+XG5cdHBhcmFtcyA9IHBhcmFtcyBvciB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcywgXG5cdFx0c3dpdGNoVGludDogZGVmYXVsdHMuc3dpdGNoVGludFxuXHRcdHNjcmVlbldpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdHRhYmxlUm93SGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdHN3aXRjaENvbnRhaW5lckJvcmRlcjogNFxuXHRcdHN3aXRjaENvbnRhaW5lckhlaWdodDogNTRcblx0XHRzd2l0Y2hDb250YWluZXJXaWR0aDogOTRcblx0XHRib3JkZXJDb2xvcjogZGVmYXVsdHMubGluZVRpbnQgIyBHcmV5IHJvdW5kZWQgcGlsbCAmIGJvcmRlcnMgYmV0d2VlbiBjZWxsc1xuXG5cdEBzZWxlY3RlZCA9IHRydWVcblx0XG5cdCMgU29tZSBvZiB0aGUgdmFsdWVzIGFyZSBiYXNlZCBvbiBvdGhlciBjb25zdGFudHMsXG5cdCMgc28geW91IGhhdmUgdG8gY2FsY3VsYXRlIHRoZW0gaW4gYSBzZWNvbmQgcGFzc1xuXHRzd2l0Y2hCdXR0b25SYWRpdXMgPSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0LzJcblx0c2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIgPSAyXG5cdFxuXHQjIFRoaXMgaXMgb3VyIGZhbmN5IGFuaW1hdGVkIHN3aXRjaCBzd2l0Y2hcblx0IyB3ZSBuZWVkIHRvIG1ha2UgYSByb3VuZGVkIHJlY3RhbmdsZSB3aXRoIGEgY2lyY2xlIGluc2lkZSBpdC5cblx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRcdFx0XHQwXG5cdFx0eTogXHRcdFx0XHRcdDBcblx0XHRjbGlwOiBcdFx0XHRcdGZhbHNlICMgQ2xpcHBpbmcgaHVydHMgdGhlIHN1YnRsZSBzaGFkb3cgb24gdGhlIGJ1dHRvblxuXHRcdHdpZHRoOlx0XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoIFxuXHRcdGhlaWdodDpcdFx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJcIlxuXHRcdG9wYWNpdHk6IFx0XHRcdDFcblxuXHRAc3dpdGNoQmFja2dyb3VuZCA9IG5ldyBMYXllclxuXHRcdHg6XHRcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyAtIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyLzJcblx0XHR5Olx0XHRcdFx0XHRzd2l0Y2hCdXR0b25SYWRpdXMgLSBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlci8yIC0gNFxuXHRcdHdpZHRoOiBcdFx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJXaWR0aCAtIHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQgKyBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlclxuXHRcdGhlaWdodDogXHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodCAtIHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQgKyBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlclxuXHRcdGJvcmRlclJhZGl1czogXHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHRzaGFkb3dTcHJlYWQ6XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyAtIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyLzIgKyBwYXJhbXMuc3dpdGNoQ29udGFpbmVyQm9yZGVyXG5cdFx0c2hhZG93Q29sb3I6IFx0XHRwYXJhbXMuc3dpdGNoVGludFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHQnJ1xuXHRcdG9wYWNpdHk6IFx0XHRcdDFcblx0XHRzdXBlckxheWVyOiBcdFx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lclxuXHRcdFxuXHRAc3dpdGNoQnV0dG9uID0gbmV3IExheWVyXG5cdFx0eDogcGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoIC0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdHk6IC00XG5cdFx0d2lkdGg6XHRcdFx0XHRzd2l0Y2hCdXR0b25SYWRpdXMqMlxuXHRcdGhlaWdodDpcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyoyXG5cdFx0Ym9yZGVyUmFkaXVzOiBcdFx0c3dpdGNoQnV0dG9uUmFkaXVzXG5cdFx0c2hhZG93WTpcdFx0XHQzXG5cdFx0c2hhZG93Qmx1cjogXHRcdDVcblx0XHRzaGFkb3dDb2xvcjogXHRcdCdyZ2JhKDAsMCwwLDAuMyknXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwid2hpdGVcIlxuXHRcdG9wYWNpdHk6IFx0XHRcdDFcblx0XHRzdXBlckxheWVyOiBcdFx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lclxuXHRcblx0IyBTRVQgVVAgQU5JTUFUSU9OU1xuXHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuYWRkXG5cdFx0ZGVzZWxlY3RlZDogXG5cdFx0XHR4OiBcdFx0XHRcdDBcblx0XHRcdHk6IFx0XHRcdFx0LTRcblx0XHRcdHdpZHRoOlx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJXaWR0aFxuXHRcdFx0aGVpZ2h0Olx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHRcdHNoYWRvd1NwcmVhZDogXHRwYXJhbXMuc3dpdGNoQ29udGFpbmVyQm9yZGVyXG5cdFx0XHRzYXR1cmF0ZTogXHRcdDBcblx0XHRcdGJyaWdodG5lc3M6IFx0MTUzXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiXCJcblx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdGN1cnZlOiBcImVhc2UtaW4tb3V0XCJcblx0XHR0aW1lOiAwLjMgXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XG5cdFx0VXRpbHMuZGVsYXkgMCwgPT5cblx0IFx0XHRpZiBAc2VsZWN0ZWRcbiBcdFx0XHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLmJhY2tncm91bmRDb2xvciA9IHBhcmFtcy5zd2l0Y2hUaW50XG5cblx0QHN3aXRjaEJhY2tncm91bmQub24gRXZlbnRzLkFuaW1hdGlvblN0YXJ0LCA9PlxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLmJhY2tncm91bmRDb2xvciA9ICcnXG5cblx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuYWRkXG5cdFx0ZGVzZWxlY3RlZDoge3g6IDB9XG5cdEBzd2l0Y2hCdXR0b24uc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdGN1cnZlOiBcInNwcmluZyg0MDAsMjUsMClcIlxuXHRcdFxuXHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyLnNlbGVjdCA9ID0+XG5cdFx0QHNlbGVjdGVkID0gdHJ1ZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5zd2l0Y2goXCJkZWZhdWx0XCIpXG5cdFx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuc3dpdGNoKFwiZGVmYXVsdFwiKVxuXHRcdFxuXHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyLmRlc2VsZWN0ID0gPT5cblx0XHRAc2VsZWN0ZWQgPSBmYWxzZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5zd2l0Y2goXCJkZXNlbGVjdGVkXCIpXG5cdFx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuc3dpdGNoKFwiZGVzZWxlY3RlZFwiKVxuXG5cdGlmIEBzZWxlY3RlZCA9PSBmYWxzZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5zd2l0Y2hJbnN0YW50KFwiZGVzZWxlY3RlZFwiKVxuXHRcdEBzd2l0Y2hCdXR0b24uc3RhdGVzLnN3aXRjaEluc3RhbnQoXCJkZXNlbGVjdGVkXCIpXG5cdGVsc2Vcblx0XHRAc3dpdGNoQmFja2dyb3VuZC5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbXMuc3dpdGNoVGludFxuXG5cdHJldHVybiBAc3dpdGNoQnV0dG9uQ29udGFpbmVyXG5cdFxuQ3Jvc3MgPSAtPlxuXHRjb2xvciA9IGRlZmF1bHRzLnRpbnRcblx0Y3Jvc3NUaGlja25lc3MgPSA0XG5cdGNyb3NzID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IDMwXHRcblx0XHRoZWlnaHQ6IDMwXHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuXHRjcm9zc1Vwc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjcm9zc1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAyMFxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRvcmlnaW5YOiAxXG5cdFx0c3VwZXJMYXllcjogY3Jvc3Ncblx0Y3Jvc3NVcHN0cm9rZS55ID0gMTRcblx0Y3Jvc3NVcHN0cm9rZS5yb3RhdGlvblogPSA0NVxuXHRjcm9zc0Rvd25zdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNyb3NzVGhpY2tuZXNzXG5cdFx0d2lkdGg6IDIwXG5cdFx0b3JpZ2luWDogMVxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRzdXBlckxheWVyOiBjcm9zc1xuXHRjcm9zc0Rvd25zdHJva2Uucm90YXRpb25aID0gLTQ1XG5cdGNyb3NzLnNlbGVjdCA9IC0+XG5cdFx0Y3Jvc3MuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRjcm9zcy5kZXNlbGVjdCA9IC0+XG5cdFx0Y3Jvc3MuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRzY2FsZTogMC40XG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXHRcdFxuXHRyZXR1cm4gY3Jvc3Ncblx0XG5DYXJldCA9IC0+XG5cdGNvbG9yID0gZGVmYXVsdHMudGludFxuXHRjYXJldFRoaWNrbmVzcyA9IDRcblx0Y2FyZXQgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogMzBcblx0XHRoZWlnaHQ6IDMwXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcdFx0XG5cdGNhcmV0VXBzdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNhcmV0VGhpY2tuZXNzXG5cdFx0d2lkdGg6IDE4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdG9yaWdpblg6IDFcblx0XHRzdXBlckxheWVyOiBjYXJldFxuXHRjYXJldFVwc3Ryb2tlLnkgPSAxNFxuXHRjYXJldFVwc3Ryb2tlLnJvdGF0aW9uWiA9IDQ1XG5cdGNhcmV0RG93bnN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2FyZXRUaGlja25lc3Ncblx0XHR3aWR0aDogMThcblx0XHRvcmlnaW5YOiAxXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdHN1cGVyTGF5ZXI6IGNhcmV0XG5cdGNhcmV0RG93bnN0cm9rZS55ID0gMTJcdFx0XG5cdGNhcmV0RG93bnN0cm9rZS5yb3RhdGlvblogPSAtNDVcblx0Y2FyZXQuc2VsZWN0ID0gLT5cblx0XHRjYXJldC5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXG5cdGNhcmV0LmRlc2VsZWN0ID0gLT5cblx0XHRjYXJldC5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHNjYWxlOiAwLjRcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcdFxuXHRyZXR1cm4gY2FyZXRcblx0XG5DaGVjayA9IC0+XG5cdGNvbG9yID0gZGVmYXVsdHMudGludFxuXHRjaGVja1RoaWNrbmVzcyA9IDRcblx0Y2hlY2sgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogMzBcblx0XHRoZWlnaHQ6IDMwXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcblx0Y2hlY2tVcHN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2hlY2tUaGlja25lc3Ncblx0XHR3aWR0aDogMTNcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0b3JpZ2luWDogMVxuXHRcdHN1cGVyTGF5ZXI6IGNoZWNrXG5cdGNoZWNrVXBzdHJva2UueSA9IDE2XG5cdGNoZWNrVXBzdHJva2Uucm90YXRpb25aID0gNDVcblx0Y2hlY2tEb3duc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjaGVja1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAyMlxuXHRcdG9yaWdpblg6IDFcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0c3VwZXJMYXllcjogY2hlY2tcdFxuXHRjaGVja0Rvd25zdHJva2UueCA9IDRcblx0Y2hlY2tEb3duc3Ryb2tlLnJvdGF0aW9uWiA9IC00NVxuXHRjaGVjay5zZWxlY3QgPSAtPlxuXHRcdGNoZWNrLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcblx0Y2hlY2suZGVzZWxlY3QgPSAtPlxuXHRcdGNoZWNrLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0c2NhbGU6IDAuNFxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRyZXR1cm4gY2hlY2tcblxuXG4jIyNcblx0VEFCTEUgVklFV1xuXHRcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0VGFibGVWaWV3Um93XHRcdFtFbGVtZW50cyBnbyBoZXJlXVxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4jIyNcblxuZXhwb3J0cy5UYWJsZVZpZXdSb3cgPSAocGFyYW1zKSAtPlxuXHRcblx0IyBUaGUgdHJpY2t5IHRoaW5nIGFib3V0IHJldXNhYmxlIGNvbXBvbmVudHMgaXMgcmVtZW1iZXJpbmdcblx0IyBob3cgdG8gdXNlIHRoZW0gKHBhcnRpY3VsYXJseSBpZiB0aGV5IGhhdmUgbG90cyBvZiBjdXN0b21pemFibGVcblx0IyBwYXJhbWV0ZXJzKS4gU2V0dGluZyBzZW5zaWJsZSBkZWZhdWx0cyBtYWtlcyBpdCB3YXkgZWFzaWVyIHRvIGdldFxuXHQjIHN0YXJ0ZWQgKGFuZCByZW1lbWJlciBob3cgdG8gdXNlIHRoZSB0aGluZyB5b3UgbWFkZSlcblx0Xy5kZWZhdWx0cyBwYXJhbXMsIFxuXHRcdG5hbWU6ICdHaXZlIG1lIGEgbmFtZSEnXG5cdFx0eDogMFxuXHRcdHk6IDBcblx0XHRlbmFibGVkOiB0cnVlXG5cdFx0c2VsZWN0ZWQ6IHRydWVcblx0XHRpY29uOiAnY2hlY2snXG5cdFx0dGV4dENvbG9yOiBkZWZhdWx0cy50aW50XG5cdFx0c3dpdGNoVGludDogZGVmYXVsdHMuc3dpdGNoVGludFxuXHRcdGZpcnN0SXRlbUluTGlzdDogdHJ1ZSAjIGNvdWxkIGJlIGZpcnN0IG9yIGxhc3Rcblx0XHRsYXN0SXRlbUluTGlzdDogdHJ1ZSAjIGNvdWxkIGJlIGZpcnN0IG9yIGxhc3Rcblx0XHRcblx0XHQjIENvbnN0YW50c1xuXHRcdHNjcmVlbldpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdHRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmc6IGRlZmF1bHRzLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0XHR0YWJsZVJvd0hlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRib3JkZXJDb2xvcjogZGVmYXVsdHMubGluZVRpbnQgIyBHcmV5IHJvdW5kZWQgcGlsbCAmIGJvcmRlcnMgYmV0d2VlbiBjZWxsc1xuXG5cdCMgU29tZSBvZiB0aGUgdmFsdWVzIGFyZSBiYXNlZCBvbiBvdGhlciBjb25zdGFudHMsXG5cdCMgc28geW91IGhhdmUgdG8gY2FsY3VsYXRlIHRoZW0gaW4gYSBzZWNvbmQgcGFzc1xuXHRzd2l0Y2hCdXR0b25SYWRpdXMgPSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0LzJcblx0c2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIgPSAyXG5cdFx0XG5cdCMgVGhpcyBpcyB0aGUgcm9vdCBvYmplY3QgZm9yIHRoaXMgZW50aXJlIGNvbXBvbmVudC5cblx0IyBXZSB3aWxsIGF0dGFjaCBhbGwgb3VyIGZ1bmN0aW9ucyBkaXJlY3RseSB0byB0aGlzIGxheWVyXG5cdEBsaXN0SXRlbUNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IHBhcmFtcy54XG5cdFx0eTogcGFyYW1zLnlcblx0XHR3aWR0aDogXHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRjbGlwOiBmYWxzZVxuXHRcdGJhY2tncm91bmRDb2xvcjogZGVmYXVsdHMuaXRlbUJhY2tncm91bmRcblx0QGxpc3RJdGVtQ29udGFpbmVyLnN0eWxlID0gXG5cdFx0Ym9yZGVyVG9wOiBcdFx0aWYgcGFyYW1zLmZpcnN0SXRlbUluTGlzdCB0aGVuIFwiMXB4IHNvbGlkIFwiICsgcGFyYW1zLmJvcmRlckNvbG9yIGVsc2UgXCJcIlxuXHRcdGJvcmRlckJvdHRvbTogXHRpZiBwYXJhbXMubGFzdEl0ZW1Jbkxpc3QgdGhlbiBcIjFweCBzb2xpZCBcIiArIHBhcmFtcy5ib3JkZXJDb2xvciBlbHNlIFwiXCJcblxuXHQjIFRoZXNlIHdpbGwgYmUgYWNjZXNzZWQgdXNpbmcgZnVuY3Rpb25zXG5cdEBlbmFibGVkID0gcGFyYW1zLmVuYWJsZWRcblx0QHNlbGVjdGVkID0gcGFyYW1zLnNlbGVjdGVkXG5cdFxuXHRAbGlzdEl0ZW0gPSBuZXcgTGF5ZXIgXG5cdFx0eDogcGFyYW1zLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0XHR3aWR0aDogXHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRzdXBlckxheWVyOiBAbGlzdEl0ZW1Db250YWluZXJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1x0XG5cdEBsaXN0SXRlbS5zdHlsZSA9IGRlZmF1bHRzLmxpc3RJdGVtVGV4dFN0eWxlXG5cdEBsaXN0SXRlbS5zdHlsZSA9XG5cdFx0Y29sb3I6IHBhcmFtcy50ZXh0Q29sb3Jcblx0XHRib3JkZXJUb3A6IFx0aWYgcGFyYW1zLmZpcnN0SXRlbUluTGlzdCB0aGVuIFwiXCIgZWxzZSBcIjFweCBzb2xpZCBcIiArIHBhcmFtcy5ib3JkZXJDb2xvclxuXG5cdCMgVGhpcyBpcyB3aGVyZSB0aGUgbGFiZWwgb2YgdGhlIGxpc3QgaXRlbSBsaXZlc1xuXHRAbGlzdEl0ZW0uaHRtbCA9IHBhcmFtcy5uYW1lIFxuXG5cdCMgQWRkIHRoZSBjaGVja21hcmsgZm9yIHRoZSBsaXN0XG5cdHRoaW5nVG9Td2l0Y2ggPSBzd2l0Y2hcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdjaGVjaycgdGhlbiBuZXcgQ2hlY2soKVxuXHRcdHdoZW4gcGFyYW1zLmljb24gPT0gJ2Nyb3NzJyB0aGVuIG5ldyBDcm9zcygpXG5cdFx0d2hlbiBwYXJhbXMuaWNvbiA9PSAnY2FyZXQnIHRoZW4gbmV3IENhcmV0KClcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdzd2l0Y2gnIHRoZW4gbmV3IFN3aXRjaCgpXG5cblx0dGhpbmdUb1N3aXRjaC5zdXBlckxheWVyID0gQGxpc3RJdGVtQ29udGFpbmVyXG5cdHRoaW5nVG9Td2l0Y2gueCA9IGRlZmF1bHRzLnNjcmVlbldpZHRoIC0gdGhpbmdUb1N3aXRjaC53aWR0aCAtIGRlZmF1bHRzLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0dGhpbmdUb1N3aXRjaC5jZW50ZXJZKDIpXG4jIFx0dGhpbmdUb1N3aXRjaC55ID0gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzIgLSB0aGluZ1RvU3dpdGNoLmhlaWdodC8yXG5cdFxuXHQjIE1BS0UgSVQgQUxMIElOVEVSQUNUSVZFXG5cdCMgT24gYSBjbGljaywgZ28gdG8gdGhlIG5leHQgc3RhdGVcblx0aWYgcGFyYW1zLmljb24gPT0gJ3N3aXRjaCdcblx0XHR0aGluZ1RvU3dpdGNoLm9uIEV2ZW50cy5DbGljaywgPT5cblx0XHRcdEBsaXN0SXRlbUNvbnRhaW5lci5zd2l0Y2goKVxuXHRlbHNlIFxuXHRcdEBsaXN0SXRlbS5vbiBFdmVudHMuQ2xpY2ssID0+XG5cdFx0XHRAbGlzdEl0ZW1Db250YWluZXIuc3dpdGNoKClcblxuXHRAbGlzdEl0ZW1Db250YWluZXIuc3dpdGNoID0gPT5cblx0XHRpZiBAc2VsZWN0ZWQgdGhlbiBAbGlzdEl0ZW1Db250YWluZXIuZGVzZWxlY3QoKSBlbHNlIEBsaXN0SXRlbUNvbnRhaW5lci5zZWxlY3QoKVxuXHRcdFxuXHRAbGlzdEl0ZW1Db250YWluZXIuc2VsZWN0ID0gKG9wdGlvbnMpID0+XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge3N1cHJlc3NFdmVudHM6IGZhbHNlfVxuXHRcdGlmIEBlbmFibGVkIFxuXHRcdFx0dGhpbmdUb1N3aXRjaC5zZWxlY3QoKVxuXHRcdFx0QHNlbGVjdGVkID0gdHJ1ZVxuXHRcdGlmIG9wdGlvbnMuc3VwcmVzc0V2ZW50cyA9PSBmYWxzZVxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLmVtaXQgXCJEaWRDaGFuZ2VcIiwgeyBzZWxlY3RlZDogQHNlbGVjdGVkIH1cblxuXHRAbGlzdEl0ZW1Db250YWluZXIuZGVzZWxlY3QgPSAob3B0aW9ucykgPT5cblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7c3VwcmVzc0V2ZW50czogZmFsc2V9XG5cdFx0aWYgQGVuYWJsZWQgXG5cdFx0XHR0aGluZ1RvU3dpdGNoLmRlc2VsZWN0KClcdFx0XG5cdFx0XHRAc2VsZWN0ZWQgPSBmYWxzZVxuXHRcdGlmIG9wdGlvbnMuc3VwcmVzc0V2ZW50cyA9PSBmYWxzZVxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLmVtaXQgXCJEaWRDaGFuZ2VcIiwgeyBzZWxlY3RlZDogQHNlbGVjdGVkIH1cblxuXHRAbGlzdEl0ZW1Db250YWluZXIudXBkYXRlTGFiZWwgPSAobmV3VGV4dCkgPT5cblx0XHRAbGlzdEl0ZW0uaHRtbCA9IG5ld1RleHRcblxuXHRAbGlzdEl0ZW1Db250YWluZXIuc2VsZWN0ZWQgPSAoKSA9PlxuXHRcdHJldHVybiBAc2VsZWN0ZWRcblx0XHRcdFxuXHRAbGlzdEl0ZW1Db250YWluZXIudXBkYXRlTGFiZWwocGFyYW1zLm5hbWUpXG5cblx0cmV0dXJuIEBsaXN0SXRlbUNvbnRhaW5lclxuXG5leHBvcnRzLlRhYmxlVmlldyA9IChwYXJhbXMpIC0+XG5cdHBhcmFtcyA9IHBhcmFtcyBvciB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcyxcblx0XHR5OiBcdFx0MFxuXHRcdHdpZHRoOlx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRpdGVtczogW1wiSXQncyBqdXN0IG1lIVwiXVxuXHRcdGljb246ICdjaGVjaydcblx0XHR2YWxpZGF0aW9uOiAnbm9uZSdcblx0XG5cdEBidXR0b25Hcm91cENvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTpcdFx0cGFyYW1zLnlcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICogcGFyYW1zLml0ZW1zLmxlbmd0aFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIm5vbmVcIlxuXHRcdFx0XHRcdFxuXHRAYnV0dG9uQXJyYXkgPSBbXVxuXHRmb3IgYnV0dG9uTmFtZSwgaSBpbiBwYXJhbXMuaXRlbXNcblx0XHRmaXJzdEl0ZW1Jbkxpc3QgPSBpZiBpID09IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2Vcblx0XHRsYXN0SXRlbUluTGlzdCA9IGlmIGkgPT0gKHBhcmFtcy5pdGVtcy5sZW5ndGgtMSkgdGhlbiB0cnVlIGVsc2UgZmFsc2Vcblx0XHRuZXdCdXR0b24gPSBuZXcgZXhwb3J0cy5UYWJsZVZpZXdSb3coe1xuXHRcdFx0eDogMCwgXG5cdFx0XHR5OiBpKmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LCBcblx0XHRcdG5hbWU6IGJ1dHRvbk5hbWUsIFxuXHRcdFx0aWNvbjogcGFyYW1zLmljb24sXG5cdFx0XHRmaXJzdEl0ZW1Jbkxpc3Q6IGZpcnN0SXRlbUluTGlzdCxcblx0XHRcdGxhc3RJdGVtSW5MaXN0OiBsYXN0SXRlbUluTGlzdFxuXHRcdH0pXG5cdFx0QGJ1dHRvbkFycmF5LnB1c2gobmV3QnV0dG9uKVxuXHRcdG5ld0J1dHRvbi5zdXBlckxheWVyID0gQGJ1dHRvbkdyb3VwQ29udGFpbmVyXG5cblx0YXR0YWNoUmFkaW9CdXR0b25WYWxpZGF0aW9uID0gKGJ1dHRvbkFycmF5KSA9PlxuXHRcdGJ1dHRvbkdyb3VwQ29udGFpbmVyID0gQGJ1dHRvbkdyb3VwQ29udGFpbmVyXG5cdFx0Zm9yIGJ1dHRvbkNsaWNrZWQsIGluZGV4T2ZCdXR0b25DbGlja2VkIGluIGJ1dHRvbkFycmF5XG5cdFx0XHRidXR0b25DbGlja2VkLmRlc2VsZWN0KHtzdXByZXNzRXZlbnRzOiB0cnVlfSlcblx0XHRcdCMgQ3JlYXRlcyBhIGNsb3N1cmUgdG8gc2F2ZSB0aGUgaW5kZXggb2YgdGhlIGJ1dHRvbiB3ZSdyZSBkZWFsaW5nIHdpdGhcblx0XHRcdGRvIChidXR0b25DbGlja2VkLCBpbmRleE9mQnV0dG9uQ2xpY2tlZCkgLT4gXG5cdFx0XHRcdCMgTGlzdGVuIGZvciBldmVudHMgYW5kIGNoYW5nZSBvdGhlciBidXR0b25zIGluIHJlc3BvbnNlXG5cdFx0XHRcdGJ1dHRvbkNsaWNrZWQub24gJ0RpZENoYW5nZScsIChldmVudCkgPT5cblx0XHRcdFx0XHRmb3Igb3RoZXJCdXR0b24sIG90aGVyQnV0dG9uSW5kZXggaW4gYnV0dG9uQXJyYXlcblx0XHRcdFx0XHRcdGlmIG90aGVyQnV0dG9uSW5kZXggIT0gaW5kZXhPZkJ1dHRvbkNsaWNrZWRcblx0XHRcdFx0XHRcdFx0IyBEbyBzdHVmZiB0byB0aGUgb3RoZXIgYnV0dG9uc1xuXHRcdFx0XHRcdFx0XHRvdGhlckJ1dHRvbi5kZXNlbGVjdCh7c3VwcHJlc3NFdmVudHM6IHRydWV9KVxuXHRcdFx0XHRcdGJ1dHRvbkdyb3VwQ29udGFpbmVyLmVtaXQgXCJEaWRDaGFuZ2VcIiwgeyBzZWxlY3RlZDogaW5kZXhPZkJ1dHRvbkNsaWNrZWQsIG51bVNlbGVjdGVkOiAxLCBidXR0b25zOiBidXR0b25BcnJheSB9XG5cblx0YXR0YWNoRGVmYXVsdFZhbGlkYXRpb24gPSAoYnV0dG9uQXJyYXkpID0+XG5cdFx0IyBKdXN0IGVtaXRzIHRoZSBuZXcgdmFsdWVzXG5cdFx0YnV0dG9uR3JvdXBDb250YWluZXIgPSBAYnV0dG9uR3JvdXBDb250YWluZXJcblx0XHRmb3IgYnV0dG9uQ2xpY2tlZCwgaW5kZXhPZkJ1dHRvbkNsaWNrZWQgaW4gYnV0dG9uQXJyYXlcblx0XHRcdGJ1dHRvbkNsaWNrZWQuZGVzZWxlY3Qoe3N1cHJlc3NFdmVudHM6IHRydWV9KVxuXHRcdFx0IyBDcmVhdGVzIGEgY2xvc3VyZSB0byBzYXZlIHRoZSBpbmRleCBvZiB0aGUgYnV0dG9uIHdlJ3JlIGRlYWxpbmcgd2l0aFxuXHRcdFx0ZG8gKGJ1dHRvbkNsaWNrZWQsIGluZGV4T2ZCdXR0b25DbGlja2VkKSAtPiBcblx0XHRcdFx0IyBMaXN0ZW4gZm9yIGV2ZW50cyBhbmQgY2hhbmdlIG90aGVyIGJ1dHRvbnMgaW4gcmVzcG9uc2Vcblx0XHRcdFx0YnV0dG9uQ2xpY2tlZC5vbiAnRGlkQ2hhbmdlJywgKGV2ZW50KSA9PlxuXHRcdFx0XHRcdG51bVNlbGVjdGVkID0gMFxuXHRcdFx0XHRcdHRhYmxlVmlld1N0YXRlcyA9IFtdXHRcdFxuXHRcdFx0XHRcdGZvciBidXR0b24gaW4gYnV0dG9uQXJyYXlcblx0XHRcdFx0XHRcdHRhYmxlVmlld1N0YXRlcy5wdXNoKGJ1dHRvbi5zZWxlY3RlZCgpKVxuXHRcdFx0XHRcdFx0aWYgYnV0dG9uLnNlbGVjdGVkKCkgdGhlbiBudW1TZWxlY3RlZCsrXG5cdFx0XHRcdFx0YnV0dG9uR3JvdXBDb250YWluZXIuZW1pdCBcIkRpZENoYW5nZVwiLCB7IHNlbGVjdGVkOiB0YWJsZVZpZXdTdGF0ZXMsIG51bVNlbGVjdGVkOiBudW1TZWxlY3RlZCwgYnV0dG9uczogYnV0dG9uQXJyYXkgfVxuXG5cdGlmIHBhcmFtcy52YWxpZGF0aW9uID09ICdyYWRpbydcblx0XHRhdHRhY2hSYWRpb0J1dHRvblZhbGlkYXRpb24oQGJ1dHRvbkFycmF5KVxuXHRlbHNlIFxuXHRcdGF0dGFjaERlZmF1bHRWYWxpZGF0aW9uKEBidXR0b25BcnJheSlcblx0XHRcblx0cmV0dXJuIEBidXR0b25Hcm91cENvbnRhaW5lclxuXG5cblxuIyMjXG5cdFRBQkxFIFZJRVcgSEVBREVSXG5cdEluIGlPUywgdGhpcyBpcyB0eXBpY2FsbHkgYXR0YWNoZWQgdG8gdGhlIHRhYmxlIHZpZXcsIFxuXHRidXQgaXQncyBpbmRlcGVuZGVudCBoZXJlIHNvIHlvdSBjYW4gcHV0IGl0IHdoZXJldmVyIHlvdSB3YW50LlxuIyMjXG5cbmV4cG9ydHMuVGFibGVWaWV3SGVhZGVyID0gKHBhcmFtcykgLT5cblx0cGFyYW1zID0gcGFyYW1zIHx8IHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLFxuXHRcdHRleHQ6ICdJIGFtIGEgZGl2aWRlcidcblx0XHR4OiAwXG5cdFx0eTogMFxuXHRsaXN0RGl2aWRlciA9IG5ldyBMYXllclxuXHRcdHg6IHBhcmFtcy54ICsgZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZ1xuXHRcdHk6IHBhcmFtcy55XG5cdFx0d2lkdGg6IGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcblx0bGlzdERpdmlkZXIuaHRtbCA9IHBhcmFtcy50ZXh0XG5cdGxpc3REaXZpZGVyLnN0eWxlID0gZGVmYXVsdHMuZGl2aWRlckl0ZW1UZXh0U3R5bGVcblx0bGlzdERpdmlkZXIuc3R5bGUgPSBcblx0XHRjb2xvcjogZGVmYXVsdHMudGludFxuXHRyZXR1cm4gbGlzdERpdmlkZXJcblxuXG5cbiMjI1xuXHRQSUNLRVJcblx0SW4gaU9TLCB0aGlzIGlzIHR5cGljYWxseSBhdHRhY2hlZCB0byB0aGUgdGFibGUgdmlldywgXG5cdGJ1dCBpdCdzIGluZGVwZW5kZW50IGhlcmUgc28geW91IGNhbiBwdXQgaXQgd2hlcmV2ZXIgeW91IHdhbnQuXG4jIyNcblxuXG4jIyBVdGlsaXR5IGZ1bmN0aW9uc1xuXG5xdWFudGl6ZSA9IChpbnB1dCwgc3RlcFNpemUpIC0+XG5cdHJldHVybiBNYXRoLmZsb29yKGlucHV0L3N0ZXBTaXplKSAqIHN0ZXBTaXplXG5cblxuIyMgVGhlIGl0ZW1zIGluIHRoZSBwaWNrZXJcblxuRHJ1bSA9IChwYXJlbnREcnVtTGF5ZXIsIGRydW1OYW1lLCBsaXN0SXRlbXMsIHBhcmFtcykgLT5cblx0XG5cdCMgU2V0dXAgdmFyaWFibGVzXG5cdEBwYXJlbnREcnVtTGF5ZXIgPSBwYXJlbnREcnVtTGF5ZXJcblx0cGFyYW1zID0gcGFyYW1zIHx8IHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLFxuXHRcdGVuYWJsZWQ6IHRydWVcblx0XHR4UGN0OiAwICBcdFx0XHRcdCMgMCB0byAxXG5cdFx0d2lkdGhQY3Q6IDFcdFx0XHRcdCMgMCB0byAxXG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiXHRcdCMgbGVmdCwgY2VudGVyLCByaWdodFxuXHRcdHRleHRQYWRkaW5nOiBcIjBcIlxuXHRcdHRleHRDb2xvcjogZGVmYXVsdHMudGludFxuXHRcblx0IyBWYWx1ZXMgZGVyaXZlZCBmcm9tIHBhcmFtc1xuXHRkcnVtQ29udGFpbmVySGVpZ2h0ID0gZGVmYXVsdHMudGFibGVSb3dIZWlnaHQqNVxuXG5cdCMgU2V0IHVwIGNvbnRlbnQgb2YgbGlzdCBcdFx0XG5cdGxpc3RJdGVtcyA9IGxpc3RJdGVtc1xuXHRAbmFtZSA9IGRydW1OYW1lXG5cdEBpbmRleCA9IDBcblx0QHZhbCA9IGxpc3RJdGVtc1tAaW5kZXhdXG5cdEB2ZWxvY2l0eSA9IDBcblx0Zmlyc3RUb3VjaEF2YWlsYWJsZSA9IHRydWUgICAgIyBpcyB0aGlzIHRoZSBmaXJzdCB0b3VjaCBpbiBhIGdpdmVuIGdlc3R1cmU/XG5cdFxuXHRpbnRlcnZhbFRvdXBkYXRlRHJ1bUFwcGVhcmFuY2UgPSAwXG5cdFxuXHQjIENhbGN1bGF0ZSBoZWlnaHQgYW5kIHZlcnRpY2FsIGJvdW5kcyBvZiB0aGUgbGlzdFxuXHRsaXN0TWluWVBvcyBcdD0gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0bGlzdE1heFlQb3MgXHQ9IC1saXN0SXRlbXMubGVuZ3RoKmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0K2RlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0bGlzdEhlaWdodCBcdFx0PSBsaXN0SXRlbXMubGVuZ3RoKmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICsgZHJ1bUNvbnRhaW5lckhlaWdodFxuXG5cdEBkcnVtQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdFx0XHRcdHBhcmFtcy54UGN0ICogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHR5OiBcdFx0XHRcdFx0MFxuXHRcdHdpZHRoOiBcdFx0XHRcdHBhcmFtcy53aWR0aFBjdCAqIGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBcdFx0XHRkcnVtQ29udGFpbmVySGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwibm9uZVwiXG5cdFx0c3VwZXJMYXllcjogXHRcdHBhcmVudERydW1MYXllclxuXHRcblx0bGlzdExheWVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdFx0XHRcdDBcblx0XHR5OiBcdFx0XHRcdFx0LWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0XHR3aWR0aDogXHRcdFx0XHRwYXJhbXMud2lkdGhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogXHRcdFx0bGlzdEhlaWdodFxuXHRcdHN1cGVyTGF5ZXI6IFx0XHRAZHJ1bUNvbnRhaW5lclxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIm5vbmVcIlxuXHRcblx0IyBsaXN0TGF5ZXIuc2Nyb2xsID0gdHJ1ZVxuXHRsaXN0TGF5ZXIuZHJhZ2dhYmxlLmVuYWJsZWQgPSBwYXJhbXMuZW5hYmxlZFxuXHRsaXN0TGF5ZXIuZHJhZ2dhYmxlLnNwZWVkWCA9IDBcblx0XG5cdGZvciBsaSwgaSBpbiBsaXN0SXRlbXNcblx0XHRsaXN0SXRlbUxheWVyID0gbmV3IExheWVyXG5cdFx0XHR4OiBcdFx0XHRcdDBcblx0XHRcdHk6IFx0XHRcdFx0aSAqIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICsgZHJ1bUNvbnRhaW5lckhlaWdodC8yXG5cdFx0XHR3aWR0aDogXHRcdFx0cGFyYW1zLndpZHRoUGN0ICogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRcdGhlaWdodDogXHRcdGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0XHRzdXBlckxheWVyOiBcdGxpc3RMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIm5vbmVcIiNVdGlscy5yYW5kb21Db2xvcigpXG5cdFx0bGlzdEl0ZW1MYXllci5odG1sID0gbGlcblx0XHRsaXN0SXRlbUxheWVyLnN0eWxlID1cblx0XHRcdGNvbG9yOiBcdFx0XHRwYXJhbXMudGV4dENvbG9yXG5cdFx0XHRmb250RmFtaWx5OiBcdGRlZmF1bHRzLnBpY2tlclRleHRTdHlsZS5mb250RmFtaWx5XG5cdFx0XHRmb250V2VpZ2h0OiBcdGRlZmF1bHRzLnBpY2tlclRleHRTdHlsZS5mb250V2VpZ2h0XG5cdFx0XHRmb250U2l6ZTogXHRcdGRlZmF1bHRzLnBpY2tlclRleHRTdHlsZS5mb250U2l6ZVxuXHRcdFx0bGluZUhlaWdodDogXHRkZWZhdWx0cy50YWJsZVJvd0hlaWdodCtcInB4XCJcblx0XHRcdHRleHRBbGlnbjogXHRcdHBhcmFtcy50ZXh0QWxpZ25cblx0XHRcdHBhZGRpbmc6IFx0XHRwYXJhbXMudGV4dFBhZGRpbmdcblxuXHRcdGxpc3RJdGVtTGF5ZXIuc3RhcnRZID0gaSAqIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICsgZHJ1bUNvbnRhaW5lckhlaWdodC8yXG5cblx0bGlzdExheWVyLm9uIEV2ZW50cy5EcmFnTW92ZSwgPT5cblx0XHRpZiBmaXJzdFRvdWNoQXZhaWxhYmxlXG5cdFx0XHRAZHJ1bUNvbnRhaW5lci5lbWl0KFwiRHJ1bVN0YXJ0ZWRNb3ZpbmdcIiwge2RydW06IGRydW1OYW1lLCBpbmRleDogQGluZGV4LCB2YWx1ZTogQHZhbCwgdmVsb2NpdHk6IDB9KVxuXHRcdFx0Zmlyc3RUb3VjaEF2YWlsYWJsZSA9IGZhbHNlXHRcdFxuXHRcdFx0XG5cdFx0dXBkYXRlRHJ1bUFwcGVhcmFuY2UoKVxuXHRcdFxuXHQjIFRvIHNpbXVsYXRlIGlPUyBtb21lbnR1bSBzY3JvbGxpbmcgKHdoaWNoIGNhdXNlcyB0aGUgZHJ1bSB0byBrZWVwIHNwaW5uaW5nIFxuXHQjIGFmdGVyIHlvdXIgZmluZ2VyIGxpZnRzIG9mZiBpdCksIHdlIHRyaWdnZXIgYW4gYW5pbWF0aW9uIHRoZSBtb21lbnQgeW91IGxpZnRcblx0IyB5b3VyIGZpbmdlci4gVGhlIGludGVuc2l0eSBvZiB0aGlzIGFuaW1hdGlvbiBpcyBwcm9wb3J0aW9uYWwgdG8gdGhlIHNwZWVkIHdoZW5cblx0IyBvZiB0aGUgZHJhZ2dpbmcgd2hlbiB5b3VyIGZpbmdlciB3YXMgbGlmdGVkLlxuXHRsaXN0TGF5ZXIub24gRXZlbnRzLkRyYWdFbmQsIChlLCBmKSA9PlxuXHRcdFxuXHRcdCMgTmV4dCB0b3VjaCBzaG91bGQgdHJpZ2dlciBEcnVtU3RhcnRlZE1vdmluZ1xuXHRcdGZpcnN0VG91Y2hBdmFpbGFibGUgPSB0cnVlXG5cdFxuXHRcdCMgVGhpcyBjYWxjdWxhdGVzIHRoZSBhbmltYXRpb25cblx0XHRzY3JvbGxWZWxvY2l0eSA9IGxpc3RMYXllci5kcmFnZ2FibGUuY2FsY3VsYXRlVmVsb2NpdHkoKS55XG5cdFx0dGltZUFmdGVyRHJhZyA9ICgwLjUrTWF0aC5hYnMoc2Nyb2xsVmVsb2NpdHkqMC4yKSkudG9GaXhlZCgxKVxuXHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gcXVhbnRpemUobGlzdExheWVyLnkgKyBzY3JvbGxWZWxvY2l0eSo0MDAsIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0KSArIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0XHRcblx0XHQjIEF0IHRoZSB0b3AgYW5kIGJvdHRvbSwgdGhlIG1vbWVudHVtIHNob3VsZCBiZSBhZGp1c3RlZCBzbyB0aGUgXG5cdFx0IyBmaXJzdCBhbmQgbGFzdCB2YWx1ZXMgb24gdGhlIGRydW0gZG9uJ3QgZ28gdG9vIGZhciBvdXQgb2Ygdmlld1xuXHRcdGRpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0bGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXIgPSAtbGlzdEl0ZW1zLmxlbmd0aCpkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGJvdHRvbU92ZXJmbG93ID0gTWF0aC5tYXgoMCwgbGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXItZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gKVxuXHRcdHRvcE92ZXJmbG93ID0gTWF0aC5tYXgoMCwgZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gKVxuXHRcdG92ZXJmbG93RGFtcGVuaW5nID0gMTBcblx0XHRcblx0XHRpZiBib3R0b21PdmVyZmxvdyA+IDBcblx0XHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gbGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXIgLSAoYm90dG9tT3ZlcmZsb3cgLyBvdmVyZmxvd0RhbXBlbmluZylcblx0XHRcdG5ld0Rpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0XHR0aW1lQWZ0ZXJEcmFnID0gdGltZUFmdGVyRHJhZyAqIChuZXdEaXN0YW5jZVRvVHJhdmVsL2Rpc3RhbmNlVG9UcmF2ZWwpXG5cblx0XHRpZiB0b3BPdmVyZmxvdyA+IDBcblx0XHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gNDAgKyAodG9wT3ZlcmZsb3cgLyBvdmVyZmxvd0RhbXBlbmluZylcblx0XHRcdG5ld0Rpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0XHR0aW1lQWZ0ZXJEcmFnID0gdGltZUFmdGVyRHJhZyAqIChuZXdEaXN0YW5jZVRvVHJhdmVsL2Rpc3RhbmNlVG9UcmF2ZWwpXG5cblx0XHQjIFRyaWdnZXIgdGhlIGFuaW1hdGlvbiwgYW5kIHNjaGVkdWxlIGFuIGV2ZW50IHRoYXQgd2lsbFxuXHRcdCMgdHJpZ2dlciB3aGVuIHRoZSBkcnVtIGZpbmFsbHkgc3RvcHMgc3Bpbm5pbmcuXG5cdFx0bGlzdExheWVyLmFuaW1hdGUoe1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eTogZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW19XG5cdFx0XHRcdHRpbWU6IHRpbWVBZnRlckRyYWdcblx0XHRcdFx0Y3VydmU6IFwiZWFzZS1vdXRcIlxuXHRcdFx0fSlcblx0XHRVdGlscy5kZWxheSB0aW1lQWZ0ZXJEcmFnLCAtPlxuXHRcdFx0c3RvcERydW0oKVxuXG5cdCMgVGhpcyBlbnN1cmVzIHRoYXQgZHVyaW5nIHRoZSBhbmltYXRpb24gb2YgdGhlIGxpc3QgbGF5ZXIsIHRoZSBkcnVtJ3MgYXBwZWFyYW5jZSBjb250aW51ZXNcblx0IyB0byBiZSB1cGRhdGVkLiBCZWNhdXNlIG11bHRpcGxlIGFuaW1hdGlvbnMgY291bGQgb3ZlcmxhcCwgd2UgZW5zdXJlIHRoYXQgZXZlcnkgbmV3IGFuaW1hdGlvblxuXHQjIGVuZHMgdGhlIGludGVydmFsIGFuZCBzdGFydHMgYSBuZXcgb25lIHNvIHRoYXQgd2UgbmV2ZXIgaGF2ZSBtb3JlIHRoYW4gb25lIHJ1bm5pbmcgXG5cdGxpc3RMYXllci5vbiBFdmVudHMuQW5pbWF0aW9uU3RhcnQsIC0+XG5cdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbFRvdXBkYXRlRHJ1bUFwcGVhcmFuY2UpXG5cdFx0aW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlID0gVXRpbHMuaW50ZXJ2YWwgMS8zMCwgdXBkYXRlRHJ1bUFwcGVhcmFuY2UgICAgXG5cblx0bGlzdExheWVyLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XHRcdFxuXHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlKVxuXG5cdFx0IyBFbWl0IGFmdGVyIGFsbCBtb3ZlbWVudCBlbmRzIGluIHRoZSBsaXN0XG5cdFx0QGRydW1Db250YWluZXIuZW1pdChcIkRydW1GaW5pc2hlZENoYW5naW5nXCIsIHtsaXN0OiBkcnVtTmFtZSwgaW5kZXg6IEBpbmRleCwgdmFsdWU6IEB2YWx9KVxuXG5cdHVwZGF0ZURydW1BcHBlYXJhbmNlID0gPT5cblx0XHRpdGVtc0luRHJ1bSA9IDRcblx0XHRsaXN0UG9zaXRpb24gPSBsaXN0TGF5ZXIueSAvIC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodCAtIDAuNVxuXHRcdGNhcHBlZExpc3RQb3NpdGlvbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKGxpc3RMYXllci55IC8gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0IC0gMC41LCBsaXN0SXRlbXMubGVuZ3RoIC0gMSkpXG5cdFx0Zm9jdXNJdGVtID0gTWF0aC5yb3VuZChjYXBwZWRMaXN0UG9zaXRpb24pXG5cdFx0ZGlzdGFuY2VGcm9tTWlkZGxlID0gTWF0aC5hYnMoZm9jdXNJdGVtIC0gY2FwcGVkTGlzdFBvc2l0aW9uKVxuXHRcdGZvciBpIGluIFsoZm9jdXNJdGVtLWl0ZW1zSW5EcnVtKS4uKGZvY3VzSXRlbStpdGVtc0luRHJ1bSldXG5cdFx0XHRpZiBpID49IDAgYW5kIGkgPCBsaXN0SXRlbXMubGVuZ3RoXG5cdFx0XHRcdGxpc3RMYXllci5zdWJMYXllcnNbaV0ub3BhY2l0eSA9IDEgLSBNYXRoLmFicyhsaXN0UG9zaXRpb24gLSBpKS81IC0gKGlmIChpICE9IGZvY3VzSXRlbSkgdGhlbiAwLjMgZWxzZSAwKVxuXHRcdFx0XHRsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnNjYWxlWSA9IDEgLSBNYXRoLm1pbigxLCBNYXRoLmFicyhsaXN0UG9zaXRpb24gLSBpKS80KVxuXHRcdFx0XHRsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnkgPSBsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnN0YXJ0WSAtIChpLWxpc3RQb3NpdGlvbikqTWF0aC5hYnMoaS1saXN0UG9zaXRpb24pKjEwXG5cblx0XHQjIFVwZGF0ZSB0aGUgdmFsdWUgb2YgdGhlIGRydW0gb25seSB3aGVuIGEgbmV3IHZhbHVlIGlzIHJlYWNoZWRcblx0XHRpZiAoQGluZGV4ICE9IGZvY3VzSXRlbSlcblx0XHRcdHVwZGF0ZURydW1WYWx1ZXMoZm9jdXNJdGVtKVxuXHRcdFxuXHRzdG9wRHJ1bSA9ID0+XHRcdFxuXHRcdCMgRW5zdXJlIHRoZSBkcnVtIG5ldmVyIGVuZHMgb3V0IG9mIGJvdW5kc1xuXHRcdGlmIGxpc3RMYXllci55ID4gbGlzdE1pbllQb3MgXG5cdFx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0ICAgIFx0cHJvcGVydGllczoge3k6bGlzdE1pbllQb3N9XG5cdFx0ICAgIFx0Y3VydmU6IFwic3ByaW5nKDQwMCw1MCwwKVwiXG5cdFx0XHR9KVxuXHRcdGlmIGxpc3RMYXllci55IDwgbGlzdE1heFlQb3Ncblx0XHRcdGxpc3RMYXllci5hbmltYXRlKHtcblx0XHRcdFx0cHJvcGVydGllczoge3k6IGxpc3RNYXhZUG9zfVxuXHRcdFx0XHRjdXJ2ZTogXCJzcHJpbmcoNDAwLDUwLDApXCJcblx0XHRcdH0pXG5cdFxuXHQjIFVwZGF0ZSB0aGUgdmFsdWVzIG9mIHRoZSBkcnVtcyBhbmQgaW52b2tlIHRoZSBjYWxsYmFjayBcblx0dXBkYXRlRHJ1bVZhbHVlcyA9IChuZXdJbmRleCkgPT5cblx0XHRAaW5kZXggPSBuZXdJbmRleFxuXHRcdEB2YWwgPSBsaXN0SXRlbXNbQGluZGV4XVxuXHRcdEBkcnVtQ29udGFpbmVyLmVtaXQoXCJEcnVtRGlkQ2hhbmdlXCIsIHtsaXN0OiBkcnVtTmFtZSwgaW5kZXg6IEBpbmRleCwgdmFsdWU6IEB2YWx9KVxuXHRcblx0IyBSZW5kZXIgZm9yIHRoZSBmaXJzdCB0aW1lXHRcdFxuXHR1cGRhdGVEcnVtQXBwZWFyYW5jZSgpXG5cdFxuXHRAc2V0SW5kZXggPSAoaW5kZXgpID0+XG5cdFx0eVBvc2l0aW9uRm9yVGhpc0luZGV4ID0gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzIgLSAoaW5kZXggKiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodClcblx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt5OiB5UG9zaXRpb25Gb3JUaGlzSW5kZXh9XG5cdFx0XHRcdHRpbWU6IDAuNVxuXHRcdFx0XHRjdXJ2ZTogXCJlYXNlLW91dFwiXG5cdFx0XHR9KVxuXG5cdEBzZXRWYWx1ZSA9ICh2YWwpID0+XG5cdFx0aW5kZXggPSBsaXN0SXRlbXMuaW5kZXhPZih2YWwpXG5cdFx0aWYgaW5kZXggIT0gLTFcblx0XHRcdEBzZXRJbmRleChpbmRleClcblxuXHQjIFJldHVybiB0aGUgZHJ1bSBvYmplY3Qgc28gd2UgY2FuIGFjY2VzcyBpdHMgdmFsdWVzXG5cdHJldHVybiBAXG5cblxuIyMjXG5cdFBJQ0tFUlxuXHRUaGlzIGNvbnRhaW5zIHRoZSBwaWNrZXIgXG4jIyMgXG5leHBvcnRzLlBpY2tlciA9IChwYXJhbXMpIC0+XG5cdFxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0MFxuXHRcdHdpZHRoOlx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRkZWZhdWx0VGV4dDogXCJcIlxuXHRcdHRleHRDb2xvcjogZGVmYXVsdHMudGludFxuXG5cdGRydW1Db250YWluZXJIZWlnaHQgPSBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCo1XG5cblx0QHBpY2tlckNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRwYXJhbXMueFxuXHRcdHk6XHRcdHBhcmFtcy55XG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0OiBkcnVtQ29udGFpbmVySGVpZ2h0Kzg4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdGRlZmF1bHRzLml0ZW1CYWNrZ3JvdW5kXG5cdFx0XHRcblx0QGRydW0gPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0MFxuXHRcdHk6IFx0XHQ4OFxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZHJ1bUNvbnRhaW5lckhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJub25lXCJcblx0XHRzdXBlckxheWVyOiBAcGlja2VyQ29udGFpbmVyXHRcdFxuXHRcdFxuXHRAc2VsZWN0ZWRJdGVtID0gbmV3IExheWVyXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0ZHJ1bUNvbnRhaW5lckhlaWdodC8yIC0gZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwibm9uZVwiXG5cdFx0c3VwZXJMYXllcjogQGRydW1cblxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTogXHRcdDBcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6XHQ4OFxuXHRcdGJhY2tncm91bmRDb2xvcjogZGVmYXVsdHMuaXRlbUJhY2tncm91bmRcblx0XHRzdXBlckxheWVyOiBAcGlja2VyQ29udGFpbmVyXG5cdFx0XG5cdCMgU3R5bGVzXG5cdEBkcnVtLnN0eWxlID1cblx0XHRwb2ludGVyRXZlbnRzOiBcIm5vbmVcIlxuXHRcdGJvcmRlclRvcDogXCIxcHggc29saWQgXCIgKyBkZWZhdWx0cy5saW5lVGludFxuXHRcdGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgXCIgKyBkZWZhdWx0cy5saW5lVGludFxuXHRcblx0QHNlbGVjdGVkSXRlbS5zdHlsZSA9XG5cdFx0cG9pbnRlckV2ZW50czogXCJub25lXCJcblx0XHRib3JkZXJUb3A6IFwiMXB4IHNvbGlkIHJnYmEoMCwwLDAsMC4zKVwiXG5cdFx0Ym9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDAsMCwwLDAuMylcIlxuXHRcdFxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlci5zdHlsZSA9IGRlZmF1bHRzLmxpc3RJdGVtVGV4dFN0eWxlXG5cdEBwaWNrZXJDb250YWluZXIucGlja2VySGVhZGVyLnN0eWxlID0gXG5cdFx0Y29sb3I6IHBhcmFtcy50ZXh0Q29sb3Jcblx0XHRwYWRkaW5nTGVmdDogXCIyMHB4XCJcblx0XHRib3JkZXJUb3A6IFwiMXB4IHNvbGlkIFwiICsgZGVmYXVsdHMubGluZVRpbnRcblx0XHRcdFxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlci5odG1sID0gcGFyYW1zLmRlZmF1bHRUZXh0XG5cdFx0XG5cdFx0XG5cdCMgQWRkIGRydW1zXG5cdEBwaWNrZXJDb250YWluZXIuZHJ1bXMgPSBbXVxuXHRAcGlja2VyQ29udGFpbmVyLmRydW1zQnlOYW1lID0ge31cblx0XG5cdHBpY2tlclN0YXJ0ZWRNb3ZpbmcgPSAoKT0+XG5cdFx0ZHJ1bVZhbHVlcyA9IHt9XG5cdFx0bmV3VmFsdWVzID0gZm9yIGRydW0gaW4gQHBpY2tlckNvbnRhaW5lci5kcnVtc1xuXHRcdFx0ZHJ1bVZhbHVlc1tkcnVtLm5hbWVdID0ge2luZGV4OiBkcnVtLmluZGV4LCB2YWw6IGRydW0udmFsLCB2ZWxvY2l0eTogMH1cdFxuXHRcdEBwaWNrZXJDb250YWluZXIuZW1pdChcIlBpY2tlclN0YXJ0ZWRNb3ZpbmdcIiApXG5cdFx0XG5cdHBpY2tlckRpZENoYW5nZSA9ICgpPT5cblx0XHRkcnVtVmFsdWVzID0ge31cblx0XHRuZXdWYWx1ZXMgPSBmb3IgZHJ1bSBpbiBAcGlja2VyQ29udGFpbmVyLmRydW1zXG5cdFx0XHRkcnVtVmFsdWVzW2RydW0ubmFtZV0gPSB7aW5kZXg6IGRydW0uaW5kZXgsIHZhbDogZHJ1bS52YWx9XG5cblx0XHRAcGlja2VyQ29udGFpbmVyLmVtaXQoXCJQaWNrZXJEaWRDaGFuZ2VcIiwgZHJ1bVZhbHVlcyApXG5cdFxuXHRwaWNrZXJGaW5pc2hlZENoYW5naW5nID0gKCk9PlxuXHRcdGRydW1WYWx1ZXMgPSB7fVxuXHRcdG5ld1ZhbHVlcyA9IGZvciBkcnVtIGluIEBwaWNrZXJDb250YWluZXIuZHJ1bXNcblx0XHRcdGRydW1WYWx1ZXNbZHJ1bS5uYW1lXSA9IHtpbmRleDogZHJ1bS5pbmRleCwgdmFsOiBkcnVtLnZhbH1cblxuXHRcdEBwaWNrZXJDb250YWluZXIuZW1pdChcIlBpY2tlckZpbmlzaGVkQ2hhbmdpbmdcIiwgZHJ1bVZhbHVlcyApXHRcblx0aWYgKHBhcmFtcy5kcnVtcyBhbmQgcGFyYW1zLmRydW1zLmxlbmd0aCA+IDApXG5cdFx0Zm9yIGRydW0gaW4gcGFyYW1zLmRydW1zXG5cdFx0XHRuZXdEcnVtID0gbmV3IERydW0oQGRydW0sIGRydW0ubmFtZSwgZHJ1bS5pdGVtcywgZHJ1bS5wYXJhbXMpXG5cblx0XHRcdCMjIFN0b3JlIGRydW1zIGluc2lkZSB0aGUgcGlja2VyXG5cdFx0XHRAcGlja2VyQ29udGFpbmVyLmRydW1zLnB1c2gobmV3RHJ1bSlcblx0XHRcdEBwaWNrZXJDb250YWluZXIuZHJ1bXNCeU5hbWVbZHJ1bS5uYW1lXSA9IG5ld0RydW0gXG5cblx0XHRcdCMjIEVuc3VyZSB0aGF0IGNoYW5nZXMgdG8gdGhlIGRydW0gYnViYmxlIHVwIHRvIHRoZSBwaWNrZXJcblx0XHRcdG5ld0RydW0uZHJ1bUNvbnRhaW5lci5vbiBcIkRydW1EaWRDaGFuZ2VcIiwgcGlja2VyRGlkQ2hhbmdlXG5cdFx0XHRcblx0XHRcdCMjIEVtaXQgYW4gZXZlbnQgd2hlbiBkcnVtcyBzdG9wIG1vdmluZyBhbHRvZ2V0aGVyXG5cdFx0XHRuZXdEcnVtLmRydW1Db250YWluZXIub24gXCJEcnVtRmluaXNoZWRDaGFuZ2luZ1wiLCBwaWNrZXJGaW5pc2hlZENoYW5naW5nXG5cblx0XHRcdCMjIEVtaXQgYW4gZXZlbnQgd2hlbiBsaXN0cyBzdG9wIG1vdmluZyBhbHRvZ2V0aGVyXG5cdFx0XHRuZXdEcnVtLmRydW1Db250YWluZXIub24gXCJEcnVtU3RhcnRlZE1vdmluZ1wiLCBwaWNrZXJTdGFydGVkTW92aW5nXG5cblxuXHRyZXR1cm4gQHBpY2tlckNvbnRhaW5lclxuIl19
