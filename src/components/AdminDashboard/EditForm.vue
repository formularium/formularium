<template>
  <v-dialog v-model="show" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Edit "{{ data.name }}"</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-form ref="createForm" v-model="valid" @submit="submitForm">
              <v-jsf :schema="schema" v-model="data" />
            </v-form> </v-row
        ></v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="show = false">
          Close
        </v-btn>
        <v-btn color="primary" text @click="submitForm">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CreateForm",

  props: {
    value: Boolean,
    formID: String
  },
  data() {
    return {
      schema: {
        type: "object",
        title: "Create a Form",
        properties: {
          name: {
            title: "Name",
            type: "string"
          },
          description: {
            title: "Description",
            type: "string",
            "x-display": "textarea"
          },
          active: {
            title: "Active",
            description: "Indicates if user can use this form",
            type: "boolean",
            "x-display": "switch"
          }
        },
        dependencies: {},
        required: ["name", "description"]
      },
      data: {},
      valid: null
    };
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },

  methods: {
    submitForm(frm) {
      frm.preventDefault();
      var that = this;
      //as soon as the user submits a form we update the form context and continue the code
      if (this.$refs.createForm.validate()) {
        console.log(this.$props.formID);
        this.$apollo
          .mutate({
            // Query
            mutation: require("../../graphql/admin/updateForm.gql"),
            // Parameters
            variables: {
              name: this.data.name,
              description: this.data.description,
              active: this.data.active,
              formId: this.$props.formID
            }
          })
          .then(data => {
            this.$emit("editedForm");

            console.log(data);
            that.show = false;
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  },
  watch: {
    internalForm: function(result) {
      this.data = result;
    }
  },
  apollo: {
    internalForm: {
      query() {
        return require("../../graphql/admin/internalForm.gql");
      },
      variables() {
        return {
          id: this.$props.formID
        };
      },
      skip() {
        return this.$props.formID === null;
      }
    }
  }
};
</script>

<style scoped></style>
