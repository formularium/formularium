<template>
  <v-input
    :value="value"
    :name="fullKey"
    :disabled="disabled"
    :rules="rules"
    :required="required"
    class="vjsf-tiptap"
  >
    <div v-if="editor" class="tiptap-vuetify-editor">
      <VCard>
        <v-toolbar color="grey lighten-4" flat dense>
          <v-btn
            small
            icon
            type="button"
            @click="
              editor
                .chain()
                .focus()
                .undo()
                .run()
            "
            :class="{ 'tiptap-vuetify-editor__action-render-btn': true }"
          >
            <v-icon>mdi-undo</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            type="button"
            @click="
              editor
                .chain()
                .focus()
                .redo()
                .run()
            "
            :class="{ 'tiptap-vuetify-editor__action-render-btn': true }"
          >
            <v-icon>mdi-redo</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            type="button"
            @click="
              editor
                .chain()
                .focus()
                .toggleBold()
                .run()
            "
            :class="{
              'v-btn--active': editor.isActive('bold'),
              'tiptap-vuetify-editor__action-render-btn': true
            }"
          >
            <v-icon>mdi-format-bold</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            type="button"
            @click="
              editor
                .chain()
                .focus()
                .toggleItalic()
                .run()
            "
            :class="{
              'is-v-btn--active': editor.isActive('italic'),
              'tiptap-vuetify-editor__action-render-btn': true
            }"
          >
            <v-icon>mdi-format-italic</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            type="button"
            @click="
              editor
                .chain()
                .focus()
                .toggleStrike()
                .run()
            "
            :class="{
              'is-v-btn--activev-btn--activev-btn--activev-btn--activev-btn--activev-btn--activev-btn--activev-btn--activev-btn--active': editor.isActive(
                'strike'
              ),
              'tiptap-vuetify-editor__action-render-btn': true
            }"
          >
            <v-icon>mdi-format-strikethrough</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            type="button"
            @click="
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 2 })
                .run()
            "
            :class="{
              'v-btn--active': editor.isActive('heading', { level: 2 }),
              'tiptap-vuetify-editor__action-render-btn': true
            }"
          >
            <b class="tiptap-vuetify-editor__btn-icon">
              H2
            </b>
          </v-btn>
          <v-btn
            small
            icon
            type="button"
            @click="
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 3 })
                .run()
            "
            :class="{
              'v-btn--active': editor.isActive('heading', { level: 3 }),
              'tiptap-vuetify-editor__action-render-btn': true
            }"
          >
            <b class="tiptap-vuetify-editor__btn-icon">
              H3
            </b>
          </v-btn>
          <v-btn
            small
            icon
            type="button"
            @click="
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 4 })
                .run()
            "
            :class="{
              'v-btn--active': editor.isActive('heading', { level: 4 }),
              'tiptap-vuetify-editor__action-render-btn': true
            }"
          >
            <b class="tiptap-vuetify-editor__btn-icon">
              H4
            </b>
          </v-btn>
          <v-btn
            small
            icon
            type="button"
            @click="
              editor
                .chain()
                .focus()
                .toggleBulletList()
                .run()
            "
            :class="{
              'v-btn--active': editor.isActive('bulletList'),
              'tiptap-vuetify-editor__action-render-btn': true
            }"
          >
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            type="button"
            @click="
              editor
                .chain()
                .focus()
                .toggleOrderedList()
                .run()
            "
            :class="{
              'v-btn--active': editor.isActive('orderedList'),
              'tiptap-vuetify-editor__action-render-btn': true
            }"
          >
            <v-icon>mdi-format-list-numbered</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            type="button"
            @click="
              editor
                .chain()
                .focus()
                .toggleCodeBlock()
                .run()
            "
            :class="{
              'v-btn--active': editor.isActive('codeBlock'),
              'tiptap-vuetify-editor__action-render-btn': true
            }"
          >
            <v-icon>mdi-code-tags</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            type="button"
            @click="
              editor
                .chain()
                .focus()
                .toggleBlockquote()
                .run()
            "
            :class="{
              'v-btn--active': editor.isActive('blockquote'),
              'tiptap-vuetify-editor__action-render-btn': true
            }"
          >
            <v-icon>mdi-format-quote-close</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            type="button"
            @click="
              editor
                .chain()
                .focus()
                .setHorizontalRule()
                .run()
            "
            :class="{ 'tiptap-vuetify-editor__action-render-btn': true }"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            type="button"
            @click="
              editor
                .chain()
                .focus()
                .setParagraph()
                .run()
            "
            :class="{
              'v-btn--active': editor.isActive('paragraph'),
              'tiptap-vuetify-editor__action-render-btn': true
            }"
          >
            <v-icon>mdi-format-paragraph</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            type="button"
            @click="
              editor
                .chain()
                .focus()
                .clearNodes()
                .run()
            "
            :class="{ 'tiptap-vuetify-editor__action-render-btn': true }"
          >
            <v-icon>mdi-format-clear</v-icon>
          </v-btn>
        </v-toolbar>
        <editor-content
          :editor="editor"
          class="tiptap-vuetify-editor__content"
        />
      </VCard>
    </div>
  </v-input>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-2";
import { VueRenderer } from "@tiptap/vue-2";

import { defaultExtensions } from "@tiptap/starter-kit";
import "tiptap-vuetify/dist/main.css";
import MentionList from "./MentionList";
import tippy from "tippy.js";
import { TemplateTagSuggestion } from "./templateTagSuggestion";

import propertiesToArray from "../../utils/propertiesToArray";

export default {
  components: {
    EditorContent
  },

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
      editor: null
    };
  },

  watch: {
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value;

      // JSON
      // const isSame = this.editor.getJSON().toString() === value.toString()

      if (isSame) {
        return;
      }

      this.editor.commands.setContent(this.value, false);
    }
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        ...defaultExtensions(),
        TemplateTagSuggestion.configure({
          HTMLAttributes: {
            class: "mention"
          },
          suggestion: {
            items: query => {
              return propertiesToArray(window.jsonSchemaPaths)
                .filter(item =>
                  item.toLowerCase().startsWith(query.toLowerCase())
                )
                .slice(0, 5);
            },
            render: () => {
              let component;
              let popup;

              return {
                onStart: props => {
                  component = new VueRenderer(MentionList, {
                    parent: this,
                    propsData: props
                  });

                  popup = tippy("body", {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement: "bottom-start"
                  });
                },
                onUpdate(props) {
                  component.updateProps(props);

                  popup[0].setProps({
                    getReferenceClientRect: props.clientRect
                  });
                },
                onKeyDown(props) {
                  return component.ref?.onKeyDown(props);
                },
                onExit() {
                  popup[0].destroy();
                  component.destroy();
                }
              };
            }
          }
        })
      ],
      content: this.value,
      onUpdate: () => {
        // HTML
        this.$emit("input", this.editor.getHTML());
        this.on.input(this.editor.getHTML());
        // JSON
        // this.$emit('input', this.editor.getJSON())
      }
    });
  },

  beforeDestroy() {
    this.editor.destroy();
  }
};
</script>
