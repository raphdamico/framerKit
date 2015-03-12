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
  this.selected = false;
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
    selected: false,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcmFwaGRhbWljby9Eb2N1bWVudHMvR2l0L2ZyYW1lcktpdC9mcmFtZXJLaXQuZnJhbWVyL21vZHVsZXMvZnJhbWVyS2l0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQUE7Ozs7Ozs7Ozs7OztHQUFBO0FBaUJBO0FBQUE7Ozs7O0dBakJBO0FBQUEsSUFBQSxxREFBQTs7QUFBQSxRQXVCQSxHQUFXO0FBQUEsRUFDVixXQUFBLEVBQWEsR0FESDtDQXZCWCxDQUFBOztBQTJCQTtBQUFBOztHQTNCQTs7QUFBQSxRQThCUSxDQUFDLGNBQVQsR0FBMEIsRUE5QjFCLENBQUE7O0FBQUEsUUErQlEsQ0FBQyx5QkFBVCxHQUFxQyxFQS9CckMsQ0FBQTs7QUFBQSxRQWdDUSxDQUFDLElBQVQsR0FBZ0IsTUFoQ2hCLENBQUE7O0FBQUEsUUFpQ1EsQ0FBQyxRQUFULEdBQW9CLHFCQWpDcEIsQ0FBQTs7QUFBQSxRQWtDUSxDQUFDLGNBQVQsR0FBMEIsT0FsQzFCLENBQUE7O0FBQUEsUUFtQ1EsQ0FBQyxpQkFBVCxHQUE2QjtBQUFBLEVBQzVCLFFBQUEsRUFBVSxNQURrQjtBQUFBLEVBRTVCLFVBQUEsRUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFULEdBQXdCLENBQXpCLENBQUEsR0FBNEIsSUFGWjtBQUFBLEVBRzVCLFVBQUEsRUFBWSxnQkFIZ0I7QUFBQSxFQUk1QixVQUFBLEVBQVksS0FKZ0I7Q0FuQzdCLENBQUE7O0FBQUEsUUF5Q1EsQ0FBQyxvQkFBVCxHQUFnQztBQUFBLEVBQy9CLFFBQUEsRUFBVSxNQURxQjtBQUFBLEVBRS9CLFVBQUEsRUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFULEdBQXdCLENBQXpCLENBQUEsR0FBNEIsSUFGVDtBQUFBLEVBRy9CLFVBQUEsRUFBWSxnQkFIbUI7QUFBQSxFQUkvQixVQUFB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LENBQUEsSUFBSSxDQUFDLElBQUwsQ0FBWCxHQUF3QjtBQUFBLFlBQUMsS0FBQSxFQUFPLElBQUksQ0FBQyxLQUFiO0FBQUEsWUFBb0IsR0FBQSxFQUFLLElBQUksQ0FBQyxHQUE5QjtZQUF4QixDQURXO0FBQUE7O29CQURaLENBQUE7YUFJQSxLQUFDLENBQUEsZUFBZSxDQUFDLElBQWpCLENBQXNCLHdCQUF0QixFQUFnRCxVQUFoRCxFQUx3QjtJQUFBLEVBQUE7RUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBeEV6QixDQUFBO0FBOEVBLEVBQUEsSUFBSSxNQUFNLENBQUMsS0FBUCxJQUFpQixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQWIsR0FBc0IsQ0FBM0M7QUFDQztBQUFBLFNBQUEscUNBQUE7b0JBQUE7QUFDQyxNQUFBLE9BQUEsR0FBYyxJQUFBLElBQUEsQ0FBSyxJQUFDLENBQUEsSUFBTixFQUFZLElBQUksQ0FBQyxJQUFqQixFQUF1QixJQUFJLENBQUMsS0FBNUIsRUFBbUMsSUFBSSxDQUFDLE1BQXhDLENBQWQsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBdkIsQ0FBNEIsT0FBNUIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsZUFBZSxDQUFDLFdBQVksQ0FBQSxJQUFJLENBQUMsSUFBTCxDQUE3QixHQUEwQyxPQUoxQyxDQUFBO0FBQUEsTUFPQSxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQXRCLENBQXlCLGVBQXpCLEVBQTBDLGVBQTFDLENBUEEsQ0FBQTtBQUFBLE1BVUEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUF0QixDQUF5QixzQkFBekIsRUFBaUQsc0JBQWpELENBVkEsQ0FERDtBQUFBLEtBREQ7R0E5RUE7QUE0RkEsU0FBTyxJQUFDLENBQUEsZUFBUixDQTlGZ0I7QUFBQSxDQTVvQmpCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyMjXG4gIEZyYW1lcktpdCBmb3IgRnJhbWVyXG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9yYXBoZGFtaWNvL2ZyYW1lcktpdFxuXG4gIENvcHlyaWdodCAoYykgMjAxNSwgUmFwaCBEJ0FtaWNvIGh0dHA6Ly9yYXBoZGFtaWNvLmNvbSAoQHJhcGhkYW1pY28pXG4gIE1JVCBMaWNlbnNlXG5cbiAgUmVhZG1lOlxuICBodHRwczovL2dpdGh1Yi5jb20vcmFwaGRhbWljby9mcmFtZXJLaXRcblxuICBMaWNlbnNlOlxuICBodHRwczovL2dpdGh1Yi5jb20vcmFwaGRhbWljby9mcmFtZXJLaXQvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuIyMjXG5cblxuXG5cbiMjI1xuXHRERUZBVUxUIFNUWUxFU1xuXHROb3RlIHRoZSBzY3JlZW53aWR0aCBjb25zdGFudDogdGhpcyBpcyBwcm9iYWJseSBvbmUgb2YgdGhlXG5cdGZpcnN0IHRoaW5ncyB5b3Ugd2FudCB0byBjaGFuZ2Ugc28gaXQgbWF0Y2hlcyB0aGUgZGV2aWNlXG5cdHlvdSdyZSBwcm90b3R5cGluZyBvbi5cbiMjI1xuZGVmYXVsdHMgPSB7XG5cdHNjcmVlbldpZHRoOiA3NTBcbn1cblxuIyMjXG5cdE1PUkUgU1RZTEVTXG4jIyNcbmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ID0gODhcbmRlZmF1bHRzLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmcgPSAyMFxuZGVmYXVsdHMudGludCA9ICdncmV5J1xuZGVmYXVsdHMubGluZVRpbnQgPSBcInJnYmEoMjAwLDIwMCwyMDAsMSlcIlxuZGVmYXVsdHMuaXRlbUJhY2tncm91bmQgPSAnd2hpdGUnXG5kZWZhdWx0cy5saXN0SXRlbVRleHRTdHlsZSA9IHtcblx0Zm9udFNpemU6IFwiMzJweFwiXG5cdGxpbmVIZWlnaHQ6IChkZWZhdWx0cy50YWJsZVJvd0hlaWdodC00KStcInB4XCJcdFx0XG5cdGZvbnRGYW1pbHk6IFwiSGVsdmV0aWNhIE5ldWVcIlxuXHRmb250V2VpZ2h0OiBcIjIwMFwiXG59XG5kZWZhdWx0cy5kaXZpZGVySXRlbVRleHRTdHlsZSA9IHtcblx0Zm9udFNpemU6IFwiMjJweFwiXG5cdGxpbmVIZWlnaHQ6IChkZWZhdWx0cy50YWJsZVJvd0hlaWdodC00KStcInB4XCJcdFx0XG5cdGZvbnRGYW1pbHk6IFwiSGVsdmV0aWNhIE5ldWVcIlxuXHRmb250V2VpZ2h0OiBcIjIwMFwiXG5cdHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnXG59XG5leHBvcnRzLmRlZmF1bHRzID0gZGVmYXVsdHNcblxuXG4jIyNcblx0VEFCTEUgVklFVyBFTEVNRU5UU1xuXHQoZS5nLiBcIlRodW1iXCIgZm9yIHRoZSBzd2l0Y2ggY29udHJvbClcbiMjI1xuXG5Td2l0Y2ggPSAocGFyYW1zKSAtPlxuXHRwYXJhbXMgPSBwYXJhbXMgb3Ige31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsIFxuXHRcdHN3aXRjaFRpbnQ6ICcjMURDMjRCJ1xuXHRcdHNjcmVlbldpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdHRhYmxlUm93SGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdHN3aXRjaENvbnRhaW5lckJvcmRlcjogNFxuXHRcdHN3aXRjaENvbnRhaW5lckhlaWdodDogNTRcblx0XHRzd2l0Y2hDb250YWluZXJXaWR0aDogOTRcblx0XHRib3JkZXJDb2xvcjogZGVmYXVsdHMubGluZVRpbnQgIyBHcmV5IHJvdW5kZWQgcGlsbCAmIGJvcmRlcnMgYmV0d2VlbiBjZWxsc1xuXG5cdEBzZWxlY3RlZCA9IGZhbHNlXG5cdFxuXHQjIFNvbWUgb2YgdGhlIHZhbHVlcyBhcmUgYmFzZWQgb24gb3RoZXIgY29uc3RhbnRzLFxuXHQjIHNvIHlvdSBoYXZlIHRvIGNhbGN1bGF0ZSB0aGVtIGluIGEgc2Vjb25kIHBhc3Ncblx0c3dpdGNoQnV0dG9uUmFkaXVzID0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodC8yXG5cdHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyID0gMlxuXHRcblx0IyBUaGlzIGlzIG91ciBmYW5jeSBhbmltYXRlZCBzd2l0Y2ggc3dpdGNoXG5cdCMgd2UgbmVlZCB0byBtYWtlIGEgcm91bmRlZCByZWN0YW5nbGUgd2l0aCBhIGNpcmNsZSBpbnNpZGUgaXQuXG5cdEBzd2l0Y2hCdXR0b25Db250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0XHRcdFx0MFxuXHRcdHk6IFx0XHRcdFx0XHQwXG5cdFx0Y2xpcDogXHRcdFx0XHRmYWxzZSAjIENsaXBwaW5nIGh1cnRzIHRoZSBzdWJ0bGUgc2hhZG93IG9uIHRoZSBidXR0b25cblx0XHR3aWR0aDpcdFx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJXaWR0aCBcblx0XHRoZWlnaHQ6XHRcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwiXCJcblx0XHRvcGFjaXR5OiBcdFx0XHQxXG5cblx0QHN3aXRjaEJhY2tncm91bmQgPSBuZXcgTGF5ZXJcblx0XHR4Olx0XHRcdFx0XHRzd2l0Y2hCdXR0b25SYWRpdXMgLSBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlci8yXG5cdFx0eTpcdFx0XHRcdFx0c3dpdGNoQnV0dG9uUmFkaXVzIC0gc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIvMiAtIDRcblx0XHR3aWR0aDogXHRcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVyV2lkdGggLSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0ICsgc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXJcblx0XHRoZWlnaHQ6IFx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQgLSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0ICsgc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXJcblx0XHRib3JkZXJSYWRpdXM6IFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0XG5cdFx0c2hhZG93U3ByZWFkOlx0XHRzd2l0Y2hCdXR0b25SYWRpdXMgLSBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlci8yICsgcGFyYW1zLnN3aXRjaENvbnRhaW5lckJvcmRlclxuXHRcdHNoYWRvd0NvbG9yOiBcdFx0cGFyYW1zLnN3aXRjaFRpbnRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0Jydcblx0XHRvcGFjaXR5OiBcdFx0XHQxXG5cdFx0c3VwZXJMYXllcjogXHRcdEBzd2l0Y2hCdXR0b25Db250YWluZXJcblx0XHRcblx0QHN3aXRjaEJ1dHRvbiA9IG5ldyBMYXllclxuXHRcdHg6IHBhcmFtcy5zd2l0Y2hDb250YWluZXJXaWR0aCAtIHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHR5OiAtNFxuXHRcdHdpZHRoOlx0XHRcdFx0c3dpdGNoQnV0dG9uUmFkaXVzKjJcblx0XHRoZWlnaHQ6XHRcdFx0XHRzd2l0Y2hCdXR0b25SYWRpdXMqMlxuXHRcdGJvcmRlclJhZGl1czogXHRcdHN3aXRjaEJ1dHRvblJhZGl1c1xuXHRcdHNoYWRvd1k6XHRcdFx0M1xuXHRcdHNoYWRvd0JsdXI6IFx0XHQ1XG5cdFx0c2hhZG93Q29sb3I6IFx0XHQncmdiYSgwLDAsMCwwLjMpJ1xuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIndoaXRlXCJcblx0XHRvcGFjaXR5OiBcdFx0XHQxXG5cdFx0c3VwZXJMYXllcjogXHRcdEBzd2l0Y2hCdXR0b25Db250YWluZXJcblx0XG5cdCMgU0VUIFVQIEFOSU1BVElPTlNcblx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLmFkZFxuXHRcdGRlc2VsZWN0ZWQ6IFxuXHRcdFx0eDogXHRcdFx0XHQwXG5cdFx0XHR5OiBcdFx0XHRcdC00XG5cdFx0XHR3aWR0aDpcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVyV2lkdGhcblx0XHRcdGhlaWdodDpcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0XG5cdFx0XHRzaGFkb3dTcHJlYWQ6IFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckJvcmRlclxuXHRcdFx0c2F0dXJhdGU6IFx0XHQwXG5cdFx0XHRicmlnaHRuZXNzOiBcdDE1M1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIlwiXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5hbmltYXRpb25PcHRpb25zID1cblx0XHRjdXJ2ZTogXCJlYXNlLWluLW91dFwiXG5cdFx0dGltZTogMC4zIFxuXHRAc3dpdGNoQmFja2dyb3VuZC5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PlxuXHRcdFV0aWxzLmRlbGF5IDAsID0+XG5cdCBcdFx0aWYgQHNlbGVjdGVkXG4gXHRcdFx0XHRAc3dpdGNoQmFja2dyb3VuZC5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbXMuc3dpdGNoVGludFxuXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kLm9uIEV2ZW50cy5BbmltYXRpb25TdGFydCwgPT5cblx0XHRAc3dpdGNoQmFja2dyb3VuZC5iYWNrZ3JvdW5kQ29sb3IgPSAnJ1xuXG5cdEBzd2l0Y2hCdXR0b24uc3RhdGVzLmFkZFxuXHRcdGRlc2VsZWN0ZWQ6IHt4OiAwfVxuXHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5hbmltYXRpb25PcHRpb25zID1cblx0XHRjdXJ2ZTogXCJzcHJpbmcoNDAwLDI1LDApXCJcblx0XHRcblx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lci5zZWxlY3QgPSA9PlxuXHRcdEBzZWxlY3RlZCA9IHRydWVcblx0XHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuc3dpdGNoKFwiZGVmYXVsdFwiKVxuXHRcdEBzd2l0Y2hCdXR0b24uc3RhdGVzLnN3aXRjaChcImRlZmF1bHRcIilcblx0XHRcblx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lci5kZXNlbGVjdCA9ID0+XG5cdFx0QHNlbGVjdGVkID0gZmFsc2Vcblx0XHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuc3dpdGNoKFwiZGVzZWxlY3RlZFwiKVxuXHRcdEBzd2l0Y2hCdXR0b24uc3RhdGVzLnN3aXRjaChcImRlc2VsZWN0ZWRcIilcblxuXHRpZiBAc2VsZWN0ZWQgPT0gZmFsc2Vcblx0XHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuc3dpdGNoSW5zdGFudChcImRlc2VsZWN0ZWRcIilcblx0XHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5zd2l0Y2hJbnN0YW50KFwiZGVzZWxlY3RlZFwiKVxuXG5cdHJldHVybiBAc3dpdGNoQnV0dG9uQ29udGFpbmVyXG5cdFxuQ3Jvc3MgPSAtPlxuXHRjb2xvciA9IGRlZmF1bHRzLnRpbnRcblx0Y3Jvc3NUaGlja25lc3MgPSA0XG5cdGNyb3NzID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IDMwXHRcblx0XHRoZWlnaHQ6IDMwXHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuXHRjcm9zc1Vwc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjcm9zc1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAyMFxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRvcmlnaW5YOiAxXG5cdFx0c3VwZXJMYXllcjogY3Jvc3Ncblx0Y3Jvc3NVcHN0cm9rZS55ID0gMTRcblx0Y3Jvc3NVcHN0cm9rZS5yb3RhdGlvblogPSA0NVxuXHRjcm9zc0Rvd25zdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNyb3NzVGhpY2tuZXNzXG5cdFx0d2lkdGg6IDIwXG5cdFx0b3JpZ2luWDogMVxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRzdXBlckxheWVyOiBjcm9zc1xuXHRjcm9zc0Rvd25zdHJva2Uucm90YXRpb25aID0gLTQ1XG5cdGNyb3NzLnNlbGVjdCA9IC0+XG5cdFx0Y3Jvc3MuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRjcm9zcy5kZXNlbGVjdCA9IC0+XG5cdFx0Y3Jvc3MuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRzY2FsZTogMC40XG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXHRcdFxuXHRyZXR1cm4gY3Jvc3Ncblx0XG5DYXJldCA9IC0+XG5cdGNvbG9yID0gZGVmYXVsdHMudGludFxuXHRjYXJldFRoaWNrbmVzcyA9IDRcblx0Y2FyZXQgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogMzBcblx0XHRoZWlnaHQ6IDMwXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcdFx0XG5cdGNhcmV0VXBzdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNhcmV0VGhpY2tuZXNzXG5cdFx0d2lkdGg6IDE4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdG9yaWdpblg6IDFcblx0XHRzdXBlckxheWVyOiBjYXJldFxuXHRjYXJldFVwc3Ryb2tlLnkgPSAxNFxuXHRjYXJldFVwc3Ryb2tlLnJvdGF0aW9uWiA9IDQ1XG5cdGNhcmV0RG93bnN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2FyZXRUaGlja25lc3Ncblx0XHR3aWR0aDogMThcblx0XHRvcmlnaW5YOiAxXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdHN1cGVyTGF5ZXI6IGNhcmV0XG5cdGNhcmV0RG93bnN0cm9rZS55ID0gMTJcdFx0XG5cdGNhcmV0RG93bnN0cm9rZS5yb3RhdGlvblogPSAtNDVcblx0Y2FyZXQuc2VsZWN0ID0gLT5cblx0XHRjYXJldC5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXG5cdGNhcmV0LmRlc2VsZWN0ID0gLT5cblx0XHRjYXJldC5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHNjYWxlOiAwLjRcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcdFxuXHRyZXR1cm4gY2FyZXRcblx0XG5DaGVjayA9IC0+XG5cdGNvbG9yID0gZGVmYXVsdHMudGludFxuXHRjaGVja1RoaWNrbmVzcyA9IDRcblx0Y2hlY2sgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogMzBcblx0XHRoZWlnaHQ6IDMwXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcblx0Y2hlY2tVcHN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2hlY2tUaGlja25lc3Ncblx0XHR3aWR0aDogMTNcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0b3JpZ2luWDogMVxuXHRcdHN1cGVyTGF5ZXI6IGNoZWNrXG5cdGNoZWNrVXBzdHJva2UueSA9IDE2XG5cdGNoZWNrVXBzdHJva2Uucm90YXRpb25aID0gNDVcblx0Y2hlY2tEb3duc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjaGVja1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAyMlxuXHRcdG9yaWdpblg6IDFcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0c3VwZXJMYXllcjogY2hlY2tcdFxuXHRjaGVja0Rvd25zdHJva2UueCA9IDRcblx0Y2hlY2tEb3duc3Ryb2tlLnJvdGF0aW9uWiA9IC00NVxuXHRjaGVjay5zZWxlY3QgPSAtPlxuXHRcdGNoZWNrLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcblx0Y2hlY2suZGVzZWxlY3QgPSAtPlxuXHRcdGNoZWNrLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0c2NhbGU6IDAuNFxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRyZXR1cm4gY2hlY2tcblxuXG4jIyNcblx0VEFCTEUgVklFV1xuXHRcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0VGFibGVWaWV3Um93XHRcdFtFbGVtZW50cyBnbyBoZXJlXVxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4jIyNcblxuZXhwb3J0cy5UYWJsZVZpZXdSb3cgPSAocGFyYW1zKSAtPlxuXHRcblx0IyBUaGUgdHJpY2t5IHRoaW5nIGFib3V0IHJldXNhYmxlIGNvbXBvbmVudHMgaXMgcmVtZW1iZXJpbmdcblx0IyBob3cgdG8gdXNlIHRoZW0gKHBhcnRpY3VsYXJseSBpZiB0aGV5IGhhdmUgbG90cyBvZiBjdXN0b21pemFibGVcblx0IyBwYXJhbWV0ZXJzKS4gU2V0dGluZyBzZW5zaWJsZSBkZWZhdWx0cyBtYWtlcyBpdCB3YXkgZWFzaWVyIHRvIGdldFxuXHQjIHN0YXJ0ZWQgKGFuZCByZW1lbWJlciBob3cgdG8gdXNlIHRoZSB0aGluZyB5b3UgbWFkZSlcblx0Xy5kZWZhdWx0cyBwYXJhbXMsIFxuXHRcdG5hbWU6ICdHaXZlIG1lIGEgbmFtZSEnXG5cdFx0eDogMFxuXHRcdHk6IDBcblx0XHRlbmFibGVkOiB0cnVlXG5cdFx0c2VsZWN0ZWQ6IGZhbHNlXG5cdFx0aWNvbjogJ2NoZWNrJ1xuXHRcdHRleHRDb2xvcjogZGVmYXVsdHMudGludFxuXHRcdHN3aXRjaFRpbnQ6ICdncmVlbidcblx0XHRmaXJzdEl0ZW1Jbkxpc3Q6IHRydWUgIyBjb3VsZCBiZSBmaXJzdCBvciBsYXN0XG5cdFx0bGFzdEl0ZW1Jbkxpc3Q6IHRydWUgIyBjb3VsZCBiZSBmaXJzdCBvciBsYXN0XG5cdFx0XG5cdFx0IyBDb25zdGFudHNcblx0XHRzY3JlZW5XaWR0aDogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHR0YWJsZVJvd0hvcml6b250YWxQYWRkaW5nOiBkZWZhdWx0cy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nXG5cdFx0dGFibGVSb3dIZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0Ym9yZGVyQ29sb3I6IGRlZmF1bHRzLmxpbmVUaW50ICMgR3JleSByb3VuZGVkIHBpbGwgJiBib3JkZXJzIGJldHdlZW4gY2VsbHNcblxuXHQjIFNvbWUgb2YgdGhlIHZhbHVlcyBhcmUgYmFzZWQgb24gb3RoZXIgY29uc3RhbnRzLFxuXHQjIHNvIHlvdSBoYXZlIHRvIGNhbGN1bGF0ZSB0aGVtIGluIGEgc2Vjb25kIHBhc3Ncblx0c3dpdGNoQnV0dG9uUmFkaXVzID0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodC8yXG5cdHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyID0gMlxuXHRcdFxuXHQjIFRoaXMgaXMgdGhlIHJvb3Qgb2JqZWN0IGZvciB0aGlzIGVudGlyZSBjb21wb25lbnQuXG5cdCMgV2Ugd2lsbCBhdHRhY2ggYWxsIG91ciBmdW5jdGlvbnMgZGlyZWN0bHkgdG8gdGhpcyBsYXllclxuXHRAbGlzdEl0ZW1Db250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBwYXJhbXMueFxuXHRcdHk6IHBhcmFtcy55XG5cdFx0d2lkdGg6IFx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0Y2xpcDogZmFsc2Vcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGRlZmF1bHRzLml0ZW1CYWNrZ3JvdW5kXG5cdEBsaXN0SXRlbUNvbnRhaW5lci5zdHlsZSA9IFxuXHRcdGJvcmRlclRvcDogXHRcdGlmIHBhcmFtcy5maXJzdEl0ZW1Jbkxpc3QgdGhlbiBcIjFweCBzb2xpZCBcIiArIHBhcmFtcy5ib3JkZXJDb2xvciBlbHNlIFwiXCJcblx0XHRib3JkZXJCb3R0b206IFx0aWYgcGFyYW1zLmxhc3RJdGVtSW5MaXN0IHRoZW4gXCIxcHggc29saWQgXCIgKyBwYXJhbXMuYm9yZGVyQ29sb3IgZWxzZSBcIlwiXG5cblx0IyBUaGVzZSB3aWxsIGJlIGFjY2Vzc2VkIHVzaW5nIGZ1bmN0aW9uc1xuXHRAZW5hYmxlZCA9IHBhcmFtcy5lbmFibGVkXG5cdEBzZWxlY3RlZCA9IHBhcmFtcy5zZWxlY3RlZFxuXHRcblx0QGxpc3RJdGVtID0gbmV3IExheWVyIFxuXHRcdHg6IHBhcmFtcy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nXG5cdFx0d2lkdGg6IFx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0c3VwZXJMYXllcjogQGxpc3RJdGVtQ29udGFpbmVyXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcdFxuXHRAbGlzdEl0ZW0uc3R5bGUgPSBkZWZhdWx0cy5saXN0SXRlbVRleHRTdHlsZVxuXHRAbGlzdEl0ZW0uc3R5bGUgPVxuXHRcdGNvbG9yOiBwYXJhbXMudGV4dENvbG9yXG5cdFx0Ym9yZGVyVG9wOiBcdGlmIHBhcmFtcy5maXJzdEl0ZW1Jbkxpc3QgdGhlbiBcIlwiIGVsc2UgXCIxcHggc29saWQgXCIgKyBwYXJhbXMuYm9yZGVyQ29sb3JcblxuXHQjIFRoaXMgaXMgd2hlcmUgdGhlIGxhYmVsIG9mIHRoZSBsaXN0IGl0ZW0gbGl2ZXNcblx0QGxpc3RJdGVtLmh0bWwgPSBwYXJhbXMubmFtZSBcblxuXHQjIEFkZCB0aGUgY2hlY2ttYXJrIGZvciB0aGUgbGlzdFxuXHR0aGluZ1RvU3dpdGNoID0gc3dpdGNoXG5cdFx0d2hlbiBwYXJhbXMuaWNvbiA9PSAnY2hlY2snIHRoZW4gbmV3IENoZWNrKClcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdjcm9zcycgdGhlbiBuZXcgQ3Jvc3MoKVxuXHRcdHdoZW4gcGFyYW1zLmljb24gPT0gJ2NhcmV0JyB0aGVuIG5ldyBDYXJldCgpXG5cdFx0d2hlbiBwYXJhbXMuaWNvbiA9PSAnc3dpdGNoJyB0aGVuIG5ldyBTd2l0Y2goKVxuXG5cdHRoaW5nVG9Td2l0Y2guc3VwZXJMYXllciA9IEBsaXN0SXRlbUNvbnRhaW5lclxuXHR0aGluZ1RvU3dpdGNoLnggPSBkZWZhdWx0cy5zY3JlZW5XaWR0aCAtIHRoaW5nVG9Td2l0Y2gud2lkdGggLSBkZWZhdWx0cy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nXG5cdHRoaW5nVG9Td2l0Y2guY2VudGVyWSgyKVxuIyBcdHRoaW5nVG9Td2l0Y2gueSA9IC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yIC0gdGhpbmdUb1N3aXRjaC5oZWlnaHQvMlxuXHRcblx0IyBNQUtFIElUIEFMTCBJTlRFUkFDVElWRVxuXHQjIE9uIGEgY2xpY2ssIGdvIHRvIHRoZSBuZXh0IHN0YXRlXG5cdGlmIHBhcmFtcy5pY29uID09ICdzd2l0Y2gnXG5cdFx0dGhpbmdUb1N3aXRjaC5vbiBFdmVudHMuQ2xpY2ssID0+XG5cdFx0XHRAbGlzdEl0ZW1Db250YWluZXIuc3dpdGNoKClcblx0ZWxzZSBcblx0XHRAbGlzdEl0ZW0ub24gRXZlbnRzLkNsaWNrLCA9PlxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLnN3aXRjaCgpXG5cblx0QGxpc3RJdGVtQ29udGFpbmVyLnN3aXRjaCA9ID0+XG5cdFx0aWYgQHNlbGVjdGVkIHRoZW4gQGxpc3RJdGVtQ29udGFpbmVyLmRlc2VsZWN0KCkgZWxzZSBAbGlzdEl0ZW1Db250YWluZXIuc2VsZWN0KClcblx0XHRcblx0QGxpc3RJdGVtQ29udGFpbmVyLnNlbGVjdCA9IChvcHRpb25zKSA9PlxuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHtzdXByZXNzRXZlbnRzOiBmYWxzZX1cblx0XHRpZiBAZW5hYmxlZCBcblx0XHRcdHRoaW5nVG9Td2l0Y2guc2VsZWN0KClcblx0XHRcdEBzZWxlY3RlZCA9IHRydWVcblx0XHRpZiBvcHRpb25zLnN1cHJlc3NFdmVudHMgPT0gZmFsc2Vcblx0XHRcdEBsaXN0SXRlbUNvbnRhaW5lci5lbWl0IFwiRGlkQ2hhbmdlXCIsIHsgc2VsZWN0ZWQ6IEBzZWxlY3RlZCB9XG5cblx0QGxpc3RJdGVtQ29udGFpbmVyLmRlc2VsZWN0ID0gKG9wdGlvbnMpID0+XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge3N1cHJlc3NFdmVudHM6IGZhbHNlfVxuXHRcdGlmIEBlbmFibGVkIFxuXHRcdFx0dGhpbmdUb1N3aXRjaC5kZXNlbGVjdCgpXHRcdFxuXHRcdFx0QHNlbGVjdGVkID0gZmFsc2Vcblx0XHRpZiBvcHRpb25zLnN1cHJlc3NFdmVudHMgPT0gZmFsc2Vcblx0XHRcdEBsaXN0SXRlbUNvbnRhaW5lci5lbWl0IFwiRGlkQ2hhbmdlXCIsIHsgc2VsZWN0ZWQ6IEBzZWxlY3RlZCB9XG5cblx0QGxpc3RJdGVtQ29udGFpbmVyLnVwZGF0ZUxhYmVsID0gKG5ld1RleHQpID0+XG5cdFx0QGxpc3RJdGVtLmh0bWwgPSBuZXdUZXh0XG5cdFx0XHRcblx0QGxpc3RJdGVtQ29udGFpbmVyLnVwZGF0ZUxhYmVsKHBhcmFtcy5uYW1lKVxuXG5cdHJldHVybiBAbGlzdEl0ZW1Db250YWluZXJcblxuZXhwb3J0cy5UYWJsZVZpZXcgPSAocGFyYW1zKSAtPlxuXHRwYXJhbXMgPSBwYXJhbXMgb3Ige31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0eTogXHRcdDBcblx0XHR3aWR0aDpcdGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aXRlbXM6IFtcIkl0J3MganVzdCBtZSFcIl1cblx0XHRpY29uOiAnY2hlY2snXG5cdFx0dmFsaWRhdGlvbjogJ25vbmUnXG5cdFxuXHRAYnV0dG9uR3JvdXBDb250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0MFxuXHRcdHk6XHRcdHBhcmFtcy55XG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCAqIHBhcmFtcy5pdGVtcy5sZW5ndGhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJub25lXCJcblx0XHRcdFx0XHRcblx0QGJ1dHRvbkFycmF5ID0gW11cblx0Zm9yIGJ1dHRvbk5hbWUsIGkgaW4gcGFyYW1zLml0ZW1zXG5cdFx0Zmlyc3RJdGVtSW5MaXN0ID0gaWYgaSA9PSAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG5cdFx0bGFzdEl0ZW1Jbkxpc3QgPSBpZiBpID09IChwYXJhbXMuaXRlbXMubGVuZ3RoLTEpIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG5cdFx0bmV3QnV0dG9uID0gbmV3IGV4cG9ydHMuVGFibGVWaWV3Um93KHtcblx0XHRcdHg6IDAsIFxuXHRcdFx0eTogaSpkZWZhdWx0cy50YWJsZVJvd0hlaWdodCwgXG5cdFx0XHRuYW1lOiBidXR0b25OYW1lLCBcblx0XHRcdGljb246IHBhcmFtcy5pY29uLFxuXHRcdFx0Zmlyc3RJdGVtSW5MaXN0OiBmaXJzdEl0ZW1Jbkxpc3QsXG5cdFx0XHRsYXN0SXRlbUluTGlzdDogbGFzdEl0ZW1Jbkxpc3Rcblx0XHR9KVxuXHRcdEBidXR0b25BcnJheS5wdXNoKG5ld0J1dHRvbilcblx0XHRuZXdCdXR0b24uc3VwZXJMYXllciA9IEBidXR0b25Hcm91cENvbnRhaW5lclxuXG5cdGF0dGFjaFJhZGlvQnV0dG9uVmFsaWRhdGlvbiA9IChidXR0b25BcnJheSkgPT5cblx0XHRmb3IgYnV0dG9uQ2xpY2tlZCwgaW5kZXhPZkJ1dHRvbkNsaWNrZWQgaW4gYnV0dG9uQXJyYXlcblx0XHRcdCMgQ3JlYXRlcyBhIGNsb3N1cmUgdG8gc2F2ZSB0aGUgaW5kZXggb2YgdGhlIGJ1dHRvbiB3ZSdyZSBkZWFsaW5nIHdpdGhcblx0XHRcdGRvIChidXR0b25DbGlja2VkLCBpbmRleE9mQnV0dG9uQ2xpY2tlZCkgLT4gXG5cdFx0XHRcdCMgTGlzdGVuIGZvciBldmVudHMgYW5kIGNoYW5nZSBvdGhlciBidXR0b25zIGluIHJlc3BvbnNlXG5cdFx0XHRcdGJ1dHRvbkNsaWNrZWQub24gJ0RpZENoYW5nZScsIChldmVudCkgPT5cblx0XHRcdFx0XHRmb3Igb3RoZXJCdXR0b24sIG90aGVyQnV0dG9uSW5kZXggaW4gYnV0dG9uQXJyYXlcblx0XHRcdFx0XHRcdGlmIG90aGVyQnV0dG9uSW5kZXggIT0gaW5kZXhPZkJ1dHRvbkNsaWNrZWRcblx0XHRcdFx0XHRcdFx0IyBEbyBzdHVmZiB0byB0aGUgb3RoZXIgYnV0dG9uc1xuXHRcdFx0XHRcdFx0XHRvdGhlckJ1dHRvbi5kZXNlbGVjdCh7c3VwcHJlc3NFdmVudHM6IHRydWV9KVxuXG5cdGlmIHBhcmFtcy52YWxpZGF0aW9uID09ICdyYWRpbydcblx0XHRhdHRhY2hSYWRpb0J1dHRvblZhbGlkYXRpb24oQGJ1dHRvbkFycmF5KVxuXHRcdFxuXHRyZXR1cm4gQGJ1dHRvbkdyb3VwQ29udGFpbmVyXG5cblxuXG4jIyNcblx0VEFCTEUgVklFVyBIRUFERVJcblx0SW4gaU9TLCB0aGlzIGlzIHR5cGljYWxseSBhdHRhY2hlZCB0byB0aGUgdGFibGUgdmlldywgXG5cdGJ1dCBpdCdzIGluZGVwZW5kZW50IGhlcmUgc28geW91IGNhbiBwdXQgaXQgd2hlcmV2ZXIgeW91IHdhbnQuXG4jIyNcblxuZXhwb3J0cy5UYWJsZVZpZXdIZWFkZXIgPSAocGFyYW1zKSAtPlxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0dGV4dDogJ0kgYW0gYSBkaXZpZGVyJ1xuXHRcdHg6IDBcblx0XHR5OiAwXG5cdGxpc3REaXZpZGVyID0gbmV3IExheWVyXG5cdFx0eDogcGFyYW1zLnggKyBkZWZhdWx0cy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nXG5cdFx0eTogcGFyYW1zLnlcblx0XHR3aWR0aDogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuXHRsaXN0RGl2aWRlci5odG1sID0gcGFyYW1zLnRleHRcblx0bGlzdERpdmlkZXIuc3R5bGUgPSBkZWZhdWx0cy5kaXZpZGVySXRlbVRleHRTdHlsZVxuXHRsaXN0RGl2aWRlci5zdHlsZSA9IFxuXHRcdGNvbG9yOiBkZWZhdWx0cy50aW50XG5cdHJldHVybiBsaXN0RGl2aWRlclxuXG5cblxuIyMjXG5cdFBJQ0tFUlxuXHRJbiBpT1MsIHRoaXMgaXMgdHlwaWNhbGx5IGF0dGFjaGVkIHRvIHRoZSB0YWJsZSB2aWV3LCBcblx0YnV0IGl0J3MgaW5kZXBlbmRlbnQgaGVyZSBzbyB5b3UgY2FuIHB1dCBpdCB3aGVyZXZlciB5b3Ugd2FudC5cbiMjI1xuXG5cbiMjIFV0aWxpdHkgZnVuY3Rpb25zXG5cbnF1YW50aXplID0gKGlucHV0LCBzdGVwU2l6ZSkgLT5cblx0cmV0dXJuIE1hdGguZmxvb3IoaW5wdXQvc3RlcFNpemUpICogc3RlcFNpemVcblxuXG4jIyBUaGUgaXRlbXMgaW4gdGhlIHBpY2tlclxuXG5EcnVtID0gKHBhcmVudERydW1MYXllciwgbGlzdE5hbWUsIGxpc3RJdGVtcywgcGFyYW1zKSAtPlxuXHRcblx0IyBTZXR1cCB2YXJpYWJsZXNcblx0QHBhcmVudERydW1MYXllciA9IHBhcmVudERydW1MYXllclxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0ZW5hYmxlZDogdHJ1ZVxuXHRcdHhQY3Q6IDAgIFx0XHRcdFx0IyAwIHRvIDFcblx0XHR3aWR0aFBjdDogMVx0XHRcdFx0IyAwIHRvIDFcblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCJcdFx0IyBsZWZ0LCBjZW50ZXIsIHJpZ2h0XG5cdFx0dGV4dFBhZGRpbmc6IFwiMFwiXG5cdFx0dGV4dENvbG9yOiBkZWZhdWx0cy50aW50XG5cdFxuXHQjIFZhbHVlcyBkZXJpdmVkIGZyb20gcGFyYW1zXG5cdGRydW1Db250YWluZXJIZWlnaHQgPSBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCo1XG5cblx0IyBTZXQgdXAgY29udGVudCBvZiBsaXN0IFx0XHRcblx0bGlzdEl0ZW1zID0gbGlzdEl0ZW1zXG5cdEBuYW1lID0gbGlzdE5hbWVcblx0QGluZGV4ID0gMFxuXHRAdmFsID0gbGlzdEl0ZW1zW0BpbmRleF1cblx0XG5cdGludGVydmFsVG91cGRhdGVEcnVtQXBwZWFyYW5jZSA9IDBcblx0XG5cdCMgQ2FsY3VsYXRlIGhlaWdodCBhbmQgdmVydGljYWwgYm91bmRzIG9mIHRoZSBsaXN0XG5cdGxpc3RNaW5ZUG9zIFx0PSAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRsaXN0TWF4WVBvcyBcdD0gLWxpc3RJdGVtcy5sZW5ndGgqZGVmYXVsdHMudGFibGVSb3dIZWlnaHQrZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRsaXN0SGVpZ2h0IFx0XHQ9IGxpc3RJdGVtcy5sZW5ndGgqZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKyBkcnVtQ29udGFpbmVySGVpZ2h0XG5cblx0QGRydW1Db250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0XHRcdFx0cGFyYW1zLnhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdHk6IFx0XHRcdFx0XHQwXG5cdFx0d2lkdGg6IFx0XHRcdFx0cGFyYW1zLndpZHRoUGN0ICogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRoZWlnaHQ6IFx0XHRcdGRydW1Db250YWluZXJIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJub25lXCJcblx0XHRzdXBlckxheWVyOiBcdFx0cGFyZW50RHJ1bUxheWVyXG5cdFxuXHRsaXN0TGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0XHRcdFx0MFxuXHRcdHk6IFx0XHRcdFx0XHQtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRcdHdpZHRoOiBcdFx0XHRcdHBhcmFtcy53aWR0aFBjdCAqIGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBcdFx0XHRsaXN0SGVpZ2h0XG5cdFx0c3VwZXJMYXllcjogXHRcdEBkcnVtQ29udGFpbmVyXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwibm9uZVwiXG5cdFxuXHQjIGxpc3RMYXllci5zY3JvbGwgPSB0cnVlXG5cdGxpc3RMYXllci5kcmFnZ2FibGUuZW5hYmxlZCA9IHBhcmFtcy5lbmFibGVkXG5cdGxpc3RMYXllci5kcmFnZ2FibGUuc3BlZWRYID0gMFxuXHRcblx0Zm9yIGxpLCBpIGluIGxpc3RJdGVtc1xuXHRcdGxpc3RJdGVtTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdHg6IFx0XHRcdFx0MFxuXHRcdFx0eTogXHRcdFx0XHRpICogZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKyBkcnVtQ29udGFpbmVySGVpZ2h0LzJcblx0XHRcdHdpZHRoOiBcdFx0XHRwYXJhbXMud2lkdGhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdFx0aGVpZ2h0OiBcdFx0ZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRcdHN1cGVyTGF5ZXI6IFx0bGlzdExheWVyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwibm9uZVwiI1V0aWxzLnJhbmRvbUNvbG9yKClcblx0XHRsaXN0SXRlbUxheWVyLmh0bWwgPSBsaVxuXHRcdGxpc3RJdGVtTGF5ZXIuc3R5bGUgPVxuXHRcdFx0Y29sb3I6IFx0XHRcdHBhcmFtcy50ZXh0Q29sb3Jcblx0XHRcdGZvbnRGYW1pbHk6IFx0XCJIZWx2ZXRpY2EgTmV1ZVwiXG5cdFx0XHRmb250V2VpZ2h0OiBcdFwiMjAwXCJcblx0XHRcdGZvbnRTaXplOiBcdFx0XCI0MnB4XCJcblx0XHRcdGxpbmVIZWlnaHQ6IFx0ZGVmYXVsdHMudGFibGVSb3dIZWlnaHQrXCJweFwiXG5cdFx0XHR0ZXh0QWxpZ246IFx0XHRwYXJhbXMudGV4dEFsaWduXG5cdFx0XHRwYWRkaW5nOiBcdFx0cGFyYW1zLnRleHRQYWRkaW5nXG5cblx0XHRsaXN0SXRlbUxheWVyLnN0YXJ0WSA9IGkgKiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCArIGRydW1Db250YWluZXJIZWlnaHQvMlxuXG5cdGxpc3RMYXllci5vbiBFdmVudHMuRHJhZ01vdmUsID0+XG5cdFx0dXBkYXRlRHJ1bUFwcGVhcmFuY2UoKVxuXHRcdFxuXHQjIFRvIHNpbXVsYXRlIGlPUyBtb21lbnR1bSBzY3JvbGxpbmcgKHdoaWNoIGNhdXNlcyB0aGUgZHJ1bSB0byBrZWVwIHNwaW5uaW5nIFxuXHQjIGFmdGVyIHlvdXIgZmluZ2VyIGxpZnRzIG9mZiBpdCksIHdlIHRyaWdnZXIgYW4gYW5pbWF0aW9uIHRoZSBtb21lbnQgeW91IGxpZnRcblx0IyB5b3VyIGZpbmdlci4gVGhlIGludGVuc2l0eSBvZiB0aGlzIGFuaW1hdGlvbiBpcyBwcm9wb3J0aW9uYWwgdG8gdGhlIHNwZWVkIHdoZW5cblx0IyBvZiB0aGUgZHJhZ2dpbmcgd2hlbiB5b3VyIGZpbmdlciB3YXMgbGlmdGVkLlxuXHRsaXN0TGF5ZXIub24gRXZlbnRzLkRyYWdFbmQsIChlLCBmKSA9PlxuXHRcblx0XHQjIFRoaXMgY2FsY3VsYXRlcyB0aGUgYW5pbWF0aW9uXG5cdFx0c2Nyb2xsVmVsb2NpdHkgPSBsaXN0TGF5ZXIuZHJhZ2dhYmxlLmNhbGN1bGF0ZVZlbG9jaXR5KCkueVxuXHRcdHRpbWVBZnRlckRyYWcgPSAoMC41K01hdGguYWJzKHNjcm9sbFZlbG9jaXR5KjAuMikpLnRvRml4ZWQoMSlcblx0XHRmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSA9IHF1YW50aXplKGxpc3RMYXllci55ICsgc2Nyb2xsVmVsb2NpdHkqNDAwLCBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCkgKyBkZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yXG5cdFx0XG5cdFx0IyBBdCB0aGUgdG9wIGFuZCBib3R0b20sIHRoZSBtb21lbnR1bSBzaG91bGQgYmUgYWRqdXN0ZWQgc28gdGhlIFxuXHRcdCMgZmlyc3QgYW5kIGxhc3QgdmFsdWVzIG9uIHRoZSBkcnVtIGRvbid0IGdvIHRvbyBmYXIgb3V0IG9mIHZpZXdcblx0XHRkaXN0YW5jZVRvVHJhdmVsID0gZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gLSBsaXN0TGF5ZXIueVxuXHRcdGxpc3RIZWlnaHRXaXRob3V0RW5kQnVmZmVyID0gLWxpc3RJdGVtcy5sZW5ndGgqZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRib3R0b21PdmVyZmxvdyA9IE1hdGgubWF4KDAsIGxpc3RIZWlnaHRXaXRob3V0RW5kQnVmZmVyLWZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtIClcblx0XHR0b3BPdmVyZmxvdyA9IE1hdGgubWF4KDAsIGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtIClcblx0XHRvdmVyZmxvd0RhbXBlbmluZyA9IDEwXG5cdFx0XG5cdFx0aWYgYm90dG9tT3ZlcmZsb3cgPiAwXG5cdFx0XHRmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSA9IGxpc3RIZWlnaHRXaXRob3V0RW5kQnVmZmVyIC0gKGJvdHRvbU92ZXJmbG93IC8gb3ZlcmZsb3dEYW1wZW5pbmcpXG5cdFx0XHRuZXdEaXN0YW5jZVRvVHJhdmVsID0gZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gLSBsaXN0TGF5ZXIueVxuXHRcdFx0dGltZUFmdGVyRHJhZyA9IHRpbWVBZnRlckRyYWcgKiAobmV3RGlzdGFuY2VUb1RyYXZlbC9kaXN0YW5jZVRvVHJhdmVsKVxuXG5cdFx0aWYgdG9wT3ZlcmZsb3cgPiAwXG5cdFx0XHRmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSA9IDQwICsgKHRvcE92ZXJmbG93IC8gb3ZlcmZsb3dEYW1wZW5pbmcpXG5cdFx0XHRuZXdEaXN0YW5jZVRvVHJhdmVsID0gZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gLSBsaXN0TGF5ZXIueVxuXHRcdFx0dGltZUFmdGVyRHJhZyA9IHRpbWVBZnRlckRyYWcgKiAobmV3RGlzdGFuY2VUb1RyYXZlbC9kaXN0YW5jZVRvVHJhdmVsKVxuXG5cdFx0IyBUcmlnZ2VyIHRoZSBhbmltYXRpb24sIGFuZCBzY2hlZHVsZSBhbiBldmVudCB0aGF0IHdpbGxcblx0XHQjIHRyaWdnZXIgd2hlbiB0aGUgZHJ1bSBmaW5hbGx5IHN0b3BzIHNwaW5uaW5nLlxuXHRcdGxpc3RMYXllci5hbmltYXRlKHtcblx0XHRcdFx0cHJvcGVydGllczoge3k6IGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtfVxuXHRcdFx0XHR0aW1lOiB0aW1lQWZ0ZXJEcmFnXG5cdFx0XHRcdGN1cnZlOiBcImVhc2Utb3V0XCJcblx0XHRcdH0pXG5cdFx0VXRpbHMuZGVsYXkgdGltZUFmdGVyRHJhZywgLT5cblx0XHRcdHN0b3BEcnVtKClcblxuXHQjIFRoaXMgZW5zdXJlcyB0aGF0IGR1cmluZyB0aGUgYW5pbWF0aW9uIG9mIHRoZSBsaXN0IGxheWVyLCB0aGUgZHJ1bSdzIGFwcGVhcmFuY2UgY29udGludWVzXG5cdCMgdG8gYmUgdXBkYXRlZC4gQmVjYXVzZSBtdWx0aXBsZSBhbmltYXRpb25zIGNvdWxkIG92ZXJsYXAsIHdlIGVuc3VyZSB0aGF0IGV2ZXJ5IG5ldyBhbmltYXRpb25cblx0IyBlbmRzIHRoZSBpbnRlcnZhbCBhbmQgc3RhcnRzIGEgbmV3IG9uZSBzbyB0aGF0IHdlIG5ldmVyIGhhdmUgbW9yZSB0aGFuIG9uZSBydW5uaW5nIFxuXHRsaXN0TGF5ZXIub24gRXZlbnRzLkFuaW1hdGlvblN0YXJ0LCAtPlxuXHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlKVxuXHRcdGludGVydmFsVG91cGRhdGVEcnVtQXBwZWFyYW5jZSA9IFV0aWxzLmludGVydmFsIDEvMzAsIHVwZGF0ZURydW1BcHBlYXJhbmNlICAgIFxuXG5cdGxpc3RMYXllci5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9Plx0XHRcblx0XHRjbGVhckludGVydmFsKGludGVydmFsVG91cGRhdGVEcnVtQXBwZWFyYW5jZSlcblxuXHRcdCMgRW1pdCBhZnRlciBhbGwgbW92ZW1lbnQgZW5kcyBpbiB0aGUgbGlzdFxuXHRcdEBkcnVtQ29udGFpbmVyLmVtaXQoXCJEcnVtRmluaXNoZWRDaGFuZ2luZ1wiLCB7bGlzdDogbGlzdE5hbWUsIGluZGV4OiBAaW5kZXgsIHZhbHVlOiBAdmFsfSlcblxuXHR1cGRhdGVEcnVtQXBwZWFyYW5jZSA9ID0+XG5cdFx0aXRlbXNJbkRydW0gPSA0XG5cdFx0bGlzdFBvc2l0aW9uID0gbGlzdExheWVyLnkgLyAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgLSAwLjVcblx0XHRjYXBwZWRMaXN0UG9zaXRpb24gPSBNYXRoLm1heCgwLCBNYXRoLm1pbihsaXN0TGF5ZXIueSAvIC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodCAtIDAuNSwgbGlzdEl0ZW1zLmxlbmd0aCAtIDEpKVxuXHRcdGZvY3VzSXRlbSA9IE1hdGgucm91bmQoY2FwcGVkTGlzdFBvc2l0aW9uKVxuXHRcdGRpc3RhbmNlRnJvbU1pZGRsZSA9IE1hdGguYWJzKGZvY3VzSXRlbSAtIGNhcHBlZExpc3RQb3NpdGlvbilcblx0XHRmb3IgaSBpbiBbKGZvY3VzSXRlbS1pdGVtc0luRHJ1bSkuLihmb2N1c0l0ZW0raXRlbXNJbkRydW0pXVxuXHRcdFx0aWYgaSA+PSAwIGFuZCBpIDwgbGlzdEl0ZW1zLmxlbmd0aFxuXHRcdFx0XHRsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLm9wYWNpdHkgPSAxIC0gTWF0aC5hYnMobGlzdFBvc2l0aW9uIC0gaSkvNSAtIChpZiAoaSAhPSBmb2N1c0l0ZW0pIHRoZW4gMC4zIGVsc2UgMClcblx0XHRcdFx0bGlzdExheWVyLnN1YkxheWVyc1tpXS5zY2FsZVkgPSAxIC0gTWF0aC5taW4oMSwgTWF0aC5hYnMobGlzdFBvc2l0aW9uIC0gaSkvNClcblx0XHRcdFx0bGlzdExheWVyLnN1YkxheWVyc1tpXS55ID0gbGlzdExheWVyLnN1YkxheWVyc1tpXS5zdGFydFkgLSAoaS1saXN0UG9zaXRpb24pKk1hdGguYWJzKGktbGlzdFBvc2l0aW9uKSoxMFxuXG5cdFx0IyBVcGRhdGUgdGhlIHZhbHVlIG9mIHRoZSBkcnVtIG9ubHkgd2hlbiBhIG5ldyB2YWx1ZSBpcyByZWFjaGVkXG5cdFx0aWYgKEBpbmRleCAhPSBmb2N1c0l0ZW0pXG5cdFx0XHR1cGRhdGVEcnVtVmFsdWVzKGZvY3VzSXRlbSlcblx0XHRcblx0c3RvcERydW0gPSA9Plx0XHRcblx0XHQjIEVuc3VyZSB0aGUgZHJ1bSBuZXZlciBlbmRzIG91dCBvZiBib3VuZHNcblx0XHRpZiBsaXN0TGF5ZXIueSA+IGxpc3RNaW5ZUG9zIFxuXHRcdFx0bGlzdExheWVyLmFuaW1hdGUoe1xuXHRcdCAgICBcdHByb3BlcnRpZXM6IHt5Omxpc3RNaW5ZUG9zfVxuXHRcdCAgICBcdGN1cnZlOiBcInNwcmluZyg0MDAsNTAsMClcIlxuXHRcdFx0fSlcblx0XHRpZiBsaXN0TGF5ZXIueSA8IGxpc3RNYXhZUG9zXG5cdFx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt5OiBsaXN0TWF4WVBvc31cblx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDQwMCw1MCwwKVwiXG5cdFx0XHR9KVxuXHRcblx0IyBVcGRhdGUgdGhlIHZhbHVlcyBvZiB0aGUgZHJ1bXMgYW5kIGludm9rZSB0aGUgY2FsbGJhY2sgXG5cdHVwZGF0ZURydW1WYWx1ZXMgPSAobmV3SW5kZXgpID0+XG5cdFx0QGluZGV4ID0gbmV3SW5kZXhcblx0XHRAdmFsID0gbGlzdEl0ZW1zW0BpbmRleF1cblx0XHRAZHJ1bUNvbnRhaW5lci5lbWl0KFwiRHJ1bURpZENoYW5nZVwiLCB7bGlzdDogbGlzdE5hbWUsIGluZGV4OiBAaW5kZXgsIHZhbHVlOiBAdmFsfSlcblx0XG5cdCMgUmVuZGVyIGZvciB0aGUgZmlyc3QgdGltZVx0XHRcblx0dXBkYXRlRHJ1bUFwcGVhcmFuY2UoKVxuXHRcblx0QHNldEluZGV4ID0gKGluZGV4KSA9PlxuXHRcdHlQb3NpdGlvbkZvclRoaXNJbmRleCA9IC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yIC0gKGluZGV4ICogZGVmYXVsdHMudGFibGVSb3dIZWlnaHQpXG5cdFx0bGlzdExheWVyLmFuaW1hdGUoe1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eTogeVBvc2l0aW9uRm9yVGhpc0luZGV4fVxuXHRcdFx0XHR0aW1lOiAwLjVcblx0XHRcdFx0Y3VydmU6IFwiZWFzZS1vdXRcIlxuXHRcdFx0fSlcblxuXHRAc2V0VmFsdWUgPSAodmFsKSA9PlxuXHRcdGluZGV4ID0gbGlzdEl0ZW1zLmluZGV4T2YodmFsKVxuXHRcdGlmIGluZGV4ICE9IC0xXG5cdFx0XHRAc2V0SW5kZXgoaW5kZXgpXG5cblx0IyBSZXR1cm4gdGhlIGRydW0gb2JqZWN0IHNvIHdlIGNhbiBhY2Nlc3MgaXRzIHZhbHVlc1xuXHRyZXR1cm4gQFxuXG5cbiMjI1xuXHRQSUNLRVJcblx0VGhpcyBjb250YWlucyB0aGUgcGlja2VyIFxuIyMjIFxuZXhwb3J0cy5QaWNrZXIgPSAocGFyYW1zKSAtPlxuXHRcblx0cGFyYW1zID0gcGFyYW1zIHx8IHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLFxuXHRcdHg6IFx0XHQwXG5cdFx0eTogXHRcdDBcblx0XHR3aWR0aDpcdGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0ZGVmYXVsdFRleHQ6IFwiXCJcblx0XHR0ZXh0Q29sb3I6IGRlZmF1bHRzLnRpbnRcblxuXHRkcnVtQ29udGFpbmVySGVpZ2h0ID0gZGVmYXVsdHMudGFibGVSb3dIZWlnaHQqNVxuXG5cdEBwaWNrZXJDb250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0cGFyYW1zLnhcblx0XHR5Olx0XHRwYXJhbXMueVxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZHJ1bUNvbnRhaW5lckhlaWdodCs4OFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRkZWZhdWx0cy5pdGVtQmFja2dyb3VuZFxuXHRcdFx0XG5cdEBkcnVtID0gbmV3IExheWVyXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0ODhcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6IGRydW1Db250YWluZXJIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwibm9uZVwiXG5cdFx0c3VwZXJMYXllcjogQHBpY2tlckNvbnRhaW5lclx0XHRcblx0XHRcblx0QHNlbGVjdGVkSXRlbSA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTogXHRcdGRydW1Db250YWluZXJIZWlnaHQvMiAtIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIm5vbmVcIlxuXHRcdHN1cGVyTGF5ZXI6IEBkcnVtXG5cblx0QHBpY2tlckNvbnRhaW5lci5waWNrZXJIZWFkZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0MFxuXHRcdHk6IFx0XHQwXG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0Olx0ODhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGRlZmF1bHRzLml0ZW1CYWNrZ3JvdW5kXG5cdFx0c3VwZXJMYXllcjogQHBpY2tlckNvbnRhaW5lclxuXHRcdFxuXHQjIFN0eWxlc1xuXHRAZHJ1bS5zdHlsZSA9XG5cdFx0cG9pbnRlckV2ZW50czogXCJub25lXCJcblx0XHRib3JkZXJUb3A6IFwiMXB4IHNvbGlkIFwiICsgZGVmYXVsdHMubGluZVRpbnRcblx0XHRib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIFwiICsgZGVmYXVsdHMubGluZVRpbnRcblx0XG5cdEBzZWxlY3RlZEl0ZW0uc3R5bGUgPVxuXHRcdHBvaW50ZXJFdmVudHM6IFwibm9uZVwiXG5cdFx0Ym9yZGVyVG9wOiBcIjFweCBzb2xpZCByZ2JhKDAsMCwwLDAuMylcIlxuXHRcdGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgwLDAsMCwwLjMpXCJcblx0XHRcblx0QHBpY2tlckNvbnRhaW5lci5waWNrZXJIZWFkZXIuc3R5bGUgPSBkZWZhdWx0cy5saXN0SXRlbVRleHRTdHlsZVxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlci5zdHlsZSA9IFxuXHRcdGNvbG9yOiBwYXJhbXMudGV4dENvbG9yXG5cdFx0cGFkZGluZ0xlZnQ6IFwiMjBweFwiXG5cdFx0Ym9yZGVyVG9wOiBcIjFweCBzb2xpZCBcIiArIGRlZmF1bHRzLmxpbmVUaW50XG5cdFx0XHRcblx0QHBpY2tlckNvbnRhaW5lci5waWNrZXJIZWFkZXIuaHRtbCA9IHBhcmFtcy5kZWZhdWx0VGV4dFxuXHRcdFxuXHRcdFxuXHQjIEFkZCBkcnVtc1xuXHRAcGlja2VyQ29udGFpbmVyLmRydW1zID0gW11cblx0QHBpY2tlckNvbnRhaW5lci5kcnVtc0J5TmFtZSA9IHt9XG5cdFxuXHRwaWNrZXJEaWRDaGFuZ2UgPSAoKT0+XG5cdFx0ZHJ1bVZhbHVlcyA9IHt9XG5cdFx0bmV3VmFsdWVzID0gZm9yIGRydW0gaW4gQHBpY2tlckNvbnRhaW5lci5kcnVtc1xuXHRcdFx0ZHJ1bVZhbHVlc1tkcnVtLm5hbWVdID0ge2luZGV4OiBkcnVtLmluZGV4LCB2YWw6IGRydW0udmFsfVxuXG5cdFx0QHBpY2tlckNvbnRhaW5lci5lbWl0KFwiUGlja2VyRGlkQ2hhbmdlXCIsIGRydW1WYWx1ZXMgKVxuXHRcblx0cGlja2VyRmluaXNoZWRDaGFuZ2luZyA9ICgpPT5cblx0XHRkcnVtVmFsdWVzID0ge31cblx0XHRuZXdWYWx1ZXMgPSBmb3IgZHJ1bSBpbiBAcGlja2VyQ29udGFpbmVyLmRydW1zXG5cdFx0XHRkcnVtVmFsdWVzW2RydW0ubmFtZV0gPSB7aW5kZXg6IGRydW0uaW5kZXgsIHZhbDogZHJ1bS52YWx9XG5cblx0XHRAcGlja2VyQ29udGFpbmVyLmVtaXQoXCJQaWNrZXJGaW5pc2hlZENoYW5naW5nXCIsIGRydW1WYWx1ZXMgKVx0XG5cdGlmIChwYXJhbXMuZHJ1bXMgYW5kIHBhcmFtcy5kcnVtcy5sZW5ndGggPiAwKVxuXHRcdGZvciBkcnVtIGluIHBhcmFtcy5kcnVtc1xuXHRcdFx0bmV3RHJ1bSA9IG5ldyBEcnVtKEBkcnVtLCBkcnVtLm5hbWUsIGRydW0uaXRlbXMsIGRydW0ucGFyYW1zKVxuXG5cdFx0XHQjIyBTdG9yZSBkcnVtcyBpbnNpZGUgdGhlIHBpY2tlclxuXHRcdFx0QHBpY2tlckNvbnRhaW5lci5kcnVtcy5wdXNoKG5ld0RydW0pXG5cdFx0XHRAcGlja2VyQ29udGFpbmVyLmRydW1zQnlOYW1lW2RydW0ubmFtZV0gPSBuZXdEcnVtIFxuXG5cdFx0XHQjIyBFbnN1cmUgdGhhdCBjaGFuZ2VzIHRvIHRoZSBkcnVtIGJ1YmJsZSB1cCB0byB0aGUgcGlja2VyXG5cdFx0XHRuZXdEcnVtLmRydW1Db250YWluZXIub24gXCJEcnVtRGlkQ2hhbmdlXCIsIHBpY2tlckRpZENoYW5nZVxuXHRcdFx0XG5cdFx0XHQjIyBFbWl0IGFuIGV2ZW50IHdoZW4gZHJ1bXMgc3RvcCBtb3ZpbmcgYWx0b2dldGhlclxuXHRcdFx0bmV3RHJ1bS5kcnVtQ29udGFpbmVyLm9uIFwiRHJ1bUZpbmlzaGVkQ2hhbmdpbmdcIiwgcGlja2VyRmluaXNoZWRDaGFuZ2luZ1xuXG5cdHJldHVybiBAcGlja2VyQ29udGFpbmVyXG5cblxuXG5cbiJdfQ==
