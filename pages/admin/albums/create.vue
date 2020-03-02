<template>
  <section class="section">
    <albums-form :is-creating="true" />
  </section>
</template>

<script>
import AlbumsForm from '../../../components/AlbumsForm'

export default {
  name: 'AlbumCreate',
  components: {
    AlbumsForm
  }
}
</script>
