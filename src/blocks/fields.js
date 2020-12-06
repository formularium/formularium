/*eslint no-unused-vars: 1*/

import * as Blockly from "blockly/core";
Blockly.Blocks["formfield"] = {
  init: function() {
    this.appendDummyInput()
      .appendField("Form Field")
      .appendField(
        new Blockly.FieldDropdown([
          ["string", "string"],
          ["number", "number"],
          ["integer", "integer"],
          ["boolean", "boolean"],
          ["array", "array"]
        ]),
        "type"
      );
    this.appendDummyInput()
      .appendField("Widget:")
      .appendField(
        new Blockly.FieldDropdown([
          ["---", ""],
          ["color-picker", "color-picker"],
          ["radio", "radio"],
          ["checkbox", "checkbox"],
          ["switch", "switch"],
          ["file", "file"],
          ["textarea", "textarea"],
          ["markdown", "markdown"],
          ["time", "time"],
          ["date", "date"],
          ["date-time", "date-time"],
          ["hexcolor", "hexcolor"],
          ["email", "email"],
          ["uri", "uri"]
        ]),
        "widget"
      );
    this.appendDummyInput()
      .appendField("Required: ")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "required");
    this.appendDummyInput()
      .appendField("Field Name:")
      .appendField(new Blockly.FieldTextInput("null"), "name");
    this.appendDummyInput()
      .appendField("Display Name: ")
      .appendField(new Blockly.FieldTextInput("null"), "title");
    this.appendStatementInput("validation")
      .setCheck([
        "length_validation",
        "numeric_value_validation",
        "regex_validation"
      ])
      .appendField("Validation");
    this.appendStatementInput("help")
      .setCheck("help")
      .appendField("Help");
    this.appendStatementInput("enums")
      .setCheck("enum")
      .appendField("Enums");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["formsection"] = {
  init: function() {
    this.appendDummyInput().appendField("Form Section");
    this.appendDummyInput()
      .appendField("Name: ")
      .appendField(new Blockly.FieldTextInput("null"), "name");
    this.appendStatementInput("form_fields")
      .setCheck(["formfield", "multiple"])
      .appendField("Form Fields:");
    this.appendStatementInput("help")
      .setCheck("help")
      .appendField("Help:");
    this.appendValueInput("Context")
      .setCheck(null)
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Context");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["length_validation"] = {
  init: function() {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["Min Length", "minLength"],
        ["Max Length", "maxLength"]
      ]),
      "type"
    );
    this.appendValueInput("NAME")
      .setCheck("Number")
      .appendField("Value: ")
      .appendField(new Blockly.FieldNumber(1, 0), "length");
    this.appendDummyInput()
      .appendField("Error Message:")
      .appendField(new Blockly.FieldTextInput(""), "error_message");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["regex_validation"] = {
  init: function() {
    this.appendDummyInput().appendField("Regex Validation");
    this.appendValueInput("pattern")
      .setCheck("String")
      .appendField("Pattern: ")
      .appendField(new Blockly.FieldTextInput(""), "pattern");
    this.appendDummyInput()
      .appendField("Error Message:")
      .appendField(new Blockly.FieldTextInput(""), "error_message");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["numeric_value_validation"] = {
  init: function() {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["Min Value", "minimum"],
        ["Max Value", "maximum"]
      ]),
      "type"
    );
    this.appendValueInput("value")
      .setCheck("Number")
      .appendField("Value: ")
      .appendField(new Blockly.FieldNumber(1), "value");
    this.appendDummyInput()
      .appendField("Error Message:")
      .appendField(new Blockly.FieldTextInput(""), "error_message");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["help"] = {
  init: function() {
    this.appendDummyInput()
      .appendField("Help:")
      .appendField(
        new Blockly.FieldDropdown([
          ["Title", "title"],
          ["Description", "description"],
          ["Icon", "icon"],
          ["Prefilled", "prefilled"]
        ]),
        "type"
      );
    this.appendValueInput("value")
      .setCheck("String")
      .appendField("Value:")
      .appendField(new Blockly.FieldTextInput(""), "value");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["enum"] = {
  init: function() {
    this.appendDummyInput().appendField("ENUM");
    this.appendDummyInput()
      .appendField("Value:")
      .appendField(new Blockly.FieldTextInput(""), "value");
    this.appendDummyInput()
      .appendField("Display Name:")
      .appendField(new Blockly.FieldTextInput(""), "display");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["enum_from_list"] = {
  init: function() {
    this.appendDummyInput().appendField("ENUM from List");
    this.setInputsInline(true);
    this.appendValueInput("list").appendField("List:");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["multiple"] = {
  init: function() {
    this.appendDummyInput().appendField("Multiple");
    this.appendDummyInput()
      .appendField("Name: ")
      .appendField(new Blockly.FieldTextInput("null"), "name");
    this.appendStatementInput("fields")
      .setCheck("formfield")
      .appendField("Fields");
    this.appendValueInput("min")
      .setCheck("Number")
      .appendField("Min ")
      .appendField(new Blockly.FieldNumber(0, 0), "min");
    this.appendValueInput("max")
      .setCheck("Number")
      .appendField("Max")
      .appendField(new Blockly.FieldNumber(0, 1), "max");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(285);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["jsonschemaformsection"] = {
  init: function() {
    this.appendDummyInput()
      .appendField("SchemaForm Section")
      .appendField(new Blockly.FieldTextInput("null"), "name");
    this.appendDummyInput()
      .appendField("Schema")
      .appendField(new Blockly.FieldTextInput("null"), "schema");
    this.appendStatementInput("help")
      .setCheck("help")
      .appendField("Help:");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["navigation"] = {
  init: function() {
    this.appendDummyInput().appendField("Navigation");
    this.appendDummyInput()
      .appendField("Variable Name:")
      .appendField(new Blockly.FieldTextInput("null"), "name");
    this.appendDummyInput()
      .appendField("Title")
      .appendField(new Blockly.FieldTextInput("null"), "title");
    this.appendStatementInput("options")
      .setCheck("enum")
      .appendField("Options (Enums):");
    this.appendStatementInput("help")
      .setCheck("help")
      .appendField("Help:");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript["formfield"] = function(block) {
  var dropdown_type = block.getFieldValue("type");
  var dropdown_widget = block.getFieldValue("widget");
  var checkbox_required = block.getFieldValue("required") == "TRUE";
  var text_name = block.getFieldValue("name");
  var text_title = block.getFieldValue("title");
  var statements_validation = Blockly.JavaScript.statementToCode(
    block,
    "validation"
  );
  var statements_help = Blockly.JavaScript.statementToCode(block, "help");
  var statements_enums = Blockly.JavaScript.statementToCode(block, "enums");
  // TODO: Assemble JavaScript into code variable.

  var json = {};

  json = {
    title: text_title,
    type: dropdown_type,
    required: checkbox_required,
    "x-options": {
      messages: {}
    }
  };

  if (dropdown_widget !== "") {
    if (
      ["date", "date-time", "time", "hexcolor"].includes(dropdown_widget) !==
      false
    ) {
      json["format"] = dropdown_widget;
    } else {
      json["x-display"] = dropdown_widget;
    }
  }

  var code =
    'fields["' +
    text_name +
    '"] = function () {\n' +
    "var element = " +
    JSON.stringify(json) +
    ";\n" +
    statements_help +
    "\n" +
    statements_enums +
    "\n" +
    statements_validation +
    "\n" +
    'if("' +
    dropdown_type +
    '" === "array" && element["oneOf"]){\n' +
    'element["items"] = {"type": "string", "oneOf": element["oneOf"]}; \ndelete element["oneOf"];\n' +
    "}\n" +
    "return element;" +
    "\n" +
    "}();\n";
  return code;
};

Blockly.JavaScript["formsection"] = function(block) {
  var text_name = block.getFieldValue("name");
  var statements_form_fields = Blockly.JavaScript.statementToCode(
    block,
    "form_fields"
  );
  var statements_help = Blockly.JavaScript.statementToCode(block, "help");
  console.log(statements_form_fields);

  var code =
    "" +
    "render(function () {\n" +
    "var fields = {};\n" +
    " " +
    statements_form_fields +
    "var element = {\n" +
    '  type: "object",\n' +
    "  properties: fields,\n " +
    " required: []\n" +
    "};\n" +
    'for(var e in element["properties"]) { \n' +
    'if(element["properties"][e]["required"] === true) {\n' +
    'element["required"].push(e)\n' +
    "}\n" +
    "}\n" +
    "\n" +
    statements_help +
    "\n" +
    'return JSON.stringify({ type: "form", schema: { type: "object", "properties": { "' +
    text_name +
    '": element}}});\n' +
    "}());\n";

  return code;
};

Blockly.JavaScript["length_validation"] = function(block) {
  var dropdown_type = block.getFieldValue("type");
  var number_length = block.getFieldValue("length");
  var value_name = Blockly.JavaScript.valueToCode(
    block,
    "NAME",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var text_error_message = block.getFieldValue("error_message");
  var length;
  if (value_name) {
    length = value_name;
  } else {
    length = number_length;
  }
  var code =
    "" +
    'element["' +
    dropdown_type +
    '"] = ' +
    length +
    ";\n" +
    'if("' +
    text_error_message +
    '" != "" ) {element["x-options"]["messages"]["' +
    dropdown_type +
    '"] = "' +
    text_error_message +
    '";}\n' +
    "";
  return code;
};

Blockly.JavaScript["regex_validation"] = function(block) {
  var text_pattern = block.getFieldValue("pattern");
  var value_pattern = Blockly.JavaScript.valueToCode(
    block,
    "pattern",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var text_error_message = block.getFieldValue("error_message");
  var pattern;
  if (value_pattern) {
    pattern = value_pattern;
  } else {
    pattern = "'" + text_pattern + "'";
  }
  var code =
    "" +
    'element["pattern"] = ' +
    pattern +
    ";\n" +
    'if("' +
    text_error_message +
    '" != "" ) {element["x-options"]["messages"]["pattern"] = "' +
    text_error_message +
    '";}\n' +
    "";
  return code;
};

Blockly.JavaScript["numeric_value_validation"] = function(block) {
  var dropdown_type = block.getFieldValue("type");
  var number_value = block.getFieldValue("value");
  var value_value = Blockly.JavaScript.valueToCode(
    block,
    "value",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var text_error_message = block.getFieldValue("error_message");

  var value;
  if (value_value) {
    value = value_value;
  } else {
    value = number_value;
  }
  var code =
    "" +
    'element["' +
    dropdown_type +
    '"] = ' +
    value +
    ";\n" +
    'if("' +
    text_error_message +
    '" != "" ) {element["x-options"]["messages"]["' +
    dropdown_type +
    '"] = "' +
    text_error_message +
    '";}\n' +
    "";
  return code;
};

Blockly.JavaScript["help"] = function(block) {
  var dropdown_type = block.getFieldValue("type");
  var text_value = block.getFieldValue("value");
  var value_value = Blockly.JavaScript.valueToCode(
    block,
    "value",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var value = null;
  if (value_value) {
    value = value_value;
  } else {
    value = "'" + text_value + "'";
  }
  var code = 'element["' + dropdown_type + '"] = ' + value + ";\n";
  return code;
};

Blockly.JavaScript["enum"] = function(block) {
  var text_value = block.getFieldValue("value");
  var text_display = block.getFieldValue("display");
  // TODO: Assemble JavaScript into code variable.
  var code =
    'if(!element["oneOf"]) {\n' +
    'element["oneOf"] = [];\n' +
    "}\n" +
    'element["oneOf"].push({"const": "' +
    text_value +
    '", "title": "' +
    text_display +
    '"});\n';
  return code;
};

Blockly.JavaScript["enum_from_list"] = function(block) {
  var value_list = Blockly.JavaScript.valueToCode(
    block,
    "list",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code =
    'if(!element["oneOf"]) {\n' +
    'element["oneOf"] = [];\n' +
    "}\n" +
    "for(var e in " +
    value_list +
    ") {" +
    'element["oneOf"].push({"const": ' +
    value_list +
    '[e], "title": ' +
    value_list +
    "[e]});}\n";
  return code;
};

Blockly.JavaScript["multiple"] = function(block) {
  var text_name = block.getFieldValue("name");
  var statements_fields = Blockly.JavaScript.statementToCode(block, "fields");
  var number_min = block.getFieldValue("min");
  var value_min = Blockly.JavaScript.valueToCode(
    block,
    "min",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var number_max = block.getFieldValue("max");
  var value_max = Blockly.JavaScript.valueToCode(
    block,
    "max",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["jsonschemaformsection"] = function(block) {
  var text_name = block.getFieldValue("name");
  var text_schema = block.getFieldValue("schema");
  var statements_help = Blockly.JavaScript.statementToCode(block, "help");
  // TODO: Assemble JavaScript into code variable.
  var code = 'render(JSON.stringify({ type: "form", schema: JSON.parse(\'' + text_schema + '\')}));\n';
  return code;
};

Blockly.JavaScript["navigation"] = function(block) {
  var text_name = block.getFieldValue("name");
  var text_title = block.getFieldValue("title");
  var statements_help = Blockly.JavaScript.statementToCode(block, "help");
  var statements_options = Blockly.JavaScript.statementToCode(block, "options");
  // TODO: Assemble JavaScript into code variable.
  var json = {
    title: text_title,
    name: text_name,
    type: "buttons"
  };

  var code =
    'render( JSON.stringify({ type: "navigation", schema: function () {\n' +
    "var element = " +
    JSON.stringify(json) +
    "\n" +
    statements_options +
    "\n" +
    statements_help +
    "\n" +
    "return element;" +
    "\n" +
    "}()}));\n";

  return code;
};
