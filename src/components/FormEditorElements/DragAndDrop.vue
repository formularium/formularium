<template>
  <v-container fluid class="grey lighten-5 background px-0 py-0">
    <v-row no-gutters>
      <v-col cols="2">
        <v-sheet
          color="white"
          elevation="2"
          class="px-2 py-2 mx-0"
          height="100%"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                Form Elements
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list>
            <draggable
              class="dragArea list-group"
              :list="list1"
              :group="{ name: 'people', pull: 'clone', put: false }"
              :clone="cloneField"
              @change="log"
            >
              <v-list-item
                class="list-group-item white-background"
                v-for="element in list1"
                :key="element.id"
              >
                <v-list-item-content>
                  <v-list-item-title> {{ element.name }} </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </draggable>
          </v-list>
        </v-sheet>
      </v-col>
      <v-col cols="8">
        <v-container>
          <v-row align="center" justify="center">
            <v-col
              :cols="12"
              :xl="8"
              class="mx-2 py-4 center scroll-y"
              :md="8"
              :sm="10"
              align-self="center"
            >
              <v-sheet color="white" elevation="1" class="px-2 py-2">
                <v-form ref="schemaForm">
                  <div class="form-item">
                    <h3 contenteditable>Form title</h3>
                  </div>
                  <draggable
                    class="dragArea list-group"
                    ghost-class="ghost"
                    :list="list2"
                    group="people"
                    @change="log"
                  >
                    <div
                      class="form-item"
                      v-for="(element, idx) in list2"
                      :key="element.id"
                    >
                      <v-row>
                        <v-col class="py-0">
                          <v-btn-toggle class="float-right edit-option">
                            <v-btn x-small @click="showEditor(idx)">
                              <v-icon x-small>mdi-pencil</v-icon></v-btn
                            >

                            <v-btn color="red" x-small @click="removeAt(idx)">
                              <v-icon x-small light>mdi-delete</v-icon>
                            </v-btn>
                          </v-btn-toggle>
                        </v-col>
                      </v-row>
                        <v-row v-if="idx in viewTab && viewTab[idx] === 'editor'">

                        </v-row>
                      <v-row v-else >
                        <v-col class="py-0">
                          <v-jsf :schema="element.schema" v-model="formData" />
                        </v-col>
                      </v-row>
                    </div>
                  </draggable>
                </v-form>
              </v-sheet> </v-col
          ></v-row>
        </v-container>
      </v-col>

      <v-col cols="2">
        <v-sheet
          color="white"
          elevation="2"
          class="px-2 py-2 mx-0"
          height="100%"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                Field Attributes
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import draggable from "vuedraggable";
let idGlobal = 8;
export default {
  name: "DragAndDrop",
  order: 3,
  components: {
    draggable
  },
  data() {
    return {

        viewTab: {

        },
      list1: [
        {
          name: "Text",
          widget: null,
          type: "string",
          typeChoices: ["string"],
          additional: {},
          widgetChoices: [""],
          id: 1
        },
        {
          name: "Long Text",
          widget: "textarea",
          type: "string",
          typeChoices: ["string"],
          widgetChoices: ["textarea"],
          additional: {},
          id: 2
        },
        {
          name: "Number",
          widget: null,
          type: "number",
          typeChoices: ["number", "integer"],
          widgetChoices: [],
          additional: {},
          id: 3
        },
        {
          name: "Checkbox",
          widget: "checkbox",
          type: "array",
          typeChoices: ["array", "boolean", "string"],
          additional: {
            items: {
              type: "string",
              oneOf: [
                { const: "first", title: "First Option" },
                { const: "second", title: "Second Option" }
              ]
            }
          },
          widgetChoices: ["checkbox"],
          id: 4
        },
        {
          name: "Radio",
          widget: "radio",
          type: "array",
          typeChoices: ["array", "string"],
          widgetChoices: ["radio"],
          additional: {
            items: {
              type: "string",
              oneOf: [
                { const: "first", title: "First Option" },
                { const: "second", title: "Second Option" }
              ]
            }
          },
          id: 5
        },
        {
          name: "Switch",
          widget: "switch",
          type: "array",
          typeChoices: ["boolean"],
          widgetChoices: ["switch"],
          additional: {
            items: {
              type: "string",
              oneOf: [
                { const: "first", title: "First Option" },
                { const: "second", title: "Second Option" }
              ]
            }
          },
          id: 6
        },
        {
          name: "File",
          widget: "file",
          type: "string",
          typeChoices: ["string"],
          widgetChoices: ["file"],
          additional: {},
          id: 7
        },
        {
          name: "Date/Time",
          widget: "date-time",
          type: "string",
          typeChoices: ["string"],
          widgetChoices: ["date-time", "date", "time"],
          additional: {},
          id: 8
        },
        {
          name: "Color",
          widget: "color-picker",
          type: "string",
          typeChoices: ["string"],
          widgetChoices: ["color-picker"],
          additional: {},
          id: 9
        }
      ],
      list2: [],
      formData: {}
    };
  },
  methods: {
    log: function(evt) {
      window.console.log(evt);
    },
    removeAt(idx) {
      this.list2.splice(idx, 1);
    },
      showEditor(idx) {
        this.viewTab[idx] = 'editor';
      },
    cloneField(item) {
      let json = {
        type: item.type,
        description: "",
        title: item.name,
        ...item.additional
      };
      if (item.widget !== "") {
        if (
          ["date", "date-time", "time", "hexcolor"].includes(item.widget) !==
          false
        ) {
          json["format"] = item.widget;
        } else {
          json["x-display"] = item.widget;
        }
      }
      console.log(json);
      let element = {
        id: idGlobal++,
        name: item.name,
        schema: {
          type: "object",
          required: [],
          properties: {}
        }
      };

      element["schema"]["properties"][
        Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substr(0, 5)
      ] = json;
      return element;
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

.form-item .edit-option {
  display: none;
}
.form-item:hover {
  padding-top: 16px;
}
.form-item:hover .edit-option {
  display: inline-block;
}
.white-background {
  background-color: #fff;
  cursor: pointer;
}
.ghost {
  background-color: #e3e3e3;
}
</style>
