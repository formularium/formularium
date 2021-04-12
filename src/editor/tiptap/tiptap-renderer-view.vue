<!-- Inspired by https://github.com/koumoul-dev/vuetify-jsonschema-form/blob/master/doc/components/wrappers/v-jsf-tiptap.vue -->
<template>
  <!-- using vuetify's generic component v-input is handy for homogeneous labels, validation, etc. -->
  <v-input
    :value="sanitizedHtml"
    :name="fullKey"
    :disabled="disabled"
    :rules="rules"
    :required="required"
    class="vjsf-tiptap"
  >
    <div v-html="fullSchema.html"></div>
  </v-input>
</template>

<script>
// cf https://github.com/iliyaZelenko/tiptap-vuetify#npm-es-modules

import "tiptap-vuetify/dist/main.css";

import sanitizeHtml from "sanitize-html";

export default {
  components: {},
  // available props are the contextual elements passed by v-jsf to its slots
  props: {
    value: { type: String, default: "" },
    options: { type: Object, required: true },
    schema: { type: Object, required: true },
    fullSchema: { type: Object, required: true },
    fullKey: { type: String, required: true },
    label: { type: String, default: "" },
    htmlDescription: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    rules: { type: Array, required: true },
    on: { type: Object, required: true }
  },
  data() {
    return {};
  },
  computed: {
    sanitizedHtml() {
      return this.value && sanitizeHtml(this.value);
    }
  },
  methods: {
    input(value) {
      if (value == null) {
        value = "";
      }
      if (value === "<p></p>") value = "";
      // sanitizing should also be done when receiving this data in the backend
      this.on.input(sanitizeHtml(value));
    }
  }
};
</script>

<style lang="css">
.vjsf-tiptap .v-input__slot {
  display: block;
}
</style>
