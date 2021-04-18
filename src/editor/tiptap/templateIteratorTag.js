import { Node, mergeAttributes } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-2";
import Component from "./templateIterator.vue";

export default Node.create({
  name: "templateIterator",

  group: "block",
  content: "block*",

  atom: true,

  addAttributes() {
    return {
      scope: {
        default: "allo!"
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: "template-iterator"
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["template-iterator", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return VueNodeViewRenderer(Component);
  }
});
