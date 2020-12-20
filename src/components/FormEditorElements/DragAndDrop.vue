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
              class="mx-2 py-4 center"
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
                          <v-btn-toggle
                            class="float-right"
                            v-model="toggle_none"
                          >
                            <v-btn x-small>
                              <v-icon x-small>mdi-pencil</v-icon></v-btn
                            >

                            <v-btn color="red" x-small @click="removeAt(idx)">
                              <v-icon x-small light>mdi-delete</v-icon>
                            </v-btn>
                          </v-btn-toggle>
                        </v-col>
                      </v-row>
                      <v-row>
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
      list1: [
        { name: "Text", id: 1 },
        { name: "Number", id: 2 },
        { name: "Phone", id: 3 },
        { name: "E-Mail", id: 4 }
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
    cloneField(item) {
      return {
        id: idGlobal++,
        name: item.name,
        schema: {
          type: "object",
          required: ["firstName"],
          properties: {
            firstName: {
              type: "string",
              title: item.name
            }
          }
        }
      };
    }
  }
};
</script>

<style scoped>
.form-item {
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 2px solid #e3e3e3;
  background-color: #fff;
}
.white-background {
  background-color: #fff;
  cursor: pointer;
}
.ghost {
  background-color: #e3e3e3;
}
</style>
