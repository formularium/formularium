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
      .appendField("Help:");
    this.appendStatementInput("enums")
      .setCheck("enum")
      .appendField("Enums");
    this.setPreviousStatement(true, ["multiple", "formfield"]);
    this.setNextStatement(true, ["multiple", "formfield"]);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["formsection"] = {
  init: function() {
    this.appendDummyInput().appendField("Form Section");
    this.appendValueInput("name")
      .setCheck("String")
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
    this.setPreviousStatement(true, [
      "regex_validation",
      "numeric_value_validation",
      "length_validation"
    ]);
    this.setNextStatement(true, [
      "regex_validation",
      "numeric_value_validation",
      "length_validation"
    ]);
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
    this.setPreviousStatement(true, [
      "regex_validation",
      "numeric_value_validation",
      "length_validation"
    ]);
    this.setNextStatement(true, [
      "regex_validation",
      "numeric_value_validation",
      "length_validation"
    ]);
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
    this.setPreviousStatement(true, [
      "regex_validation",
      "numeric_value_validation",
      "length_validation"
    ]);
    this.setNextStatement(true, [
      "regex_validation",
      "numeric_value_validation",
      "length_validation"
    ]);
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
    this.setPreviousStatement(true, "help");
    this.setNextStatement(true, "help");
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
    this.setPreviousStatement(true, ["enum", "enum_from_list"]);
    this.setNextStatement(true, ["enum", "enum_from_list"]);
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
    this.setPreviousStatement(true, ["enum", "enum_from_list"]);
    this.setNextStatement(true, ["enum", "enum_from_list"]);
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
    this.appendStatementInput("help")
      .setCheck("help")
      .appendField("Help");
    this.setPreviousStatement(true, ["multiple", "formfield"]);
    this.setNextStatement(true, ["multiple", "formfield"]);
    this.setColour(285);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["jsonschemaformsection"] = {
  init: function() {
    this.appendDummyInput().appendField("JSON-Schema-Section");
    this.appendValueInput("name")
      .setCheck("String")
      .appendField("Name")
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
    this.appendValueInput("name")
      .setCheck("String")
      .appendField("Name: ")
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
  let dropdown_type = block.getFieldValue("type");
  let dropdown_widget = block.getFieldValue("widget");
  let checkbox_required = block.getFieldValue("required") == "TRUE";
  let text_name = block.getFieldValue("name");
  let text_title = block.getFieldValue("title");
  let statements_validation = Blockly.JavaScript.statementToCode(
    block,
    "validation"
  );
  let statements_help = Blockly.JavaScript.statementToCode(block, "help");
  let statements_enums = Blockly.JavaScript.statementToCode(block, "enums");
  // TODO: Assemble JavaScript into code variable.

  let json = {};

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

  let code =
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
  let text_name = block.getFieldValue("name");
  let statements_form_fields = Blockly.JavaScript.statementToCode(
    block,
    "form_fields"
  );
  let statements_help = Blockly.JavaScript.statementToCode(block, "help");

  let value_name = Blockly.JavaScript.valueToCode(
    block,
    "name",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  let name = null;
  if (value_name) {
    name = value_name;
  } else {
    name = "'" + text_name + "'";
  }

  let code =
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
    'return JSON.stringify({ type: "form", name: ' +
    name +
    ', schema: { type: "object", "properties": { ' +
    name +
    ": element}}});\n" +
    "}());\n";

  return code;
};

Blockly.JavaScript["length_validation"] = function(block) {
  let dropdown_type = block.getFieldValue("type");
  let number_length = block.getFieldValue("length");
  let value_name = Blockly.JavaScript.valueToCode(
    block,
    "NAME",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  let text_error_message = block.getFieldValue("error_message");
  let length;
  if (value_name) {
    length = value_name;
  } else {
    length = number_length;
  }
  let code =
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
  let text_pattern = block.getFieldValue("pattern");
  let value_pattern = Blockly.JavaScript.valueToCode(
    block,
    "pattern",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  let text_error_message = block.getFieldValue("error_message");
  let pattern;
  if (value_pattern) {
    pattern = value_pattern;
  } else {
    pattern = "'" + text_pattern + "'";
  }
  let code =
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
  let dropdown_type = block.getFieldValue("type");
  let number_value = block.getFieldValue("value");
  let value_value = Blockly.JavaScript.valueToCode(
    block,
    "value",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  let text_error_message = block.getFieldValue("error_message");

  let value;
  if (value_value) {
    value = value_value;
  } else {
    value = number_value;
  }
  let code =
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
  let dropdown_type = block.getFieldValue("type");
  let text_value = block.getFieldValue("value");
  let value_value = Blockly.JavaScript.valueToCode(
    block,
    "value",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  let value = null;
  if (value_value) {
    value = value_value;
  } else {
    value = "'" + text_value + "'";
  }
  let code = 'element["' + dropdown_type + '"] = ' + value + ";\n";
  return code;
};

Blockly.JavaScript["enum"] = function(block) {
  let text_value = block.getFieldValue("value");
  let text_display = block.getFieldValue("display");
  // TODO: Assemble JavaScript into code variable.
  let code =
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
  let value_list = Blockly.JavaScript.valueToCode(
    block,
    "list",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  let code =
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
    "[e]});}\n" +
    "";

  return code;
};

Blockly.JavaScript["multiple"] = function(block) {
  let text_name = block.getFieldValue("name");
  let statements_fields = Blockly.JavaScript.statementToCode(block, "fields");
  let statements_help = Blockly.JavaScript.statementToCode(block, "help");
  let number_min = block.getFieldValue("min");
  let value_min = Blockly.JavaScript.valueToCode(
    block,
    "min",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  let number_max = block.getFieldValue("max");
  let value_max = Blockly.JavaScript.valueToCode(
    block,
    "max",
    Blockly.JavaScript.ORDER_ATOMIC
  );

  let max_length;
  if (value_max) {
    max_length = value_max;
  } else {
    max_length = number_max;
  }

  let min_length;
  if (value_min) {
    min_length = value_min;
  } else {
    min_length = number_min;
  }

  console.log(statements_fields);
  console.log("foo");
  console.log(statements_help);

  let code =
    'fields["' +
    text_name +
    '"] = function () {' +
    'var element = {"type": "object", "required": [], "properties": {},  "title": null};' +
    "\n" +
    statements_help +
    "\n" +
    "var fields = {};\n" +
    statements_fields +
    "\n" +
    'element["properties"] = fields;' +
    'var multiple = { "type": "array",' +
    '"items": element,' +
    '"title": element["title"],' +
    "\n" +
    '"minItems": ' +
    min_length +
    "," +
    '"maxItems": ' +
    max_length +
    "," +
    "};" +
    'for(var e in multiple["items"]["properties"]) { \n' +
    'if(multiple["items"]["properties"][e]["required"] === true) {\n' +
    'multiple["items"]["required"].push(e)\n' +
    "}\n" +
    "}\n" +
    "return multiple;" +
    "\n" +
    "}();\n";
  return code;
};

Blockly.JavaScript["jsonschemaformsection"] = function(block) {
  let text_name = block.getFieldValue("name");
  let text_schema = block.getFieldValue("schema");
  let statements_help = Blockly.JavaScript.statementToCode(block, "help");
  let value_name = Blockly.JavaScript.valueToCode(
    block,
    "name",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  let name = null;
  if (value_name) {
    name = value_name;
  } else {
    name = "'" + text_name + "'";
  }

  let code =
    "" +
    "var element = JSON.parse('" +
    text_schema +
    "');\n" +
    statements_help +
    "\n" +
    'render(JSON.stringify({ type: "form", name: ' +
    name +
    ', schema: { type: "object", "properties":{ ' +
    name +
    ": element}}}));\n";
  return code;
};

Blockly.JavaScript["navigation"] = function(block) {
  let text_name = block.getFieldValue("name");
  let text_title = block.getFieldValue("title");
  let statements_help = Blockly.JavaScript.statementToCode(block, "help");
  let statements_options = Blockly.JavaScript.statementToCode(block, "options");
  // TODO: Assemble JavaScript into code variable.
  let value_name = Blockly.JavaScript.valueToCode(
    block,
    "name",
    Blockly.JavaScript.ORDER_ATOMIC
  );

  let name = null;
  if (value_name) {
    name = value_name;
  } else {
    name = "'" + text_name + "'";
  }

  let code =
    'render( JSON.stringify({ type: "navigation", name: ' +
    name +
    ", schema: function () {\n" +
    'var element = { title: "' +
    text_title +
    '", name: ' +
    name +
    ', type: "buttons"}' +
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
