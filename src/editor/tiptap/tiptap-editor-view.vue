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
    <tiptap-vuetify
      v-if="!disabled"
      :value="sanitizedHtml"
      :extensions="extensions"
      v-on="{ ...on, input }"
    />
    <div v-html="sanitizedHtml" v-else></div>
  </v-input>
</template>

<script>
// cf https://github.com/iliyaZelenko/tiptap-vuetify#npm-es-modules
import {
  TiptapVuetify,
  History,
  Blockquote,
  Link,
  Underline,
  Strike,
  Italic,
  ListItem,
  BulletList,
  OrderedList,
  Heading,
  Bold,
  Code,
  HorizontalRule,
  Paragraph,
  HardBreak
} from "tiptap-vuetify";
import "tiptap-vuetify/dist/main.css";

import sanitizeHtml from "sanitize-html";

export default {
  components: { TiptapVuetify },
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
    return {
      extensions: [
        History,
        Blockquote,
        Link,
        Underline,
        Strike,
        Italic,
        ListItem,
        BulletList,
        OrderedList,
        [
          Heading,
          {
            options: {
              levels: [1, 2, 3]
            }
          }
        ],
        Bold,
        Code,
        HorizontalRule,
        Paragraph,
        HardBreak
      ]
    };
  },
  computed: {
    sanitizedHtml() {
      console.log(this.value);
      return this.value && sanitizeHtml(this.value);
    }
  },
  methods: {
    input(value) {
      console.log(value);
      console.log("hello2");
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
