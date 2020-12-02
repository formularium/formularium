
<template>
  <div id="app">
    <FormRenderer id="renderer" :code="code"  @contextUpdate="updateContext"></FormRenderer>
    <BlocklyComponent id="blockly2" :options="options" ref="foo"></BlocklyComponent>
    <p id="code">
      <button v-on:click="showCode()">Run</button>
      <pre v-html="code"></pre>
      <pre id="context">{{context}}</pre>

    </p>
  </div>
</template>

<script>

import BlocklyComponent from './components/BlocklyComponent.vue'
import './prompt';
import BlocklyJS from 'blockly/javascript';
import * as Blockly from 'blockly/core';
import './blocks/context';
import './blocks/fields';
import FormRenderer from "./components/FormRenderer";

export default {
  name: 'app',
  components: {
    FormRenderer,
    BlocklyComponent
  },
  data(){
    return {
      context: {},
      code: '',
      options: {
        media: 'media/',
        grid:
          {
            spacing: 25,
            length: 3,
            colour: '#ccc',
            snap: true
          },
        toolbox:
        `<xml>
          <category name="Logic" colour="%{BKY_LOGIC_HUE}">
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
            <block type="logic_operation"></block>
            <block type="logic_negate"></block>
            <block type="logic_boolean"></block>
          </category>
          <category name="Loops" colour="%{BKY_LOOPS_HUE}">
            <block type="controls_repeat_ext">
              <value name="TIMES">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
            </block>
            <block type="controls_whileUntil"></block>
          </category>
          <category name="Math" colour="%{BKY_MATH_HUE}">
            <block type="math_number">
              <field name="NUM">123</field>
            </block>
            <block type="math_arithmetic"></block>
            <block type="math_single"></block>
          </category>
          <category name="Text" colour="%{BKY_TEXTS_HUE}">
            <block type="text"></block>
            <block type="text_length"></block>
            <block type="text_print"></block>
          </category>
          <category name="Variables" custom="VARIABLE" colour="%{BKY_VARIABLES_HUE}">
            </category>

            <category name="Functions" colour="290" custom="PROCEDURE"></category>
          <category name="FormFields" colour="%{BKY_LOOPS_HUE}">
            <block type="simple_field"></block>
            <block type="display"></block>
          </category>
          <category name="Context" colour="%{BKY_LOOPS_HUE}">
            <block type="fieldfromcontext"></block>
            <block type="getcontext"></block>
          </category>

        </xml>`
      }
    }
  },
  methods: {
    showCode() {
      this.code = BlocklyJS.workspaceToCode(this.$refs["foo"].workspace);
      this.$refs["foo"].workspace.registerToolboxCategoryCallback('COLOUR_PALETTE', this.coloursFlyoutCallback)
    },
    // test for dynamic elements
    coloursFlyoutCallback (workspace) {
        console.log(workspace);

      // Returns an array of hex colours, e.g. ['#4286f4', '#ef0447']
      var colourList = ['#4286f4', '#ef0447'];
      var xmlList = [];
      if (Blockly.Blocks['colour_picker']) {
        for (var i = 0; i < colourList.length; i++) {
          var blockText = '<block type="colour_picker">' +
              '<field name="COLOUR">' + colourList[i] + '</field>' +
              '</block>';
          var block = Blockly.Xml.textToDom(blockText);
          xmlList.push(block);
        }
      }
      return xmlList;
},

        updateContext(payload){
          this.context = payload;
      }

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
html, body {
  margin: 0;
}
#code {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 50%;
  height: 50%;
  margin: 0;
  background-color: beige;
}

#blockly2 {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50%;
  height: 100%;
}
#renderer {
    position: absolute;
    right: 0;
    top: 0;
    width: 50%;
    height: 50%;
    margin: 0;
}

  #context {
    width: 100%;
    background-color: #eee;
  }
</style>