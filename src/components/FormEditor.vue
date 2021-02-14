<template>
  <v-row justify="center">
    <v-dialog v-model="showModal">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="showModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Form Editor</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="save()">
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="formEditor">
          <DragAndDrop
            :initialSchema="this.initialSchema_"
            @updateSchema="updateSchema"
          ></DragAndDrop>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import "@koumoul/vjsf/lib/VJsf.css";

import DragAndDrop from "./FormEditorElements/DragAndDrop";
export default {
  name: "FormEditor",
  components: { DragAndDrop },
  data() {
    console.log(this.$props.initialSchema);
    return {
      initialSchema_: this.$props.initialSchema,
      schema: {}
    };
  },
  props: ["visible", "sectionID", "initialSchema"],

  methods: {
    updateSchema(schema) {
      this.schema = schema;
    },
    save() {
      this.$emit("updateSchema", {
        id: this.$props.sectionID,
        schema: this.schema
      });
      this.showModal = false;
    }
  },

  computed: {
    showModal: {
      get() {
        return this.$props.visible;
      },
      set(value) {
        this.$emit("close", value);
      }
    }
  }
};
</script>

<style scoped>
.formEditor {
  overflow-y: auto;
  height: 100%;
  min-height: 600px;
}
</style>
