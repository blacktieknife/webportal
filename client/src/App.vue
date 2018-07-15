<template>
  <div id="app">
    <nav class="navbar is-primary">
        <div class="navbar-brand">
          <router-link
            :to="{name:'home'}"
            class="navbar-item"
          >
            Non-Profit Web Portal
          </router-link>
        </div>
    </nav>
    <router-view/>
  </div>
</template>

<style>
html {
 background-color:#333;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
