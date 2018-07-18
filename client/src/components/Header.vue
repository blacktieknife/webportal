<template>
    <nav class="navbar is-transparent is-primary">
        <div class="navbar-brand">
            <router-link
              to="/"
              class="navbar-item" 
            >
              Non-Profit Web Portal
            </router-link>
            <div id="burger-id" class="navbar-burger burger" data-target="navbarExampleTransparentExample" @click="handleBurgerOpen">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        <div id="navbarExampleTransparentExample" class="navbar-menu">
            <div class="navbar-start">
            <a class="navbar-item" href="https://bulma.io/">
                Home
            </a>
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link" href="/documentation/overview/start/">
                Docs
                </a>
                <div class="navbar-dropdown is-boxed">
                <a class="navbar-item" href="/documentation/overview/start/">
                    Overview
                </a>
                <a class="navbar-item" href="https://bulma.io/documentation/modifiers/syntax/">
                    Modifiers
                </a>
                <a class="navbar-item" href="https://bulma.io/documentation/columns/basics/">
                    Columns
                </a>
                <a class="navbar-item" href="https://bulma.io/documentation/layout/container/">
                    Layout
                </a>
                <a class="navbar-item" href="https://bulma.io/documentation/form/general/">
                    Form
                </a>
                <hr class="navbar-divider">
                <a class="navbar-item" href="https://bulma.io/documentation/elements/box/">
                    Elements
                </a>
                <a class="navbar-item is-active" href="https://bulma.io/documentation/components/breadcrumb/">
                    Components
                </a>
                </div>
                
            </div>
            </div>
            <div v-if="!currentUser.isLoggedIn" class="navbar-end">
                <div class="navbar-item">
                    <router-link
                            to="signup"
                            class="navbar-item has-text-light"
                            tag="a"
                        >
                        Signup
                    </router-link>
                    <router-link
                        to='login'
                        class="navbar-item has-text-light"
                        tag="a"
                        >
                        Login
                    </router-link>
                </div>
            </div>
            <div v-else class="navbar-end">
                 <div class="navbar-item" v-if="currentUser.isLoggedIn">
                    <div>Welcome {{currentUser.userEmail}}</div>
                </div>
                <div class="navbar-item">
                    <a
                    class="navbar-item has-text-light"
                    @click="handleLogout"
                    >
                    Logout
                    </a>
                </div>   
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    data(){
        return {

        };
    },
    methods:{
        handleBurgerOpen(e) {
            //open or close menu
        document.querySelector('.navbar-menu').classList.toggle('is-active');
        document.querySelector('#burger-id').classList.toggle('is-active');
        },
        handleLogout() {
            console.log("Emitted logout");
           this.$emit('logout');
        }
    },
    props:['currentUser']

}
</script>

<style>

</style>
