import Interpreter from "js-interpreter";

class JSInterpreter {
  interpreter = null;
  nativeFunctions = null;
  schemaUpdateFn = null;
  doneFn = null;
  code = null;
  backStackFns = ["render"];

  running = false;
  backStack = null;
  goTo = null;

  constructor(code, native_functions, schemaUpdateFn, doneFn) {
    this.nativeFunctions = native_functions;
    this.schemaUpdateFn = schemaUpdateFn;
    this.doneFn = doneFn;
    this.code = code;
    this.setupInterpreter();
  }

  setupInterpreter() {
    this.interpreter = new Interpreter(this.code, this.setupNativeFunctions());
    this.backStack = [];
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

  back() {
    if(this.canGoBack()){
      console.log("goin back to")
      this.backStack.pop();
      this.goTo = this.backStack.pop();
      console.log(this.goTo);
      // reset the interpreter to start
      this.setupInterpreter();
      this.execute();
    }

  }

  canGoBack() {
    return this.backStack.length > 0;
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

            // check if this is a function that adds st to the backstack
            console.log(fn);
            if(executor.backStackFns.includes(fn))
            {
              props = JSON.parse(props);
              executor.backStack.push(props["name"]);
              console.log(executor.backStack);
              // check if we want to go back to a specific page
              if(executor.goTo != null)
              {
                if(props["name"] !== executor.goTo) {
                  return;
                } else {
                  executor.goTo = null;
                }

              }

            }
            return executor.nativeFunctions[fn](props, executor);
          })
        );
      }
      return interpreter;
    };
  }
}

export default JSInterpreter;
