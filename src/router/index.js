import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Form from "../views/Form";
import Login from "../views/admin/Login";
import AdminDashboard from "../views/admin/AdminDashboard";
import Editor from "../views/Editor";
import * as AUTH from "../auth";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/form/:id",
    name: "Form",
    component: Form
  },
  {
    path: "/editor/:id",
    name: "Editor",
    component: Editor
  },
  {
    path: "/admin",
    name: "AdminDashboard",
    component: AdminDashboard,
    beforeEnter(to, from, next) {
      if (AUTH.isLoggedIn() === true) {
        next();
      } else {
        next({
          name: "Home" // back to safety route //
        });
      }
    }
  },
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: Login
  },
  {
    path: "/login/done",
    beforeEnter: async function(to, from, next) {
      await AUTH.loginCallback(window.location)
        .then(function() {
          next("Admin");
        })
        .catch(function() {
          next("Home");
        });
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
