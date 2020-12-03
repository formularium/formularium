<template>
  <div class="grey lighten-5 background">
    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-col :cols="10" align-self="center">
          <v-sheet color="white" elevation="1">

            <v-form v-model="valid" v-if="schema.type === 'form'">
              <v-jsf v-model="model" :schema="schema.schema" />
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
                  >Weiter</v-btn
                >
              </v-row>
            </v-form>
            <div v-if="schema.type === 'navigation'">
                                             <h3 class="mx-2 py-2 center">{{schema.schema.title}}</h3>

              <p class="mx-2">{{schema.schema.description}}</p>
                           <v-row
                align="center"
                justify="center"
              >
              <v-col :cols="10" align-self="center"
                align="center"
                justify="center">


                  <v-btn
                  color="primary"
                  outlined
                  raised
                  block
                  rounded
                  align="center"
                justify="center"
                  class="my-4"
                  tile
                  x-large
                  v-for="item in schema.schema.oneOf"
                  :key="item.const"
                  @click="selectNavigationItem(item)"

                >
                    {{item.title}}
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

export default {
  props: ["code", "contextUpdate"],
  name: "FormRenderer",
  data() {
    return {
      formData: {},
      valid: false,
      model: {},
      schema: {},
      options: {},
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
        that.schema = {"type": "form", "schema": JSON.parse(props)};
        that.$emit("jsonSchemaUpdate", that.schema);
      };

      interpreter.setProperty(
        globalObject,
        "renderFormSection",
        interpreter.createNativeFunction(renderFormSection_wrapper)
      );

      var renderNavigation_wrapper = function(props) {
        that.executorRunning = false;
        that.schema = {"type": "navigation", "schema": JSON.parse(props)};
        that.$emit("jsonSchemaUpdate", that.schema);
      };

      interpreter.setProperty(
        globalObject,
        "renderNavigation",
        interpreter.createNativeFunction(renderNavigation_wrapper)
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
              this.$emit("jsonSchemaUpdate", {"exception": JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)))});
              console.error(error)
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
        this.schema = {"type": "navigation", "schema": {"title": "Done!", "description": "Application finished successfully."}};
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
    }
  },

  watch: {
    code: function(code) {
      this.executeCode(code);
      console.log(code);
    }
  }
};
</script>

<style scoped>
.background {
  min-height: 100%;
}
</style>
