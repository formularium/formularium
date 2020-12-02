
<template>
    <div class="grey lighten-5 background">

<v-container fill-height fluid>
  <v-row align="center"
      justify="center">
      <v-col
        :cols="10"
                align-self="center"

      >
                <v-sheet
  color="white"
	elevation="1"
>
      <v-form v-model="valid">

        <v-jsf v-model="model" :schema="schema"/>
          <v-row
    align="center"
    justify="center"

  >
        <v-btn
  color="primary"
	depressed
	outlined
              class="ma-3"

  elevation="1"
            @click="submitForm"
        >Zurück</v-btn>
        <v-btn
            class="ma-3"
            color="primary"
            elevation="1"
            @click="submitForm"
        >Weiter</v-btn>
          </v-row>
      </v-form>
        </v-sheet>

        </v-col>
          </v-row>
</v-container>

    </div>
</template>

<script>

    import Interpreter from 'js-interpreter';
import '@koumoul/vjsf/lib/VJsf.css'
import '@koumoul/vjsf/lib/deps/third-party.js'

    export default {
        props: ["code", "contextUpdate"],
        name: "FormRenderer",
        data(){
            return {
                formData: {
                },
                 valid: false,
                model: {},
                schema:{},
                options: {},
                input_model: "",
                executorRunning: null,
                form: {
                    input: {},
                    submit: null,
                    model: null,
                },
                interpreter: null,
            }},
        methods: {

            initApi(interpreter, globalObject) {
                this.interpreter = interpreter;
                console.log(this.interpreter);
                // Add an API function for the alert() block.
                var wrapper = function (text) {
                    return alert(arguments.length ? text : '');
                };
                interpreter.setProperty(globalObject, 'alert',
                    interpreter.createNativeFunction(wrapper));

                // Add an API function for the context
                var that = this;
                wrapper = function () {
                    console.log(that);
                    return JSON.stringify(that.formData);
                };
                interpreter.setProperty(globalObject, 'dataContext',
                    interpreter.createNativeFunction(wrapper));

                var renderFormSection_wrapper = function (props) {
                    that.executorRunning = false;
                    console.log("oh hey");
                    console.log(props);
                    that.schema = JSON.parse(props);
                    that.$emit('jsonSchemaUpdate', that.schema);

                    };

                interpreter.setProperty(globalObject, 'renderFormSection',
                    interpreter.createNativeFunction(renderFormSection_wrapper));
            },

            executeCode(code) {
                if(this.interpreter === null) {
                    var myInterpreter = new Interpreter(code, this.initApi);
                    this.interpreter = myInterpreter;
                    this.executorRunning = true;
                }

                this.execute();
            },


            execute(){
                this.executorRunning = true;
                var last_setp = true;
                while(this.executorRunning === true && last_setp  === true) {
                    last_setp = this.interpreter.step();
                  console.log("step executed");
                }

                if(this.executorRunning === false) {
                    console.log("executor halted by native function");
                }
                else if (last_setp === false ) {
                     console.log("executor done");
                     this.interpreter = null;
                     this.executorRunning = false;
                }
            },

            submitForm() {
                Object.assign(this.formData, this.model);
                this.$emit('contextUpdate',this.formData);
                this.model = {};
                this.execute();
            }
        },

        watch: {
            code: function (code) {
                this.executeCode(code);
                console.log(code);
            }

        },
    };
</script>

<style scoped>

    .background {
      height: 100%;
    }



</style>