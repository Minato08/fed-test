<template>
  <v-main>
    <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px">
      <v-toolbar color="blue-grey darken-2" dark>
        <h1 class="display-1 mb-2">Welcome!</h1>
      </v-toolbar>
      <v-card tile class="px-4">
        <v-card-text>
          <v-form v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="loginEmail" :rules="loginEmailRules" label="E-mail" required />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="loginPassword"
                  :append-icon="show1?'eye':'eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Password"
                  hint="At least 8 characters"
                  counter
                  @click:append="show1 = !show1"
                />
              </v-col>
              <v-col class="d-flex" cols="12" sm="6" xsm="12" />
              <v-spacer />
              <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                <v-btn
                  x-large
                  block
                  :disabled="!valid"
                  color="success"
                  @click="validate"
                >
                  Login
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data: () => ({
    dialog: true,
    tab: 0,
    tabs: [
      { name: 'Login', icon: 'mdi-account' }
    ],
    valid: true,
    email: 'dev@xpv',
    password: 'password',
    loginPassword: 'password',
    loginEmail: 'dev@xpv',
    loginEmailRules: [
      v => !!v || 'Required',
      v => /.+@..+/.test(v) || 'E-mail must be valid'
    ],
    show1: false,
    rules: {
      required: value => !!value || 'Required.',
      min: v => (v && v.length >= 8) || 'Min 8 characters'
    }
  }),
  methods: {
    ...mapMutations(['loginSuccess']),
    async validate () {
      this.$nuxt.$emit('show-loading')
      try {
        const response = await this.$auth.loginWith('local', {
          data: {
            email: this.loginEmail,
            password: this.loginPassword
          }
        })
        this.loginSuccess(response.data)
        this.$router.push({ path: '/' })
        this.$nuxt.$emit('hide-loading')
      } catch (err) {
        alert('login error:', err)
        this.$nuxt.$emit('hide-loading')
      }
    }
  }
}
</script>

<style scoped>
.loginOverlay {
  background:rgba(33,150,243,0.3);
}

.photoCredit{
  position: absolute;
  bottom: 15px;
  right: 15px;
}
</style>
