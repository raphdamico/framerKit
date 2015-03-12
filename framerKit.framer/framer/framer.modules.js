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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcmFwaGRhbWljby9Eb2N1bWVudHMvR2l0L2ZyYW1lcktpdC9mcmFtZXJLaXQuZnJhbWVyL21vZHVsZXMvZnJhbWVyS2l0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQUE7Ozs7Ozs7Ozs7OztHQUFBO0FBaUJBO0FBQUE7Ozs7O0dBakJBO0FBQUEsSUFBQSxxREFBQTs7QUFBQSxRQXVCQSxHQUFXO0FBQUEsRUFDVixXQUFBLEVBQWEsR0FESDtDQXZCWCxDQUFBOztBQTJCQTtBQUFBOztHQTNCQTs7QUFBQSxRQThCUSxDQUFDLGNBQVQsR0FBMEIsRUE5QjFCLENBQUE7O0FBQUEsUUErQlEsQ0FBQyx5QkFBVCxHQUFxQyxFQS9CckMsQ0FBQTs7QUFBQSxRQWdDUSxDQUFDLElBQVQsR0FBZ0IsTUFoQ2hCLENBQUE7O0FBQUEsUUFpQ1EsQ0FBQyxRQUFULEdBQW9CLHFCQWpDcEIsQ0FBQTs7QUFBQSxRQWtDUSxDQUFDLGNBQVQsR0FBMEIsT0FsQzFCLENBQUE7O0FBQUEsUUFtQ1EsQ0FBQyxpQkFBVCxHQUE2QjtBQUFBLEVBQzVCLFFBQUEsRUFBVSxNQURrQjtBQUFBLEVBRTVCLFVBQUEsRUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFULEdBQXdCLENBQXpCLENBQUEsR0FBNEIsSUFGWjtBQUFBLEVBRzVCLFVBQUEsRUFBWSxnQkFIZ0I7QUFBQSxFQUk1QixVQUFBLEVBQVksS0FKZ0I7Q0FuQzdCLENBQUE7O0FBQUEsUUF5Q1EsQ0FBQyxvQkFBVCxHQUFnQztBQUFBLEVBQy9CLFFBQUEsRUFBVSxNQURxQjtBQUFBLEVBRS9CLFVBQUEsRUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFULEdBQXdCLENBQXpCLENBQUEsR0FBNEIsSUFGVDtBQUFBLEVBRy9CLFVBQUEsRUFBWSxnQkFIbUI7QUFBQSxFQUkvQixVQUFB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c0JBQXpCLEVBQWlELHNCQUFqRCxDQVZBLENBREQ7QUFBQSxLQUREO0dBOUVBO0FBNEZBLFNBQU8sSUFBQyxDQUFBLGVBQVIsQ0E5RmdCO0FBQUEsQ0Evb0JqQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMjI1xuICBGcmFtZXJLaXQgZm9yIEZyYW1lclxuICBodHRwczovL2dpdGh1Yi5jb20vcmFwaGRhbWljby9mcmFtZXJLaXRcblxuICBDb3B5cmlnaHQgKGMpIDIwMTUsIFJhcGggRCdBbWljbyBodHRwOi8vcmFwaGRhbWljby5jb20gKEByYXBoZGFtaWNvKVxuICBNSVQgTGljZW5zZVxuXG4gIFJlYWRtZTpcbiAgaHR0cHM6Ly9naXRodWIuY29tL3JhcGhkYW1pY28vZnJhbWVyS2l0XG5cbiAgTGljZW5zZTpcbiAgaHR0cHM6Ly9naXRodWIuY29tL3JhcGhkYW1pY28vZnJhbWVyS2l0L2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiMjI1xuXG5cblxuXG4jIyNcblx0REVGQVVMVCBTVFlMRVNcblx0Tm90ZSB0aGUgc2NyZWVud2lkdGggY29uc3RhbnQ6IHRoaXMgaXMgcHJvYmFibHkgb25lIG9mIHRoZVxuXHRmaXJzdCB0aGluZ3MgeW91IHdhbnQgdG8gY2hhbmdlIHNvIGl0IG1hdGNoZXMgdGhlIGRldmljZVxuXHR5b3UncmUgcHJvdG90eXBpbmcgb24uXG4jIyNcbmRlZmF1bHRzID0ge1xuXHRzY3JlZW5XaWR0aDogNzUwXG59XG5cbiMjI1xuXHRNT1JFIFNUWUxFU1xuIyMjXG5kZWZhdWx0cy50YWJsZVJvd0hlaWdodCA9IDg4XG5kZWZhdWx0cy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nID0gMjBcbmRlZmF1bHRzLnRpbnQgPSAnZ3JleSdcbmRlZmF1bHRzLmxpbmVUaW50ID0gXCJyZ2JhKDIwMCwyMDAsMjAwLDEpXCJcbmRlZmF1bHRzLml0ZW1CYWNrZ3JvdW5kID0gJ3doaXRlJ1xuZGVmYXVsdHMubGlzdEl0ZW1UZXh0U3R5bGUgPSB7XG5cdGZvbnRTaXplOiBcIjMycHhcIlxuXHRsaW5lSGVpZ2h0OiAoZGVmYXVsdHMudGFibGVSb3dIZWlnaHQtNCkrXCJweFwiXHRcdFxuXHRmb250RmFtaWx5OiBcIkhlbHZldGljYSBOZXVlXCJcblx0Zm9udFdlaWdodDogXCIyMDBcIlxufVxuZGVmYXVsdHMuZGl2aWRlckl0ZW1UZXh0U3R5bGUgPSB7XG5cdGZvbnRTaXplOiBcIjIycHhcIlxuXHRsaW5lSGVpZ2h0OiAoZGVmYXVsdHMudGFibGVSb3dIZWlnaHQtNCkrXCJweFwiXHRcdFxuXHRmb250RmFtaWx5OiBcIkhlbHZldGljYSBOZXVlXCJcblx0Zm9udFdlaWdodDogXCIyMDBcIlxuXHR0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJ1xufVxuZXhwb3J0cy5kZWZhdWx0cyA9IGRlZmF1bHRzXG5cblxuIyMjXG5cdFRBQkxFIFZJRVcgRUxFTUVOVFNcblx0KGUuZy4gXCJUaHVtYlwiIGZvciB0aGUgc3dpdGNoIGNvbnRyb2wpXG4jIyNcblxuU3dpdGNoID0gKHBhcmFtcykgLT5cblx0cGFyYW1zID0gcGFyYW1zIG9yIHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLCBcblx0XHRzd2l0Y2hUaW50OiAnIzFEQzI0Qidcblx0XHRzY3JlZW5XaWR0aDogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHR0YWJsZVJvd0hlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRzd2l0Y2hDb250YWluZXJCb3JkZXI6IDRcblx0XHRzd2l0Y2hDb250YWluZXJIZWlnaHQ6IDU0XG5cdFx0c3dpdGNoQ29udGFpbmVyV2lkdGg6IDk0XG5cdFx0Ym9yZGVyQ29sb3I6IGRlZmF1bHRzLmxpbmVUaW50ICMgR3JleSByb3VuZGVkIHBpbGwgJiBib3JkZXJzIGJldHdlZW4gY2VsbHNcblxuXHRAc2VsZWN0ZWQgPSB0cnVlXG5cdFxuXHQjIFNvbWUgb2YgdGhlIHZhbHVlcyBhcmUgYmFzZWQgb24gb3RoZXIgY29uc3RhbnRzLFxuXHQjIHNvIHlvdSBoYXZlIHRvIGNhbGN1bGF0ZSB0aGVtIGluIGEgc2Vjb25kIHBhc3Ncblx0c3dpdGNoQnV0dG9uUmFkaXVzID0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodC8yXG5cdHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyID0gMlxuXHRcblx0IyBUaGlzIGlzIG91ciBmYW5jeSBhbmltYXRlZCBzd2l0Y2ggc3dpdGNoXG5cdCMgd2UgbmVlZCB0byBtYWtlIGEgcm91bmRlZCByZWN0YW5nbGUgd2l0aCBhIGNpcmNsZSBpbnNpZGUgaXQuXG5cdEBzd2l0Y2hCdXR0b25Db250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0XHRcdFx0MFxuXHRcdHk6IFx0XHRcdFx0XHQwXG5cdFx0Y2xpcDogXHRcdFx0XHRmYWxzZSAjIENsaXBwaW5nIGh1cnRzIHRoZSBzdWJ0bGUgc2hhZG93IG9uIHRoZSBidXR0b25cblx0XHR3aWR0aDpcdFx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJXaWR0aCBcblx0XHRoZWlnaHQ6XHRcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwiXCJcblx0XHRvcGFjaXR5OiBcdFx0XHQxXG5cblx0QHN3aXRjaEJhY2tncm91bmQgPSBuZXcgTGF5ZXJcblx0XHR4Olx0XHRcdFx0XHRzd2l0Y2hCdXR0b25SYWRpdXMgLSBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlci8yXG5cdFx0eTpcdFx0XHRcdFx0c3dpdGNoQnV0dG9uUmFkaXVzIC0gc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIvMiAtIDRcblx0XHR3aWR0aDogXHRcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVyV2lkdGggLSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0ICsgc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXJcblx0XHRoZWlnaHQ6IFx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQgLSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0ICsgc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXJcblx0XHRib3JkZXJSYWRpdXM6IFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0XG5cdFx0c2hhZG93U3ByZWFkOlx0XHRzd2l0Y2hCdXR0b25SYWRpdXMgLSBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlci8yICsgcGFyYW1zLnN3aXRjaENvbnRhaW5lckJvcmRlclxuXHRcdHNoYWRvd0NvbG9yOiBcdFx0cGFyYW1zLnN3aXRjaFRpbnRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0Jydcblx0XHRvcGFjaXR5OiBcdFx0XHQxXG5cdFx0c3VwZXJMYXllcjogXHRcdEBzd2l0Y2hCdXR0b25Db250YWluZXJcblx0XHRcblx0QHN3aXRjaEJ1dHRvbiA9IG5ldyBMYXllclxuXHRcdHg6IHBhcmFtcy5zd2l0Y2hDb250YWluZXJXaWR0aCAtIHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHR5OiAtNFxuXHRcdHdpZHRoOlx0XHRcdFx0c3dpdGNoQnV0dG9uUmFkaXVzKjJcblx0XHRoZWlnaHQ6XHRcdFx0XHRzd2l0Y2hCdXR0b25SYWRpdXMqMlxuXHRcdGJvcmRlclJhZGl1czogXHRcdHN3aXRjaEJ1dHRvblJhZGl1c1xuXHRcdHNoYWRvd1k6XHRcdFx0M1xuXHRcdHNoYWRvd0JsdXI6IFx0XHQ1XG5cdFx0c2hhZG93Q29sb3I6IFx0XHQncmdiYSgwLDAsMCwwLjMpJ1xuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIndoaXRlXCJcblx0XHRvcGFjaXR5OiBcdFx0XHQxXG5cdFx0c3VwZXJMYXllcjogXHRcdEBzd2l0Y2hCdXR0b25Db250YWluZXJcblx0XG5cdCMgU0VUIFVQIEFOSU1BVElPTlNcblx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLmFkZFxuXHRcdGRlc2VsZWN0ZWQ6IFxuXHRcdFx0eDogXHRcdFx0XHQwXG5cdFx0XHR5OiBcdFx0XHRcdC00XG5cdFx0XHR3aWR0aDpcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVyV2lkdGhcblx0XHRcdGhlaWdodDpcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0XG5cdFx0XHRzaGFkb3dTcHJlYWQ6IFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckJvcmRlclxuXHRcdFx0c2F0dXJhdGU6IFx0XHQwXG5cdFx0XHRicmlnaHRuZXNzOiBcdDE1M1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIlwiXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5hbmltYXRpb25PcHRpb25zID1cblx0XHRjdXJ2ZTogXCJlYXNlLWluLW91dFwiXG5cdFx0dGltZTogMC4zIFxuXHRAc3dpdGNoQmFja2dyb3VuZC5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PlxuXHRcdFV0aWxzLmRlbGF5IDAsID0+XG5cdCBcdFx0aWYgQHNlbGVjdGVkXG4gXHRcdFx0XHRAc3dpdGNoQmFja2dyb3VuZC5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbXMuc3dpdGNoVGludFxuXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kLm9uIEV2ZW50cy5BbmltYXRpb25TdGFydCwgPT5cblx0XHRAc3dpdGNoQmFja2dyb3VuZC5iYWNrZ3JvdW5kQ29sb3IgPSAnJ1xuXG5cdEBzd2l0Y2hCdXR0b24uc3RhdGVzLmFkZFxuXHRcdGRlc2VsZWN0ZWQ6IHt4OiAwfVxuXHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5hbmltYXRpb25PcHRpb25zID1cblx0XHRjdXJ2ZTogXCJzcHJpbmcoNDAwLDI1LDApXCJcblx0XHRcblx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lci5zZWxlY3QgPSA9PlxuXHRcdEBzZWxlY3RlZCA9IHRydWVcblx0XHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuc3dpdGNoKFwiZGVmYXVsdFwiKVxuXHRcdEBzd2l0Y2hCdXR0b24uc3RhdGVzLnN3aXRjaChcImRlZmF1bHRcIilcblx0XHRcblx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lci5kZXNlbGVjdCA9ID0+XG5cdFx0QHNlbGVjdGVkID0gZmFsc2Vcblx0XHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuc3dpdGNoKFwiZGVzZWxlY3RlZFwiKVxuXHRcdEBzd2l0Y2hCdXR0b24uc3RhdGVzLnN3aXRjaChcImRlc2VsZWN0ZWRcIilcblxuXHRpZiBAc2VsZWN0ZWQgPT0gZmFsc2Vcblx0XHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuc3dpdGNoSW5zdGFudChcImRlc2VsZWN0ZWRcIilcblx0XHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5zd2l0Y2hJbnN0YW50KFwiZGVzZWxlY3RlZFwiKVxuXHRlbHNlXG5cdFx0QHN3aXRjaEJhY2tncm91bmQuYmFja2dyb3VuZENvbG9yID0gcGFyYW1zLnN3aXRjaFRpbnRcblxuXHRyZXR1cm4gQHN3aXRjaEJ1dHRvbkNvbnRhaW5lclxuXHRcbkNyb3NzID0gLT5cblx0Y29sb3IgPSBkZWZhdWx0cy50aW50XG5cdGNyb3NzVGhpY2tuZXNzID0gNFxuXHRjcm9zcyA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiAzMFx0XG5cdFx0aGVpZ2h0OiAzMFx0XG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcblx0Y3Jvc3NVcHN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY3Jvc3NUaGlja25lc3Ncblx0XHR3aWR0aDogMjBcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0b3JpZ2luWDogMVxuXHRcdHN1cGVyTGF5ZXI6IGNyb3NzXG5cdGNyb3NzVXBzdHJva2UueSA9IDE0XG5cdGNyb3NzVXBzdHJva2Uucm90YXRpb25aID0gNDVcblx0Y3Jvc3NEb3duc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjcm9zc1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAyMFxuXHRcdG9yaWdpblg6IDFcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0c3VwZXJMYXllcjogY3Jvc3Ncblx0Y3Jvc3NEb3duc3Ryb2tlLnJvdGF0aW9uWiA9IC00NVxuXHRjcm9zcy5zZWxlY3QgPSAtPlxuXHRcdGNyb3NzLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcblx0Y3Jvc3MuZGVzZWxlY3QgPSAtPlxuXHRcdGNyb3NzLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0c2NhbGU6IDAuNFxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1x0XHRcblx0cmV0dXJuIGNyb3NzXG5cdFxuQ2FyZXQgPSAtPlxuXHRjb2xvciA9IGRlZmF1bHRzLnRpbnRcblx0Y2FyZXRUaGlja25lc3MgPSA0XG5cdGNhcmV0ID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IDMwXG5cdFx0aGVpZ2h0OiAzMFxuXHRcdGJhY2tncm91bmRDb2xvcjogJ25vbmUnXHRcdFxuXHRjYXJldFVwc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjYXJldFRoaWNrbmVzc1xuXHRcdHdpZHRoOiAxOFxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRvcmlnaW5YOiAxXG5cdFx0c3VwZXJMYXllcjogY2FyZXRcblx0Y2FyZXRVcHN0cm9rZS55ID0gMTRcblx0Y2FyZXRVcHN0cm9rZS5yb3RhdGlvblogPSA0NVxuXHRjYXJldERvd25zdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNhcmV0VGhpY2tuZXNzXG5cdFx0d2lkdGg6IDE4XG5cdFx0b3JpZ2luWDogMVxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRzdXBlckxheWVyOiBjYXJldFxuXHRjYXJldERvd25zdHJva2UueSA9IDEyXHRcdFxuXHRjYXJldERvd25zdHJva2Uucm90YXRpb25aID0gLTQ1XG5cdGNhcmV0LnNlbGVjdCA9IC0+XG5cdFx0Y2FyZXQuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRjYXJldC5kZXNlbGVjdCA9IC0+XG5cdFx0Y2FyZXQuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRzY2FsZTogMC40XG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXHRcblx0cmV0dXJuIGNhcmV0XG5cdFxuQ2hlY2sgPSAtPlxuXHRjb2xvciA9IGRlZmF1bHRzLnRpbnRcblx0Y2hlY2tUaGlja25lc3MgPSA0XG5cdGNoZWNrID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IDMwXG5cdFx0aGVpZ2h0OiAzMFxuXHRcdGJhY2tncm91bmRDb2xvcjogJ25vbmUnXG5cdGNoZWNrVXBzdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNoZWNrVGhpY2tuZXNzXG5cdFx0d2lkdGg6IDEzXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdG9yaWdpblg6IDFcblx0XHRzdXBlckxheWVyOiBjaGVja1xuXHRjaGVja1Vwc3Ryb2tlLnkgPSAxNlxuXHRjaGVja1Vwc3Ryb2tlLnJvdGF0aW9uWiA9IDQ1XG5cdGNoZWNrRG93bnN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2hlY2tUaGlja25lc3Ncblx0XHR3aWR0aDogMjJcblx0XHRvcmlnaW5YOiAxXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdHN1cGVyTGF5ZXI6IGNoZWNrXHRcblx0Y2hlY2tEb3duc3Ryb2tlLnggPSA0XG5cdGNoZWNrRG93bnN0cm9rZS5yb3RhdGlvblogPSAtNDVcblx0Y2hlY2suc2VsZWN0ID0gLT5cblx0XHRjaGVjay5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXG5cdGNoZWNrLmRlc2VsZWN0ID0gLT5cblx0XHRjaGVjay5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHNjYWxlOiAwLjRcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcblx0cmV0dXJuIGNoZWNrXG5cblxuIyMjXG5cdFRBQkxFIFZJRVdcblx0XG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFRhYmxlVmlld1Jvd1x0XHRbRWxlbWVudHMgZ28gaGVyZV1cblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuIyMjXG5cbmV4cG9ydHMuVGFibGVWaWV3Um93ID0gKHBhcmFtcykgLT5cblx0XG5cdCMgVGhlIHRyaWNreSB0aGluZyBhYm91dCByZXVzYWJsZSBjb21wb25lbnRzIGlzIHJlbWVtYmVyaW5nXG5cdCMgaG93IHRvIHVzZSB0aGVtIChwYXJ0aWN1bGFybHkgaWYgdGhleSBoYXZlIGxvdHMgb2YgY3VzdG9taXphYmxlXG5cdCMgcGFyYW1ldGVycykuIFNldHRpbmcgc2Vuc2libGUgZGVmYXVsdHMgbWFrZXMgaXQgd2F5IGVhc2llciB0byBnZXRcblx0IyBzdGFydGVkIChhbmQgcmVtZW1iZXIgaG93IHRvIHVzZSB0aGUgdGhpbmcgeW91IG1hZGUpXG5cdF8uZGVmYXVsdHMgcGFyYW1zLCBcblx0XHRuYW1lOiAnR2l2ZSBtZSBhIG5hbWUhJ1xuXHRcdHg6IDBcblx0XHR5OiAwXG5cdFx0ZW5hYmxlZDogdHJ1ZVxuXHRcdHNlbGVjdGVkOiB0cnVlXG5cdFx0aWNvbjogJ2NoZWNrJ1xuXHRcdHRleHRDb2xvcjogZGVmYXVsdHMudGludFxuXHRcdHN3aXRjaFRpbnQ6ICdncmVlbidcblx0XHRmaXJzdEl0ZW1Jbkxpc3Q6IHRydWUgIyBjb3VsZCBiZSBmaXJzdCBvciBsYXN0XG5cdFx0bGFzdEl0ZW1Jbkxpc3Q6IHRydWUgIyBjb3VsZCBiZSBmaXJzdCBvciBsYXN0XG5cdFx0XG5cdFx0IyBDb25zdGFudHNcblx0XHRzY3JlZW5XaWR0aDogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHR0YWJsZVJvd0hvcml6b250YWxQYWRkaW5nOiBkZWZhdWx0cy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nXG5cdFx0dGFibGVSb3dIZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0Ym9yZGVyQ29sb3I6IGRlZmF1bHRzLmxpbmVUaW50ICMgR3JleSByb3VuZGVkIHBpbGwgJiBib3JkZXJzIGJldHdlZW4gY2VsbHNcblxuXHQjIFNvbWUgb2YgdGhlIHZhbHVlcyBhcmUgYmFzZWQgb24gb3RoZXIgY29uc3RhbnRzLFxuXHQjIHNvIHlvdSBoYXZlIHRvIGNhbGN1bGF0ZSB0aGVtIGluIGEgc2Vjb25kIHBhc3Ncblx0c3dpdGNoQnV0dG9uUmFkaXVzID0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodC8yXG5cdHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyID0gMlxuXHRcdFxuXHQjIFRoaXMgaXMgdGhlIHJvb3Qgb2JqZWN0IGZvciB0aGlzIGVudGlyZSBjb21wb25lbnQuXG5cdCMgV2Ugd2lsbCBhdHRhY2ggYWxsIG91ciBmdW5jdGlvbnMgZGlyZWN0bHkgdG8gdGhpcyBsYXllclxuXHRAbGlzdEl0ZW1Db250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBwYXJhbXMueFxuXHRcdHk6IHBhcmFtcy55XG5cdFx0d2lkdGg6IFx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0Y2xpcDogZmFsc2Vcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGRlZmF1bHRzLml0ZW1CYWNrZ3JvdW5kXG5cdEBsaXN0SXRlbUNvbnRhaW5lci5zdHlsZSA9IFxuXHRcdGJvcmRlclRvcDogXHRcdGlmIHBhcmFtcy5maXJzdEl0ZW1Jbkxpc3QgdGhlbiBcIjFweCBzb2xpZCBcIiArIHBhcmFtcy5ib3JkZXJDb2xvciBlbHNlIFwiXCJcblx0XHRib3JkZXJCb3R0b206IFx0aWYgcGFyYW1zLmxhc3RJdGVtSW5MaXN0IHRoZW4gXCIxcHggc29saWQgXCIgKyBwYXJhbXMuYm9yZGVyQ29sb3IgZWxzZSBcIlwiXG5cblx0IyBUaGVzZSB3aWxsIGJlIGFjY2Vzc2VkIHVzaW5nIGZ1bmN0aW9uc1xuXHRAZW5hYmxlZCA9IHBhcmFtcy5lbmFibGVkXG5cdEBzZWxlY3RlZCA9IHBhcmFtcy5zZWxlY3RlZFxuXHRcblx0QGxpc3RJdGVtID0gbmV3IExheWVyIFxuXHRcdHg6IHBhcmFtcy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nXG5cdFx0d2lkdGg6IFx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0c3VwZXJMYXllcjogQGxpc3RJdGVtQ29udGFpbmVyXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcdFxuXHRAbGlzdEl0ZW0uc3R5bGUgPSBkZWZhdWx0cy5saXN0SXRlbVRleHRTdHlsZVxuXHRAbGlzdEl0ZW0uc3R5bGUgPVxuXHRcdGNvbG9yOiBwYXJhbXMudGV4dENvbG9yXG5cdFx0Ym9yZGVyVG9wOiBcdGlmIHBhcmFtcy5maXJzdEl0ZW1Jbkxpc3QgdGhlbiBcIlwiIGVsc2UgXCIxcHggc29saWQgXCIgKyBwYXJhbXMuYm9yZGVyQ29sb3JcblxuXHQjIFRoaXMgaXMgd2hlcmUgdGhlIGxhYmVsIG9mIHRoZSBsaXN0IGl0ZW0gbGl2ZXNcblx0QGxpc3RJdGVtLmh0bWwgPSBwYXJhbXMubmFtZSBcblxuXHQjIEFkZCB0aGUgY2hlY2ttYXJrIGZvciB0aGUgbGlzdFxuXHR0aGluZ1RvU3dpdGNoID0gc3dpdGNoXG5cdFx0d2hlbiBwYXJhbXMuaWNvbiA9PSAnY2hlY2snIHRoZW4gbmV3IENoZWNrKClcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdjcm9zcycgdGhlbiBuZXcgQ3Jvc3MoKVxuXHRcdHdoZW4gcGFyYW1zLmljb24gPT0gJ2NhcmV0JyB0aGVuIG5ldyBDYXJldCgpXG5cdFx0d2hlbiBwYXJhbXMuaWNvbiA9PSAnc3dpdGNoJyB0aGVuIG5ldyBTd2l0Y2goKVxuXG5cdHRoaW5nVG9Td2l0Y2guc3VwZXJMYXllciA9IEBsaXN0SXRlbUNvbnRhaW5lclxuXHR0aGluZ1RvU3dpdGNoLnggPSBkZWZhdWx0cy5zY3JlZW5XaWR0aCAtIHRoaW5nVG9Td2l0Y2gud2lkdGggLSBkZWZhdWx0cy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nXG5cdHRoaW5nVG9Td2l0Y2guY2VudGVyWSgyKVxuIyBcdHRoaW5nVG9Td2l0Y2gueSA9IC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yIC0gdGhpbmdUb1N3aXRjaC5oZWlnaHQvMlxuXHRcblx0IyBNQUtFIElUIEFMTCBJTlRFUkFDVElWRVxuXHQjIE9uIGEgY2xpY2ssIGdvIHRvIHRoZSBuZXh0IHN0YXRlXG5cdGlmIHBhcmFtcy5pY29uID09ICdzd2l0Y2gnXG5cdFx0dGhpbmdUb1N3aXRjaC5vbiBFdmVudHMuQ2xpY2ssID0+XG5cdFx0XHRAbGlzdEl0ZW1Db250YWluZXIuc3dpdGNoKClcblx0ZWxzZSBcblx0XHRAbGlzdEl0ZW0ub24gRXZlbnRzLkNsaWNrLCA9PlxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLnN3aXRjaCgpXG5cblx0QGxpc3RJdGVtQ29udGFpbmVyLnN3aXRjaCA9ID0+XG5cdFx0aWYgQHNlbGVjdGVkIHRoZW4gQGxpc3RJdGVtQ29udGFpbmVyLmRlc2VsZWN0KCkgZWxzZSBAbGlzdEl0ZW1Db250YWluZXIuc2VsZWN0KClcblx0XHRcblx0QGxpc3RJdGVtQ29udGFpbmVyLnNlbGVjdCA9IChvcHRpb25zKSA9PlxuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHtzdXByZXNzRXZlbnRzOiBmYWxzZX1cblx0XHRpZiBAZW5hYmxlZCBcblx0XHRcdHRoaW5nVG9Td2l0Y2guc2VsZWN0KClcblx0XHRcdEBzZWxlY3RlZCA9IHRydWVcblx0XHRpZiBvcHRpb25zLnN1cHJlc3NFdmVudHMgPT0gZmFsc2Vcblx0XHRcdEBsaXN0SXRlbUNvbnRhaW5lci5lbWl0IFwiRGlkQ2hhbmdlXCIsIHsgc2VsZWN0ZWQ6IEBzZWxlY3RlZCB9XG5cblx0QGxpc3RJdGVtQ29udGFpbmVyLmRlc2VsZWN0ID0gKG9wdGlvbnMpID0+XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge3N1cHJlc3NFdmVudHM6IGZhbHNlfVxuXHRcdGlmIEBlbmFibGVkIFxuXHRcdFx0dGhpbmdUb1N3aXRjaC5kZXNlbGVjdCgpXHRcdFxuXHRcdFx0QHNlbGVjdGVkID0gZmFsc2Vcblx0XHRpZiBvcHRpb25zLnN1cHJlc3NFdmVudHMgPT0gZmFsc2Vcblx0XHRcdEBsaXN0SXRlbUNvbnRhaW5lci5lbWl0IFwiRGlkQ2hhbmdlXCIsIHsgc2VsZWN0ZWQ6IEBzZWxlY3RlZCB9XG5cblx0QGxpc3RJdGVtQ29udGFpbmVyLnVwZGF0ZUxhYmVsID0gKG5ld1RleHQpID0+XG5cdFx0QGxpc3RJdGVtLmh0bWwgPSBuZXdUZXh0XG5cdFx0XHRcblx0QGxpc3RJdGVtQ29udGFpbmVyLnVwZGF0ZUxhYmVsKHBhcmFtcy5uYW1lKVxuXG5cdHJldHVybiBAbGlzdEl0ZW1Db250YWluZXJcblxuZXhwb3J0cy5UYWJsZVZpZXcgPSAocGFyYW1zKSAtPlxuXHRwYXJhbXMgPSBwYXJhbXMgb3Ige31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0eTogXHRcdDBcblx0XHR3aWR0aDpcdGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aXRlbXM6IFtcIkl0J3MganVzdCBtZSFcIl1cblx0XHRpY29uOiAnY2hlY2snXG5cdFx0dmFsaWRhdGlvbjogJ25vbmUnXG5cdFxuXHRAYnV0dG9uR3JvdXBDb250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0MFxuXHRcdHk6XHRcdHBhcmFtcy55XG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCAqIHBhcmFtcy5pdGVtcy5sZW5ndGhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJub25lXCJcblx0XHRcdFx0XHRcblx0QGJ1dHRvbkFycmF5ID0gW11cblx0Zm9yIGJ1dHRvbk5hbWUsIGkgaW4gcGFyYW1zLml0ZW1zXG5cdFx0Zmlyc3RJdGVtSW5MaXN0ID0gaWYgaSA9PSAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG5cdFx0bGFzdEl0ZW1Jbkxpc3QgPSBpZiBpID09IChwYXJhbXMuaXRlbXMubGVuZ3RoLTEpIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG5cdFx0bmV3QnV0dG9uID0gbmV3IGV4cG9ydHMuVGFibGVWaWV3Um93KHtcblx0XHRcdHg6IDAsIFxuXHRcdFx0eTogaSpkZWZhdWx0cy50YWJsZVJvd0hlaWdodCwgXG5cdFx0XHRuYW1lOiBidXR0b25OYW1lLCBcblx0XHRcdGljb246IHBhcmFtcy5pY29uLFxuXHRcdFx0Zmlyc3RJdGVtSW5MaXN0OiBmaXJzdEl0ZW1Jbkxpc3QsXG5cdFx0XHRsYXN0SXRlbUluTGlzdDogbGFzdEl0ZW1Jbkxpc3Rcblx0XHR9KVxuXHRcdEBidXR0b25BcnJheS5wdXNoKG5ld0J1dHRvbilcblx0XHRuZXdCdXR0b24uc3VwZXJMYXllciA9IEBidXR0b25Hcm91cENvbnRhaW5lclxuXG5cdGF0dGFjaFJhZGlvQnV0dG9uVmFsaWRhdGlvbiA9IChidXR0b25BcnJheSkgPT5cblx0XHRmb3IgYnV0dG9uQ2xpY2tlZCwgaW5kZXhPZkJ1dHRvbkNsaWNrZWQgaW4gYnV0dG9uQXJyYXlcblx0XHRcdGJ1dHRvbkNsaWNrZWQuZGVzZWxlY3Qoe3N1cHJlc3NFdmVudHM6IHRydWUsIGluc3RhbnQ6IHRydWV9KVxuXHRcdFx0IyBDcmVhdGVzIGEgY2xvc3VyZSB0byBzYXZlIHRoZSBpbmRleCBvZiB0aGUgYnV0dG9uIHdlJ3JlIGRlYWxpbmcgd2l0aFxuXHRcdFx0ZG8gKGJ1dHRvbkNsaWNrZWQsIGluZGV4T2ZCdXR0b25DbGlja2VkKSAtPiBcblx0XHRcdFx0IyBMaXN0ZW4gZm9yIGV2ZW50cyBhbmQgY2hhbmdlIG90aGVyIGJ1dHRvbnMgaW4gcmVzcG9uc2Vcblx0XHRcdFx0YnV0dG9uQ2xpY2tlZC5vbiAnRGlkQ2hhbmdlJywgKGV2ZW50KSA9PlxuXHRcdFx0XHRcdGZvciBvdGhlckJ1dHRvbiwgb3RoZXJCdXR0b25JbmRleCBpbiBidXR0b25BcnJheVxuXHRcdFx0XHRcdFx0aWYgb3RoZXJCdXR0b25JbmRleCAhPSBpbmRleE9mQnV0dG9uQ2xpY2tlZFxuXHRcdFx0XHRcdFx0XHQjIERvIHN0dWZmIHRvIHRoZSBvdGhlciBidXR0b25zXG5cdFx0XHRcdFx0XHRcdG90aGVyQnV0dG9uLmRlc2VsZWN0KHtzdXBwcmVzc0V2ZW50czogdHJ1ZX0pXG5cblx0aWYgcGFyYW1zLnZhbGlkYXRpb24gPT0gJ3JhZGlvJ1xuXHRcdGF0dGFjaFJhZGlvQnV0dG9uVmFsaWRhdGlvbihAYnV0dG9uQXJyYXkpXG5cdFx0XG5cdHJldHVybiBAYnV0dG9uR3JvdXBDb250YWluZXJcblxuXG5cbiMjI1xuXHRUQUJMRSBWSUVXIEhFQURFUlxuXHRJbiBpT1MsIHRoaXMgaXMgdHlwaWNhbGx5IGF0dGFjaGVkIHRvIHRoZSB0YWJsZSB2aWV3LCBcblx0YnV0IGl0J3MgaW5kZXBlbmRlbnQgaGVyZSBzbyB5b3UgY2FuIHB1dCBpdCB3aGVyZXZlciB5b3Ugd2FudC5cbiMjI1xuXG5leHBvcnRzLlRhYmxlVmlld0hlYWRlciA9IChwYXJhbXMpIC0+XG5cdHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcyxcblx0XHR0ZXh0OiAnSSBhbSBhIGRpdmlkZXInXG5cdFx0eDogMFxuXHRcdHk6IDBcblx0bGlzdERpdmlkZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBwYXJhbXMueCArIGRlZmF1bHRzLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0XHR5OiBwYXJhbXMueVxuXHRcdHdpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGJhY2tncm91bmRDb2xvcjogJ25vbmUnXG5cdGxpc3REaXZpZGVyLmh0bWwgPSBwYXJhbXMudGV4dFxuXHRsaXN0RGl2aWRlci5zdHlsZSA9IGRlZmF1bHRzLmRpdmlkZXJJdGVtVGV4dFN0eWxlXG5cdGxpc3REaXZpZGVyLnN0eWxlID0gXG5cdFx0Y29sb3I6IGRlZmF1bHRzLnRpbnRcblx0cmV0dXJuIGxpc3REaXZpZGVyXG5cblxuXG4jIyNcblx0UElDS0VSXG5cdEluIGlPUywgdGhpcyBpcyB0eXBpY2FsbHkgYXR0YWNoZWQgdG8gdGhlIHRhYmxlIHZpZXcsIFxuXHRidXQgaXQncyBpbmRlcGVuZGVudCBoZXJlIHNvIHlvdSBjYW4gcHV0IGl0IHdoZXJldmVyIHlvdSB3YW50LlxuIyMjXG5cblxuIyMgVXRpbGl0eSBmdW5jdGlvbnNcblxucXVhbnRpemUgPSAoaW5wdXQsIHN0ZXBTaXplKSAtPlxuXHRyZXR1cm4gTWF0aC5mbG9vcihpbnB1dC9zdGVwU2l6ZSkgKiBzdGVwU2l6ZVxuXG5cbiMjIFRoZSBpdGVtcyBpbiB0aGUgcGlja2VyXG5cbkRydW0gPSAocGFyZW50RHJ1bUxheWVyLCBsaXN0TmFtZSwgbGlzdEl0ZW1zLCBwYXJhbXMpIC0+XG5cdFxuXHQjIFNldHVwIHZhcmlhYmxlc1xuXHRAcGFyZW50RHJ1bUxheWVyID0gcGFyZW50RHJ1bUxheWVyXG5cdHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcyxcblx0XHRlbmFibGVkOiB0cnVlXG5cdFx0eFBjdDogMCAgXHRcdFx0XHQjIDAgdG8gMVxuXHRcdHdpZHRoUGN0OiAxXHRcdFx0XHQjIDAgdG8gMVxuXHRcdHRleHRBbGlnbjogXCJjZW50ZXJcIlx0XHQjIGxlZnQsIGNlbnRlciwgcmlnaHRcblx0XHR0ZXh0UGFkZGluZzogXCIwXCJcblx0XHR0ZXh0Q29sb3I6IGRlZmF1bHRzLnRpbnRcblx0XG5cdCMgVmFsdWVzIGRlcml2ZWQgZnJvbSBwYXJhbXNcblx0ZHJ1bUNvbnRhaW5lckhlaWdodCA9IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0KjVcblxuXHQjIFNldCB1cCBjb250ZW50IG9mIGxpc3QgXHRcdFxuXHRsaXN0SXRlbXMgPSBsaXN0SXRlbXNcblx0QG5hbWUgPSBsaXN0TmFtZVxuXHRAaW5kZXggPSAwXG5cdEB2YWwgPSBsaXN0SXRlbXNbQGluZGV4XVxuXHRcblx0aW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlID0gMFxuXHRcblx0IyBDYWxjdWxhdGUgaGVpZ2h0IGFuZCB2ZXJ0aWNhbCBib3VuZHMgb2YgdGhlIGxpc3Rcblx0bGlzdE1pbllQb3MgXHQ9IC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yXG5cdGxpc3RNYXhZUG9zIFx0PSAtbGlzdEl0ZW1zLmxlbmd0aCpkZWZhdWx0cy50YWJsZVJvd0hlaWdodCtkZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yXG5cdGxpc3RIZWlnaHQgXHRcdD0gbGlzdEl0ZW1zLmxlbmd0aCpkZWZhdWx0cy50YWJsZVJvd0hlaWdodCArIGRydW1Db250YWluZXJIZWlnaHRcblxuXHRAZHJ1bUNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRcdFx0XHRwYXJhbXMueFBjdCAqIGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0eTogXHRcdFx0XHRcdDBcblx0XHR3aWR0aDogXHRcdFx0XHRwYXJhbXMud2lkdGhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogXHRcdFx0ZHJ1bUNvbnRhaW5lckhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIm5vbmVcIlxuXHRcdHN1cGVyTGF5ZXI6IFx0XHRwYXJlbnREcnVtTGF5ZXJcblx0XG5cdGxpc3RMYXllciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRcdFx0XHQwXG5cdFx0eTogXHRcdFx0XHRcdC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yXG5cdFx0d2lkdGg6IFx0XHRcdFx0cGFyYW1zLndpZHRoUGN0ICogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRoZWlnaHQ6IFx0XHRcdGxpc3RIZWlnaHRcblx0XHRzdXBlckxheWVyOiBcdFx0QGRydW1Db250YWluZXJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJub25lXCJcblx0XG5cdCMgbGlzdExheWVyLnNjcm9sbCA9IHRydWVcblx0bGlzdExheWVyLmRyYWdnYWJsZS5lbmFibGVkID0gcGFyYW1zLmVuYWJsZWRcblx0bGlzdExheWVyLmRyYWdnYWJsZS5zcGVlZFggPSAwXG5cdFxuXHRmb3IgbGksIGkgaW4gbGlzdEl0ZW1zXG5cdFx0bGlzdEl0ZW1MYXllciA9IG5ldyBMYXllclxuXHRcdFx0eDogXHRcdFx0XHQwXG5cdFx0XHR5OiBcdFx0XHRcdGkgKiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCArIGRydW1Db250YWluZXJIZWlnaHQvMlxuXHRcdFx0d2lkdGg6IFx0XHRcdHBhcmFtcy53aWR0aFBjdCAqIGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0XHRoZWlnaHQ6IFx0XHRkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdFx0c3VwZXJMYXllcjogXHRsaXN0TGF5ZXJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJub25lXCIjVXRpbHMucmFuZG9tQ29sb3IoKVxuXHRcdGxpc3RJdGVtTGF5ZXIuaHRtbCA9IGxpXG5cdFx0bGlzdEl0ZW1MYXllci5zdHlsZSA9XG5cdFx0XHRjb2xvcjogXHRcdFx0cGFyYW1zLnRleHRDb2xvclxuXHRcdFx0Zm9udEZhbWlseTogXHRcIkhlbHZldGljYSBOZXVlXCJcblx0XHRcdGZvbnRXZWlnaHQ6IFx0XCIyMDBcIlxuXHRcdFx0Zm9udFNpemU6IFx0XHRcIjQycHhcIlxuXHRcdFx0bGluZUhlaWdodDogXHRkZWZhdWx0cy50YWJsZVJvd0hlaWdodCtcInB4XCJcblx0XHRcdHRleHRBbGlnbjogXHRcdHBhcmFtcy50ZXh0QWxpZ25cblx0XHRcdHBhZGRpbmc6IFx0XHRwYXJhbXMudGV4dFBhZGRpbmdcblxuXHRcdGxpc3RJdGVtTGF5ZXIuc3RhcnRZID0gaSAqIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICsgZHJ1bUNvbnRhaW5lckhlaWdodC8yXG5cblx0bGlzdExheWVyLm9uIEV2ZW50cy5EcmFnTW92ZSwgPT5cblx0XHR1cGRhdGVEcnVtQXBwZWFyYW5jZSgpXG5cdFx0XG5cdCMgVG8gc2ltdWxhdGUgaU9TIG1vbWVudHVtIHNjcm9sbGluZyAod2hpY2ggY2F1c2VzIHRoZSBkcnVtIHRvIGtlZXAgc3Bpbm5pbmcgXG5cdCMgYWZ0ZXIgeW91ciBmaW5nZXIgbGlmdHMgb2ZmIGl0KSwgd2UgdHJpZ2dlciBhbiBhbmltYXRpb24gdGhlIG1vbWVudCB5b3UgbGlmdFxuXHQjIHlvdXIgZmluZ2VyLiBUaGUgaW50ZW5zaXR5IG9mIHRoaXMgYW5pbWF0aW9uIGlzIHByb3BvcnRpb25hbCB0byB0aGUgc3BlZWQgd2hlblxuXHQjIG9mIHRoZSBkcmFnZ2luZyB3aGVuIHlvdXIgZmluZ2VyIHdhcyBsaWZ0ZWQuXG5cdGxpc3RMYXllci5vbiBFdmVudHMuRHJhZ0VuZCwgKGUsIGYpID0+XG5cdFxuXHRcdCMgVGhpcyBjYWxjdWxhdGVzIHRoZSBhbmltYXRpb25cblx0XHRzY3JvbGxWZWxvY2l0eSA9IGxpc3RMYXllci5kcmFnZ2FibGUuY2FsY3VsYXRlVmVsb2NpdHkoKS55XG5cdFx0dGltZUFmdGVyRHJhZyA9ICgwLjUrTWF0aC5hYnMoc2Nyb2xsVmVsb2NpdHkqMC4yKSkudG9GaXhlZCgxKVxuXHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gcXVhbnRpemUobGlzdExheWVyLnkgKyBzY3JvbGxWZWxvY2l0eSo0MDAsIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0KSArIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0XHRcblx0XHQjIEF0IHRoZSB0b3AgYW5kIGJvdHRvbSwgdGhlIG1vbWVudHVtIHNob3VsZCBiZSBhZGp1c3RlZCBzbyB0aGUgXG5cdFx0IyBmaXJzdCBhbmQgbGFzdCB2YWx1ZXMgb24gdGhlIGRydW0gZG9uJ3QgZ28gdG9vIGZhciBvdXQgb2Ygdmlld1xuXHRcdGRpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0bGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXIgPSAtbGlzdEl0ZW1zLmxlbmd0aCpkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGJvdHRvbU92ZXJmbG93ID0gTWF0aC5tYXgoMCwgbGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXItZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gKVxuXHRcdHRvcE92ZXJmbG93ID0gTWF0aC5tYXgoMCwgZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gKVxuXHRcdG92ZXJmbG93RGFtcGVuaW5nID0gMTBcblx0XHRcblx0XHRpZiBib3R0b21PdmVyZmxvdyA+IDBcblx0XHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gbGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXIgLSAoYm90dG9tT3ZlcmZsb3cgLyBvdmVyZmxvd0RhbXBlbmluZylcblx0XHRcdG5ld0Rpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0XHR0aW1lQWZ0ZXJEcmFnID0gdGltZUFmdGVyRHJhZyAqIChuZXdEaXN0YW5jZVRvVHJhdmVsL2Rpc3RhbmNlVG9UcmF2ZWwpXG5cblx0XHRpZiB0b3BPdmVyZmxvdyA+IDBcblx0XHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gNDAgKyAodG9wT3ZlcmZsb3cgLyBvdmVyZmxvd0RhbXBlbmluZylcblx0XHRcdG5ld0Rpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0XHR0aW1lQWZ0ZXJEcmFnID0gdGltZUFmdGVyRHJhZyAqIChuZXdEaXN0YW5jZVRvVHJhdmVsL2Rpc3RhbmNlVG9UcmF2ZWwpXG5cblx0XHQjIFRyaWdnZXIgdGhlIGFuaW1hdGlvbiwgYW5kIHNjaGVkdWxlIGFuIGV2ZW50IHRoYXQgd2lsbFxuXHRcdCMgdHJpZ2dlciB3aGVuIHRoZSBkcnVtIGZpbmFsbHkgc3RvcHMgc3Bpbm5pbmcuXG5cdFx0bGlzdExheWVyLmFuaW1hdGUoe1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eTogZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW19XG5cdFx0XHRcdHRpbWU6IHRpbWVBZnRlckRyYWdcblx0XHRcdFx0Y3VydmU6IFwiZWFzZS1vdXRcIlxuXHRcdFx0fSlcblx0XHRVdGlscy5kZWxheSB0aW1lQWZ0ZXJEcmFnLCAtPlxuXHRcdFx0c3RvcERydW0oKVxuXG5cdCMgVGhpcyBlbnN1cmVzIHRoYXQgZHVyaW5nIHRoZSBhbmltYXRpb24gb2YgdGhlIGxpc3QgbGF5ZXIsIHRoZSBkcnVtJ3MgYXBwZWFyYW5jZSBjb250aW51ZXNcblx0IyB0byBiZSB1cGRhdGVkLiBCZWNhdXNlIG11bHRpcGxlIGFuaW1hdGlvbnMgY291bGQgb3ZlcmxhcCwgd2UgZW5zdXJlIHRoYXQgZXZlcnkgbmV3IGFuaW1hdGlvblxuXHQjIGVuZHMgdGhlIGludGVydmFsIGFuZCBzdGFydHMgYSBuZXcgb25lIHNvIHRoYXQgd2UgbmV2ZXIgaGF2ZSBtb3JlIHRoYW4gb25lIHJ1bm5pbmcgXG5cdGxpc3RMYXllci5vbiBFdmVudHMuQW5pbWF0aW9uU3RhcnQsIC0+XG5cdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbFRvdXBkYXRlRHJ1bUFwcGVhcmFuY2UpXG5cdFx0aW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlID0gVXRpbHMuaW50ZXJ2YWwgMS8zMCwgdXBkYXRlRHJ1bUFwcGVhcmFuY2UgICAgXG5cblx0bGlzdExheWVyLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XHRcdFxuXHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlKVxuXG5cdFx0IyBFbWl0IGFmdGVyIGFsbCBtb3ZlbWVudCBlbmRzIGluIHRoZSBsaXN0XG5cdFx0QGRydW1Db250YWluZXIuZW1pdChcIkRydW1GaW5pc2hlZENoYW5naW5nXCIsIHtsaXN0OiBsaXN0TmFtZSwgaW5kZXg6IEBpbmRleCwgdmFsdWU6IEB2YWx9KVxuXG5cdHVwZGF0ZURydW1BcHBlYXJhbmNlID0gPT5cblx0XHRpdGVtc0luRHJ1bSA9IDRcblx0XHRsaXN0UG9zaXRpb24gPSBsaXN0TGF5ZXIueSAvIC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodCAtIDAuNVxuXHRcdGNhcHBlZExpc3RQb3NpdGlvbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKGxpc3RMYXllci55IC8gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0IC0gMC41LCBsaXN0SXRlbXMubGVuZ3RoIC0gMSkpXG5cdFx0Zm9jdXNJdGVtID0gTWF0aC5yb3VuZChjYXBwZWRMaXN0UG9zaXRpb24pXG5cdFx0ZGlzdGFuY2VGcm9tTWlkZGxlID0gTWF0aC5hYnMoZm9jdXNJdGVtIC0gY2FwcGVkTGlzdFBvc2l0aW9uKVxuXHRcdGZvciBpIGluIFsoZm9jdXNJdGVtLWl0ZW1zSW5EcnVtKS4uKGZvY3VzSXRlbStpdGVtc0luRHJ1bSldXG5cdFx0XHRpZiBpID49IDAgYW5kIGkgPCBsaXN0SXRlbXMubGVuZ3RoXG5cdFx0XHRcdGxpc3RMYXllci5zdWJMYXllcnNbaV0ub3BhY2l0eSA9IDEgLSBNYXRoLmFicyhsaXN0UG9zaXRpb24gLSBpKS81IC0gKGlmIChpICE9IGZvY3VzSXRlbSkgdGhlbiAwLjMgZWxzZSAwKVxuXHRcdFx0XHRsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnNjYWxlWSA9IDEgLSBNYXRoLm1pbigxLCBNYXRoLmFicyhsaXN0UG9zaXRpb24gLSBpKS80KVxuXHRcdFx0XHRsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnkgPSBsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnN0YXJ0WSAtIChpLWxpc3RQb3NpdGlvbikqTWF0aC5hYnMoaS1saXN0UG9zaXRpb24pKjEwXG5cblx0XHQjIFVwZGF0ZSB0aGUgdmFsdWUgb2YgdGhlIGRydW0gb25seSB3aGVuIGEgbmV3IHZhbHVlIGlzIHJlYWNoZWRcblx0XHRpZiAoQGluZGV4ICE9IGZvY3VzSXRlbSlcblx0XHRcdHVwZGF0ZURydW1WYWx1ZXMoZm9jdXNJdGVtKVxuXHRcdFxuXHRzdG9wRHJ1bSA9ID0+XHRcdFxuXHRcdCMgRW5zdXJlIHRoZSBkcnVtIG5ldmVyIGVuZHMgb3V0IG9mIGJvdW5kc1xuXHRcdGlmIGxpc3RMYXllci55ID4gbGlzdE1pbllQb3MgXG5cdFx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0ICAgIFx0cHJvcGVydGllczoge3k6bGlzdE1pbllQb3N9XG5cdFx0ICAgIFx0Y3VydmU6IFwic3ByaW5nKDQwMCw1MCwwKVwiXG5cdFx0XHR9KVxuXHRcdGlmIGxpc3RMYXllci55IDwgbGlzdE1heFlQb3Ncblx0XHRcdGxpc3RMYXllci5hbmltYXRlKHtcblx0XHRcdFx0cHJvcGVydGllczoge3k6IGxpc3RNYXhZUG9zfVxuXHRcdFx0XHRjdXJ2ZTogXCJzcHJpbmcoNDAwLDUwLDApXCJcblx0XHRcdH0pXG5cdFxuXHQjIFVwZGF0ZSB0aGUgdmFsdWVzIG9mIHRoZSBkcnVtcyBhbmQgaW52b2tlIHRoZSBjYWxsYmFjayBcblx0dXBkYXRlRHJ1bVZhbHVlcyA9IChuZXdJbmRleCkgPT5cblx0XHRAaW5kZXggPSBuZXdJbmRleFxuXHRcdEB2YWwgPSBsaXN0SXRlbXNbQGluZGV4XVxuXHRcdEBkcnVtQ29udGFpbmVyLmVtaXQoXCJEcnVtRGlkQ2hhbmdlXCIsIHtsaXN0OiBsaXN0TmFtZSwgaW5kZXg6IEBpbmRleCwgdmFsdWU6IEB2YWx9KVxuXHRcblx0IyBSZW5kZXIgZm9yIHRoZSBmaXJzdCB0aW1lXHRcdFxuXHR1cGRhdGVEcnVtQXBwZWFyYW5jZSgpXG5cdFxuXHRAc2V0SW5kZXggPSAoaW5kZXgpID0+XG5cdFx0eVBvc2l0aW9uRm9yVGhpc0luZGV4ID0gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzIgLSAoaW5kZXggKiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodClcblx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt5OiB5UG9zaXRpb25Gb3JUaGlzSW5kZXh9XG5cdFx0XHRcdHRpbWU6IDAuNVxuXHRcdFx0XHRjdXJ2ZTogXCJlYXNlLW91dFwiXG5cdFx0XHR9KVxuXG5cdEBzZXRWYWx1ZSA9ICh2YWwpID0+XG5cdFx0aW5kZXggPSBsaXN0SXRlbXMuaW5kZXhPZih2YWwpXG5cdFx0aWYgaW5kZXggIT0gLTFcblx0XHRcdEBzZXRJbmRleChpbmRleClcblxuXHQjIFJldHVybiB0aGUgZHJ1bSBvYmplY3Qgc28gd2UgY2FuIGFjY2VzcyBpdHMgdmFsdWVzXG5cdHJldHVybiBAXG5cblxuIyMjXG5cdFBJQ0tFUlxuXHRUaGlzIGNvbnRhaW5zIHRoZSBwaWNrZXIgXG4jIyMgXG5leHBvcnRzLlBpY2tlciA9IChwYXJhbXMpIC0+XG5cdFxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0MFxuXHRcdHdpZHRoOlx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRkZWZhdWx0VGV4dDogXCJcIlxuXHRcdHRleHRDb2xvcjogZGVmYXVsdHMudGludFxuXG5cdGRydW1Db250YWluZXJIZWlnaHQgPSBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCo1XG5cblx0QHBpY2tlckNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRwYXJhbXMueFxuXHRcdHk6XHRcdHBhcmFtcy55XG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0OiBkcnVtQ29udGFpbmVySGVpZ2h0Kzg4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdGRlZmF1bHRzLml0ZW1CYWNrZ3JvdW5kXG5cdFx0XHRcblx0QGRydW0gPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0MFxuXHRcdHk6IFx0XHQ4OFxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZHJ1bUNvbnRhaW5lckhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJub25lXCJcblx0XHRzdXBlckxheWVyOiBAcGlja2VyQ29udGFpbmVyXHRcdFxuXHRcdFxuXHRAc2VsZWN0ZWRJdGVtID0gbmV3IExheWVyXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0ZHJ1bUNvbnRhaW5lckhlaWdodC8yIC0gZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwibm9uZVwiXG5cdFx0c3VwZXJMYXllcjogQGRydW1cblxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTogXHRcdDBcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6XHQ4OFxuXHRcdGJhY2tncm91bmRDb2xvcjogZGVmYXVsdHMuaXRlbUJhY2tncm91bmRcblx0XHRzdXBlckxheWVyOiBAcGlja2VyQ29udGFpbmVyXG5cdFx0XG5cdCMgU3R5bGVzXG5cdEBkcnVtLnN0eWxlID1cblx0XHRwb2ludGVyRXZlbnRzOiBcIm5vbmVcIlxuXHRcdGJvcmRlclRvcDogXCIxcHggc29saWQgXCIgKyBkZWZhdWx0cy5saW5lVGludFxuXHRcdGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgXCIgKyBkZWZhdWx0cy5saW5lVGludFxuXHRcblx0QHNlbGVjdGVkSXRlbS5zdHlsZSA9XG5cdFx0cG9pbnRlckV2ZW50czogXCJub25lXCJcblx0XHRib3JkZXJUb3A6IFwiMXB4IHNvbGlkIHJnYmEoMCwwLDAsMC4zKVwiXG5cdFx0Ym9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDAsMCwwLDAuMylcIlxuXHRcdFxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlci5zdHlsZSA9IGRlZmF1bHRzLmxpc3RJdGVtVGV4dFN0eWxlXG5cdEBwaWNrZXJDb250YWluZXIucGlja2VySGVhZGVyLnN0eWxlID0gXG5cdFx0Y29sb3I6IHBhcmFtcy50ZXh0Q29sb3Jcblx0XHRwYWRkaW5nTGVmdDogXCIyMHB4XCJcblx0XHRib3JkZXJUb3A6IFwiMXB4IHNvbGlkIFwiICsgZGVmYXVsdHMubGluZVRpbnRcblx0XHRcdFxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlci5odG1sID0gcGFyYW1zLmRlZmF1bHRUZXh0XG5cdFx0XG5cdFx0XG5cdCMgQWRkIGRydW1zXG5cdEBwaWNrZXJDb250YWluZXIuZHJ1bXMgPSBbXVxuXHRAcGlja2VyQ29udGFpbmVyLmRydW1zQnlOYW1lID0ge31cblx0XG5cdHBpY2tlckRpZENoYW5nZSA9ICgpPT5cblx0XHRkcnVtVmFsdWVzID0ge31cblx0XHRuZXdWYWx1ZXMgPSBmb3IgZHJ1bSBpbiBAcGlja2VyQ29udGFpbmVyLmRydW1zXG5cdFx0XHRkcnVtVmFsdWVzW2RydW0ubmFtZV0gPSB7aW5kZXg6IGRydW0uaW5kZXgsIHZhbDogZHJ1bS52YWx9XG5cblx0XHRAcGlja2VyQ29udGFpbmVyLmVtaXQoXCJQaWNrZXJEaWRDaGFuZ2VcIiwgZHJ1bVZhbHVlcyApXG5cdFxuXHRwaWNrZXJGaW5pc2hlZENoYW5naW5nID0gKCk9PlxuXHRcdGRydW1WYWx1ZXMgPSB7fVxuXHRcdG5ld1ZhbHVlcyA9IGZvciBkcnVtIGluIEBwaWNrZXJDb250YWluZXIuZHJ1bXNcblx0XHRcdGRydW1WYWx1ZXNbZHJ1bS5uYW1lXSA9IHtpbmRleDogZHJ1bS5pbmRleCwgdmFsOiBkcnVtLnZhbH1cblxuXHRcdEBwaWNrZXJDb250YWluZXIuZW1pdChcIlBpY2tlckZpbmlzaGVkQ2hhbmdpbmdcIiwgZHJ1bVZhbHVlcyApXHRcblx0aWYgKHBhcmFtcy5kcnVtcyBhbmQgcGFyYW1zLmRydW1zLmxlbmd0aCA+IDApXG5cdFx0Zm9yIGRydW0gaW4gcGFyYW1zLmRydW1zXG5cdFx0XHRuZXdEcnVtID0gbmV3IERydW0oQGRydW0sIGRydW0ubmFtZSwgZHJ1bS5pdGVtcywgZHJ1bS5wYXJhbXMpXG5cblx0XHRcdCMjIFN0b3JlIGRydW1zIGluc2lkZSB0aGUgcGlja2VyXG5cdFx0XHRAcGlja2VyQ29udGFpbmVyLmRydW1zLnB1c2gobmV3RHJ1bSlcblx0XHRcdEBwaWNrZXJDb250YWluZXIuZHJ1bXNCeU5hbWVbZHJ1bS5uYW1lXSA9IG5ld0RydW0gXG5cblx0XHRcdCMjIEVuc3VyZSB0aGF0IGNoYW5nZXMgdG8gdGhlIGRydW0gYnViYmxlIHVwIHRvIHRoZSBwaWNrZXJcblx0XHRcdG5ld0RydW0uZHJ1bUNvbnRhaW5lci5vbiBcIkRydW1EaWRDaGFuZ2VcIiwgcGlja2VyRGlkQ2hhbmdlXG5cdFx0XHRcblx0XHRcdCMjIEVtaXQgYW4gZXZlbnQgd2hlbiBkcnVtcyBzdG9wIG1vdmluZyBhbHRvZ2V0aGVyXG5cdFx0XHRuZXdEcnVtLmRydW1Db250YWluZXIub24gXCJEcnVtRmluaXNoZWRDaGFuZ2luZ1wiLCBwaWNrZXJGaW5pc2hlZENoYW5naW5nXG5cblx0cmV0dXJuIEBwaWNrZXJDb250YWluZXJcblxuXG5cblxuIl19
