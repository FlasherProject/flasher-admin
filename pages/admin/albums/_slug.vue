<template>
  <section class="section">
    <albums-form :is-creating="false" />
  </section>
</template>

<script>
import AlbumsForm from '../../../components/AlbumsForm'

export default {
  name: 'AlbumEdit',
  components: {
    AlbumsForm
  }
}
</script>
