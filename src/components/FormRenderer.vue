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
            <v-form v-model="valid" v-if="schema.type === 'form'">
              <v-row>
                <v-col>
                  <v-jsf
                    v-model="model"
                    :schema="schema.schema"
                    :options="options"
                  />
                  <v-row align="center" justify="center">
                    <!--
                <v-btn
                  color="primary"
                  depressed
                  outlined
                  class="ma-3"
                  elevation="1"
                  @click="submitForm"
                  >Zurück</v-btn
                >-->
                    <v-btn
                      class="ma-3"
                      color="primary"
                      elevation="1"
                      @click="submitForm"
                      :disabled="valid === false && debuggerMode === false"
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
import Interpreter from "js-interpreter";
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";
import PDFGenerator from "../lib/pdfGenerator";
var openpgp = require('openpgp');

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
    initApi(interpreter, globalObject) {
      this.interpreter = interpreter;
      console.log(this.interpreter);
      // add an api to access the context during runtime
      var that = this;
      var wrapper = function() {
        console.log(that);
        return JSON.stringify(that.formData);
      };
      interpreter.setProperty(
        globalObject,
        "dataContext",
        interpreter.createNativeFunction(wrapper)
      );

      /*
       * render json schema forms
       * TODO: check if this could be done with asynchronous api calls, so maybe we don't have to execute the interpreter
       * step by step
       * */
      var renderFormSection_wrapper = function(props) {
        that.executorRunning = false;
        that.updateSchema(JSON.parse(props));
        that.$emit("jsonSchemaUpdate", that.schema);
      };

      interpreter.setProperty(
        globalObject,
        "render",
        interpreter.createNativeFunction(renderFormSection_wrapper)
      );
    },

    executeCode(code) {
      if (this.interpreter === null) {
        var myInterpreter = new Interpreter(code, this.initApi);
        this.interpreter = myInterpreter;
        this.executorRunning = true;
      }

      this.execute();
    },

    execute() {
      this.executorRunning = true;
      var last_setp = true;
      /*
       * We execute the code step by step, so that we can stop the execution inside the sandbox as soon as user innput is required
       * */
      while (this.executorRunning === true && last_setp === true) {
        try {
          last_setp = this.interpreter.step();
        } catch (error) {
          //TODO: find a nicer way for that
          this.$emit("jsonSchemaUpdate", {
            exception: JSON.parse(
                    JSON.stringify(error, Object.getOwnPropertyNames(error))
            )
          });
          console.error(error);
        }
        console.log("step executed");
      }

      if (this.executorRunning === false) {
        console.log("executor halted by native function");
        // TODO: here we have to take the interpreter step from one step before and cache it. So that we can go back in for,s
      } else if (last_setp === false) {
        console.log("executor done");
        // TODO: callback to the parent function
        this.interpreter = null;
        this.executorRunning = false;
        this.schema = {
          type: "navigation",
          schema: {
            title: "Done!",
            description: "Application finished successfully."
          }
        };
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
                pubkeys.push((await openpgp.key.readArmored(this.publicKeysForForm[k].publicKey)).keys[0])
              }

              // encrypt message
              const  { data: encryptedContent } = await openpgp.encrypt({
                message: await openpgp.message.fromText(JSON.stringify(this.formData)),   // input as Message object the form data
                publicKeys: pubkeys, // for encryption
              });

              // submit the encrypted form to the backend and receive the signature as a prove that the form has been submitted
                this.$apollo.mutate({
                  // Query
                  mutation: require("../graphql/submitForm.gql"),
                  // Parameters
                  variables: {
                      formID: this.formID,
                      content: encryptedContent
                  },}).then((data) => {
                      console.log(data);
                      // add signature & encrypted data to the pdf header
                      pdf.addSignature(data.data.submitForm.content, data.data.submitForm.signature);
                      // generate and return pdf
                      pdf.generate();
                      pdf.download();
                }).catch((error) => {

                  console.error(error);

                });

            })();
          }
        }
      }
    },




    submitForm() {
      //as soon as the user submits a form we update the form context and continue the code
      Object.assign(this.formData, this.model);
      this.$emit("contextUpdate", this.formData);
      this.model = {};
      this.execute();
    },
    selectNavigationItem(item) {
      var result = {};
      result[this.schema.schema.name] = item.const;
      Object.assign(this.formData, result);
      this.$emit("contextUpdate", this.formData);
      this.execute();
    },

    updateSchema(schema) {
      this.schema = schema;
      this.fullSchema.push(schema);
      this.$emit("jsonSchemaUpdate", schema);
    }
  },

  watch: {
    code: function(code) {
      this.executeCode(code);
      console.log(code);
    }
  },
  apollo: {
  publicKeysForForm: {
    query: require("../graphql/publicKeysForForm.gql"),
    variables () {
      return {
        formID: this.$props.formID,
      }
    },
    skip () {
      return this.$props.formID === null
    },
  },
},
};
</script>

<style scoped>
.background {
  min-height: 100%;
}
</style>
