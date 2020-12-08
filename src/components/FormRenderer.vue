<template>
  <div class="grey lighten-5 background">
    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-col
          :cols="12"
          :xl="6"
          class="mx-2 py-4 center"
          :md="6"
          :sm="10"
          align-self="center"
        >
          <v-sheet color="white" elevation="1" class="px-2 py-2">
            <v-form
              ref="schemaForm"
              v-model="valid"
              v-if="schema.type === 'form'"
              @submit="submitForm"
            >
              <v-row>
                <v-col>
                  <v-jsf
                    v-model="model"
                    :schema="schema.schema"
                    :options="options"
                  />
                  <v-row align="center" justify="center">
                    <v-btn
                      color="primary"
                      depressed
                      outlined
                      class="ma-3"
                      elevation="1"
                      v-if="interpreter.canGoBack() === true && schema.backBtn !== false"
                      @click="goBack"
                      >Zurück</v-btn
                    >
                    <v-btn
                      class="ma-3"
                      color="primary"
                      elevation="1"
                      type="submit"
                      >Weiter</v-btn
                    >
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
            <div v-if="schema.type === 'navigation'">
              <h2 class="pl-3 pt-3 my-3 title">{{ schema.schema.title }}</h2>

              <p class="pl-3 ">{{ schema.schema.description }}</p>
              <v-row fluid align="center" justify="center">
                <v-col align-self="center" class="mx-3 ">
                  <v-btn
                    color="primary"
                    outlined
                    raised
                    block
                    rounded
                    class=" my-4"
                    tile
                    large
                    v-for="item in schema.schema.oneOf"
                    :key="item.const"
                    @click="selectNavigationItem(item)"
                  >
                    {{ item.title }}
                  </v-btn>
                  <span
                    v-if="interpreter.canGoBack() && schema.backBtn !== false"
                  >
                    <v-btn
                      color="primary"
                      raised
                      block
                      rounded
                      class=" my-4"
                      tile
                      large
                      @click="goBack()"
                    >
                      Zurück
                    </v-btn>
                  </span>
                </v-col>
              </v-row>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";
import PDFGenerator from "../lib/pdfGenerator";
import JSInterpreter from "../lib/jsInterpreter";
var openpgp = require("openpgp");

