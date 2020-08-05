<template>
  <div class="text-center min-width">
    <form class="form-signin" @submit.prevent>
      <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
      <label for="iemail" class="sr-only">Email address</label>
      <input type="email" v-model.trim="loginForm.email" id="iemail" class="form-control" placeholder="Email address" required autofocus>
      <label for="ipassword" class="sr-only">Password</label>
      <input type="password" v-model.trim="loginForm.password" id="ipassword" class="form-control" placeholder="Password" required>
      <button @click="login()" class="btn btn-lg btn-info btn-block">Sign in</button>
      <p class="mt-5 mb-3 text-muted">Applications manager</p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      }
    }
  },

  methods: {
    login() {
      this.$store.dispatch('login', {
        email: this.loginForm.email,
        password: this.loginForm.password
      })
    }
  },

  beforeCreate: function() {
      document.body.className = 'login';
  }
}
</script>

<style>
  @import '../assets/styles/login.css';
</style>
