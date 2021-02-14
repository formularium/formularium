<template>
  <div
    :class="{
      'editor-active': editor === true,
      'elevation-3': editor === true,
      'form-item-not-editor': editor === false,
      'form-item': true
    }"
  >
    <v-row>
      <v-col class="py-0">
        <v-btn-toggle
          :class="{
            'float-right': editor === false,
            'edit-option': editor === false,
            'edit-option-hidden': editor === true
          }"
        >
          <v-btn x-small @click="showEditor()">
            <v-icon x-small>mdi-pencil</v-icon></v-btn
          >

          <v-btn color="red" x-small @click="remove">
            <v-icon x-small light>mdi-delete</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row v-if="editor" class="editor">
      <v-col class="py-0">
        <v-jsf :schema="editorSettings" v-model="editorSettingsModel" />
        <v-btn @click="done()" color="primary">
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
import formEditor from "../../assets/formEditor";
export default {
  name: "FormElement",
  props: ["inputElement", "idX"],
  data() {
    return {
      formData: {},
      element: this.$props.inputElement,
      editor: false,
      editorSettings: [],
      editorView: null,
      editorSettingsModel: {}
    };
  },

  created() {
    this.$emit("updateElement");
  },

  methods: {
    showEditor() {
      this.editor = true;
      this.editorSettings = null;
      let formSettings = formEditor;

      this.editorSettingsModel = this.element.schema.properties[
        this.element.fieldKey
      ];

      this.editorSettings = formSettings;
    },
    remove() {
      this.$emit("removeAt", this.idX);
    },
    done() {
      this.editor = false;
      if (
        this.element.schema.properties[this.element.fieldKey].required === true
      ) {
        this.element.schema.required = [this.element.fieldKey];
      } else {
        this.element.schema.required = [];
      }

      this.$emit("updateElement");
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

.form-item.editor-active {
  background: #fff;
  width: 120%;
  margin-left: -10%;
  padding: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #eee;
}

.form-item .edit-option-hidden {
  display: none !important;
  margin-top: 16px;
}

.form-item .edit-option {
  display: none;
}
.form-item-not-editor:hover {
  padding-top: 16px;
}
.form-item:hover .edit-option {
  display: inline-block;
}
</style>
