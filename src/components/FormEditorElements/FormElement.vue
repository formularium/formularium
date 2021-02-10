<template>
  <div class="form-item">
    <v-row>
      <v-col class="py-0">
        <v-btn-toggle class="float-right edit-option">
          <v-btn x-small @click="showEditor()">
            <v-icon x-small>mdi-pencil</v-icon></v-btn
          >

          <v-btn color="red" x-small @click="remove()">
            <v-icon x-small light>mdi-delete</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row v-if="editor" class="editor">
      <v-col class="py-0">
        {{ element }}
        <br />d
        <v-jsf :schema="editorSettings" v-model="editorSettingsModel" />
        <v-btn @click="done()">
          done
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col class="py-0">
        <v-jsf :schema="element.schema" v-model="formData" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import formElements from "../../assets/formElements";
export default {
  name: "FormElement",
  props: ["inputElement", "idX"],
  data() {
    return {
      formData: {},
      element: this.inputElement,
      editor: false,
      editorSettings: [],
      editorView: null,
      editorSettingsModel: {}
    };
  },
  methods: {
    showEditor() {
      this.editor = true;
      this.editorSettings = null;
      let formSettigs = {
        properties: {
          title: {
            type: "string",
            title: "Field name"
          },
          description: {
            title: "Help Text",
            type: "string"
          },
          widget: {
            type: "string",
            enum:
              formElements[
                this.element.schema.properties[this.element.fieldKey][
                  "x-type-id"
                ]
              ].widgetChoices
          },
          type: {
            type: "string",
            enum:
              formElements[
                this.element.schema.properties[this.element.fieldKey][
                  "x-type-id"
                ]
              ].typeChoices
          }
        },
        type: "object"
      };

      this.editorSettingsModel = {
        title: this.element.schema.properties[this.element.fieldKey].title,
        description: this.element.schema.properties[this.element.fieldKey]
          .description,
        type: this.element.schema.properties[this.element.fieldKey].type
      };

      this.editorSettings = formSettigs;
    },
    remove() {},
    done() {
      this.editor = false;
      this.element.schema.properties[
        this.element.fieldKey
      ].title = this.editorSettingsModel.title;
      this.element.schema.properties[
        this.element.fieldKey
      ].description = this.editorSettingsModel.description;
      this.element.schema.properties[
        this.element.fieldKey
      ].type = this.editorSettingsModel.type;
    }
  }
};
</script>

<style lang="scss" scoped>
.form-item {
  padding-top: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e3e3e3;
  background-color: #fff;
}

.editor {
  background-color: #eee;
}

.form-item .edit-option {
  display: none;
}
.form-item:hover {
  padding-top: 16px;
}
.form-item:hover .edit-option {
  display: inline-block;
}
</style>
