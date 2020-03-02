<template>
  <section class="section">
    Login
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

  @Component({ name: 'Login' })
class Login extends Vue {
    created (): void {
      this.$auth.loginWith('laravel.passport')
    }
  }

export default Login
</script>
