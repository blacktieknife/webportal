<template>
    <div class="container" style="margin-top:10px">
        <section class="hero is-small is-dark is-bold">
            <div class="hero-body">
                <div class="container">
                    <p class="title">
                        Login
                    </p>
                    <p class="subtitle">
                        Enter your email and your password
                    </p>
                </div>
            </div>
        </section>
        <section class="section is-light form-section"
        style="display:flex;flex-direction:column; align-items: center; ">
            <form @submit="handleFormSubmit" style="max-width:500px;width:100%">
                <b-field label="Email">
                    <b-input
                        id="email"
                        type="email"
                        message="Please enter valid email address"
                        class="is-medium"
                        v-model="email"
                        placeholder="Youremail@email.com"
                        @focus="handleFocus"
                    >
                    </b-input>
                </b-field>
                <b-field label="Password">
                    <b-input
                        id="password"
                        type="password"
                        class="is-medium"
                        v-model="pass"
                        placeholder="Password"
                        minlength="5"
                        @focus="formErrors = []"
                    >
                    </b-input>
                </b-field>
                <button class="button is-primary"
                    style="margin-top:15px;" id="loginBtn"
                    :disabled="validForm"
                >
                    Login
                </button>
            </form>
            <div style="min-height:50px;">
                 <div v-show="formErrors.length > 0">
                <h4 class="formErrors" v-for="error in formErrors" :key="error">{{error}}</h4>
            </div>
            </div>
        </section>
    </div>
</template>
<script>
export default {
  data() {
    return {
      email: '',
      pass: '',
      formErrors: [],
    };
  },
  computed: {
    validForm() {
      if (this.email && this.pass) {
        if (this.pass.length > 4) {
          document.querySelectorAll('input.is-danger').forEach((input) => {
            if (input.type === 'email') {
              this.addFormError('Make sure your email is valid');
            }
          });
          if (!this.formErrors.length > 0) {
            return false;
          }
        }
      }
      return true;
    },
  },
  methods: {
    async handleFormSubmit(e) {
      e.preventDefault();
      e.target.disabled = true;
      e.target.classList.add('is-loading');
      const newUser = {
        email: this.email,
        password: this.pass,
      };
      try {
        const rawResponse = await fetch('http://localhost:8000/auth/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });
        if (rawResponse.ok) {
          const user = await rawResponse.json();
          localStorage.setItem('non-token', user.token);
          this.$emit('loggedIn', user);
          this.$router.push('dashboard');
          this.$toast.open({
            duration: 3500,
            message: 'Successfully Logged In',
            position: 'is-top',
            type: 'is-success',
          });
          this.clearForm();
        } else {
          const error = await rawResponse.json();
          throw new Error(error.message);
        }
      } catch (err) {
        if (err.message.includes('NetworkError')) {
          this.clearForm();
          err.message = 'Connection to server failed';
        }
        if (err.message.includes('Already Exists')) {
          document.getElementById('signupBtn').classList.remove('is-loading');
          this.pass = '';
          this.passConfirm = '';
          document.getElementById('email').classList.add('is-danger');
        }
        this.$toast.open({
          duration: 10000,
          message: err.message,
          position: 'is-bottom',
          type: 'is-danger',
        });
      }
    },
    clearForm() {
      this.email = '';
      this.pass = '';
      this.passConfirm = '';
      this.formErrors = [];
      if (document.getElementById('signupBtn')) {
        document.getElementById('signupBtn').classList.remove('is-loading');
      }
    },
    handleFocus(e) {
      e.target.classList.remove('is-danger');
      this.formErrors = [];
    },
    addFormError(errorMessage) {
      this.formErrors = [];
      this.formErrors.push(errorMessage);
    },

  },
};
</script>

<style>
    .form-section {
    background-image: linear-gradient(141deg, #adc6fd 0%, #84a8eb 71%, #576cb3 100%) !important;
    }
    .help {
        font-size:.8rem !important;
        font-weight: bolder !important;
    }
    .label {
        text-align: left !important;
    }
    .formErrors {
        font-size:1rem;
        font-weight:bolder;
        color:#e8eb34;
        text-shadow: #576cb3 1px 1px 0px;
        padding:10px;
    }
</style>
