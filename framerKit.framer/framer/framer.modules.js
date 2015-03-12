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
  var drumContainerHeight, i, intervalToupdateDrumAppearance, j, len, li, listHeight, listItemLayer, listLayer, listMaxYPos, listMinYPos, stopDrum, updateDrumAppearance, updateDrumValues;
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
      return updateDrumAppearance();
    };
  })(this));
  listLayer.on(Events.DragEnd, (function(_this) {
    return function(e, f) {
      var bottomOverflow, distanceToTravel, finalPositionAfterMomentum, listHeightWithoutEndBuffer, newDistanceToTravel, overflowDampening, scrollVelocity, timeAfterDrag, topOverflow;
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
  var drum, drumContainerHeight, j, len, newDrum, pickerDidChange, pickerFinishedChanging, ref;
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
    }
  }
  return this.pickerContainer;
};



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcmFwaGRhbWljby9Eb2N1bWVudHMvR2l0L2ZyYW1lcktpdC9mcmFtZXJLaXQuZnJhbWVyL21vZHVsZXMvZnJhbWVyS2l0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQUE7Ozs7Ozs7Ozs7OztHQUFBO0FBaUJBO0FBQUE7Ozs7O0dBakJBO0FBQUEsSUFBQSxxREFBQTs7QUFBQSxRQXVCQSxHQUFXO0FBQUEsRUFDVixXQUFBLEVBQWEsR0FESDtDQXZCWCxDQUFBOztBQTJCQTtBQUFBOztHQTNCQTs7QUFBQSxRQThCUSxDQUFDLGNBQVQsR0FBMEIsRUE5QjFCLENBQUE7O0FBQUEsUUErQlEsQ0FBQyx5QkFBVCxHQUFxQyxFQS9CckMsQ0FBQTs7QUFBQSxRQWdDUSxDQUFDLElBQVQsR0FBZ0IsTUFoQ2hCLENBQUE7O0FBQUEsUUFpQ1EsQ0FBQyxRQUFULEdBQW9CLHFCQWpDcEIsQ0FBQTs7QUFBQSxRQWtDUSxDQUFDLGNBQVQsR0FBMEIsT0FsQzFCLENBQUE7O0FBQUEsUUFtQ1EsQ0FBQyxpQkFBVCxHQUE2QjtBQUFBLEVBQzVCLFFBQUEsRUFBVSxNQURrQjtBQUFBLEVBRTVCLFVBQUEsRUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFULEdBQXdCLENBQXpCLENBQUEsR0FBNEIsSUFGWjtBQUFBLEVBRzVCLFVBQUEsRUFBWSxnQkFIZ0I7QUFBQSxFQUk1QixVQUFBLEVBQVksS0FKZ0I7Q0FuQzdCLENBQUE7O0FBQUEsUUF5Q1EsQ0FBQyxvQkFBVCxHQUFnQztBQUFBLEVBQy9CLFFBQUEsRUFBVSxNQURxQjtBQUFBLEVBRS9CLFVBQUEsRUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFULEdBQXdCLENBQXpCLENBQUEsR0FBNEIsSUFGVDtBQUFBLEVBRy9CLFVBQUEsRUFBWSxnQkFIbUI7QUFBQSxFQUkvQixVQUFB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aWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyMjXG4gIEZyYW1lcktpdCBmb3IgRnJhbWVyXG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9yYXBoZGFtaWNvL2ZyYW1lcktpdFxuXG4gIENvcHlyaWdodCAoYykgMjAxNSwgUmFwaCBEJ0FtaWNvIGh0dHA6Ly9yYXBoZGFtaWNvLmNvbSAoQHJhcGhkYW1pY28pXG4gIE1JVCBMaWNlbnNlXG5cbiAgUmVhZG1lOlxuICBodHRwczovL2dpdGh1Yi5jb20vcmFwaGRhbWljby9mcmFtZXJLaXRcblxuICBMaWNlbnNlOlxuICBodHRwczovL2dpdGh1Yi5jb20vcmFwaGRhbWljby9mcmFtZXJLaXQvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuIyMjXG5cblxuXG5cbiMjI1xuXHRERUZBVUxUIFNUWUxFU1xuXHROb3RlIHRoZSBzY3JlZW53aWR0aCBjb25zdGFudDogdGhpcyBpcyBwcm9iYWJseSBvbmUgb2YgdGhlXG5cdGZpcnN0IHRoaW5ncyB5b3Ugd2FudCB0byBjaGFuZ2Ugc28gaXQgbWF0Y2hlcyB0aGUgZGV2aWNlXG5cdHlvdSdyZSBwcm90b3R5cGluZyBvbi5cbiMjI1xuZGVmYXVsdHMgPSB7XG5cdHNjcmVlbldpZHRoOiA3NTBcbn1cblxuIyMjXG5cdE1PUkUgU1RZTEVTXG4jIyNcbmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ID0gODhcbmRlZmF1bHRzLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmcgPSAyMFxuZGVmYXVsdHMudGludCA9ICdncmV5J1xuZGVmYXVsdHMubGluZVRpbnQgPSBcInJnYmEoMjAwLDIwMCwyMDAsMSlcIlxuZGVmYXVsdHMuaXRlbUJhY2tncm91bmQgPSAnd2hpdGUnXG5kZWZhdWx0cy5saXN0SXRlbVRleHRTdHlsZSA9IHtcblx0Zm9udFNpemU6IFwiMzJweFwiXG5cdGxpbmVIZWlnaHQ6IChkZWZhdWx0cy50YWJsZVJvd0hlaWdodC00KStcInB4XCJcdFx0XG5cdGZvbnRGYW1pbHk6IFwiSGVsdmV0aWNhIE5ldWVcIlxuXHRmb250V2VpZ2h0OiBcIjIwMFwiXG59XG5kZWZhdWx0cy5kaXZpZGVySXRlbVRleHRTdHlsZSA9IHtcblx0Zm9udFNpemU6IFwiMjJweFwiXG5cdGxpbmVIZWlnaHQ6IChkZWZhdWx0cy50YWJsZVJvd0hlaWdodC00KStcInB4XCJcdFx0XG5cdGZvbnRGYW1pbHk6IFwiSGVsdmV0aWNhIE5ldWVcIlxuXHRmb250V2VpZ2h0OiBcIjIwMFwiXG5cdHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnXG59XG5leHBvcnRzLmRlZmF1bHRzID0gZGVmYXVsdHNcblxuXG4jIyNcblx0VEFCTEUgVklFVyBFTEVNRU5UU1xuXHQoZS5nLiBcIlRodW1iXCIgZm9yIHRoZSBzd2l0Y2ggY29udHJvbClcbiMjI1xuXG5Td2l0Y2ggPSAocGFyYW1zKSAtPlxuXHRwYXJhbXMgPSBwYXJhbXMgb3Ige31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsIFxuXHRcdHN3aXRjaFRpbnQ6ICcjMURDMjRCJ1xuXHRcdHNjcmVlbldpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdHRhYmxlUm93SGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdHN3aXRjaENvbnRhaW5lckJvcmRlcjogNFxuXHRcdHN3aXRjaENvbnRhaW5lckhlaWdodDogNTRcblx0XHRzd2l0Y2hDb250YWluZXJXaWR0aDogOTRcblx0XHRib3JkZXJDb2xvcjogZGVmYXVsdHMubGluZVRpbnQgIyBHcmV5IHJvdW5kZWQgcGlsbCAmIGJvcmRlcnMgYmV0d2VlbiBjZWxsc1xuXG5cdEBzZWxlY3RlZCA9IHRydWVcblx0XG5cdCMgU29tZSBvZiB0aGUgdmFsdWVzIGFyZSBiYXNlZCBvbiBvdGhlciBjb25zdGFudHMsXG5cdCMgc28geW91IGhhdmUgdG8gY2FsY3VsYXRlIHRoZW0gaW4gYSBzZWNvbmQgcGFzc1xuXHRzd2l0Y2hCdXR0b25SYWRpdXMgPSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0LzJcblx0c2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIgPSAyXG5cdFxuXHQjIFRoaXMgaXMgb3VyIGZhbmN5IGFuaW1hdGVkIHN3aXRjaCBzd2l0Y2hcblx0IyB3ZSBuZWVkIHRvIG1ha2UgYSByb3VuZGVkIHJlY3RhbmdsZSB3aXRoIGEgY2lyY2xlIGluc2lkZSBpdC5cblx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRcdFx0XHQwXG5cdFx0eTogXHRcdFx0XHRcdDBcblx0XHRjbGlwOiBcdFx0XHRcdGZhbHNlICMgQ2xpcHBpbmcgaHVydHMgdGhlIHN1YnRsZSBzaGFkb3cgb24gdGhlIGJ1dHRvblxuXHRcdHdpZHRoOlx0XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoIFxuXHRcdGhlaWdodDpcdFx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJcIlxuXHRcdG9wYWNpdHk6IFx0XHRcdDFcblxuXHRAc3dpdGNoQmFja2dyb3VuZCA9IG5ldyBMYXllclxuXHRcdHg6XHRcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyAtIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyLzJcblx0XHR5Olx0XHRcdFx0XHRzd2l0Y2hCdXR0b25SYWRpdXMgLSBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlci8yIC0gNFxuXHRcdHdpZHRoOiBcdFx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJXaWR0aCAtIHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQgKyBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlclxuXHRcdGhlaWdodDogXHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodCAtIHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQgKyBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlclxuXHRcdGJvcmRlclJhZGl1czogXHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHRzaGFkb3dTcHJlYWQ6XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyAtIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyLzIgKyBwYXJhbXMuc3dpdGNoQ29udGFpbmVyQm9yZGVyXG5cdFx0c2hhZG93Q29sb3I6IFx0XHRwYXJhbXMuc3dpdGNoVGludFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHQnJ1xuXHRcdG9wYWNpdHk6IFx0XHRcdDFcblx0XHRzdXBlckxheWVyOiBcdFx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lclxuXHRcdFxuXHRAc3dpdGNoQnV0dG9uID0gbmV3IExheWVyXG5cdFx0eDogcGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoIC0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdHk6IC00XG5cdFx0d2lkdGg6XHRcdFx0XHRzd2l0Y2hCdXR0b25SYWRpdXMqMlxuXHRcdGhlaWdodDpcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyoyXG5cdFx0Ym9yZGVyUmFkaXVzOiBcdFx0c3dpdGNoQnV0dG9uUmFkaXVzXG5cdFx0c2hhZG93WTpcdFx0XHQzXG5cdFx0c2hhZG93Qmx1cjogXHRcdDVcblx0XHRzaGFkb3dDb2xvcjogXHRcdCdyZ2JhKDAsMCwwLDAuMyknXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwid2hpdGVcIlxuXHRcdG9wYWNpdHk6IFx0XHRcdDFcblx0XHRzdXBlckxheWVyOiBcdFx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lclxuXHRcblx0IyBTRVQgVVAgQU5JTUFUSU9OU1xuXHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuYWRkXG5cdFx0ZGVzZWxlY3RlZDogXG5cdFx0XHR4OiBcdFx0XHRcdDBcblx0XHRcdHk6IFx0XHRcdFx0LTRcblx0XHRcdHdpZHRoOlx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJXaWR0aFxuXHRcdFx0aGVpZ2h0Olx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHRcdHNoYWRvd1NwcmVhZDogXHRwYXJhbXMuc3dpdGNoQ29udGFpbmVyQm9yZGVyXG5cdFx0XHRzYXR1cmF0ZTogXHRcdDBcblx0XHRcdGJyaWdodG5lc3M6IFx0MTUzXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiXCJcblx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdGN1cnZlOiBcImVhc2UtaW4tb3V0XCJcblx0XHR0aW1lOiAwLjMgXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XG5cdFx0VXRpbHMuZGVsYXkgMCwgPT5cblx0IFx0XHRpZiBAc2VsZWN0ZWRcbiBcdFx0XHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLmJhY2tncm91bmRDb2xvciA9IHBhcmFtcy5zd2l0Y2hUaW50XG5cblx0QHN3aXRjaEJhY2tncm91bmQub24gRXZlbnRzLkFuaW1hdGlvblN0YXJ0LCA9PlxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLmJhY2tncm91bmRDb2xvciA9ICcnXG5cblx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuYWRkXG5cdFx0ZGVzZWxlY3RlZDoge3g6IDB9XG5cdEBzd2l0Y2hCdXR0b24uc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdGN1cnZlOiBcInNwcmluZyg0MDAsMjUsMClcIlxuXHRcdFxuXHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyLnNlbGVjdCA9ID0+XG5cdFx0QHNlbGVjdGVkID0gdHJ1ZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5zd2l0Y2goXCJkZWZhdWx0XCIpXG5cdFx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuc3dpdGNoKFwiZGVmYXVsdFwiKVxuXHRcdFxuXHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyLmRlc2VsZWN0ID0gPT5cblx0XHRAc2VsZWN0ZWQgPSBmYWxzZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5zd2l0Y2goXCJkZXNlbGVjdGVkXCIpXG5cdFx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuc3dpdGNoKFwiZGVzZWxlY3RlZFwiKVxuXG5cdGlmIEBzZWxlY3RlZCA9PSBmYWxzZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5zd2l0Y2hJbnN0YW50KFwiZGVzZWxlY3RlZFwiKVxuXHRcdEBzd2l0Y2hCdXR0b24uc3RhdGVzLnN3aXRjaEluc3RhbnQoXCJkZXNlbGVjdGVkXCIpXG5cdGVsc2Vcblx0XHRAc3dpdGNoQmFja2dyb3VuZC5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbXMuc3dpdGNoVGludFxuXG5cdHJldHVybiBAc3dpdGNoQnV0dG9uQ29udGFpbmVyXG5cdFxuQ3Jvc3MgPSAtPlxuXHRjb2xvciA9IGRlZmF1bHRzLnRpbnRcblx0Y3Jvc3NUaGlja25lc3MgPSA0XG5cdGNyb3NzID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IDMwXHRcblx0XHRoZWlnaHQ6IDMwXHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuXHRjcm9zc1Vwc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjcm9zc1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAyMFxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRvcmlnaW5YOiAxXG5cdFx0c3VwZXJMYXllcjogY3Jvc3Ncblx0Y3Jvc3NVcHN0cm9rZS55ID0gMTRcblx0Y3Jvc3NVcHN0cm9rZS5yb3RhdGlvblogPSA0NVxuXHRjcm9zc0Rvd25zdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNyb3NzVGhpY2tuZXNzXG5cdFx0d2lkdGg6IDIwXG5cdFx0b3JpZ2luWDogMVxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRzdXBlckxheWVyOiBjcm9zc1xuXHRjcm9zc0Rvd25zdHJva2Uucm90YXRpb25aID0gLTQ1XG5cdGNyb3NzLnNlbGVjdCA9IC0+XG5cdFx0Y3Jvc3MuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRjcm9zcy5kZXNlbGVjdCA9IC0+XG5cdFx0Y3Jvc3MuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRzY2FsZTogMC40XG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXHRcdFxuXHRyZXR1cm4gY3Jvc3Ncblx0XG5DYXJldCA9IC0+XG5cdGNvbG9yID0gZGVmYXVsdHMudGludFxuXHRjYXJldFRoaWNrbmVzcyA9IDRcblx0Y2FyZXQgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogMzBcblx0XHRoZWlnaHQ6IDMwXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcdFx0XG5cdGNhcmV0VXBzdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNhcmV0VGhpY2tuZXNzXG5cdFx0d2lkdGg6IDE4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdG9yaWdpblg6IDFcblx0XHRzdXBlckxheWVyOiBjYXJldFxuXHRjYXJldFVwc3Ryb2tlLnkgPSAxNFxuXHRjYXJldFVwc3Ryb2tlLnJvdGF0aW9uWiA9IDQ1XG5cdGNhcmV0RG93bnN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2FyZXRUaGlja25lc3Ncblx0XHR3aWR0aDogMThcblx0XHRvcmlnaW5YOiAxXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdHN1cGVyTGF5ZXI6IGNhcmV0XG5cdGNhcmV0RG93bnN0cm9rZS55ID0gMTJcdFx0XG5cdGNhcmV0RG93bnN0cm9rZS5yb3RhdGlvblogPSAtNDVcblx0Y2FyZXQuc2VsZWN0ID0gLT5cblx0XHRjYXJldC5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXG5cdGNhcmV0LmRlc2VsZWN0ID0gLT5cblx0XHRjYXJldC5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHNjYWxlOiAwLjRcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcdFxuXHRyZXR1cm4gY2FyZXRcblx0XG5DaGVjayA9IC0+XG5cdGNvbG9yID0gZGVmYXVsdHMudGludFxuXHRjaGVja1RoaWNrbmVzcyA9IDRcblx0Y2hlY2sgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogMzBcblx0XHRoZWlnaHQ6IDMwXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcblx0Y2hlY2tVcHN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2hlY2tUaGlja25lc3Ncblx0XHR3aWR0aDogMTNcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0b3JpZ2luWDogMVxuXHRcdHN1cGVyTGF5ZXI6IGNoZWNrXG5cdGNoZWNrVXBzdHJva2UueSA9IDE2XG5cdGNoZWNrVXBzdHJva2Uucm90YXRpb25aID0gNDVcblx0Y2hlY2tEb3duc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjaGVja1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAyMlxuXHRcdG9yaWdpblg6IDFcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0c3VwZXJMYXllcjogY2hlY2tcdFxuXHRjaGVja0Rvd25zdHJva2UueCA9IDRcblx0Y2hlY2tEb3duc3Ryb2tlLnJvdGF0aW9uWiA9IC00NVxuXHRjaGVjay5zZWxlY3QgPSAtPlxuXHRcdGNoZWNrLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcblx0Y2hlY2suZGVzZWxlY3QgPSAtPlxuXHRcdGNoZWNrLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0c2NhbGU6IDAuNFxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRyZXR1cm4gY2hlY2tcblxuXG4jIyNcblx0VEFCTEUgVklFV1xuXHRcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0VGFibGVWaWV3Um93XHRcdFtFbGVtZW50cyBnbyBoZXJlXVxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4jIyNcblxuZXhwb3J0cy5UYWJsZVZpZXdSb3cgPSAocGFyYW1zKSAtPlxuXHRcblx0IyBUaGUgdHJpY2t5IHRoaW5nIGFib3V0IHJldXNhYmxlIGNvbXBvbmVudHMgaXMgcmVtZW1iZXJpbmdcblx0IyBob3cgdG8gdXNlIHRoZW0gKHBhcnRpY3VsYXJseSBpZiB0aGV5IGhhdmUgbG90cyBvZiBjdXN0b21pemFibGVcblx0IyBwYXJhbWV0ZXJzKS4gU2V0dGluZyBzZW5zaWJsZSBkZWZhdWx0cyBtYWtlcyBpdCB3YXkgZWFzaWVyIHRvIGdldFxuXHQjIHN0YXJ0ZWQgKGFuZCByZW1lbWJlciBob3cgdG8gdXNlIHRoZSB0aGluZyB5b3UgbWFkZSlcblx0Xy5kZWZhdWx0cyBwYXJhbXMsIFxuXHRcdG5hbWU6ICdHaXZlIG1lIGEgbmFtZSEnXG5cdFx0eDogMFxuXHRcdHk6IDBcblx0XHRlbmFibGVkOiB0cnVlXG5cdFx0c2VsZWN0ZWQ6IHRydWVcblx0XHRpY29uOiAnY2hlY2snXG5cdFx0dGV4dENvbG9yOiBkZWZhdWx0cy50aW50XG5cdFx0c3dpdGNoVGludDogJ2dyZWVuJ1xuXHRcdGZpcnN0SXRlbUluTGlzdDogdHJ1ZSAjIGNvdWxkIGJlIGZpcnN0IG9yIGxhc3Rcblx0XHRsYXN0SXRlbUluTGlzdDogdHJ1ZSAjIGNvdWxkIGJlIGZpcnN0IG9yIGxhc3Rcblx0XHRcblx0XHQjIENvbnN0YW50c1xuXHRcdHNjcmVlbldpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdHRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmc6IGRlZmF1bHRzLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0XHR0YWJsZVJvd0hlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRib3JkZXJDb2xvcjogZGVmYXVsdHMubGluZVRpbnQgIyBHcmV5IHJvdW5kZWQgcGlsbCAmIGJvcmRlcnMgYmV0d2VlbiBjZWxsc1xuXG5cdCMgU29tZSBvZiB0aGUgdmFsdWVzIGFyZSBiYXNlZCBvbiBvdGhlciBjb25zdGFudHMsXG5cdCMgc28geW91IGhhdmUgdG8gY2FsY3VsYXRlIHRoZW0gaW4gYSBzZWNvbmQgcGFzc1xuXHRzd2l0Y2hCdXR0b25SYWRpdXMgPSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0LzJcblx0c2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIgPSAyXG5cdFx0XG5cdCMgVGhpcyBpcyB0aGUgcm9vdCBvYmplY3QgZm9yIHRoaXMgZW50aXJlIGNvbXBvbmVudC5cblx0IyBXZSB3aWxsIGF0dGFjaCBhbGwgb3VyIGZ1bmN0aW9ucyBkaXJlY3RseSB0byB0aGlzIGxheWVyXG5cdEBsaXN0SXRlbUNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IHBhcmFtcy54XG5cdFx0eTogcGFyYW1zLnlcblx0XHR3aWR0aDogXHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRjbGlwOiBmYWxzZVxuXHRcdGJhY2tncm91bmRDb2xvcjogZGVmYXVsdHMuaXRlbUJhY2tncm91bmRcblx0QGxpc3RJdGVtQ29udGFpbmVyLnN0eWxlID0gXG5cdFx0Ym9yZGVyVG9wOiBcdFx0aWYgcGFyYW1zLmZpcnN0SXRlbUluTGlzdCB0aGVuIFwiMXB4IHNvbGlkIFwiICsgcGFyYW1zLmJvcmRlckNvbG9yIGVsc2UgXCJcIlxuXHRcdGJvcmRlckJvdHRvbTogXHRpZiBwYXJhbXMubGFzdEl0ZW1Jbkxpc3QgdGhlbiBcIjFweCBzb2xpZCBcIiArIHBhcmFtcy5ib3JkZXJDb2xvciBlbHNlIFwiXCJcblxuXHQjIFRoZXNlIHdpbGwgYmUgYWNjZXNzZWQgdXNpbmcgZnVuY3Rpb25zXG5cdEBlbmFibGVkID0gcGFyYW1zLmVuYWJsZWRcblx0QHNlbGVjdGVkID0gcGFyYW1zLnNlbGVjdGVkXG5cdFxuXHRAbGlzdEl0ZW0gPSBuZXcgTGF5ZXIgXG5cdFx0eDogcGFyYW1zLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0XHR3aWR0aDogXHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRzdXBlckxheWVyOiBAbGlzdEl0ZW1Db250YWluZXJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1x0XG5cdEBsaXN0SXRlbS5zdHlsZSA9IGRlZmF1bHRzLmxpc3RJdGVtVGV4dFN0eWxlXG5cdEBsaXN0SXRlbS5zdHlsZSA9XG5cdFx0Y29sb3I6IHBhcmFtcy50ZXh0Q29sb3Jcblx0XHRib3JkZXJUb3A6IFx0aWYgcGFyYW1zLmZpcnN0SXRlbUluTGlzdCB0aGVuIFwiXCIgZWxzZSBcIjFweCBzb2xpZCBcIiArIHBhcmFtcy5ib3JkZXJDb2xvclxuXG5cdCMgVGhpcyBpcyB3aGVyZSB0aGUgbGFiZWwgb2YgdGhlIGxpc3QgaXRlbSBsaXZlc1xuXHRAbGlzdEl0ZW0uaHRtbCA9IHBhcmFtcy5uYW1lIFxuXG5cdCMgQWRkIHRoZSBjaGVja21hcmsgZm9yIHRoZSBsaXN0XG5cdHRoaW5nVG9Td2l0Y2ggPSBzd2l0Y2hcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdjaGVjaycgdGhlbiBuZXcgQ2hlY2soKVxuXHRcdHdoZW4gcGFyYW1zLmljb24gPT0gJ2Nyb3NzJyB0aGVuIG5ldyBDcm9zcygpXG5cdFx0d2hlbiBwYXJhbXMuaWNvbiA9PSAnY2FyZXQnIHRoZW4gbmV3IENhcmV0KClcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdzd2l0Y2gnIHRoZW4gbmV3IFN3aXRjaCgpXG5cblx0dGhpbmdUb1N3aXRjaC5zdXBlckxheWVyID0gQGxpc3RJdGVtQ29udGFpbmVyXG5cdHRoaW5nVG9Td2l0Y2gueCA9IGRlZmF1bHRzLnNjcmVlbldpZHRoIC0gdGhpbmdUb1N3aXRjaC53aWR0aCAtIGRlZmF1bHRzLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0dGhpbmdUb1N3aXRjaC5jZW50ZXJZKDIpXG4jIFx0dGhpbmdUb1N3aXRjaC55ID0gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzIgLSB0aGluZ1RvU3dpdGNoLmhlaWdodC8yXG5cdFxuXHQjIE1BS0UgSVQgQUxMIElOVEVSQUNUSVZFXG5cdCMgT24gYSBjbGljaywgZ28gdG8gdGhlIG5leHQgc3RhdGVcblx0aWYgcGFyYW1zLmljb24gPT0gJ3N3aXRjaCdcblx0XHR0aGluZ1RvU3dpdGNoLm9uIEV2ZW50cy5DbGljaywgPT5cblx0XHRcdEBsaXN0SXRlbUNvbnRhaW5lci5zd2l0Y2goKVxuXHRlbHNlIFxuXHRcdEBsaXN0SXRlbS5vbiBFdmVudHMuQ2xpY2ssID0+XG5cdFx0XHRAbGlzdEl0ZW1Db250YWluZXIuc3dpdGNoKClcblxuXHRAbGlzdEl0ZW1Db250YWluZXIuc3dpdGNoID0gPT5cblx0XHRpZiBAc2VsZWN0ZWQgdGhlbiBAbGlzdEl0ZW1Db250YWluZXIuZGVzZWxlY3QoKSBlbHNlIEBsaXN0SXRlbUNvbnRhaW5lci5zZWxlY3QoKVxuXHRcdFxuXHRAbGlzdEl0ZW1Db250YWluZXIuc2VsZWN0ID0gKG9wdGlvbnMpID0+XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge3N1cHJlc3NFdmVudHM6IGZhbHNlfVxuXHRcdGlmIEBlbmFibGVkIFxuXHRcdFx0dGhpbmdUb1N3aXRjaC5zZWxlY3QoKVxuXHRcdFx0QHNlbGVjdGVkID0gdHJ1ZVxuXHRcdGlmIG9wdGlvbnMuc3VwcmVzc0V2ZW50cyA9PSBmYWxzZVxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLmVtaXQgXCJEaWRDaGFuZ2VcIiwgeyBzZWxlY3RlZDogQHNlbGVjdGVkIH1cblxuXHRAbGlzdEl0ZW1Db250YWluZXIuZGVzZWxlY3QgPSAob3B0aW9ucykgPT5cblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7c3VwcmVzc0V2ZW50czogZmFsc2V9XG5cdFx0aWYgQGVuYWJsZWQgXG5cdFx0XHR0aGluZ1RvU3dpdGNoLmRlc2VsZWN0KClcdFx0XG5cdFx0XHRAc2VsZWN0ZWQgPSBmYWxzZVxuXHRcdGlmIG9wdGlvbnMuc3VwcmVzc0V2ZW50cyA9PSBmYWxzZVxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLmVtaXQgXCJEaWRDaGFuZ2VcIiwgeyBzZWxlY3RlZDogQHNlbGVjdGVkIH1cblxuXHRAbGlzdEl0ZW1Db250YWluZXIudXBkYXRlTGFiZWwgPSAobmV3VGV4dCkgPT5cblx0XHRAbGlzdEl0ZW0uaHRtbCA9IG5ld1RleHRcblx0XHRcdFxuXHRAbGlzdEl0ZW1Db250YWluZXIudXBkYXRlTGFiZWwocGFyYW1zLm5hbWUpXG5cblx0cmV0dXJuIEBsaXN0SXRlbUNvbnRhaW5lclxuXG5leHBvcnRzLlRhYmxlVmlldyA9IChwYXJhbXMpIC0+XG5cdHBhcmFtcyA9IHBhcmFtcyBvciB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcyxcblx0XHR5OiBcdFx0MFxuXHRcdHdpZHRoOlx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRpdGVtczogW1wiSXQncyBqdXN0IG1lIVwiXVxuXHRcdGljb246ICdjaGVjaydcblx0XHR2YWxpZGF0aW9uOiAnbm9uZSdcblx0XG5cdEBidXR0b25Hcm91cENvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTpcdFx0cGFyYW1zLnlcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICogcGFyYW1zLml0ZW1zLmxlbmd0aFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIm5vbmVcIlxuXHRcdFx0XHRcdFxuXHRAYnV0dG9uQXJyYXkgPSBbXVxuXHRmb3IgYnV0dG9uTmFtZSwgaSBpbiBwYXJhbXMuaXRlbXNcblx0XHRmaXJzdEl0ZW1Jbkxpc3QgPSBpZiBpID09IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2Vcblx0XHRsYXN0SXRlbUluTGlzdCA9IGlmIGkgPT0gKHBhcmFtcy5pdGVtcy5sZW5ndGgtMSkgdGhlbiB0cnVlIGVsc2UgZmFsc2Vcblx0XHRuZXdCdXR0b24gPSBuZXcgZXhwb3J0cy5UYWJsZVZpZXdSb3coe1xuXHRcdFx0eDogMCwgXG5cdFx0XHR5OiBpKmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LCBcblx0XHRcdG5hbWU6IGJ1dHRvbk5hbWUsIFxuXHRcdFx0aWNvbjogcGFyYW1zLmljb24sXG5cdFx0XHRmaXJzdEl0ZW1Jbkxpc3Q6IGZpcnN0SXRlbUluTGlzdCxcblx0XHRcdGxhc3RJdGVtSW5MaXN0OiBsYXN0SXRlbUluTGlzdFxuXHRcdH0pXG5cdFx0QGJ1dHRvbkFycmF5LnB1c2gobmV3QnV0dG9uKVxuXHRcdG5ld0J1dHRvbi5zdXBlckxheWVyID0gQGJ1dHRvbkdyb3VwQ29udGFpbmVyXG5cblx0YXR0YWNoUmFkaW9CdXR0b25WYWxpZGF0aW9uID0gKGJ1dHRvbkFycmF5KSA9PlxuXHRcdGZvciBidXR0b25DbGlja2VkLCBpbmRleE9mQnV0dG9uQ2xpY2tlZCBpbiBidXR0b25BcnJheVxuXHRcdFx0IyBDcmVhdGVzIGEgY2xvc3VyZSB0byBzYXZlIHRoZSBpbmRleCBvZiB0aGUgYnV0dG9uIHdlJ3JlIGRlYWxpbmcgd2l0aFxuXHRcdFx0ZG8gKGJ1dHRvbkNsaWNrZWQsIGluZGV4T2ZCdXR0b25DbGlja2VkKSAtPiBcblx0XHRcdFx0IyBMaXN0ZW4gZm9yIGV2ZW50cyBhbmQgY2hhbmdlIG90aGVyIGJ1dHRvbnMgaW4gcmVzcG9uc2Vcblx0XHRcdFx0YnV0dG9uQ2xpY2tlZC5vbiAnRGlkQ2hhbmdlJywgKGV2ZW50KSA9PlxuXHRcdFx0XHRcdGZvciBvdGhlckJ1dHRvbiwgb3RoZXJCdXR0b25JbmRleCBpbiBidXR0b25BcnJheVxuXHRcdFx0XHRcdFx0aWYgb3RoZXJCdXR0b25JbmRleCAhPSBpbmRleE9mQnV0dG9uQ2xpY2tlZFxuXHRcdFx0XHRcdFx0XHQjIERvIHN0dWZmIHRvIHRoZSBvdGhlciBidXR0b25zXG5cdFx0XHRcdFx0XHRcdG90aGVyQnV0dG9uLmRlc2VsZWN0KHtzdXBwcmVzc0V2ZW50czogdHJ1ZX0pXG5cblx0aWYgcGFyYW1zLnZhbGlkYXRpb24gPT0gJ3JhZGlvJ1xuXHRcdGF0dGFjaFJhZGlvQnV0dG9uVmFsaWRhdGlvbihAYnV0dG9uQXJyYXkpXG5cdFx0XG5cdHJldHVybiBAYnV0dG9uR3JvdXBDb250YWluZXJcblxuXG5cbiMjI1xuXHRUQUJMRSBWSUVXIEhFQURFUlxuXHRJbiBpT1MsIHRoaXMgaXMgdHlwaWNhbGx5IGF0dGFjaGVkIHRvIHRoZSB0YWJsZSB2aWV3LCBcblx0YnV0IGl0J3MgaW5kZXBlbmRlbnQgaGVyZSBzbyB5b3UgY2FuIHB1dCBpdCB3aGVyZXZlciB5b3Ugd2FudC5cbiMjI1xuXG5leHBvcnRzLlRhYmxlVmlld0hlYWRlciA9IChwYXJhbXMpIC0+XG5cdHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcyxcblx0XHR0ZXh0OiAnSSBhbSBhIGRpdmlkZXInXG5cdFx0eDogMFxuXHRcdHk6IDBcblx0bGlzdERpdmlkZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBwYXJhbXMueCArIGRlZmF1bHRzLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0XHR5OiBwYXJhbXMueVxuXHRcdHdpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGJhY2tncm91bmRDb2xvcjogJ25vbmUnXG5cdGxpc3REaXZpZGVyLmh0bWwgPSBwYXJhbXMudGV4dFxuXHRsaXN0RGl2aWRlci5zdHlsZSA9IGRlZmF1bHRzLmRpdmlkZXJJdGVtVGV4dFN0eWxlXG5cdGxpc3REaXZpZGVyLnN0eWxlID0gXG5cdFx0Y29sb3I6IGRlZmF1bHRzLnRpbnRcblx0cmV0dXJuIGxpc3REaXZpZGVyXG5cblxuXG4jIyNcblx0UElDS0VSXG5cdEluIGlPUywgdGhpcyBpcyB0eXBpY2FsbHkgYXR0YWNoZWQgdG8gdGhlIHRhYmxlIHZpZXcsIFxuXHRidXQgaXQncyBpbmRlcGVuZGVudCBoZXJlIHNvIHlvdSBjYW4gcHV0IGl0IHdoZXJldmVyIHlvdSB3YW50LlxuIyMjXG5cblxuIyMgVXRpbGl0eSBmdW5jdGlvbnNcblxucXVhbnRpemUgPSAoaW5wdXQsIHN0ZXBTaXplKSAtPlxuXHRyZXR1cm4gTWF0aC5mbG9vcihpbnB1dC9zdGVwU2l6ZSkgKiBzdGVwU2l6ZVxuXG5cbiMjIFRoZSBpdGVtcyBpbiB0aGUgcGlja2VyXG5cbkRydW0gPSAocGFyZW50RHJ1bUxheWVyLCBsaXN0TmFtZSwgbGlzdEl0ZW1zLCBwYXJhbXMpIC0+XG5cdFxuXHQjIFNldHVwIHZhcmlhYmxlc1xuXHRAcGFyZW50RHJ1bUxheWVyID0gcGFyZW50RHJ1bUxheWVyXG5cdHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcyxcblx0XHRlbmFibGVkOiB0cnVlXG5cdFx0eFBjdDogMCAgXHRcdFx0XHQjIDAgdG8gMVxuXHRcdHdpZHRoUGN0OiAxXHRcdFx0XHQjIDAgdG8gMVxuXHRcdHRleHRBbGlnbjogXCJjZW50ZXJcIlx0XHQjIGxlZnQsIGNlbnRlciwgcmlnaHRcblx0XHR0ZXh0UGFkZGluZzogXCIwXCJcblx0XHR0ZXh0Q29sb3I6IGRlZmF1bHRzLnRpbnRcblx0XG5cdCMgVmFsdWVzIGRlcml2ZWQgZnJvbSBwYXJhbXNcblx0ZHJ1bUNvbnRhaW5lckhlaWdodCA9IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0KjVcblxuXHQjIFNldCB1cCBjb250ZW50IG9mIGxpc3QgXHRcdFxuXHRsaXN0SXRlbXMgPSBsaXN0SXRlbXNcblx0QG5hbWUgPSBsaXN0TmFtZVxuXHRAaW5kZXggPSAwXG5cdEB2YWwgPSBsaXN0SXRlbXNbQGluZGV4XVxuXHRcblx0aW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlID0gMFxuXHRcblx0IyBDYWxjdWxhdGUgaGVpZ2h0IGFuZCB2ZXJ0aWNhbCBib3VuZHMgb2YgdGhlIGxpc3Rcblx0bGlzdE1pbllQb3MgXHQ9IC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yXG5cdGxpc3RNYXhZUG9zIFx0PSAtbGlzdEl0ZW1zLmxlbmd0aCpkZWZhdWx0cy50YWJsZVJvd0hlaWdodCtkZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yXG5cdGxpc3RIZWlnaHQgXHRcdD0gbGlzdEl0ZW1zLmxlbmd0aCpkZWZhdWx0cy50YWJsZVJvd0hlaWdodCArIGRydW1Db250YWluZXJIZWlnaHRcblxuXHRAZHJ1bUNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRcdFx0XHRwYXJhbXMueFBjdCAqIGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0eTogXHRcdFx0XHRcdDBcblx0XHR3aWR0aDogXHRcdFx0XHRwYXJhbXMud2lkdGhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogXHRcdFx0ZHJ1bUNvbnRhaW5lckhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIm5vbmVcIlxuXHRcdHN1cGVyTGF5ZXI6IFx0XHRwYXJlbnREcnVtTGF5ZXJcblx0XG5cdGxpc3RMYXllciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRcdFx0XHQwXG5cdFx0eTogXHRcdFx0XHRcdC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yXG5cdFx0d2lkdGg6IFx0XHRcdFx0cGFyYW1zLndpZHRoUGN0ICogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRoZWlnaHQ6IFx0XHRcdGxpc3RIZWlnaHRcblx0XHRzdXBlckxheWVyOiBcdFx0QGRydW1Db250YWluZXJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJub25lXCJcblx0XG5cdCMgbGlzdExheWVyLnNjcm9sbCA9IHRydWVcblx0bGlzdExheWVyLmRyYWdnYWJsZS5lbmFibGVkID0gcGFyYW1zLmVuYWJsZWRcblx0bGlzdExheWVyLmRyYWdnYWJsZS5zcGVlZFggPSAwXG5cdFxuXHRmb3IgbGksIGkgaW4gbGlzdEl0ZW1zXG5cdFx0bGlzdEl0ZW1MYXllciA9IG5ldyBMYXllclxuXHRcdFx0eDogXHRcdFx0XHQwXG5cdFx0XHR5OiBcdFx0XHRcdGkgKiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCArIGRydW1Db250YWluZXJIZWlnaHQvMlxuXHRcdFx0d2lkdGg6IFx0XHRcdHBhcmFtcy53aWR0aFBjdCAqIGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0XHRoZWlnaHQ6IFx0XHRkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdFx0c3VwZXJMYXllcjogXHRsaXN0TGF5ZXJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJub25lXCIjVXRpbHMucmFuZG9tQ29sb3IoKVxuXHRcdGxpc3RJdGVtTGF5ZXIuaHRtbCA9IGxpXG5cdFx0bGlzdEl0ZW1MYXllci5zdHlsZSA9XG5cdFx0XHRjb2xvcjogXHRcdFx0cGFyYW1zLnRleHRDb2xvclxuXHRcdFx0Zm9udEZhbWlseTogXHRcIkhlbHZldGljYSBOZXVlXCJcblx0XHRcdGZvbnRXZWlnaHQ6IFx0XCIyMDBcIlxuXHRcdFx0Zm9udFNpemU6IFx0XHRcIjQycHhcIlxuXHRcdFx0bGluZUhlaWdodDogXHRkZWZhdWx0cy50YWJsZVJvd0hlaWdodCtcInB4XCJcblx0XHRcdHRleHRBbGlnbjogXHRcdHBhcmFtcy50ZXh0QWxpZ25cblx0XHRcdHBhZGRpbmc6IFx0XHRwYXJhbXMudGV4dFBhZGRpbmdcblxuXHRcdGxpc3RJdGVtTGF5ZXIuc3RhcnRZID0gaSAqIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICsgZHJ1bUNvbnRhaW5lckhlaWdodC8yXG5cblx0bGlzdExheWVyLm9uIEV2ZW50cy5EcmFnTW92ZSwgPT5cblx0XHR1cGRhdGVEcnVtQXBwZWFyYW5jZSgpXG5cdFx0XG5cdCMgVG8gc2ltdWxhdGUgaU9TIG1vbWVudHVtIHNjcm9sbGluZyAod2hpY2ggY2F1c2VzIHRoZSBkcnVtIHRvIGtlZXAgc3Bpbm5pbmcgXG5cdCMgYWZ0ZXIgeW91ciBmaW5nZXIgbGlmdHMgb2ZmIGl0KSwgd2UgdHJpZ2dlciBhbiBhbmltYXRpb24gdGhlIG1vbWVudCB5b3UgbGlmdFxuXHQjIHlvdXIgZmluZ2VyLiBUaGUgaW50ZW5zaXR5IG9mIHRoaXMgYW5pbWF0aW9uIGlzIHByb3BvcnRpb25hbCB0byB0aGUgc3BlZWQgd2hlblxuXHQjIG9mIHRoZSBkcmFnZ2luZyB3aGVuIHlvdXIgZmluZ2VyIHdhcyBsaWZ0ZWQuXG5cdGxpc3RMYXllci5vbiBFdmVudHMuRHJhZ0VuZCwgKGUsIGYpID0+XG5cdFxuXHRcdCMgVGhpcyBjYWxjdWxhdGVzIHRoZSBhbmltYXRpb25cblx0XHRzY3JvbGxWZWxvY2l0eSA9IGxpc3RMYXllci5kcmFnZ2FibGUuY2FsY3VsYXRlVmVsb2NpdHkoKS55XG5cdFx0dGltZUFmdGVyRHJhZyA9ICgwLjUrTWF0aC5hYnMoc2Nyb2xsVmVsb2NpdHkqMC4yKSkudG9GaXhlZCgxKVxuXHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gcXVhbnRpemUobGlzdExheWVyLnkgKyBzY3JvbGxWZWxvY2l0eSo0MDAsIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0KSArIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0XHRcblx0XHQjIEF0IHRoZSB0b3AgYW5kIGJvdHRvbSwgdGhlIG1vbWVudHVtIHNob3VsZCBiZSBhZGp1c3RlZCBzbyB0aGUgXG5cdFx0IyBmaXJzdCBhbmQgbGFzdCB2YWx1ZXMgb24gdGhlIGRydW0gZG9uJ3QgZ28gdG9vIGZhciBvdXQgb2Ygdmlld1xuXHRcdGRpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0bGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXIgPSAtbGlzdEl0ZW1zLmxlbmd0aCpkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGJvdHRvbU92ZXJmbG93ID0gTWF0aC5tYXgoMCwgbGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXItZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gKVxuXHRcdHRvcE92ZXJmbG93ID0gTWF0aC5tYXgoMCwgZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gKVxuXHRcdG92ZXJmbG93RGFtcGVuaW5nID0gMTBcblx0XHRcblx0XHRpZiBib3R0b21PdmVyZmxvdyA+IDBcblx0XHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gbGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXIgLSAoYm90dG9tT3ZlcmZsb3cgLyBvdmVyZmxvd0RhbXBlbmluZylcblx0XHRcdG5ld0Rpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0XHR0aW1lQWZ0ZXJEcmFnID0gdGltZUFmdGVyRHJhZyAqIChuZXdEaXN0YW5jZVRvVHJhdmVsL2Rpc3RhbmNlVG9UcmF2ZWwpXG5cblx0XHRpZiB0b3BPdmVyZmxvdyA+IDBcblx0XHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gNDAgKyAodG9wT3ZlcmZsb3cgLyBvdmVyZmxvd0RhbXBlbmluZylcblx0XHRcdG5ld0Rpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0XHR0aW1lQWZ0ZXJEcmFnID0gdGltZUFmdGVyRHJhZyAqIChuZXdEaXN0YW5jZVRvVHJhdmVsL2Rpc3RhbmNlVG9UcmF2ZWwpXG5cblx0XHQjIFRyaWdnZXIgdGhlIGFuaW1hdGlvbiwgYW5kIHNjaGVkdWxlIGFuIGV2ZW50IHRoYXQgd2lsbFxuXHRcdCMgdHJpZ2dlciB3aGVuIHRoZSBkcnVtIGZpbmFsbHkgc3RvcHMgc3Bpbm5pbmcuXG5cdFx0bGlzdExheWVyLmFuaW1hdGUoe1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eTogZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW19XG5cdFx0XHRcdHRpbWU6IHRpbWVBZnRlckRyYWdcblx0XHRcdFx0Y3VydmU6IFwiZWFzZS1vdXRcIlxuXHRcdFx0fSlcblx0XHRVdGlscy5kZWxheSB0aW1lQWZ0ZXJEcmFnLCAtPlxuXHRcdFx0c3RvcERydW0oKVxuXG5cdCMgVGhpcyBlbnN1cmVzIHRoYXQgZHVyaW5nIHRoZSBhbmltYXRpb24gb2YgdGhlIGxpc3QgbGF5ZXIsIHRoZSBkcnVtJ3MgYXBwZWFyYW5jZSBjb250aW51ZXNcblx0IyB0byBiZSB1cGRhdGVkLiBCZWNhdXNlIG11bHRpcGxlIGFuaW1hdGlvbnMgY291bGQgb3ZlcmxhcCwgd2UgZW5zdXJlIHRoYXQgZXZlcnkgbmV3IGFuaW1hdGlvblxuXHQjIGVuZHMgdGhlIGludGVydmFsIGFuZCBzdGFydHMgYSBuZXcgb25lIHNvIHRoYXQgd2UgbmV2ZXIgaGF2ZSBtb3JlIHRoYW4gb25lIHJ1bm5pbmcgXG5cdGxpc3RMYXllci5vbiBFdmVudHMuQW5pbWF0aW9uU3RhcnQsIC0+XG5cdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbFRvdXBkYXRlRHJ1bUFwcGVhcmFuY2UpXG5cdFx0aW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlID0gVXRpbHMuaW50ZXJ2YWwgMS8zMCwgdXBkYXRlRHJ1bUFwcGVhcmFuY2UgICAgXG5cblx0bGlzdExheWVyLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XHRcdFxuXHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlKVxuXG5cdFx0IyBFbWl0IGFmdGVyIGFsbCBtb3ZlbWVudCBlbmRzIGluIHRoZSBsaXN0XG5cdFx0QGRydW1Db250YWluZXIuZW1pdChcIkRydW1GaW5pc2hlZENoYW5naW5nXCIsIHtsaXN0OiBsaXN0TmFtZSwgaW5kZXg6IEBpbmRleCwgdmFsdWU6IEB2YWx9KVxuXG5cdHVwZGF0ZURydW1BcHBlYXJhbmNlID0gPT5cblx0XHRpdGVtc0luRHJ1bSA9IDRcblx0XHRsaXN0UG9zaXRpb24gPSBsaXN0TGF5ZXIueSAvIC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodCAtIDAuNVxuXHRcdGNhcHBlZExpc3RQb3NpdGlvbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKGxpc3RMYXllci55IC8gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0IC0gMC41LCBsaXN0SXRlbXMubGVuZ3RoIC0gMSkpXG5cdFx0Zm9jdXNJdGVtID0gTWF0aC5yb3VuZChjYXBwZWRMaXN0UG9zaXRpb24pXG5cdFx0ZGlzdGFuY2VGcm9tTWlkZGxlID0gTWF0aC5hYnMoZm9jdXNJdGVtIC0gY2FwcGVkTGlzdFBvc2l0aW9uKVxuXHRcdGZvciBpIGluIFsoZm9jdXNJdGVtLWl0ZW1zSW5EcnVtKS4uKGZvY3VzSXRlbStpdGVtc0luRHJ1bSldXG5cdFx0XHRpZiBpID49IDAgYW5kIGkgPCBsaXN0SXRlbXMubGVuZ3RoXG5cdFx0XHRcdGxpc3RMYXllci5zdWJMYXllcnNbaV0ub3BhY2l0eSA9IDEgLSBNYXRoLmFicyhsaXN0UG9zaXRpb24gLSBpKS81IC0gKGlmIChpICE9IGZvY3VzSXRlbSkgdGhlbiAwLjMgZWxzZSAwKVxuXHRcdFx0XHRsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnNjYWxlWSA9IDEgLSBNYXRoLm1pbigxLCBNYXRoLmFicyhsaXN0UG9zaXRpb24gLSBpKS80KVxuXHRcdFx0XHRsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnkgPSBsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnN0YXJ0WSAtIChpLWxpc3RQb3NpdGlvbikqTWF0aC5hYnMoaS1saXN0UG9zaXRpb24pKjEwXG5cblx0XHQjIFVwZGF0ZSB0aGUgdmFsdWUgb2YgdGhlIGRydW0gb25seSB3aGVuIGEgbmV3IHZhbHVlIGlzIHJlYWNoZWRcblx0XHRpZiAoQGluZGV4ICE9IGZvY3VzSXRlbSlcblx0XHRcdHVwZGF0ZURydW1WYWx1ZXMoZm9jdXNJdGVtKVxuXHRcdFxuXHRzdG9wRHJ1bSA9ID0+XHRcdFxuXHRcdCMgRW5zdXJlIHRoZSBkcnVtIG5ldmVyIGVuZHMgb3V0IG9mIGJvdW5kc1xuXHRcdGlmIGxpc3RMYXllci55ID4gbGlzdE1pbllQb3MgXG5cdFx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0ICAgIFx0cHJvcGVydGllczoge3k6bGlzdE1pbllQb3N9XG5cdFx0ICAgIFx0Y3VydmU6IFwic3ByaW5nKDQwMCw1MCwwKVwiXG5cdFx0XHR9KVxuXHRcdGlmIGxpc3RMYXllci55IDwgbGlzdE1heFlQb3Ncblx0XHRcdGxpc3RMYXllci5hbmltYXRlKHtcblx0XHRcdFx0cHJvcGVydGllczoge3k6IGxpc3RNYXhZUG9zfVxuXHRcdFx0XHRjdXJ2ZTogXCJzcHJpbmcoNDAwLDUwLDApXCJcblx0XHRcdH0pXG5cdFxuXHQjIFVwZGF0ZSB0aGUgdmFsdWVzIG9mIHRoZSBkcnVtcyBhbmQgaW52b2tlIHRoZSBjYWxsYmFjayBcblx0dXBkYXRlRHJ1bVZhbHVlcyA9IChuZXdJbmRleCkgPT5cblx0XHRAaW5kZXggPSBuZXdJbmRleFxuXHRcdEB2YWwgPSBsaXN0SXRlbXNbQGluZGV4XVxuXHRcdEBkcnVtQ29udGFpbmVyLmVtaXQoXCJEcnVtRGlkQ2hhbmdlXCIsIHtsaXN0OiBsaXN0TmFtZSwgaW5kZXg6IEBpbmRleCwgdmFsdWU6IEB2YWx9KVxuXHRcblx0IyBSZW5kZXIgZm9yIHRoZSBmaXJzdCB0aW1lXHRcdFxuXHR1cGRhdGVEcnVtQXBwZWFyYW5jZSgpXG5cdFxuXHRAc2V0SW5kZXggPSAoaW5kZXgpID0+XG5cdFx0eVBvc2l0aW9uRm9yVGhpc0luZGV4ID0gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzIgLSAoaW5kZXggKiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodClcblx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt5OiB5UG9zaXRpb25Gb3JUaGlzSW5kZXh9XG5cdFx0XHRcdHRpbWU6IDAuNVxuXHRcdFx0XHRjdXJ2ZTogXCJlYXNlLW91dFwiXG5cdFx0XHR9KVxuXG5cdEBzZXRWYWx1ZSA9ICh2YWwpID0+XG5cdFx0aW5kZXggPSBsaXN0SXRlbXMuaW5kZXhPZih2YWwpXG5cdFx0aWYgaW5kZXggIT0gLTFcblx0XHRcdEBzZXRJbmRleChpbmRleClcblxuXHQjIFJldHVybiB0aGUgZHJ1bSBvYmplY3Qgc28gd2UgY2FuIGFjY2VzcyBpdHMgdmFsdWVzXG5cdHJldHVybiBAXG5cblxuIyMjXG5cdFBJQ0tFUlxuXHRUaGlzIGNvbnRhaW5zIHRoZSBwaWNrZXIgXG4jIyMgXG5leHBvcnRzLlBpY2tlciA9IChwYXJhbXMpIC0+XG5cdFxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0MFxuXHRcdHdpZHRoOlx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRkZWZhdWx0VGV4dDogXCJcIlxuXHRcdHRleHRDb2xvcjogZGVmYXVsdHMudGludFxuXG5cdGRydW1Db250YWluZXJIZWlnaHQgPSBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCo1XG5cblx0QHBpY2tlckNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRwYXJhbXMueFxuXHRcdHk6XHRcdHBhcmFtcy55XG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0OiBkcnVtQ29udGFpbmVySGVpZ2h0Kzg4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdGRlZmF1bHRzLml0ZW1CYWNrZ3JvdW5kXG5cdFx0XHRcblx0QGRydW0gPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0MFxuXHRcdHk6IFx0XHQ4OFxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZHJ1bUNvbnRhaW5lckhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJub25lXCJcblx0XHRzdXBlckxheWVyOiBAcGlja2VyQ29udGFpbmVyXHRcdFxuXHRcdFxuXHRAc2VsZWN0ZWRJdGVtID0gbmV3IExheWVyXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0ZHJ1bUNvbnRhaW5lckhlaWdodC8yIC0gZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwibm9uZVwiXG5cdFx0c3VwZXJMYXllcjogQGRydW1cblxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTogXHRcdDBcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6XHQ4OFxuXHRcdGJhY2tncm91bmRDb2xvcjogZGVmYXVsdHMuaXRlbUJhY2tncm91bmRcblx0XHRzdXBlckxheWVyOiBAcGlja2VyQ29udGFpbmVyXG5cdFx0XG5cdCMgU3R5bGVzXG5cdEBkcnVtLnN0eWxlID1cblx0XHRwb2ludGVyRXZlbnRzOiBcIm5vbmVcIlxuXHRcdGJvcmRlclRvcDogXCIxcHggc29saWQgXCIgKyBkZWZhdWx0cy5saW5lVGludFxuXHRcdGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgXCIgKyBkZWZhdWx0cy5saW5lVGludFxuXHRcblx0QHNlbGVjdGVkSXRlbS5zdHlsZSA9XG5cdFx0cG9pbnRlckV2ZW50czogXCJub25lXCJcblx0XHRib3JkZXJUb3A6IFwiMXB4IHNvbGlkIHJnYmEoMCwwLDAsMC4zKVwiXG5cdFx0Ym9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDAsMCwwLDAuMylcIlxuXHRcdFxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlci5zdHlsZSA9IGRlZmF1bHRzLmxpc3RJdGVtVGV4dFN0eWxlXG5cdEBwaWNrZXJDb250YWluZXIucGlja2VySGVhZGVyLnN0eWxlID0gXG5cdFx0Y29sb3I6IHBhcmFtcy50ZXh0Q29sb3Jcblx0XHRwYWRkaW5nTGVmdDogXCIyMHB4XCJcblx0XHRib3JkZXJUb3A6IFwiMXB4IHNvbGlkIFwiICsgZGVmYXVsdHMubGluZVRpbnRcblx0XHRcdFxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlci5odG1sID0gcGFyYW1zLmRlZmF1bHRUZXh0XG5cdFx0XG5cdFx0XG5cdCMgQWRkIGRydW1zXG5cdEBwaWNrZXJDb250YWluZXIuZHJ1bXMgPSBbXVxuXHRAcGlja2VyQ29udGFpbmVyLmRydW1zQnlOYW1lID0ge31cblx0XG5cdHBpY2tlckRpZENoYW5nZSA9ICgpPT5cblx0XHRkcnVtVmFsdWVzID0ge31cblx0XHRuZXdWYWx1ZXMgPSBmb3IgZHJ1bSBpbiBAcGlja2VyQ29udGFpbmVyLmRydW1zXG5cdFx0XHRkcnVtVmFsdWVzW2RydW0ubmFtZV0gPSB7aW5kZXg6IGRydW0uaW5kZXgsIHZhbDogZHJ1bS52YWx9XG5cblx0XHRAcGlja2VyQ29udGFpbmVyLmVtaXQoXCJQaWNrZXJEaWRDaGFuZ2VcIiwgZHJ1bVZhbHVlcyApXG5cdFxuXHRwaWNrZXJGaW5pc2hlZENoYW5naW5nID0gKCk9PlxuXHRcdGRydW1WYWx1ZXMgPSB7fVxuXHRcdG5ld1ZhbHVlcyA9IGZvciBkcnVtIGluIEBwaWNrZXJDb250YWluZXIuZHJ1bXNcblx0XHRcdGRydW1WYWx1ZXNbZHJ1bS5uYW1lXSA9IHtpbmRleDogZHJ1bS5pbmRleCwgdmFsOiBkcnVtLnZhbH1cblxuXHRcdEBwaWNrZXJDb250YWluZXIuZW1pdChcIlBpY2tlckZpbmlzaGVkQ2hhbmdpbmdcIiwgZHJ1bVZhbHVlcyApXHRcblx0aWYgKHBhcmFtcy5kcnVtcyBhbmQgcGFyYW1zLmRydW1zLmxlbmd0aCA+IDApXG5cdFx0Zm9yIGRydW0gaW4gcGFyYW1zLmRydW1zXG5cdFx0XHRuZXdEcnVtID0gbmV3IERydW0oQGRydW0sIGRydW0ubmFtZSwgZHJ1bS5pdGVtcywgZHJ1bS5wYXJhbXMpXG5cblx0XHRcdCMjIFN0b3JlIGRydW1zIGluc2lkZSB0aGUgcGlja2VyXG5cdFx0XHRAcGlja2VyQ29udGFpbmVyLmRydW1zLnB1c2gobmV3RHJ1bSlcblx0XHRcdEBwaWNrZXJDb250YWluZXIuZHJ1bXNCeU5hbWVbZHJ1bS5uYW1lXSA9IG5ld0RydW0gXG5cblx0XHRcdCMjIEVuc3VyZSB0aGF0IGNoYW5nZXMgdG8gdGhlIGRydW0gYnViYmxlIHVwIHRvIHRoZSBwaWNrZXJcblx0XHRcdG5ld0RydW0uZHJ1bUNvbnRhaW5lci5vbiBcIkRydW1EaWRDaGFuZ2VcIiwgcGlja2VyRGlkQ2hhbmdlXG5cdFx0XHRcblx0XHRcdCMjIEVtaXQgYW4gZXZlbnQgd2hlbiBkcnVtcyBzdG9wIG1vdmluZyBhbHRvZ2V0aGVyXG5cdFx0XHRuZXdEcnVtLmRydW1Db250YWluZXIub24gXCJEcnVtRmluaXNoZWRDaGFuZ2luZ1wiLCBwaWNrZXJGaW5pc2hlZENoYW5naW5nXG5cblx0cmV0dXJuIEBwaWNrZXJDb250YWluZXJcblxuXG5cblxuIl19
