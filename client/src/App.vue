<template>
  <div id="app">
    <Header :currentUser="user" @logout="handleLogout"/>
    <router-view @loggedIn="handleLogin"/>
  </div>
</template>
<script>
import pageHeader from './components/Header.vue';

export default {
  data() {
    return {
      user: {
        token: localStorage.getItem('non-token') || '',
        userEmail: '',
        isLoggedIn: false,  
      },
    };
  },
  components: {
    Header: pageHeader,
  },
  methods: {
    handleLogin(user) {
      console.log("MADE IT TO THE MAIN APP");
      this.user.userEmail = user.email;
      this.user.isLoggedIn = true;
    },
    handleLogout() {
      this.$router.push('/');
      window.localStorage.removeItem('non-token');
      this.user.isLoggedIn = false;
      this.$toast.open({
            duration: 3000,
            message: 'You\'ve been logged out',
            position: 'is-top',
            type: 'is-warning',
          })

    },
  },
  beforeMount() {
      if(this.user.token) {
        const tokenObj = {token:this.user.token}
       fetch('http://localhost:8000/auth/verifyToken', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.user.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tokenObj),
        }).then((fetchResp) => {
          return fetchResp.json();
        }).then((respJson)=>{
         if(respJson.user) {
           this.user.isLoggedIn = true;
           this.user.userEmail = respJson.user.email;
           this.$router.push('dashboard');
         } else {
           window.localStorage.removeItem('non-token');
           this.user.isLoggedIn = false;
           this.user.userEmail = '';
         }
        }).catch(err=>{
           this.user.isLoggedIn = false;
           this.user.userEmail = '';
           console.error(err);
        }); 
      }
    },
};
</script>


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
