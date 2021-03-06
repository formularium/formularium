import * as Blockly from "blockly/core";


var CustomFields = CustomFields || {};
    CustomFields.Typeahead = function (text) {
      CustomFields.Typeahead.superClass_.constructor.call(this, text);
      console.log(text);

    };

    Blockly.utils.object.inherits(CustomFields.Typeahead, Blockly.FieldTextInput);
    //Blockly.utils.object.inherits(CustomFields.Typeahead, Blockly.FieldDropdown);
    CustomFields.Typeahead.fromJson = function (options) {
      return new CustomFields.Typeahead(options['pitch']);
    };
    Blockly.fieldRegistry.register('field_typeahead', CustomFields.Typeahead);

CustomFields.Typeahead.prototype.widgetCreate_ = function() {
  var div = Blockly.WidgetDiv.DIV;

  Blockly.utils.dom.addClass(this.getClickTarget_(), 'editing');

  var htmlInput = /** @type {HTMLInputElement} */ (document.createElement('input'));
  htmlInput.className = 'blocklyHtmlInput';
  htmlInput.setAttribute('spellcheck', this.spellcheck_);

  console.log( window.jsonSchemaPaths);
  if(window.jsonSchemaPaths !== undefined) {
    this.autovalues_ = Object.keys(window.jsonSchemaPaths);
  } else {
    this.autovalues_ = [];
  }

  var datalist = document.createElement('datalist');
  for (var i=0; i < this.autovalues_.length; i++) {
    var option = document.createElement('option');
    option.setAttribute('value', this.autovalues_[i]);
    datalist.appendChild(option);
  }
  datalist.setAttribute('id', 'datalist');
  htmlInput.setAttribute('list', 'datalist');

  div.appendChild(datalist);

  var scale = this.workspace_.getScale();
  var fontSize =
      (this.getConstants().FIELD_TEXT_FONTSIZE * scale) + 'pt';
  div.style.fontSize = fontSize;
  htmlInput.style.fontSize = fontSize;
  var borderRadius =
      (Blockly.FieldTextInput.BORDERRADIUS * scale) + 'px';

  if (this.fullBlockClickTarget_) {
    var bBox = this.getScaledBBox();

    // Override border radius.
    borderRadius = (bBox.bottom - bBox.top) / 2 + 'px';
    // Pull stroke colour from the existing shadow block
    var strokeColour = this.sourceBlock_.getParent() ?
      this.sourceBlock_.getParent().style.colourTertiary :
      this.sourceBlock_.style.colourTertiary;
    htmlInput.style.border = (1 * scale) + 'px solid ' + strokeColour;
    div.style.borderRadius = borderRadius;
    div.style.transition = 'box-shadow 0.25s ease 0s';
    if (this.getConstants().FIELD_TEXTINPUT_BOX_SHADOW) {
      div.style.boxShadow = 'rgba(255, 255, 255, 0.3) 0px 0px 0px ' +
          4 * scale + 'px';
    }
  }
  htmlInput.style.borderRadius = borderRadius;

  div.appendChild(htmlInput);

  htmlInput.value = htmlInput.defaultValue = this.getEditorText_(this.value_);
  htmlInput.untypedDefaultValue_ = this.value_;
  htmlInput.oldValue_ = null;

  this.resizeEditor_();

  this.bindInputEvents_(htmlInput);

  return htmlInput;
};

/**
 * Resize the editor to fit the text.
 * @protected
 */
CustomFields.Typeahead.prototype.resizeEditor_ = function() {
  var div = Blockly.WidgetDiv.DIV;
  var bBox = this.getScaledBBox();
  div.style.width = bBox.right - bBox.left + 20 + 'px';
  div.style.height = bBox.bottom - bBox.top + 'px';

  // In RTL mode block fields and LTR input fields the left edge moves,
  // whereas the right edge is fixed.  Reposition the editor.
  var x = this.sourceBlock_.RTL ? bBox.right - div.offsetWidth : bBox.left;
  var xy = new Blockly.utils.Coordinate(x, bBox.top);

  div.style.left = xy.x + 'px';
  div.style.top = xy.y + 'px';
};


Blockly.Blocks['autocomplete_context'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new CustomFields.Typeahead(""), "ctx")
          .appendField("  ");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};


Blockly.Blocks["getcontext"] = {
  init: function() {
    this.appendDummyInput().appendField("getContext");
    this.setOutput(true, null);
    this.setColour(180);
    this.setTooltip("Get current Context");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript["getcontext"] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "JSON.parse(dataContext())";
  console.log(block);
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks["fieldfromcontext"] = {
  init: function() {
    this.appendDummyInput()
      .appendField("Field:")
      .appendField(new Blockly.FieldTextInput(""), "element");
    this.appendValueInput("Context").setCheck("Context");
    this.setOutput(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript["fieldfromcontext"] = function(block) {
  var element = block.getFieldValue("element");
  var value_context = Blockly.JavaScript.valueToCode(
    block,
    "Context",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  // TODO: Assemble JavaScript into code variable.
  var code = value_context + "." + element;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.JavaScript["autocomplete_context"] = function(block) {
  var element = block.getFieldValue("ctx");
  // TODO: Assemble JavaScript into code variable.
  var code = "JSON.parse(dataContext())."+ element;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};
