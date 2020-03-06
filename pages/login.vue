<template>
  <section class="section" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({ name: 'Login' })
class Login extends Vue {
  auth = 'guest'

  created (): void {
    this.$auth.loginWith('laravel.passport')
  }
}

export default Login
</script>
