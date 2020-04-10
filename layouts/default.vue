<template>
  <div>
    <section class="section columns">
      <div class="column is-3">
        <sidebar />
      </div>

      <div class="column">
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
