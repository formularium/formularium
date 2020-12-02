import * as Blockly from 'blockly/core';

Blockly.Blocks['simple_field'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Name:")
        .appendField(new Blockly.FieldTextInput(""), "name");
    this.appendDummyInput()
        .appendField("Field Type:")
        .appendField(new Blockly.FieldDropdown([["text","Text"], ["checkbox","Checkbox"], ["url","URL"], ["date","date"], ["tel","tel"]]), "field_type");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Text Field");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['simple_field'] = function(block) {
  var text_name = block.getFieldValue('name');
  var dropdown_field_type = block.getFieldValue('field_type');
  // TODO: Assemble JavaScript into code variable.
  var code = 'renderField(JSON.stringify({"name": "'+text_name+'", "type": "'+dropdown_field_type+'"})); \n';
  return code;
};


Blockly.Blocks['display'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("display");
    this.appendValueInput("NAME")
        .setCheck("String")
        .appendField("text:");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
 this.setTooltip("");
 this.setHelpUrl("Show the user some information and halt execution");
  }
};

Blockly.JavaScript['display'] = function(block) {
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'renderField(JSON.stringify({"content": '+value_name+', "type": "render-text"})); \n';
  return code;
};