<template>
  <div>
    <section class="section">
      <sidebar />

      <div class="container" style="padding-left: 40px;">
        <nuxt />
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
