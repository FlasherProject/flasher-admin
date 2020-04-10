<template>
  <div>
    <section class="section columns">
      <div class="column is-3">
        <sidebar />
      </div>

      <div class="column has-margin-bottom-tablet">
        <div class="container">
          <nuxt />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar'

export default {
  components: {
    Sidebar
  }
}
</script>

<style lang="scss">
  .has-margin-bottom-tablet {
    @media screen and (max-width: 769px) {
      margin-bottom: 64px;
    }
  }
</style>
