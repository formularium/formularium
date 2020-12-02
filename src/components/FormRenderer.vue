<template>
    <div>
        <div v-if="form.input.type" id="sandbox">

            <span v-if="form.input.type !== 'render-text'">
                <h2>Input</h2>
            {{form.input.name}}:
            <input :type="form.input.type" ref="theInput" :name="form.input.name">
            </span>
            <span v-if="form.input.type === 'render-text'">
                <h2>Output</h2>
             {{ form.input.content }}
            </span>
            <br>
            <button
    class="button"
    @click="submitForm">Next</button>
        </div>
    </div>
</template>

<script>
    import Interpreter from 'js-interpreter';

    export default {
        props: ["code", "contextUpdate"],
        name: "FormRenderer",
        data(){
            return {
                formData: {
                },
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

                var renderField_wrapper = function (props) {
                    that.executorRunning = false;
                    console.log(props);
                    that.form.input = JSON.parse(props);
                    };

                interpreter.setProperty(globalObject, 'renderField',
                    interpreter.createNativeFunction(renderField_wrapper));
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
                if(this.form.input.type !== 'render-text')
                {
                    this.formData[this.form.input.name] = this.$refs.theInput.value;
                    this.$emit('contextUpdate',this.formData);
                }
                this.form.input = {};
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

    #sandbox {
        width: 200px;
        height: 200px;
        margin: 5px;
        border: 2px solid #000;
        padding: 10px;
    }

</style>