export default {
  props: ["code", "contextUpdate", "debuggerMode", "formID"],
  name: "FormRenderer",
  data() {
    return {
      formData: {},
      valid: false,
      model: {},
      schema: {},
      fullSchema: [],
      options: {
        locale: "de",
        rootDisplay: "",
        objectContainerClass: "",
        sectionsClass: "pl-2 pt-2",
        sectionsTitlesClasses: ["title", "subtitle-1", "subtitle-2"],
        childrenClass: "pr-2",
        fieldProps: {},
        fieldColProps: { cols: 12 },
        textFieldProps: {},
        textareaProps: { filled: true },
        numberProps: {},
        sliderProps: {},
        checkboxProps: {},
        switchProps: {},
        comboboxProps: {},
        selectProps: {},
        fileInputProps: {},
        radioGroupProps: {},
        radioItemProps: {},
        tabsProps: { grow: true },
        expansionPanelsProps: { mandatory: true },
        dialogProps: { maxWidth: 500 },
        dialogCardProps: {},
        colorPickerProps: {},
        timePickerProps: {},
        datePickerProps: { scrollable: true },
        arrayItemCardProps: { tile: true },
        arrayItemColProps: { cols: 12 },
        removeAdditionalProperties: true,
        disableAll: false,
        hideReadOnly: false,
        deleteReadOnly: false,
        filesAsDataUrl: true,
        hideTooltips: false,
        disableSorting: false,
        context: {},
        rules: {},
        initialValidation: "defined",
        idPrefix: "",
        markdownit: {}
      },
      input_model: "",
      executorRunning: null,
      form: {
        input: {},
        submit: null,
        model: null
      },
      interpreter: null
    };
  },

  methods: {
    getNativeFunctions() {
      var that = this;
      return {
        // get the data context
        dataContext() {
          console.log(that);
          return JSON.stringify(that.formData);
        },
        // render something
        render(props, executor) {
          executor.stop();
          executor.schemaUpdate(props);
        }
      };
    },

    schemaUpdate(schema) {
      // load already entered fields
      if (schema.name in this.formData) {
        console.log("loading old data");
        let dataObj = {};
        dataObj[schema.name] = this.formData[schema.name];
        this.model = dataObj;
      } else {
        this.model = {};
      }
      this.schema = schema;
      this.fullSchema.push(schema);
      this.$emit("jsonSchemaUpdate", schema);
    },

    executeCode(code) {
      if (this.interpreter === null) {
        var that = this;
        // initialize the interpreter with it's callbacks
        this.interpreter = new JSInterpreter(
          code,
          this.getNativeFunctions(),
          function(schema) {
            // on schema update
            that.schemaUpdate(schema);
          },
          function() {
            // on done
            that.generateReceipt();
            that.schemaUpdate({
              type: "navigation",
              backBtn: false,
              schema: {
                title: "Done!",
                description: "Application finished successfully."
              }
            });
          }
        );
      }

      this.execute();
    },

    execute() {
      this.interpreter.execute();
      //this.executorRunning = true;
    },
    generateReceipt() {
      const pdf = new PDFGenerator(this.formData, this.fullSchema);
      // in debug mode we don't try to submit and sign the form data, just generate the report…
      if (this.$props.debuggerMode === true) {
        pdf.generate();
        pdf.download();
      } else {
        //check if keys exist - we can only encrypt st if keys have been provided
        if (this.publicKeysForForm.length > 0) {
          (async () => {
            // load all keys provided
            let pubkeys = [];
            for (let k in this.publicKeysForForm) {
              pubkeys.push(
                (
                  await openpgp.key.readArmored(
                    this.publicKeysForForm[k].publicKey
                  )
                ).keys[0]
              );
            }

            // encrypt message
            const { data: encryptedContent } = await openpgp.encrypt({
              message: await openpgp.message.fromText(
                JSON.stringify(this.formData)
              ), // input as Message object the form data
              publicKeys: pubkeys // for encryption
            });

            // submit the encrypted form to the backend and receive the signature as a prove that the form has been submitted
            this.$apollo
              .mutate({
                // Query
                mutation: require("../graphql/submitForm.gql"),
                // Parameters
                variables: {
                  formID: this.formID,
                  content: encryptedContent
                }
              })
              .then(data => {
                // add signature & encrypted data to the pdf header
                pdf.addSignature(
                  data.data.submitForm.content,
                  data.data.submitForm.signature
                );
                // generate and return pdf
                pdf.generate();
                pdf.download();
              })
              .catch(error => {
                console.error(error);
              });
          })();
        }
      }
    },

    submitForm(frm) {
      frm.preventDefault();

      //as soon as the user submits a form we update the form context and continue the code
      if (
        this.$refs.schemaForm.validate() ||
        this.$props.debuggerMode === true
      ) {
        Object.assign(this.formData, this.model);
        this.$emit("contextUpdate", this.formData);
        this.model = {};
        this.execute();
      }
    },

    goBack() {
      //as soon as the user submits a form we update the form context and continue the code
      Object.assign(this.formData, this.model);
      this.$emit("contextUpdate", this.formData);
      this.model = {};
      this.interpreter.back();
    },
    selectNavigationItem(item) {
      var result = {};
      result[this.schema.schema.name] = item.const;
      Object.assign(this.formData, result);
      this.$emit("contextUpdate", this.formData);
      this.execute();
    }
  },

  watch: {
    code: function(code) {
      this.interpreter = null;
      this.executeCode(code);
    }
  },
  apollo: {
    publicKeysForForm: {
      query: require("../graphql/publicKeysForForm.gql"),
      variables() {
        return {
          formID: this.$props.formID
        };
      },
      skip() {
        return this.$props.formID === null;
      }
    }
  }
};
</script>

<style scoped>
.background {
  min-height: 100%;
}
</style>
