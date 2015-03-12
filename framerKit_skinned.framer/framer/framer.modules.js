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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcmFwaGRhbWljby9Eb2N1bWVudHMvR2l0L2ZyYW1lcktpdC9mcmFtZXJLaXRfc2tpbm5lZC5mcmFtZXIvbW9kdWxlcy9mcmFtZXJLaXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFBQTs7Ozs7Ozs7Ozs7O0dBQUE7QUFpQkE7QUFBQTs7Ozs7R0FqQkE7QUFBQSxJQUFBLHFEQUFBOztBQUFBLFFBdUJBLEdBQVc7QUFBQSxFQUNWLFdBQUEsRUFBYSxHQURIO0NBdkJYLENBQUE7O0FBMkJBO0FBQUE7O0dBM0JBOztBQUFBLFFBOEJRLENBQUMsY0FBVCxHQUEwQixFQTlCMUIsQ0FBQTs7QUFBQSxRQStCUSxDQUFDLHlCQUFULEdBQXFDLEVBL0JyQyxDQUFBOztBQUFBLFFBZ0NRLENBQUMsSUFBVCxHQUFnQixNQWhDaEIsQ0FBQTs7QUFBQSxRQWlDUSxDQUFDLFFBQVQsR0FBb0IscUJBakNwQixDQUFBOztBQUFBLFFBa0NRLENBQUMsVUFBVCxHQUFzQixTQWxDdEIsQ0FBQTs7QUFBQSxRQW1DUSxDQUFDLGNBQVQsR0FBMEIsT0FuQzFCLENBQUE7O0FBQUEsUUFvQ1EsQ0FBQyxpQkFBVCxHQUE2QjtBQUFBLEVBQzVCLFFBQUEsRUFBVSxNQURrQjtBQUFBLEVBRTVCLFVBQUEsRUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFULEdBQXdCLENBQXpCLENBQUEsR0FBNEIsSUFGWjtBQUFBLEVBRzVCLFVBQUEsRUFBWSxnQkFIZ0I7QUFBQSxFQUk1QixVQUFBLEVBQVksS0FKZ0I7Q0FwQzdCLENBQUE7O0FBQUEsUUEwQ1EsQ0FBQyxvQkFBVCxHQUFnQztBQUFBLEVBQy9CLFFBQUEsRUFBVSxNQURxQjtBQUFBLEVBRS9CLFVBQUEsRUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFULEdBQXdCLENBQXpCLENBQUEsR0FBNEIs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QTtBQW9GQSxFQUFBLElBQUksTUFBTSxDQUFDLEtBQVAsSUFBaUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFiLEdBQXNCLENBQTNDO0FBQ0M7QUFBQSxTQUFBLHFDQUFBO29CQUFBO0FBQ0MsTUFBQSxPQUFBLEdBQWMsSUFBQSxJQUFBLENBQUssSUFBQyxDQUFBLElBQU4sRUFBWSxJQUFJLENBQUMsSUFBakIsRUFBdUIsSUFBSSxDQUFDLEtBQTVCLEVBQW1DLElBQUksQ0FBQyxNQUF4QyxDQUFkLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxlQUFlLENBQUMsS0FBSyxDQUFDLElBQXZCLENBQTRCLE9BQTVCLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGVBQWUsQ0FBQyxXQUFZLENBQUEsSUFBSSxDQUFDLElBQUwsQ0FBN0IsR0FBMEMsT0FKMUMsQ0FBQTtBQUFBLE1BT0EsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUF0QixDQUF5QixlQUF6QixFQUEwQyxlQUExQyxDQVBBLENBQUE7QUFBQSxNQVVBLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBdEIsQ0FBeUIsc0JBQXpCLEVBQWlELHNCQUFqRCxDQVZBLENBQUE7QUFBQSxNQWFBLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBdEIsQ0FBeUIsbUJBQXpCLEVBQThDLG1CQUE5QyxDQWJBLENBREQ7QUFBQSxLQUREO0dBcEZBO0FBc0dBLFNBQU8sSUFBQyxDQUFBLGVBQVIsQ0F4R2dCO0FBQUEsQ0FyckJqQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMjI1xuICBGcmFtZXJLaXQgZm9yIEZyYW1lclxuICBodHRwczovL2dpdGh1Yi5jb20vcmFwaGRhbWljby9mcmFtZXJLaXRcblxuICBDb3B5cmlnaHQgKGMpIDIwMTUsIFJhcGggRCdBbWljbyBodHRwOi8vcmFwaGRhbWljby5jb20gKEByYXBoZGFtaWNvKVxuICBNSVQgTGljZW5zZVxuXG4gIFJlYWRtZTpcbiAgaHR0cHM6Ly9naXRodWIuY29tL3JhcGhkYW1pY28vZnJhbWVyS2l0XG5cbiAgTGljZW5zZTpcbiAgaHR0cHM6Ly9naXRodWIuY29tL3JhcGhkYW1pY28vZnJhbWVyS2l0L2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiMjI1xuXG5cblxuXG4jIyNcblx0REVGQVVMVCBTVFlMRVNcblx0Tm90ZSB0aGUgc2NyZWVud2lkdGggY29uc3RhbnQ6IHRoaXMgaXMgcHJvYmFibHkgb25lIG9mIHRoZVxuXHRmaXJzdCB0aGluZ3MgeW91IHdhbnQgdG8gY2hhbmdlIHNvIGl0IG1hdGNoZXMgdGhlIGRldmljZVxuXHR5b3UncmUgcHJvdG90eXBpbmcgb24uXG4jIyNcbmRlZmF1bHRzID0ge1xuXHRzY3JlZW5XaWR0aDogNzUwXG59XG5cbiMjI1xuXHRNT1JFIFNUWUxFU1xuIyMjXG5kZWZhdWx0cy50YWJsZVJvd0hlaWdodCA9IDg4XG5kZWZhdWx0cy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nID0gMjBcbmRlZmF1bHRzLnRpbnQgPSAnZ3JleSdcbmRlZmF1bHRzLmxpbmVUaW50ID0gXCJyZ2JhKDIwMCwyMDAsMjAwLDEpXCJcbmRlZmF1bHRzLnN3aXRjaFRpbnQgPSAnIzFEQzI0QidcbmRlZmF1bHRzLml0ZW1CYWNrZ3JvdW5kID0gJ3doaXRlJ1xuZGVmYXVsdHMubGlzdEl0ZW1UZXh0U3R5bGUgPSB7XG5cdGZvbnRTaXplOiBcIjMycHhcIlxuXHRsaW5lSGVpZ2h0OiAoZGVmYXVsdHMudGFibGVSb3dIZWlnaHQtNCkrXCJweFwiXHRcdFxuXHRmb250RmFtaWx5OiBcIkhlbHZldGljYSBOZXVlXCJcblx0Zm9udFdlaWdodDogXCIyMDBcIlxufVxuZGVmYXVsdHMuZGl2aWRlckl0ZW1UZXh0U3R5bGUgPSB7XG5cdGZvbnRTaXplOiBcIjIycHhcIlxuXHRsaW5lSGVpZ2h0OiAoZGVmYXVsdHMudGFibGVSb3dIZWlnaHQtNCkrXCJweFwiXHRcdFxuXHRmb250RmFtaWx5OiBcIkhlbHZldGljYSBOZXVlXCJcblx0Zm9udFdlaWdodDogXCIyMDBcIlxuXHR0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJ1xufVxuZGVmYXVsdHMucGlja2VyVGV4dFN0eWxlID0ge1xuXHRmb250U2l6ZTogXHRcdFwiNDJweFwiXG5cdGZvbnRGYW1pbHk6IFx0XCJIZWx2ZXRpY2EgTmV1ZVwiXG5cdGZvbnRXZWlnaHQ6IFx0XCIyMDBcIlxufVxuZXhwb3J0cy5kZWZhdWx0cyA9IGRlZmF1bHRzXG5cblxuIyMjXG5cdFRBQkxFIFZJRVcgRUxFTUVOVFNcblx0KGUuZy4gXCJUaHVtYlwiIGZvciB0aGUgc3dpdGNoIGNvbnRyb2wpXG4jIyNcblxuU3dpdGNoID0gKHBhcmFtcykgLT5cblx0cGFyYW1zID0gcGFyYW1zIG9yIHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLCBcblx0XHRzd2l0Y2hUaW50OiBkZWZhdWx0cy5zd2l0Y2hUaW50XG5cdFx0c2NyZWVuV2lkdGg6IGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0dGFibGVSb3dIZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0c3dpdGNoQ29udGFpbmVyQm9yZGVyOiA0XG5cdFx0c3dpdGNoQ29udGFpbmVySGVpZ2h0OiA1NFxuXHRcdHN3aXRjaENvbnRhaW5lcldpZHRoOiA5NFxuXHRcdGJvcmRlckNvbG9yOiBkZWZhdWx0cy5saW5lVGludCAjIEdyZXkgcm91bmRlZCBwaWxsICYgYm9yZGVycyBiZXR3ZWVuIGNlbGxzXG5cblx0QHNlbGVjdGVkID0gdHJ1ZVxuXHRcblx0IyBTb21lIG9mIHRoZSB2YWx1ZXMgYXJlIGJhc2VkIG9uIG90aGVyIGNvbnN0YW50cyxcblx0IyBzbyB5b3UgaGF2ZSB0byBjYWxjdWxhdGUgdGhlbSBpbiBhIHNlY29uZCBwYXNzXG5cdHN3aXRjaEJ1dHRvblJhZGl1cyA9IHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQvMlxuXHRzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlciA9IDJcblx0XG5cdCMgVGhpcyBpcyBvdXIgZmFuY3kgYW5pbWF0ZWQgc3dpdGNoIHN3aXRjaFxuXHQjIHdlIG5lZWQgdG8gbWFrZSBhIHJvdW5kZWQgcmVjdGFuZ2xlIHdpdGggYSBjaXJjbGUgaW5zaWRlIGl0LlxuXHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdFx0XHRcdDBcblx0XHR5OiBcdFx0XHRcdFx0MFxuXHRcdGNsaXA6IFx0XHRcdFx0ZmFsc2UgIyBDbGlwcGluZyBodXJ0cyB0aGUgc3VidGxlIHNoYWRvdyBvbiB0aGUgYnV0dG9uXG5cdFx0d2lkdGg6XHRcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVyV2lkdGggXG5cdFx0aGVpZ2h0Olx0XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIlwiXG5cdFx0b3BhY2l0eTogXHRcdFx0MVxuXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kID0gbmV3IExheWVyXG5cdFx0eDpcdFx0XHRcdFx0c3dpdGNoQnV0dG9uUmFkaXVzIC0gc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIvMlxuXHRcdHk6XHRcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyAtIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyLzIgLSA0XG5cdFx0d2lkdGg6IFx0XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoIC0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodCArIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyXG5cdFx0aGVpZ2h0OiBcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0IC0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodCArIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyXG5cdFx0Ym9yZGVyUmFkaXVzOiBcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdHNoYWRvd1NwcmVhZDpcdFx0c3dpdGNoQnV0dG9uUmFkaXVzIC0gc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIvMiArIHBhcmFtcy5zd2l0Y2hDb250YWluZXJCb3JkZXJcblx0XHRzaGFkb3dDb2xvcjogXHRcdHBhcmFtcy5zd2l0Y2hUaW50XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdCcnXG5cdFx0b3BhY2l0eTogXHRcdFx0MVxuXHRcdHN1cGVyTGF5ZXI6IFx0XHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyXG5cdFx0XG5cdEBzd2l0Y2hCdXR0b24gPSBuZXcgTGF5ZXJcblx0XHR4OiBwYXJhbXMuc3dpdGNoQ29udGFpbmVyV2lkdGggLSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0XG5cdFx0eTogLTRcblx0XHR3aWR0aDpcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyoyXG5cdFx0aGVpZ2h0Olx0XHRcdFx0c3dpdGNoQnV0dG9uUmFkaXVzKjJcblx0XHRib3JkZXJSYWRpdXM6IFx0XHRzd2l0Y2hCdXR0b25SYWRpdXNcblx0XHRzaGFkb3dZOlx0XHRcdDNcblx0XHRzaGFkb3dCbHVyOiBcdFx0NVxuXHRcdHNoYWRvd0NvbG9yOiBcdFx0J3JnYmEoMCwwLDAsMC4zKSdcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJ3aGl0ZVwiXG5cdFx0b3BhY2l0eTogXHRcdFx0MVxuXHRcdHN1cGVyTGF5ZXI6IFx0XHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyXG5cdFxuXHQjIFNFVCBVUCBBTklNQVRJT05TXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5hZGRcblx0XHRkZXNlbGVjdGVkOiBcblx0XHRcdHg6IFx0XHRcdFx0MFxuXHRcdFx0eTogXHRcdFx0XHQtNFxuXHRcdFx0d2lkdGg6XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoXG5cdFx0XHRoZWlnaHQ6XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdFx0c2hhZG93U3ByZWFkOiBcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJCb3JkZXJcblx0XHRcdHNhdHVyYXRlOiBcdFx0MFxuXHRcdFx0YnJpZ2h0bmVzczogXHQxNTNcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9XG5cdFx0Y3VydmU6IFwiZWFzZS1pbi1vdXRcIlxuXHRcdHRpbWU6IDAuMyBcblx0QHN3aXRjaEJhY2tncm91bmQub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cblx0XHRVdGlscy5kZWxheSAwLCA9PlxuXHQgXHRcdGlmIEBzZWxlY3RlZFxuIFx0XHRcdFx0QHN3aXRjaEJhY2tncm91bmQuYmFja2dyb3VuZENvbG9yID0gcGFyYW1zLnN3aXRjaFRpbnRcblxuXHRAc3dpdGNoQmFja2dyb3VuZC5vbiBFdmVudHMuQW5pbWF0aW9uU3RhcnQsID0+XG5cdFx0QHN3aXRjaEJhY2tncm91bmQuYmFja2dyb3VuZENvbG9yID0gJydcblxuXHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5hZGRcblx0XHRkZXNlbGVjdGVkOiB7eDogMH1cblx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9XG5cdFx0Y3VydmU6IFwic3ByaW5nKDQwMCwyNSwwKVwiXG5cdFx0XG5cdEBzd2l0Y2hCdXR0b25Db250YWluZXIuc2VsZWN0ID0gPT5cblx0XHRAc2VsZWN0ZWQgPSB0cnVlXG5cdFx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLnN3aXRjaChcImRlZmF1bHRcIilcblx0XHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5zd2l0Y2goXCJkZWZhdWx0XCIpXG5cdFx0XG5cdEBzd2l0Y2hCdXR0b25Db250YWluZXIuZGVzZWxlY3QgPSA9PlxuXHRcdEBzZWxlY3RlZCA9IGZhbHNlXG5cdFx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLnN3aXRjaChcImRlc2VsZWN0ZWRcIilcblx0XHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5zd2l0Y2goXCJkZXNlbGVjdGVkXCIpXG5cblx0aWYgQHNlbGVjdGVkID09IGZhbHNlXG5cdFx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLnN3aXRjaEluc3RhbnQoXCJkZXNlbGVjdGVkXCIpXG5cdFx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuc3dpdGNoSW5zdGFudChcImRlc2VsZWN0ZWRcIilcblx0ZWxzZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLmJhY2tncm91bmRDb2xvciA9IHBhcmFtcy5zd2l0Y2hUaW50XG5cblx0cmV0dXJuIEBzd2l0Y2hCdXR0b25Db250YWluZXJcblx0XG5Dcm9zcyA9IC0+XG5cdGNvbG9yID0gZGVmYXVsdHMudGludFxuXHRjcm9zc1RoaWNrbmVzcyA9IDRcblx0Y3Jvc3MgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogMzBcdFxuXHRcdGhlaWdodDogMzBcdFxuXHRcdGJhY2tncm91bmRDb2xvcjogJ25vbmUnXG5cdGNyb3NzVXBzdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNyb3NzVGhpY2tuZXNzXG5cdFx0d2lkdGg6IDIwXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdG9yaWdpblg6IDFcblx0XHRzdXBlckxheWVyOiBjcm9zc1xuXHRjcm9zc1Vwc3Ryb2tlLnkgPSAxNFxuXHRjcm9zc1Vwc3Ryb2tlLnJvdGF0aW9uWiA9IDQ1XG5cdGNyb3NzRG93bnN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY3Jvc3NUaGlja25lc3Ncblx0XHR3aWR0aDogMjBcblx0XHRvcmlnaW5YOiAxXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdHN1cGVyTGF5ZXI6IGNyb3NzXG5cdGNyb3NzRG93bnN0cm9rZS5yb3RhdGlvblogPSAtNDVcblx0Y3Jvc3Muc2VsZWN0ID0gLT5cblx0XHRjcm9zcy5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXG5cdGNyb3NzLmRlc2VsZWN0ID0gLT5cblx0XHRjcm9zcy5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHNjYWxlOiAwLjRcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcdFx0XG5cdHJldHVybiBjcm9zc1xuXHRcbkNhcmV0ID0gLT5cblx0Y29sb3IgPSBkZWZhdWx0cy50aW50XG5cdGNhcmV0VGhpY2tuZXNzID0gNFxuXHRjYXJldCA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiAzMFxuXHRcdGhlaWdodDogMzBcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1x0XHRcblx0Y2FyZXRVcHN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2FyZXRUaGlja25lc3Ncblx0XHR3aWR0aDogMThcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0b3JpZ2luWDogMVxuXHRcdHN1cGVyTGF5ZXI6IGNhcmV0XG5cdGNhcmV0VXBzdHJva2UueSA9IDE0XG5cdGNhcmV0VXBzdHJva2Uucm90YXRpb25aID0gNDVcblx0Y2FyZXREb3duc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjYXJldFRoaWNrbmVzc1xuXHRcdHdpZHRoOiAxOFxuXHRcdG9yaWdpblg6IDFcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0c3VwZXJMYXllcjogY2FyZXRcblx0Y2FyZXREb3duc3Ryb2tlLnkgPSAxMlx0XHRcblx0Y2FyZXREb3duc3Ryb2tlLnJvdGF0aW9uWiA9IC00NVxuXHRjYXJldC5zZWxlY3QgPSAtPlxuXHRcdGNhcmV0LmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcblx0Y2FyZXQuZGVzZWxlY3QgPSAtPlxuXHRcdGNhcmV0LmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0c2NhbGU6IDAuNFxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1x0XG5cdHJldHVybiBjYXJldFxuXHRcbkNoZWNrID0gLT5cblx0Y29sb3IgPSBkZWZhdWx0cy50aW50XG5cdGNoZWNrVGhpY2tuZXNzID0gNFxuXHRjaGVjayA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiAzMFxuXHRcdGhlaWdodDogMzBcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuXHRjaGVja1Vwc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjaGVja1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAxM1xuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRvcmlnaW5YOiAxXG5cdFx0c3VwZXJMYXllcjogY2hlY2tcblx0Y2hlY2tVcHN0cm9rZS55ID0gMTZcblx0Y2hlY2tVcHN0cm9rZS5yb3RhdGlvblogPSA0NVxuXHRjaGVja0Rvd25zdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNoZWNrVGhpY2tuZXNzXG5cdFx0d2lkdGg6IDIyXG5cdFx0b3JpZ2luWDogMVxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRzdXBlckxheWVyOiBjaGVja1x0XG5cdGNoZWNrRG93bnN0cm9rZS54ID0gNFxuXHRjaGVja0Rvd25zdHJva2Uucm90YXRpb25aID0gLTQ1XG5cdGNoZWNrLnNlbGVjdCA9IC0+XG5cdFx0Y2hlY2suYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRjaGVjay5kZXNlbGVjdCA9IC0+XG5cdFx0Y2hlY2suYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRzY2FsZTogMC40XG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXG5cdHJldHVybiBjaGVja1xuXG5cbiMjI1xuXHRUQUJMRSBWSUVXXG5cdFxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRUYWJsZVZpZXdSb3dcdFx0W0VsZW1lbnRzIGdvIGhlcmVdXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiMjI1xuXG5leHBvcnRzLlRhYmxlVmlld1JvdyA9IChwYXJhbXMpIC0+XG5cdFxuXHQjIFRoZSB0cmlja3kgdGhpbmcgYWJvdXQgcmV1c2FibGUgY29tcG9uZW50cyBpcyByZW1lbWJlcmluZ1xuXHQjIGhvdyB0byB1c2UgdGhlbSAocGFydGljdWxhcmx5IGlmIHRoZXkgaGF2ZSBsb3RzIG9mIGN1c3RvbWl6YWJsZVxuXHQjIHBhcmFtZXRlcnMpLiBTZXR0aW5nIHNlbnNpYmxlIGRlZmF1bHRzIG1ha2VzIGl0IHdheSBlYXNpZXIgdG8gZ2V0XG5cdCMgc3RhcnRlZCAoYW5kIHJlbWVtYmVyIGhvdyB0byB1c2UgdGhlIHRoaW5nIHlvdSBtYWRlKVxuXHRfLmRlZmF1bHRzIHBhcmFtcywgXG5cdFx0bmFtZTogJ0dpdmUgbWUgYSBuYW1lISdcblx0XHR4OiAwXG5cdFx0eTogMFxuXHRcdGVuYWJsZWQ6IHRydWVcblx0XHRzZWxlY3RlZDogdHJ1ZVxuXHRcdGljb246ICdjaGVjaydcblx0XHR0ZXh0Q29sb3I6IGRlZmF1bHRzLnRpbnRcblx0XHRzd2l0Y2hUaW50OiBkZWZhdWx0cy5zd2l0Y2hUaW50XG5cdFx0Zmlyc3RJdGVtSW5MaXN0OiB0cnVlICMgY291bGQgYmUgZmlyc3Qgb3IgbGFzdFxuXHRcdGxhc3RJdGVtSW5MaXN0OiB0cnVlICMgY291bGQgYmUgZmlyc3Qgb3IgbGFzdFxuXHRcdFxuXHRcdCMgQ29uc3RhbnRzXG5cdFx0c2NyZWVuV2lkdGg6IGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0dGFibGVSb3dIb3Jpem9udGFsUGFkZGluZzogZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZ1xuXHRcdHRhYmxlUm93SGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGJvcmRlckNvbG9yOiBkZWZhdWx0cy5saW5lVGludCAjIEdyZXkgcm91bmRlZCBwaWxsICYgYm9yZGVycyBiZXR3ZWVuIGNlbGxzXG5cblx0IyBTb21lIG9mIHRoZSB2YWx1ZXMgYXJlIGJhc2VkIG9uIG90aGVyIGNvbnN0YW50cyxcblx0IyBzbyB5b3UgaGF2ZSB0byBjYWxjdWxhdGUgdGhlbSBpbiBhIHNlY29uZCBwYXNzXG5cdHN3aXRjaEJ1dHRvblJhZGl1cyA9IHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQvMlxuXHRzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlciA9IDJcblx0XHRcblx0IyBUaGlzIGlzIHRoZSByb290IG9iamVjdCBmb3IgdGhpcyBlbnRpcmUgY29tcG9uZW50LlxuXHQjIFdlIHdpbGwgYXR0YWNoIGFsbCBvdXIgZnVuY3Rpb25zIGRpcmVjdGx5IHRvIHRoaXMgbGF5ZXJcblx0QGxpc3RJdGVtQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogcGFyYW1zLnhcblx0XHR5OiBwYXJhbXMueVxuXHRcdHdpZHRoOiBcdGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGNsaXA6IGZhbHNlXG5cdFx0YmFja2dyb3VuZENvbG9yOiBkZWZhdWx0cy5pdGVtQmFja2dyb3VuZFxuXHRAbGlzdEl0ZW1Db250YWluZXIuc3R5bGUgPSBcblx0XHRib3JkZXJUb3A6IFx0XHRpZiBwYXJhbXMuZmlyc3RJdGVtSW5MaXN0IHRoZW4gXCIxcHggc29saWQgXCIgKyBwYXJhbXMuYm9yZGVyQ29sb3IgZWxzZSBcIlwiXG5cdFx0Ym9yZGVyQm90dG9tOiBcdGlmIHBhcmFtcy5sYXN0SXRlbUluTGlzdCB0aGVuIFwiMXB4IHNvbGlkIFwiICsgcGFyYW1zLmJvcmRlckNvbG9yIGVsc2UgXCJcIlxuXG5cdCMgVGhlc2Ugd2lsbCBiZSBhY2Nlc3NlZCB1c2luZyBmdW5jdGlvbnNcblx0QGVuYWJsZWQgPSBwYXJhbXMuZW5hYmxlZFxuXHRAc2VsZWN0ZWQgPSBwYXJhbXMuc2VsZWN0ZWRcblx0XG5cdEBsaXN0SXRlbSA9IG5ldyBMYXllciBcblx0XHR4OiBwYXJhbXMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZ1xuXHRcdHdpZHRoOiBcdGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdHN1cGVyTGF5ZXI6IEBsaXN0SXRlbUNvbnRhaW5lclxuXHRcdGJhY2tncm91bmRDb2xvcjogJ25vbmUnXHRcblx0QGxpc3RJdGVtLnN0eWxlID0gZGVmYXVsdHMubGlzdEl0ZW1UZXh0U3R5bGVcblx0QGxpc3RJdGVtLnN0eWxlID1cblx0XHRjb2xvcjogcGFyYW1zLnRleHRDb2xvclxuXHRcdGJvcmRlclRvcDogXHRpZiBwYXJhbXMuZmlyc3RJdGVtSW5MaXN0IHRoZW4gXCJcIiBlbHNlIFwiMXB4IHNvbGlkIFwiICsgcGFyYW1zLmJvcmRlckNvbG9yXG5cblx0IyBUaGlzIGlzIHdoZXJlIHRoZSBsYWJlbCBvZiB0aGUgbGlzdCBpdGVtIGxpdmVzXG5cdEBsaXN0SXRlbS5odG1sID0gcGFyYW1zLm5hbWUgXG5cblx0IyBBZGQgdGhlIGNoZWNrbWFyayBmb3IgdGhlIGxpc3Rcblx0dGhpbmdUb1N3aXRjaCA9IHN3aXRjaFxuXHRcdHdoZW4gcGFyYW1zLmljb24gPT0gJ2NoZWNrJyB0aGVuIG5ldyBDaGVjaygpXG5cdFx0d2hlbiBwYXJhbXMuaWNvbiA9PSAnY3Jvc3MnIHRoZW4gbmV3IENyb3NzKClcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdjYXJldCcgdGhlbiBuZXcgQ2FyZXQoKVxuXHRcdHdoZW4gcGFyYW1zLmljb24gPT0gJ3N3aXRjaCcgdGhlbiBuZXcgU3dpdGNoKClcblxuXHR0aGluZ1RvU3dpdGNoLnN1cGVyTGF5ZXIgPSBAbGlzdEl0ZW1Db250YWluZXJcblx0dGhpbmdUb1N3aXRjaC54ID0gZGVmYXVsdHMuc2NyZWVuV2lkdGggLSB0aGluZ1RvU3dpdGNoLndpZHRoIC0gZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZ1xuXHR0aGluZ1RvU3dpdGNoLmNlbnRlclkoMilcbiMgXHR0aGluZ1RvU3dpdGNoLnkgPSAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMiAtIHRoaW5nVG9Td2l0Y2guaGVpZ2h0LzJcblx0XG5cdCMgTUFLRSBJVCBBTEwgSU5URVJBQ1RJVkVcblx0IyBPbiBhIGNsaWNrLCBnbyB0byB0aGUgbmV4dCBzdGF0ZVxuXHRpZiBwYXJhbXMuaWNvbiA9PSAnc3dpdGNoJ1xuXHRcdHRoaW5nVG9Td2l0Y2gub24gRXZlbnRzLkNsaWNrLCA9PlxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLnN3aXRjaCgpXG5cdGVsc2UgXG5cdFx0QGxpc3RJdGVtLm9uIEV2ZW50cy5DbGljaywgPT5cblx0XHRcdEBsaXN0SXRlbUNvbnRhaW5lci5zd2l0Y2goKVxuXG5cdEBsaXN0SXRlbUNvbnRhaW5lci5zd2l0Y2ggPSA9PlxuXHRcdGlmIEBzZWxlY3RlZCB0aGVuIEBsaXN0SXRlbUNvbnRhaW5lci5kZXNlbGVjdCgpIGVsc2UgQGxpc3RJdGVtQ29udGFpbmVyLnNlbGVjdCgpXG5cdFx0XG5cdEBsaXN0SXRlbUNvbnRhaW5lci5zZWxlY3QgPSAob3B0aW9ucykgPT5cblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7c3VwcmVzc0V2ZW50czogZmFsc2V9XG5cdFx0aWYgQGVuYWJsZWQgXG5cdFx0XHR0aGluZ1RvU3dpdGNoLnNlbGVjdCgpXG5cdFx0XHRAc2VsZWN0ZWQgPSB0cnVlXG5cdFx0aWYgb3B0aW9ucy5zdXByZXNzRXZlbnRzID09IGZhbHNlXG5cdFx0XHRAbGlzdEl0ZW1Db250YWluZXIuZW1pdCBcIkRpZENoYW5nZVwiLCB7IHNlbGVjdGVkOiBAc2VsZWN0ZWQgfVxuXG5cdEBsaXN0SXRlbUNvbnRhaW5lci5kZXNlbGVjdCA9IChvcHRpb25zKSA9PlxuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHtzdXByZXNzRXZlbnRzOiBmYWxzZX1cblx0XHRpZiBAZW5hYmxlZCBcblx0XHRcdHRoaW5nVG9Td2l0Y2guZGVzZWxlY3QoKVx0XHRcblx0XHRcdEBzZWxlY3RlZCA9IGZhbHNlXG5cdFx0aWYgb3B0aW9ucy5zdXByZXNzRXZlbnRzID09IGZhbHNlXG5cdFx0XHRAbGlzdEl0ZW1Db250YWluZXIuZW1pdCBcIkRpZENoYW5nZVwiLCB7IHNlbGVjdGVkOiBAc2VsZWN0ZWQgfVxuXG5cdEBsaXN0SXRlbUNvbnRhaW5lci51cGRhdGVMYWJlbCA9IChuZXdUZXh0KSA9PlxuXHRcdEBsaXN0SXRlbS5odG1sID0gbmV3VGV4dFxuXG5cdEBsaXN0SXRlbUNvbnRhaW5lci5zZWxlY3RlZCA9ICgpID0+XG5cdFx0cmV0dXJuIEBzZWxlY3RlZFxuXHRcdFx0XG5cdEBsaXN0SXRlbUNvbnRhaW5lci51cGRhdGVMYWJlbChwYXJhbXMubmFtZSlcblxuXHRyZXR1cm4gQGxpc3RJdGVtQ29udGFpbmVyXG5cbmV4cG9ydHMuVGFibGVWaWV3ID0gKHBhcmFtcykgLT5cblx0cGFyYW1zID0gcGFyYW1zIG9yIHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLFxuXHRcdHk6IFx0XHQwXG5cdFx0d2lkdGg6XHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGl0ZW1zOiBbXCJJdCdzIGp1c3QgbWUhXCJdXG5cdFx0aWNvbjogJ2NoZWNrJ1xuXHRcdHZhbGlkYXRpb246ICdub25lJ1xuXHRcblx0QGJ1dHRvbkdyb3VwQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdDBcblx0XHR5Olx0XHRwYXJhbXMueVxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKiBwYXJhbXMuaXRlbXMubGVuZ3RoXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwibm9uZVwiXG5cdFx0XHRcdFx0XG5cdEBidXR0b25BcnJheSA9IFtdXG5cdGZvciBidXR0b25OYW1lLCBpIGluIHBhcmFtcy5pdGVtc1xuXHRcdGZpcnN0SXRlbUluTGlzdCA9IGlmIGkgPT0gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxuXHRcdGxhc3RJdGVtSW5MaXN0ID0gaWYgaSA9PSAocGFyYW1zLml0ZW1zLmxlbmd0aC0xKSB0aGVuIHRydWUgZWxzZSBmYWxzZVxuXHRcdG5ld0J1dHRvbiA9IG5ldyBleHBvcnRzLlRhYmxlVmlld1Jvdyh7XG5cdFx0XHR4OiAwLCBcblx0XHRcdHk6IGkqZGVmYXVsdHMudGFibGVSb3dIZWlnaHQsIFxuXHRcdFx0bmFtZTogYnV0dG9uTmFtZSwgXG5cdFx0XHRpY29uOiBwYXJhbXMuaWNvbixcblx0XHRcdGZpcnN0SXRlbUluTGlzdDogZmlyc3RJdGVtSW5MaXN0LFxuXHRcdFx0bGFzdEl0ZW1Jbkxpc3Q6IGxhc3RJdGVtSW5MaXN0XG5cdFx0fSlcblx0XHRAYnV0dG9uQXJyYXkucHVzaChuZXdCdXR0b24pXG5cdFx0bmV3QnV0dG9uLnN1cGVyTGF5ZXIgPSBAYnV0dG9uR3JvdXBDb250YWluZXJcblxuXHRhdHRhY2hSYWRpb0J1dHRvblZhbGlkYXRpb24gPSAoYnV0dG9uQXJyYXkpID0+XG5cdFx0YnV0dG9uR3JvdXBDb250YWluZXIgPSBAYnV0dG9uR3JvdXBDb250YWluZXJcblx0XHRmb3IgYnV0dG9uQ2xpY2tlZCwgaW5kZXhPZkJ1dHRvbkNsaWNrZWQgaW4gYnV0dG9uQXJyYXlcblx0XHRcdGJ1dHRvbkNsaWNrZWQuZGVzZWxlY3Qoe3N1cHJlc3NFdmVudHM6IHRydWV9KVxuXHRcdFx0IyBDcmVhdGVzIGEgY2xvc3VyZSB0byBzYXZlIHRoZSBpbmRleCBvZiB0aGUgYnV0dG9uIHdlJ3JlIGRlYWxpbmcgd2l0aFxuXHRcdFx0ZG8gKGJ1dHRvbkNsaWNrZWQsIGluZGV4T2ZCdXR0b25DbGlja2VkKSAtPiBcblx0XHRcdFx0IyBMaXN0ZW4gZm9yIGV2ZW50cyBhbmQgY2hhbmdlIG90aGVyIGJ1dHRvbnMgaW4gcmVzcG9uc2Vcblx0XHRcdFx0YnV0dG9uQ2xpY2tlZC5vbiAnRGlkQ2hhbmdlJywgKGV2ZW50KSA9PlxuXHRcdFx0XHRcdGZvciBvdGhlckJ1dHRvbiwgb3RoZXJCdXR0b25JbmRleCBpbiBidXR0b25BcnJheVxuXHRcdFx0XHRcdFx0aWYgb3RoZXJCdXR0b25JbmRleCAhPSBpbmRleE9mQnV0dG9uQ2xpY2tlZFxuXHRcdFx0XHRcdFx0XHQjIERvIHN0dWZmIHRvIHRoZSBvdGhlciBidXR0b25zXG5cdFx0XHRcdFx0XHRcdG90aGVyQnV0dG9uLmRlc2VsZWN0KHtzdXBwcmVzc0V2ZW50czogdHJ1ZX0pXG5cdFx0XHRcdFx0YnV0dG9uR3JvdXBDb250YWluZXIuZW1pdCBcIkRpZENoYW5nZVwiLCB7IHNlbGVjdGVkOiBpbmRleE9mQnV0dG9uQ2xpY2tlZCwgbnVtU2VsZWN0ZWQ6IDEsIGJ1dHRvbnM6IGJ1dHRvbkFycmF5IH1cblxuXHRhdHRhY2hEZWZhdWx0VmFsaWRhdGlvbiA9IChidXR0b25BcnJheSkgPT5cblx0XHQjIEp1c3QgZW1pdHMgdGhlIG5ldyB2YWx1ZXNcblx0XHRidXR0b25Hcm91cENvbnRhaW5lciA9IEBidXR0b25Hcm91cENvbnRhaW5lclxuXHRcdGZvciBidXR0b25DbGlja2VkLCBpbmRleE9mQnV0dG9uQ2xpY2tlZCBpbiBidXR0b25BcnJheVxuXHRcdFx0YnV0dG9uQ2xpY2tlZC5kZXNlbGVjdCh7c3VwcmVzc0V2ZW50czogdHJ1ZX0pXG5cdFx0XHQjIENyZWF0ZXMgYSBjbG9zdXJlIHRvIHNhdmUgdGhlIGluZGV4IG9mIHRoZSBidXR0b24gd2UncmUgZGVhbGluZyB3aXRoXG5cdFx0XHRkbyAoYnV0dG9uQ2xpY2tlZCwgaW5kZXhPZkJ1dHRvbkNsaWNrZWQpIC0+IFxuXHRcdFx0XHQjIExpc3RlbiBmb3IgZXZlbnRzIGFuZCBjaGFuZ2Ugb3RoZXIgYnV0dG9ucyBpbiByZXNwb25zZVxuXHRcdFx0XHRidXR0b25DbGlja2VkLm9uICdEaWRDaGFuZ2UnLCAoZXZlbnQpID0+XG5cdFx0XHRcdFx0bnVtU2VsZWN0ZWQgPSAwXG5cdFx0XHRcdFx0dGFibGVWaWV3U3RhdGVzID0gW11cdFx0XG5cdFx0XHRcdFx0Zm9yIGJ1dHRvbiBpbiBidXR0b25BcnJheVxuXHRcdFx0XHRcdFx0dGFibGVWaWV3U3RhdGVzLnB1c2goYnV0dG9uLnNlbGVjdGVkKCkpXG5cdFx0XHRcdFx0XHRpZiBidXR0b24uc2VsZWN0ZWQoKSB0aGVuIG51bVNlbGVjdGVkKytcblx0XHRcdFx0XHRidXR0b25Hcm91cENvbnRhaW5lci5lbWl0IFwiRGlkQ2hhbmdlXCIsIHsgc2VsZWN0ZWQ6IHRhYmxlVmlld1N0YXRlcywgbnVtU2VsZWN0ZWQ6IG51bVNlbGVjdGVkLCBidXR0b25zOiBidXR0b25BcnJheSB9XG5cblx0aWYgcGFyYW1zLnZhbGlkYXRpb24gPT0gJ3JhZGlvJ1xuXHRcdGF0dGFjaFJhZGlvQnV0dG9uVmFsaWRhdGlvbihAYnV0dG9uQXJyYXkpXG5cdGVsc2UgXG5cdFx0YXR0YWNoRGVmYXVsdFZhbGlkYXRpb24oQGJ1dHRvbkFycmF5KVxuXHRcdFxuXHRyZXR1cm4gQGJ1dHRvbkdyb3VwQ29udGFpbmVyXG5cblxuXG4jIyNcblx0VEFCTEUgVklFVyBIRUFERVJcblx0SW4gaU9TLCB0aGlzIGlzIHR5cGljYWxseSBhdHRhY2hlZCB0byB0aGUgdGFibGUgdmlldywgXG5cdGJ1dCBpdCdzIGluZGVwZW5kZW50IGhlcmUgc28geW91IGNhbiBwdXQgaXQgd2hlcmV2ZXIgeW91IHdhbnQuXG4jIyNcblxuZXhwb3J0cy5UYWJsZVZpZXdIZWFkZXIgPSAocGFyYW1zKSAtPlxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0dGV4dDogJ0kgYW0gYSBkaXZpZGVyJ1xuXHRcdHg6IDBcblx0XHR5OiAwXG5cdGxpc3REaXZpZGVyID0gbmV3IExheWVyXG5cdFx0eDogcGFyYW1zLnggKyBkZWZhdWx0cy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nXG5cdFx0eTogcGFyYW1zLnlcblx0XHR3aWR0aDogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuXHRsaXN0RGl2aWRlci5odG1sID0gcGFyYW1zLnRleHRcblx0bGlzdERpdmlkZXIuc3R5bGUgPSBkZWZhdWx0cy5kaXZpZGVySXRlbVRleHRTdHlsZVxuXHRsaXN0RGl2aWRlci5zdHlsZSA9IFxuXHRcdGNvbG9yOiBkZWZhdWx0cy50aW50XG5cdHJldHVybiBsaXN0RGl2aWRlclxuXG5cblxuIyMjXG5cdFBJQ0tFUlxuXHRJbiBpT1MsIHRoaXMgaXMgdHlwaWNhbGx5IGF0dGFjaGVkIHRvIHRoZSB0YWJsZSB2aWV3LCBcblx0YnV0IGl0J3MgaW5kZXBlbmRlbnQgaGVyZSBzbyB5b3UgY2FuIHB1dCBpdCB3aGVyZXZlciB5b3Ugd2FudC5cbiMjI1xuXG5cbiMjIFV0aWxpdHkgZnVuY3Rpb25zXG5cbnF1YW50aXplID0gKGlucHV0LCBzdGVwU2l6ZSkgLT5cblx0cmV0dXJuIE1hdGguZmxvb3IoaW5wdXQvc3RlcFNpemUpICogc3RlcFNpemVcblxuXG4jIyBUaGUgaXRlbXMgaW4gdGhlIHBpY2tlclxuXG5EcnVtID0gKHBhcmVudERydW1MYXllciwgZHJ1bU5hbWUsIGxpc3RJdGVtcywgcGFyYW1zKSAtPlxuXHRcblx0IyBTZXR1cCB2YXJpYWJsZXNcblx0QHBhcmVudERydW1MYXllciA9IHBhcmVudERydW1MYXllclxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0ZW5hYmxlZDogdHJ1ZVxuXHRcdHhQY3Q6IDAgIFx0XHRcdFx0IyAwIHRvIDFcblx0XHR3aWR0aFBjdDogMVx0XHRcdFx0IyAwIHRvIDFcblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCJcdFx0IyBsZWZ0LCBjZW50ZXIsIHJpZ2h0XG5cdFx0dGV4dFBhZGRpbmc6IFwiMFwiXG5cdFx0dGV4dENvbG9yOiBkZWZhdWx0cy50aW50XG5cdFxuXHQjIFZhbHVlcyBkZXJpdmVkIGZyb20gcGFyYW1zXG5cdGRydW1Db250YWluZXJIZWlnaHQgPSBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCo1XG5cblx0IyBTZXQgdXAgY29udGVudCBvZiBsaXN0IFx0XHRcblx0bGlzdEl0ZW1zID0gbGlzdEl0ZW1zXG5cdEBuYW1lID0gZHJ1bU5hbWVcblx0QGluZGV4ID0gMFxuXHRAdmFsID0gbGlzdEl0ZW1zW0BpbmRleF1cblx0QHZlbG9jaXR5ID0gMFxuXHRmaXJzdFRvdWNoQXZhaWxhYmxlID0gdHJ1ZSAgICAjIGlzIHRoaXMgdGhlIGZpcnN0IHRvdWNoIGluIGEgZ2l2ZW4gZ2VzdHVyZT9cblx0XG5cdGludGVydmFsVG91cGRhdGVEcnVtQXBwZWFyYW5jZSA9IDBcblx0XG5cdCMgQ2FsY3VsYXRlIGhlaWdodCBhbmQgdmVydGljYWwgYm91bmRzIG9mIHRoZSBsaXN0XG5cdGxpc3RNaW5ZUG9zIFx0PSAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRsaXN0TWF4WVBvcyBcdD0gLWxpc3RJdGVtcy5sZW5ndGgqZGVmYXVsdHMudGFibGVSb3dIZWlnaHQrZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRsaXN0SGVpZ2h0IFx0XHQ9IGxpc3RJdGVtcy5sZW5ndGgqZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKyBkcnVtQ29udGFpbmVySGVpZ2h0XG5cblx0QGRydW1Db250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0XHRcdFx0cGFyYW1zLnhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdHk6IFx0XHRcdFx0XHQwXG5cdFx0d2lkdGg6IFx0XHRcdFx0cGFyYW1zLndpZHRoUGN0ICogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRoZWlnaHQ6IFx0XHRcdGRydW1Db250YWluZXJIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJub25lXCJcblx0XHRzdXBlckxheWVyOiBcdFx0cGFyZW50RHJ1bUxheWVyXG5cdFxuXHRsaXN0TGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0XHRcdFx0MFxuXHRcdHk6IFx0XHRcdFx0XHQtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRcdHdpZHRoOiBcdFx0XHRcdHBhcmFtcy53aWR0aFBjdCAqIGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBcdFx0XHRsaXN0SGVpZ2h0XG5cdFx0c3VwZXJMYXllcjogXHRcdEBkcnVtQ29udGFpbmVyXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwibm9uZVwiXG5cdFxuXHQjIGxpc3RMYXllci5zY3JvbGwgPSB0cnVlXG5cdGxpc3RMYXllci5kcmFnZ2FibGUuZW5hYmxlZCA9IHBhcmFtcy5lbmFibGVkXG5cdGxpc3RMYXllci5kcmFnZ2FibGUuc3BlZWRYID0gMFxuXHRcblx0Zm9yIGxpLCBpIGluIGxpc3RJdGVtc1xuXHRcdGxpc3RJdGVtTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdHg6IFx0XHRcdFx0MFxuXHRcdFx0eTogXHRcdFx0XHRpICogZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKyBkcnVtQ29udGFpbmVySGVpZ2h0LzJcblx0XHRcdHdpZHRoOiBcdFx0XHRwYXJhbXMud2lkdGhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdFx0aGVpZ2h0OiBcdFx0ZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRcdHN1cGVyTGF5ZXI6IFx0bGlzdExheWVyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwibm9uZVwiI1V0aWxzLnJhbmRvbUNvbG9yKClcblx0XHRsaXN0SXRlbUxheWVyLmh0bWwgPSBsaVxuXHRcdGxpc3RJdGVtTGF5ZXIuc3R5bGUgPVxuXHRcdFx0Y29sb3I6IFx0XHRcdHBhcmFtcy50ZXh0Q29sb3Jcblx0XHRcdGZvbnRGYW1pbHk6IFx0ZGVmYXVsdHMucGlja2VyVGV4dFN0eWxlLmZvbnRGYW1pbHlcblx0XHRcdGZvbnRXZWlnaHQ6IFx0ZGVmYXVsdHMucGlja2VyVGV4dFN0eWxlLmZvbnRXZWlnaHRcblx0XHRcdGZvbnRTaXplOiBcdFx0ZGVmYXVsdHMucGlja2VyVGV4dFN0eWxlLmZvbnRTaXplXG5cdFx0XHRsaW5lSGVpZ2h0OiBcdGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0K1wicHhcIlxuXHRcdFx0dGV4dEFsaWduOiBcdFx0cGFyYW1zLnRleHRBbGlnblxuXHRcdFx0cGFkZGluZzogXHRcdHBhcmFtcy50ZXh0UGFkZGluZ1xuXG5cdFx0bGlzdEl0ZW1MYXllci5zdGFydFkgPSBpICogZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKyBkcnVtQ29udGFpbmVySGVpZ2h0LzJcblxuXHRsaXN0TGF5ZXIub24gRXZlbnRzLkRyYWdNb3ZlLCA9PlxuXHRcdGlmIGZpcnN0VG91Y2hBdmFpbGFibGVcblx0XHRcdEBkcnVtQ29udGFpbmVyLmVtaXQoXCJEcnVtU3RhcnRlZE1vdmluZ1wiLCB7ZHJ1bTogZHJ1bU5hbWUsIGluZGV4OiBAaW5kZXgsIHZhbHVlOiBAdmFsLCB2ZWxvY2l0eTogMH0pXG5cdFx0XHRmaXJzdFRvdWNoQXZhaWxhYmxlID0gZmFsc2VcdFx0XG5cdFx0XHRcblx0XHR1cGRhdGVEcnVtQXBwZWFyYW5jZSgpXG5cdFx0XG5cdCMgVG8gc2ltdWxhdGUgaU9TIG1vbWVudHVtIHNjcm9sbGluZyAod2hpY2ggY2F1c2VzIHRoZSBkcnVtIHRvIGtlZXAgc3Bpbm5pbmcgXG5cdCMgYWZ0ZXIgeW91ciBmaW5nZXIgbGlmdHMgb2ZmIGl0KSwgd2UgdHJpZ2dlciBhbiBhbmltYXRpb24gdGhlIG1vbWVudCB5b3UgbGlmdFxuXHQjIHlvdXIgZmluZ2VyLiBUaGUgaW50ZW5zaXR5IG9mIHRoaXMgYW5pbWF0aW9uIGlzIHByb3BvcnRpb25hbCB0byB0aGUgc3BlZWQgd2hlblxuXHQjIG9mIHRoZSBkcmFnZ2luZyB3aGVuIHlvdXIgZmluZ2VyIHdhcyBsaWZ0ZWQuXG5cdGxpc3RMYXllci5vbiBFdmVudHMuRHJhZ0VuZCwgKGUsIGYpID0+XG5cdFx0XG5cdFx0IyBOZXh0IHRvdWNoIHNob3VsZCB0cmlnZ2VyIERydW1TdGFydGVkTW92aW5nXG5cdFx0Zmlyc3RUb3VjaEF2YWlsYWJsZSA9IHRydWVcblx0XG5cdFx0IyBUaGlzIGNhbGN1bGF0ZXMgdGhlIGFuaW1hdGlvblxuXHRcdHNjcm9sbFZlbG9jaXR5ID0gbGlzdExheWVyLmRyYWdnYWJsZS5jYWxjdWxhdGVWZWxvY2l0eSgpLnlcblx0XHR0aW1lQWZ0ZXJEcmFnID0gKDAuNStNYXRoLmFicyhzY3JvbGxWZWxvY2l0eSowLjIpKS50b0ZpeGVkKDEpXG5cdFx0ZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gPSBxdWFudGl6ZShsaXN0TGF5ZXIueSArIHNjcm9sbFZlbG9jaXR5KjQwMCwgZGVmYXVsdHMudGFibGVSb3dIZWlnaHQpICsgZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRcdFxuXHRcdCMgQXQgdGhlIHRvcCBhbmQgYm90dG9tLCB0aGUgbW9tZW50dW0gc2hvdWxkIGJlIGFkanVzdGVkIHNvIHRoZSBcblx0XHQjIGZpcnN0IGFuZCBsYXN0IHZhbHVlcyBvbiB0aGUgZHJ1bSBkb24ndCBnbyB0b28gZmFyIG91dCBvZiB2aWV3XG5cdFx0ZGlzdGFuY2VUb1RyYXZlbCA9IGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtIC0gbGlzdExheWVyLnlcblx0XHRsaXN0SGVpZ2h0V2l0aG91dEVuZEJ1ZmZlciA9IC1saXN0SXRlbXMubGVuZ3RoKmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0Ym90dG9tT3ZlcmZsb3cgPSBNYXRoLm1heCgwLCBsaXN0SGVpZ2h0V2l0aG91dEVuZEJ1ZmZlci1maW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSApXG5cdFx0dG9wT3ZlcmZsb3cgPSBNYXRoLm1heCgwLCBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSApXG5cdFx0b3ZlcmZsb3dEYW1wZW5pbmcgPSAxMFxuXHRcdFxuXHRcdGlmIGJvdHRvbU92ZXJmbG93ID4gMFxuXHRcdFx0ZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gPSBsaXN0SGVpZ2h0V2l0aG91dEVuZEJ1ZmZlciAtIChib3R0b21PdmVyZmxvdyAvIG92ZXJmbG93RGFtcGVuaW5nKVxuXHRcdFx0bmV3RGlzdGFuY2VUb1RyYXZlbCA9IGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtIC0gbGlzdExheWVyLnlcblx0XHRcdHRpbWVBZnRlckRyYWcgPSB0aW1lQWZ0ZXJEcmFnICogKG5ld0Rpc3RhbmNlVG9UcmF2ZWwvZGlzdGFuY2VUb1RyYXZlbClcblxuXHRcdGlmIHRvcE92ZXJmbG93ID4gMFxuXHRcdFx0ZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gPSA0MCArICh0b3BPdmVyZmxvdyAvIG92ZXJmbG93RGFtcGVuaW5nKVxuXHRcdFx0bmV3RGlzdGFuY2VUb1RyYXZlbCA9IGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtIC0gbGlzdExheWVyLnlcblx0XHRcdHRpbWVBZnRlckRyYWcgPSB0aW1lQWZ0ZXJEcmFnICogKG5ld0Rpc3RhbmNlVG9UcmF2ZWwvZGlzdGFuY2VUb1RyYXZlbClcblxuXHRcdCMgVHJpZ2dlciB0aGUgYW5pbWF0aW9uLCBhbmQgc2NoZWR1bGUgYW4gZXZlbnQgdGhhdCB3aWxsXG5cdFx0IyB0cmlnZ2VyIHdoZW4gdGhlIGRydW0gZmluYWxseSBzdG9wcyBzcGlubmluZy5cblx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt5OiBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bX1cblx0XHRcdFx0dGltZTogdGltZUFmdGVyRHJhZ1xuXHRcdFx0XHRjdXJ2ZTogXCJlYXNlLW91dFwiXG5cdFx0XHR9KVxuXHRcdFV0aWxzLmRlbGF5IHRpbWVBZnRlckRyYWcsIC0+XG5cdFx0XHRzdG9wRHJ1bSgpXG5cblx0IyBUaGlzIGVuc3VyZXMgdGhhdCBkdXJpbmcgdGhlIGFuaW1hdGlvbiBvZiB0aGUgbGlzdCBsYXllciwgdGhlIGRydW0ncyBhcHBlYXJhbmNlIGNvbnRpbnVlc1xuXHQjIHRvIGJlIHVwZGF0ZWQuIEJlY2F1c2UgbXVsdGlwbGUgYW5pbWF0aW9ucyBjb3VsZCBvdmVybGFwLCB3ZSBlbnN1cmUgdGhhdCBldmVyeSBuZXcgYW5pbWF0aW9uXG5cdCMgZW5kcyB0aGUgaW50ZXJ2YWwgYW5kIHN0YXJ0cyBhIG5ldyBvbmUgc28gdGhhdCB3ZSBuZXZlciBoYXZlIG1vcmUgdGhhbiBvbmUgcnVubmluZyBcblx0bGlzdExheWVyLm9uIEV2ZW50cy5BbmltYXRpb25TdGFydCwgLT5cblx0XHRjbGVhckludGVydmFsKGludGVydmFsVG91cGRhdGVEcnVtQXBwZWFyYW5jZSlcblx0XHRpbnRlcnZhbFRvdXBkYXRlRHJ1bUFwcGVhcmFuY2UgPSBVdGlscy5pbnRlcnZhbCAxLzMwLCB1cGRhdGVEcnVtQXBwZWFyYW5jZSAgICBcblxuXHRsaXN0TGF5ZXIub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cdFx0XG5cdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbFRvdXBkYXRlRHJ1bUFwcGVhcmFuY2UpXG5cblx0XHQjIEVtaXQgYWZ0ZXIgYWxsIG1vdmVtZW50IGVuZHMgaW4gdGhlIGxpc3Rcblx0XHRAZHJ1bUNvbnRhaW5lci5lbWl0KFwiRHJ1bUZpbmlzaGVkQ2hhbmdpbmdcIiwge2xpc3Q6IGRydW1OYW1lLCBpbmRleDogQGluZGV4LCB2YWx1ZTogQHZhbH0pXG5cblx0dXBkYXRlRHJ1bUFwcGVhcmFuY2UgPSA9PlxuXHRcdGl0ZW1zSW5EcnVtID0gNFxuXHRcdGxpc3RQb3NpdGlvbiA9IGxpc3RMYXllci55IC8gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0IC0gMC41XG5cdFx0Y2FwcGVkTGlzdFBvc2l0aW9uID0gTWF0aC5tYXgoMCwgTWF0aC5taW4obGlzdExheWVyLnkgLyAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgLSAwLjUsIGxpc3RJdGVtcy5sZW5ndGggLSAxKSlcblx0XHRmb2N1c0l0ZW0gPSBNYXRoLnJvdW5kKGNhcHBlZExpc3RQb3NpdGlvbilcblx0XHRkaXN0YW5jZUZyb21NaWRkbGUgPSBNYXRoLmFicyhmb2N1c0l0ZW0gLSBjYXBwZWRMaXN0UG9zaXRpb24pXG5cdFx0Zm9yIGkgaW4gWyhmb2N1c0l0ZW0taXRlbXNJbkRydW0pLi4oZm9jdXNJdGVtK2l0ZW1zSW5EcnVtKV1cblx0XHRcdGlmIGkgPj0gMCBhbmQgaSA8IGxpc3RJdGVtcy5sZW5ndGhcblx0XHRcdFx0bGlzdExheWVyLnN1YkxheWVyc1tpXS5vcGFjaXR5ID0gMSAtIE1hdGguYWJzKGxpc3RQb3NpdGlvbiAtIGkpLzUgLSAoaWYgKGkgIT0gZm9jdXNJdGVtKSB0aGVuIDAuMyBlbHNlIDApXG5cdFx0XHRcdGxpc3RMYXllci5zdWJMYXllcnNbaV0uc2NhbGVZID0gMSAtIE1hdGgubWluKDEsIE1hdGguYWJzKGxpc3RQb3NpdGlvbiAtIGkpLzQpXG5cdFx0XHRcdGxpc3RMYXllci5zdWJMYXllcnNbaV0ueSA9IGxpc3RMYXllci5zdWJMYXllcnNbaV0uc3RhcnRZIC0gKGktbGlzdFBvc2l0aW9uKSpNYXRoLmFicyhpLWxpc3RQb3NpdGlvbikqMTBcblxuXHRcdCMgVXBkYXRlIHRoZSB2YWx1ZSBvZiB0aGUgZHJ1bSBvbmx5IHdoZW4gYSBuZXcgdmFsdWUgaXMgcmVhY2hlZFxuXHRcdGlmIChAaW5kZXggIT0gZm9jdXNJdGVtKVxuXHRcdFx0dXBkYXRlRHJ1bVZhbHVlcyhmb2N1c0l0ZW0pXG5cdFx0XG5cdHN0b3BEcnVtID0gPT5cdFx0XG5cdFx0IyBFbnN1cmUgdGhlIGRydW0gbmV2ZXIgZW5kcyBvdXQgb2YgYm91bmRzXG5cdFx0aWYgbGlzdExheWVyLnkgPiBsaXN0TWluWVBvcyBcblx0XHRcdGxpc3RMYXllci5hbmltYXRlKHtcblx0XHQgICAgXHRwcm9wZXJ0aWVzOiB7eTpsaXN0TWluWVBvc31cblx0XHQgICAgXHRjdXJ2ZTogXCJzcHJpbmcoNDAwLDUwLDApXCJcblx0XHRcdH0pXG5cdFx0aWYgbGlzdExheWVyLnkgPCBsaXN0TWF4WVBvc1xuXHRcdFx0bGlzdExheWVyLmFuaW1hdGUoe1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eTogbGlzdE1heFlQb3N9XG5cdFx0XHRcdGN1cnZlOiBcInNwcmluZyg0MDAsNTAsMClcIlxuXHRcdFx0fSlcblx0XG5cdCMgVXBkYXRlIHRoZSB2YWx1ZXMgb2YgdGhlIGRydW1zIGFuZCBpbnZva2UgdGhlIGNhbGxiYWNrIFxuXHR1cGRhdGVEcnVtVmFsdWVzID0gKG5ld0luZGV4KSA9PlxuXHRcdEBpbmRleCA9IG5ld0luZGV4XG5cdFx0QHZhbCA9IGxpc3RJdGVtc1tAaW5kZXhdXG5cdFx0QGRydW1Db250YWluZXIuZW1pdChcIkRydW1EaWRDaGFuZ2VcIiwge2xpc3Q6IGRydW1OYW1lLCBpbmRleDogQGluZGV4LCB2YWx1ZTogQHZhbH0pXG5cdFxuXHQjIFJlbmRlciBmb3IgdGhlIGZpcnN0IHRpbWVcdFx0XG5cdHVwZGF0ZURydW1BcHBlYXJhbmNlKClcblx0XG5cdEBzZXRJbmRleCA9IChpbmRleCkgPT5cblx0XHR5UG9zaXRpb25Gb3JUaGlzSW5kZXggPSAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMiAtIChpbmRleCAqIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0KVxuXHRcdGxpc3RMYXllci5hbmltYXRlKHtcblx0XHRcdFx0cHJvcGVydGllczoge3k6IHlQb3NpdGlvbkZvclRoaXNJbmRleH1cblx0XHRcdFx0dGltZTogMC41XG5cdFx0XHRcdGN1cnZlOiBcImVhc2Utb3V0XCJcblx0XHRcdH0pXG5cblx0QHNldFZhbHVlID0gKHZhbCkgPT5cblx0XHRpbmRleCA9IGxpc3RJdGVtcy5pbmRleE9mKHZhbClcblx0XHRpZiBpbmRleCAhPSAtMVxuXHRcdFx0QHNldEluZGV4KGluZGV4KVxuXG5cdCMgUmV0dXJuIHRoZSBkcnVtIG9iamVjdCBzbyB3ZSBjYW4gYWNjZXNzIGl0cyB2YWx1ZXNcblx0cmV0dXJuIEBcblxuXG4jIyNcblx0UElDS0VSXG5cdFRoaXMgY29udGFpbnMgdGhlIHBpY2tlciBcbiMjIyBcbmV4cG9ydHMuUGlja2VyID0gKHBhcmFtcykgLT5cblx0XG5cdHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcyxcblx0XHR4OiBcdFx0MFxuXHRcdHk6IFx0XHQwXG5cdFx0d2lkdGg6XHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGRlZmF1bHRUZXh0OiBcIlwiXG5cdFx0dGV4dENvbG9yOiBkZWZhdWx0cy50aW50XG5cblx0ZHJ1bUNvbnRhaW5lckhlaWdodCA9IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0KjVcblxuXHRAcGlja2VyQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdHBhcmFtcy54XG5cdFx0eTpcdFx0cGFyYW1zLnlcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6IGRydW1Db250YWluZXJIZWlnaHQrODhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0ZGVmYXVsdHMuaXRlbUJhY2tncm91bmRcblx0XHRcdFxuXHRAZHJ1bSA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTogXHRcdDg4XG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0OiBkcnVtQ29udGFpbmVySGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIm5vbmVcIlxuXHRcdHN1cGVyTGF5ZXI6IEBwaWNrZXJDb250YWluZXJcdFx0XG5cdFx0XG5cdEBzZWxlY3RlZEl0ZW0gPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0MFxuXHRcdHk6IFx0XHRkcnVtQ29udGFpbmVySGVpZ2h0LzIgLSBkZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yXG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJub25lXCJcblx0XHRzdXBlckxheWVyOiBAZHJ1bVxuXG5cdEBwaWNrZXJDb250YWluZXIucGlja2VySGVhZGVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0MFxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDpcdDg4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBkZWZhdWx0cy5pdGVtQmFja2dyb3VuZFxuXHRcdHN1cGVyTGF5ZXI6IEBwaWNrZXJDb250YWluZXJcblx0XHRcblx0IyBTdHlsZXNcblx0QGRydW0uc3R5bGUgPVxuXHRcdHBvaW50ZXJFdmVudHM6IFwibm9uZVwiXG5cdFx0Ym9yZGVyVG9wOiBcIjFweCBzb2xpZCBcIiArIGRlZmF1bHRzLmxpbmVUaW50XG5cdFx0Ym9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCBcIiArIGRlZmF1bHRzLmxpbmVUaW50XG5cdFxuXHRAc2VsZWN0ZWRJdGVtLnN0eWxlID1cblx0XHRwb2ludGVyRXZlbnRzOiBcIm5vbmVcIlxuXHRcdGJvcmRlclRvcDogXCIxcHggc29saWQgcmdiYSgwLDAsMCwwLjMpXCJcblx0XHRib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMCwwLDAsMC4zKVwiXG5cdFx0XG5cdEBwaWNrZXJDb250YWluZXIucGlja2VySGVhZGVyLnN0eWxlID0gZGVmYXVsdHMubGlzdEl0ZW1UZXh0U3R5bGVcblx0QHBpY2tlckNvbnRhaW5lci5waWNrZXJIZWFkZXIuc3R5bGUgPSBcblx0XHRjb2xvcjogcGFyYW1zLnRleHRDb2xvclxuXHRcdHBhZGRpbmdMZWZ0OiBcIjIwcHhcIlxuXHRcdGJvcmRlclRvcDogXCIxcHggc29saWQgXCIgKyBkZWZhdWx0cy5saW5lVGludFxuXHRcdFx0XG5cdEBwaWNrZXJDb250YWluZXIucGlja2VySGVhZGVyLmh0bWwgPSBwYXJhbXMuZGVmYXVsdFRleHRcblx0XHRcblx0XHRcblx0IyBBZGQgZHJ1bXNcblx0QHBpY2tlckNvbnRhaW5lci5kcnVtcyA9IFtdXG5cdEBwaWNrZXJDb250YWluZXIuZHJ1bXNCeU5hbWUgPSB7fVxuXHRcblx0cGlja2VyU3RhcnRlZE1vdmluZyA9ICgpPT5cblx0XHRkcnVtVmFsdWVzID0ge31cblx0XHRuZXdWYWx1ZXMgPSBmb3IgZHJ1bSBpbiBAcGlja2VyQ29udGFpbmVyLmRydW1zXG5cdFx0XHRkcnVtVmFsdWVzW2RydW0ubmFtZV0gPSB7aW5kZXg6IGRydW0uaW5kZXgsIHZhbDogZHJ1bS52YWwsIHZlbG9jaXR5OiAwfVx0XG5cdFx0QHBpY2tlckNvbnRhaW5lci5lbWl0KFwiUGlja2VyU3RhcnRlZE1vdmluZ1wiIClcblx0XHRcblx0cGlja2VyRGlkQ2hhbmdlID0gKCk9PlxuXHRcdGRydW1WYWx1ZXMgPSB7fVxuXHRcdG5ld1ZhbHVlcyA9IGZvciBkcnVtIGluIEBwaWNrZXJDb250YWluZXIuZHJ1bXNcblx0XHRcdGRydW1WYWx1ZXNbZHJ1bS5uYW1lXSA9IHtpbmRleDogZHJ1bS5pbmRleCwgdmFsOiBkcnVtLnZhbH1cblxuXHRcdEBwaWNrZXJDb250YWluZXIuZW1pdChcIlBpY2tlckRpZENoYW5nZVwiLCBkcnVtVmFsdWVzIClcblx0XG5cdHBpY2tlckZpbmlzaGVkQ2hhbmdpbmcgPSAoKT0+XG5cdFx0ZHJ1bVZhbHVlcyA9IHt9XG5cdFx0bmV3VmFsdWVzID0gZm9yIGRydW0gaW4gQHBpY2tlckNvbnRhaW5lci5kcnVtc1xuXHRcdFx0ZHJ1bVZhbHVlc1tkcnVtLm5hbWVdID0ge2luZGV4OiBkcnVtLmluZGV4LCB2YWw6IGRydW0udmFsfVxuXG5cdFx0QHBpY2tlckNvbnRhaW5lci5lbWl0KFwiUGlja2VyRmluaXNoZWRDaGFuZ2luZ1wiLCBkcnVtVmFsdWVzIClcdFxuXHRpZiAocGFyYW1zLmRydW1zIGFuZCBwYXJhbXMuZHJ1bXMubGVuZ3RoID4gMClcblx0XHRmb3IgZHJ1bSBpbiBwYXJhbXMuZHJ1bXNcblx0XHRcdG5ld0RydW0gPSBuZXcgRHJ1bShAZHJ1bSwgZHJ1bS5uYW1lLCBkcnVtLml0ZW1zLCBkcnVtLnBhcmFtcylcblxuXHRcdFx0IyMgU3RvcmUgZHJ1bXMgaW5zaWRlIHRoZSBwaWNrZXJcblx0XHRcdEBwaWNrZXJDb250YWluZXIuZHJ1bXMucHVzaChuZXdEcnVtKVxuXHRcdFx0QHBpY2tlckNvbnRhaW5lci5kcnVtc0J5TmFtZVtkcnVtLm5hbWVdID0gbmV3RHJ1bSBcblxuXHRcdFx0IyMgRW5zdXJlIHRoYXQgY2hhbmdlcyB0byB0aGUgZHJ1bSBidWJibGUgdXAgdG8gdGhlIHBpY2tlclxuXHRcdFx0bmV3RHJ1bS5kcnVtQ29udGFpbmVyLm9uIFwiRHJ1bURpZENoYW5nZVwiLCBwaWNrZXJEaWRDaGFuZ2Vcblx0XHRcdFxuXHRcdFx0IyMgRW1pdCBhbiBldmVudCB3aGVuIGRydW1zIHN0b3AgbW92aW5nIGFsdG9nZXRoZXJcblx0XHRcdG5ld0RydW0uZHJ1bUNvbnRhaW5lci5vbiBcIkRydW1GaW5pc2hlZENoYW5naW5nXCIsIHBpY2tlckZpbmlzaGVkQ2hhbmdpbmdcblxuXHRcdFx0IyMgRW1pdCBhbiBldmVudCB3aGVuIGxpc3RzIHN0b3AgbW92aW5nIGFsdG9nZXRoZXJcblx0XHRcdG5ld0RydW0uZHJ1bUNvbnRhaW5lci5vbiBcIkRydW1TdGFydGVkTW92aW5nXCIsIHBpY2tlclN0YXJ0ZWRNb3ZpbmdcblxuXG5cdHJldHVybiBAcGlja2VyQ29udGFpbmVyXG4iXX0=
