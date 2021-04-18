<template>
  <node-view-wrapper class="vue-component">
    <span class="label"
      ><v-autocomplete
        dense
        :items="this.getItems()"
        v-model="context"
      ></v-autocomplete
    ></span>
    <node-view-content class="content" />
  </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from "@tiptap/vue-2";
import propertiesToArray from "../../utils/propertiesToArray";

export default {
  components: {
    NodeViewWrapper,
    NodeViewContent
  },
  data: function() {
    return {
      context: null
    };
  },

  props: nodeViewProps,

  methods: {
    getItems() {
      return propertiesToArray(window.jsonSchemaPaths);
    }
  }
};
</script>

<style lang="scss" scoped>
.vue-component {
  border: 3px solid #0d0d0d;
  border-radius: 0.5rem;
  position: relative;
}

.label {
  margin-left: 1rem;
  font-size: 0.6rem;
  font-weight: bold;
  border: 3px solid #0d0d0d;
  color: #fff;
  position: absolute;
  top: -3px;
  padding: 0.25rem 0.25rem;
  border-radius: 0 0 0.5rem 0.5rem;
}

.content {
  margin-top: 2.5rem;
  padding: 1rem;
}
</style>
