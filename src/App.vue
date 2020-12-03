
<template>
  <div id="app">
    <v-app>
      <v-main>
        <div id="renderer">

          <FormRenderer  :code="code"  @contextUpdate="updateContext" @jsonSchemaUpdate="updatejsonSchema"></FormRenderer>

        </div>
    <BlocklyComponent id="blockly2" :options="options" ref="foo"></BlocklyComponent>
      <div id="code">
          <div id="control">
            <v-btn v-on:click="showCode()" class="mx-2" fab dark small color="primary">
            <v-icon dark>mdi-play</v-icon>
          </v-btn>
          <v-btn v-on:click="reset()" class="mx-2" fab dark small color="primary">
            <v-icon dark>mdi-stop</v-icon>
          </v-btn>
          </div>

          <v-tabs v-model="tab">
            <v-tab>Context</v-tab>
            <v-tab>JSONSchema</v-tab>
            <v-tab>JS</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
                <code-highlight language="json" class="code-preview">
                    {{context}}
                </code-highlight>
              <pre id="context"></pre>
            </v-tab-item>
            <v-tab-item>
                 <code-highlight language="json" class="code-preview">

                        {{jsonSchema}}

                </code-highlight>
            </v-tab-item>
            <v-tab-item>
                 <code-highlight language="javascript" class="code-preview">
                         {{code}}
                </code-highlight>
            </v-tab-item>

          </v-tabs-items>


      </div>


      </v-main></v-app>
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
import "vue-code-highlight/themes/prism-coy.css";
import CodeHighlight from "vue-code-highlight/src/CodeHighlight.vue";

export default {
  name: 'app',
  components: {
    FormRenderer,
    BlocklyComponent,
      CodeHighlight
  },
  data(){
    return {
      context: {},
       tab: null,
      jsonSchema: {},
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
            <block type="formfield"></block>
            <block type="formsection"></block>
            <block type="jsonschemaformsection"></block>
            <block type="length_validation"></block>
            <block type="regex_validation"></block>
            <block type="numeric_value_validation"></block>
            <block type="help"></block>
            <block type="enum"></block>
            <block type="multiple"></block>
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
    reset() {
      this.code = null;
      this.context = null;
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
      },

        updatejsonSchema(payload){
          this.jsonSchema = payload;
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
    overflow: hidden;
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
  overflow: scroll;
}

#control {
  width: 100%;
  height: 60px;
  text-align: center;
  background: #fff;
  border-top: 1px solid #000;
  padding: 10px;
}

  #context {
    width: 100%;
    background-color: #eee;
  }
    .code-preview{
        overflow: scroll;
        max-height: 300px;
    }
</style>