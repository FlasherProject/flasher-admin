<template>
  <section class="section">
    <button v-if="!$auth.loggedIn" @click="login">
      Login
    </button>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({ name: 'Login' })
class Login extends Vue {
  auth = 'guest'

  login (): void {
    this.$auth.loginWith('oauth', { config: { headers: { common: { Accept: 'application/json' } } } })
  }
}

export default Login
</script>
