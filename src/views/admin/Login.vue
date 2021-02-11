<template>
  <div class="home">
    <a :href="loginURI">Login</a>
  </div>
</template>

<script>
// @ is an alias to /src
import * as AUTH from "../../auth.js";
export default {
  name: "Login",
  data: function() {
    return {
      loginURI: AUTH.loginURI()
    };
  },
  components: {}
};
</script>
