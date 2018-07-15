<template>
  <div class="home container">
    <section class="hero is-medium is-dark" style="margin-top:10px;">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
           Authentication / Signup example
          </h1>
          <h2 class="subtitle">
            Simple example of signup authentication
          </h2>
          <div style="padding:25px;">
            <h4>Click here to signup</h4>
            <router-link
              class="button is-primary"
              :to="{name: 'signup'}"
              role="button"
            >
            Sign Up
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'home',
  components: {
  },
};
</script>

<style scoped>
section{
  background-image: linear-gradient(141deg, #1f191a 0%, #363636 71%, #46403f 100%) !important;
}
</style>
