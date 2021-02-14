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
              :group="{ name: 'formElements', pull: 'clone', put: false }"
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
                  <div>
                    <h3 contenteditable @blur="updateTitle">
                      {{ title }}
                    </h3>
                  </div>
                  <draggable
                    class="dragArea list-group"
                    ghost-class="ghost"
                    :list="list2"
                    group="formElements"
                    @change="log"
                  >
                    <div
                      v-for="(element, idx) in list2"
                      :key="element.interalID"
                    >
                      <FormElement
                        :idX="idx"
                        :inputElement="element"
                        @removeAt="removeAt"
                        @updateElement="updateElement"
                      ></FormElement>
                    </div>
                  </draggable>
                </v-form>
              </v-sheet> </v-col
          ></v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import draggable from "vuedraggable";
import FormElement from "./FormElement";
let idGlobal = 8;
import formElements from "../../assets/formElements";

export default {
  name: "DragAndDrop",
  order: 3,
  props: ["initialSchema"],
  components: {
    FormElement,
    draggable
  },
  data() {
    console.log(this.$props.initialSchema);
    let list1 = [];
    for (let e in formElements) {
      let fe = formElements[e];
      fe["typeID"] = e;
      list1.push(fe);
    }
    let list2 = [];
    let title = "Form";

    if (this.$props.initialSchema) {
      title = this.$props.initialSchema.title;
      for (let e in this.$props.initialSchema.properties) {
        let element = {
          id: idGlobal++,
          fieldKey: e,
          interalID: Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, "")
            .substr(0, 5),
          schema: { type: "object", required: [], properties: {} }
        };
        element.schema.properties[e] = this.$props.initialSchema.properties[e];
        element.schema.required = this.$props.initialSchema.required;

        console.log(element);
        list2.push(element);
      }
    }
    console.log(list2);

    return {
      viewTab: {},
      list1: list1,
      list2: list2,
      formData: {},
      title: title,
      schema: {}
    };
  },
  watch: {
    list2() {
      this.updateElement();
    }
  },
  methods: {
    log: function(evt) {
      window.console.log(evt);
    },
    removeAt(idx) {
      this.list2.splice(idx, 1);
    },

    updateElement() {
      let new_schema = this.$props.initialSchema;
      new_schema.required = [];
      new_schema.properties = {};
      console.log(this.list2);
      for (let e in this.list2) {
        new_schema.properties[this.list2[e].fieldKey] = this.list2[
          e
        ].schema.properties[this.list2[e].fieldKey];
        for (let r in this.list2[e].schema.required) {
          new_schema.required.push(this.list2[e].schema.required[r]);
        }
      }
      this.schema = new_schema;
      this.$emit("updateSchema", new_schema);
    },
    showEditor(idx) {
      this.viewTab[idx] = "editor";

      this.$forceUpdate();
    },

    updateTitle(title) {
      this.schema.title = title.target.innerText;
    },

    cloneField(item) {
      console.log(item);
      let json = {
        type: item.type,
        description: "",
        title: item.name,
        "x-type-id": item.typeID,
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

      let fieldKey = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 5);
      console.log(json);
      let element = {
        id: idGlobal++,
        name: item.name,
        fieldKey: fieldKey,
        interalID: Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substr(0, 5),
        schema: {
          type: "object",
          required: [],
          properties: {}
        }
      };

      element["schema"]["properties"][fieldKey] = json;
      return element;
    }
  }
};
</script>

<style lang="scss" scoped>
.white-background {
  background-color: #fff;
  cursor: pointer;
}
.ghost {
  background-color: #e3e3e3;
}
</style>
