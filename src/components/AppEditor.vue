<template>
  <div>
    <div id="renderer">
      <FormRenderer
        :code="code"
        :debuggerMode="true"
        @contextUpdate="updateContext"
        @jsonSchemaUpdate="updatejsonSchema"
      ></FormRenderer>
    </div>
    <BlocklyComponent
      id="blockly"
      :options="options"
      ref="blockly-ws"
    ></BlocklyComponent>
    <div id="code">
      <div id="control">
        <v-btn
          v-on:click="showCode()"
          class="mx-2"
          fab
          dark
          small
          color="primary"
        >
          <v-icon dark>mdi-play</v-icon>
        </v-btn>
        <v-btn v-on:click="reset()" class="mx-2" fab dark small color="primary">
          <v-icon dark>mdi-stop</v-icon>
        </v-btn>
        <v-btn v-on:click="download()" class="mx-2" dark small color="primary">
          Download Workspace
        </v-btn>
        <v-btn
          v-on:click="save()"
          v-if="showSave"
          class="mx-2"
          dark
          small
          color="primary"
        >
          Save Workspace
        </v-btn>
      </div>

      <v-tabs v-model="tab">
        <v-tab>Context</v-tab>
        <v-tab>JSONSchema</v-tab>
        <v-tab>JS</v-tab>
        <v-tab>XML</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <code-highlight language="json" class="code-preview">
            {{ context }}
          </code-highlight>
          <pre id="context"></pre>
        </v-tab-item>
        <v-tab-item>
          <code-highlight language="json" class="code-preview">
            {{ jsonSchema }}
          </code-highlight>
        </v-tab-item>
        <v-tab-item>
          <code-highlight language="javascript" class="code-preview">
            {{ code }}
          </code-highlight>
        </v-tab-item>
        <v-tab-item>
          <code-highlight language="xml" class="code-preview">
            {{ xml }}
          </code-highlight>
        </v-tab-item>
      </v-tabs-items>
    </div>

    <FormEditor :visible="showFormEditor" @close="showFormEditor = false" />
  </div>
</template>

<script>
import BlocklyComponent from "./../components/BlocklyComponent.vue";
import "./../prompt";
import BlocklyJS from "blockly/javascript";
import * as Blockly from "blockly/core";
import "./../blocks/context";
import "./../blocks/fields";
import FormRenderer from "./../components/FormRenderer";
import "vue-code-highlight/themes/prism-coy.css";
import CodeHighlight from "vue-code-highlight/src/CodeHighlight.vue";
import FormEditor from "./FormEditor";
import { saveAs } from "file-saver";
export default {
  name: "AppEditor",
  props: ["xmlCode", "showSave"],
  components: {
    FormRenderer,
    FormEditor,
    BlocklyComponent,
    CodeHighlight
  },
  data() {
    return {
      context: {},
      xml: null,
      tab: null,
      jsonSchema: {},
      showFormEditor: false,

      code: "",
      options: {
        media: "media/",
        grid: {
          spacing: 25,
          length: 3,
          colour: "#ccc",
          snap: true
        },
        toolbox: `<xml>
          <category name="Logic" colour="%{BKY_LOGIC_HUE}">
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
            <block type="logic_operation"></block>
            <block type="logic_negate"></block>
            <block type="logic_boolean"></block>
            <block type="logic_null"></block>
          </category>
          <category name="Loops" colour="%{BKY_LOOPS_HUE}">
            <block type="controls_repeat_ext">
              <value name="TIMES">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>

            </block>
             <block type="controls_forEach"></block>
            <block type="controls_whileUntil"></block>
          </category>
          <category name="Math" colour="%{BKY_MATH_HUE}">
            <block type="math_number">
              <field name="NUM">123</field>
            </block>
            <block type="math_arithmetic"></block>
            <block type="math_single"></block>
            <block type="math_random_int"></block>
            <block type="math_on_list"></block>
            <block type="math_round"></block>
            <block type="math_number_property"></block>
            <block type="math_constant"></block>
          </category>
          <category name="Text" colour="%{BKY_TEXTS_HUE}">
            <block type="text"></block>
            <block type="text_length"></block>
            <block type="text_join"></block>
            <block type="text_append"></block>
            <block type="text_changeCase"></block>
            <block type="text_indexOf"></block>
            <block type="text_getSubstring"></block>
            <block type="text_isEmpty"></block>
          </category>
          <category name="List" colour="%{BKY_LISTS_HUE}">
            <block type="lists_create_with"></block>
            <block type="lists_length"></block>
            <block type="lists_indexOf"></block>
            <block type="lists_getIndex"></block>
            <block type="lists_setIndex"></block>
            <block type="lists_getSublist"></block>
            <block type="lists_split"></block>
            <block type="lists_sort"></block>
          </category>
          <category name="Variables" custom="VARIABLE" colour="%{BKY_VARIABLES_HUE}">
            </category>

            <category name="Functions" colour="290" custom="PROCEDURE"></category>
          <category name="FormFields" colour="%{BKY_LOOPS_HUE}">
            <block type="formfield"></block>
            <block type="navigation"></block>
            <block type="formsection"></block>
            <block type="formsection_editor"></block>
            <block type="jsonschemaformsection"></block>
            <block type="length_validation"></block>
            <block type="regex_validation"></block>
            <block type="numeric_value_validation"></block>
            <block type="help"></block>
            <block type="enum"></block>
            <block type="enum_from_list"></block>
            <block type="multiple"></block>
          </category>
          <category name="Context" colour="%{BKY_LOOPS_HUE}">
            <block type="fieldfromcontext"></block>
            <block type="getcontext"></block>
          </category>

        </xml>`
      }
    };
  },
  methods: {
    showCode() {
      this.code = BlocklyJS.workspaceToCode(this.$refs["blockly-ws"].workspace);
      this.xml = Blockly.Xml.domToText(
        Blockly.Xml.workspaceToDom(this.$refs["blockly-ws"].workspace)
      );
    },
    reset() {
      this.code = null;
      this.context = null;
    },
    download() {
      if (this.xml != null) {
        var blob = new Blob([this.xml], {
          type: "application/xml;charset=utf-8"
        });
        saveAs(blob, "app.xml");
      }
    },

    updateContext(payload) {
      this.context = payload;
    },

    updatejsonSchema(payload) {
      this.jsonSchema = payload;
    },
    openSchemaFormEditor(formID) {
      this.showFormEditor = true;
      console.log(formID);
      console.log("form editor");
    },

    save() {
      let xml = Blockly.Xml.domToText(
        Blockly.Xml.workspaceToDom(this.$refs["blockly-ws"].workspace)
      );
      let code = BlocklyJS.workspaceToCode(this.$refs["blockly-ws"].workspace);
      this.$emit("saveForm", { xml: xml, code: code });
    }
  },

  watch: {
    xmlCode(xmlCode) {
      var xml = Blockly.Xml.textToDom(xmlCode);
      Blockly.Xml.domToWorkspace(xml, this.$refs["blockly-ws"].workspace);
    }
  },

  mounted() {
    const that = this;
    window.addEventListener("openSchemaEditor", function(e) {
      that.openSchemaFormEditor(e.detail.id);
    });
  }
};
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
html,
body {
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

#blockly {
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
.code-preview {
  overflow: scroll;
  max-height: 300px;
}
</style>
