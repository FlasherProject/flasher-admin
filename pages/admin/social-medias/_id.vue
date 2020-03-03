<template>
  <section class="section">
    <social-medias-form is-creating="false" />
  </section>
</template>

<script>
import SocialMediasForm from '../../../components/SocialMediasForm'

export default {
  name: 'SocialMediaCreate',
  components: {
    SocialMediasForm
  }
}
</script>
