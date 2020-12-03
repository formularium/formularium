import * as Blockly from "blockly/core";

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
