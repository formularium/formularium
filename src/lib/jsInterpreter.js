import Interpreter from "js-interpreter";

class JSInterpreter {
  interpreter = null;
  nativeFunctions = null;
  schemaUpdateFn = null;
  doneFn = null;

  running = false;
  backStack = [];

  constructor(code, native_functions, schemaUpdateFn, doneFn) {
    this.nativeFunctions = native_functions;
    this.schemaUpdateFn = schemaUpdateFn;
    this.doneFn = doneFn;
    this.interpreter = new Interpreter(code, this.setupNativeFunctions());
  }

  stop() {
    this.running = false;
    console.log("stop");
  }

  execute() {
    this.running = true;
    var last_step = true;
    //run until the executor gets stopped or an error occurs
    while (this.running === true && last_step === true) {
      try {
        last_step = this.interpreter.step();
      } catch (error) {
        console.error(error);
        this.schemaUpdate({
          exception: JSON.parse(
            JSON.stringify(error, Object.getOwnPropertyNames(error))
          )
        });
      }
      console.log("step executed");
    }

    // check why we stopped
    if (this.running === false) {
      console.log("executor halted by native function");
    } else if (last_step === false) {
      // here we should call a callback
      console.log("executor done");
      this.doneFn();
    }
  }

  back() {}

  canGoBack() {
    return false;
  }

  schemaUpdate(schema) {
    this.schemaUpdateFn(schema);
  }

  setupNativeFunctions() {
    var executor = this;
    // add all defined native functions
    return function(interpreter, globalObject) {
      for (let fn in executor.nativeFunctions) {
        interpreter.setProperty(
          globalObject,
          fn,
          interpreter.createNativeFunction(function(props) {
            return executor.nativeFunctions[fn](props, executor);
          })
        );
      }
      return interpreter;
    };
  }
}

export default JSInterpreter;
