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
    <div       v-if="!disabled" class="page"
>
    <tiptap-vuetify
      :value="sanitizedHtml"
      :extensions="extensions"
        :native-extensions="nativeExtensions"
      v-on="{ ...on, input }"
    />
      <div class="suggestion-list" v-show="showSuggestions" ref="suggestions">
      <template v-if="hasResults">
        <div
          v-for="(user, index) in filteredUsers"
          :key="user.id"
          class="suggestion-list__item"
          :class="{ 'is-selected': navigatedUserIndex === index }"
          @click="selectVariable(user)"
        >{{ user.name }}</div>
      </template>
      <div v-else class="suggestion-list__item is-empty">No Variables found</div>
    </div>
  </div>

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
  HardBreak,

} from "tiptap-vuetify";

import {
  Mention,
} from "tiptap-extensions";

import Fuse from "fuse.js";
import "tiptap-vuetify/dist/main.css";

import tippy, { sticky } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

import sanitizeHtml from "../../utils/sanitizeHTML"
import propertiesToArray from "../../utils/propertiesToArray";

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
        HardBreak,
      ],
      nativeExtensions: [
        new Mention({
            matcher: {
              char: "{{"
            },

            // a list of all suggested items
            items: () => this.addIdsToSuggestions(propertiesToArray(window.jsonSchemaPaths)),
            // is called when a suggestion starts
            onEnter: ({ items, query, range, command, virtualNode }) => {
              this.query = query;
              this.filteredUsers = items;
              this.suggestionRange = range;
              this.renderPopup(virtualNode);
              // we save the command for inserting a selected mention
              // this allows us to call it inside of our custom popup
              // via keyboard navigation and on click
              this.insertMention = command;
              this.isList = false;
            },
            // is called when a suggestion has changed
            onChange: ({ items, query, range, virtualNode }) => {
              this.query = query;
              this.filteredUsers = items;
              this.suggestionRange = range;
              this.navigatedUserIndex = 0;
              this.renderPopup(virtualNode);
            },
            // is called when a suggestion is cancelled
            onExit: () => {
              // reset all saved values
              this.query = null;
              this.filteredUsers = [];
              this.suggestionRange = null;
              this.navigatedUserIndex = 0;
              this.destroyPopup();
              this.isList = false;
            },
            // is called on every keyDown event while a suggestion is active
            onKeyDown: ({ event }) => {
              // pressing up arrow
              if (event.keyCode === 38) {
                this.upHandler();
                return true;
              }
              // pressing down arrow
              if (event.keyCode === 40) {
                this.downHandler();
                return true;
              }
              // pressing enter
              if (event.keyCode === 13) {
                this.enterHandler();
                return true;
              }

              return false;
            },
            // is called when a suggestion has changed
            // this function is optional because there is basic filtering built-in
            // you can overwrite it if you prefer your own filtering
            // in this example we use fuse.js with support for fuzzy search
            onFilter: (items, query) => {
              if(query.includes("#")) {
                this.isList = true;
              } else {
                this.isList = false
              }

              for(let i in items) {
                items[i].isList = this.isList;
              }

              query = query.replace("#", "");
              if (!query) {
                return items;
              }

              const fuse = new Fuse(items, {
                threshold: 0.2,
                keys: ["name"]
              });
              console.log(fuse.search(query).map(item => item.item))

              return fuse.search(query).map(item => item.item);
            }
          })
      ],
      query: null,
      suggestionRange: null,
      filteredUsers: [],
      navigatedUserIndex: 0,
      insertMention: () => {},
      observer: null
    }
  },
  computed: {
    sanitizedHtml() {
      return this.value && sanitizeHtml(this.value);
    },
    hasResults() {
      return this.filteredUsers.length;
    },

    showSuggestions() {
      return this.query || this.hasResults;
    }
  },
  methods: {

    // suggestions need ids so we add them ;-)
    addIdsToSuggestions(suggestions) {
      let result = [];
      for(let s in suggestions) {
        result.push({
          name: suggestions[s],
          id: s
        });
      }
      return result

    },

    input(value) {
      if (value == null) {
        value = "";
      }
      if (value === "<p></p>") value = "";
      // sanitizing should also be done when receiving this data in the backend
      this.on.input(sanitizeHtml(value));
    },
    // navigate to the previous item
    // if it's the first item, navigate to the last one
    upHandler() {
      this.navigatedUserIndex =
        (this.navigatedUserIndex + this.filteredUsers.length - 1) %
        this.filteredUsers.length;
    },

    // navigate to the next item
    // if it's the last item, navigate to the first one
    downHandler() {
      this.navigatedUserIndex =
        (this.navigatedUserIndex + 1) % this.filteredUsers.length;
    },

    enterHandler() {
      const variable = this.filteredUsers[this.navigatedUserIndex];

      if (variable) {
        this.selectVariable(variable);
      }
    },

    // we have to replace our suggestion text with a mention
    // so it's important to pass also the position of your suggestion text
    selectVariable(variable) {
      if(variable.isList === false)
      {
        this.insertMention({
          range: this.suggestionRange,
          attrs: {
            id: variable.id,
            //we need to add whitespace here because of https://github.com/ueberdosis/tiptap/issues/932
            label: variable.name+"}} "
          }
        });
      } else {
        this.insertMention({
          range: this.suggestionRange,
          attrs: {
            id: variable.id,
            //we need to add whitespace here because of https://github.com/ueberdosis/tiptap/issues/932
            label: "#"+variable.name+"}} "
          }
        });

        this.insertMention({
          range: this.suggestionRange,
          attrs: {
            id: variable.id,
            //we need to add whitespace here because of https://github.com/ueberdosis/tiptap/issues/932
            label: "/"+variable.name+"}} "
          }
        });
      }

      //this.editor.focus();
    },

    // renders a popup with suggestions
    // tiptap provides a virtualNode object for using popper.js (or tippy.js) for popups
    renderPopup(node) {
      const { x, y } = node.getBoundingClientRect();
      if (x === 0 && y === 0) {
        return
      }
      if (this.popup) {
        return
      }
      // ref: https://atomiks.github.io/tippyjs/v6/all-props/
      this.popup = tippy('.page', {
        getReferenceClientRect: () => node.getBoundingClientRect(),
        appendTo: () => document.body,
        interactive: true,
        sticky: true, // make sure position of tippy is updated when content changes
        plugins: [sticky],
        content: this.$refs.suggestions,
        trigger: 'mouseenter', // manual
        showOnCreate: true,
        theme: 'dark',
        placement: 'top-start',
        inertia: true,
        duration: [400, 200],
      })
    },
    destroyPopup() {
      if (this.popup && this.popup.length > 0) {
        this.popup[0].destroy();
        this.popup = null;
      }
    }
  }
};
</script>



<style lang="scss">

  .vjsf-tiptap .v-input__slot {
  display: block;
}
$color-black: black;
$color-white: white;

.mention {
  background: rgba($color-black, 0.1);
  color: rgba($color-black, 0.6);
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 5px;
  padding: 0.2rem 0.5rem;
  white-space: nowrap;
}
.mention-suggestion {
  color: rgba($color-black, 0.6);
}
.suggestion-list {
  padding: 0.2rem;
  border: 2px solid rgba($color-black, 0.1);
  font-size: 0.8rem;
  font-weight: bold;
  &__no-results {
    padding: 0.2rem 0.5rem;
  }
  &__item {
    border-radius: 5px;
    padding: 0.2rem 0.5rem;
    margin-bottom: 0.2rem;
    cursor: pointer;
    &:last-child {
      margin-bottom: 0;
    }
    &.is-selected,
    &:hover {
      background-color: rgba($color-white, 0.2);
    }
    &.is-empty {
      opacity: 0.5;
    }
  }
}

.tippy-box[data-theme~=dark] {
  background-color: $color-black;
  padding: 0;
  font-size: 1rem;
  text-align: inherit;
  color: $color-white;
  border-radius: 5px;
}


  </style>