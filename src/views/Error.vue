<template>
<div class="max-width">
  <nav class="navbar navbar-expand-md navbar-dark bg-custom navbar-static-top">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">LOGO</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>

  <main role="main" class="container container-fluid mt-5 mb-5">
    <div class="row justify-content-md-center">
      <div class="col-md-11 col-12 col-sm-12">
        <div class="row">
          <div class="col-md-12 col-12 col-sm-12 text-center">
            <h1>Ooops, error occured. Please go to dashboard.</h1>
          </div>
        </div>
      </div>
    </div>
  </main>

</div>
</template>

<script>

export default {
  data() {
    return {
      
    }
  },
}

</script>

<style>
  @import '../assets/styles/dashboard.css';
</style>
