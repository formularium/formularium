<template>
  <v-dialog v-model="show" persistent max-width="600px">
    <v-card>
      <v-card-title> <span class="headline">Create a Form</span> </v-card-title>
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
    value: Boolean
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
        this.$apollo
          .mutate({
            // Query
            mutation: require("../../graphql/admin/createForm.gql"),
            // Parameters
            variables: {
              name: this.data.name,
              description: this.data.description
            }
          })
          .then(data => {
            console.log(data);
            that.show = false;
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }
};
</script>

<style scoped></style>
