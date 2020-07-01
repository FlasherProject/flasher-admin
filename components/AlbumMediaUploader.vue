<template>
  <div :id="uppyId">
    <div class="DashboardContainer" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import '../node_modules/@uppy/core/dist/style.css'
import Tus from '@uppy/tus'

// https://gist.github.com/pooot/a2f86e6847a8be51fb2e3672a00a905f
@Component({
  components: {}
})
class AlbumMediaUploader extends Vue {
  @Prop({ required: true })
  private modelClass!: string

  @Prop({ required: true })
  private modelId!: string

  @Prop({ required: true })
  private collection!: string

  @Prop({ required: true })
  private endpoint!: string

  mounted () {
    const uppy = Uppy({
      id: this.uppyId,
      autoProceed: false,
      debug: true,
      allowMultipleUploads: true,
      restrictions: {
        // maxFileSize: false,
        allowedFileTypes: ['image/*']
      },
      meta: {
        modelClass: this.modelClass,
        modelId: this.modelId,
        collection: this.collection
      }
      // onBeforeFileAdded: (currentFile, files) => Promise.resolve(),
      // onBeforeUpload: (files, done) => Promise.resolve()
    })

    uppy.use(Tus, {
      endpoint: 'http://localhost/tus',
      resume: true,
      autoRetry: true,
      retryDelays: [0, 1000, 3000, 5000],
      headers: {
        authorization: this.$auth.strategy.token.get()
      }
    })

    uppy.use(Dashboard, {
      inline: true,
      target: '.DashboardContainer',
      replaceTargetContent: true,
      note: 'Images only.',
      maxHeight: 500,
      restrictions: {
        maxFileSize: null,
        allowedFileTypes: null
      },
      metaFields: [
        { id: 'owner', name: 'Owner', placeholder: 'name of the photographer/owner' },
        { id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' },
        { id: 'order', name: 'Order', placeholder: 'order' }
      ]
    })
  }

  get uppyId (): string {
    return this.modelClass + '-' + this.modelId + '-' + this.collection
  }
}

export default AlbumMediaUploader
</script>

<style lang="sass">
  @import '../node_modules/@uppy/core/dist/style.css'
  @import '../node_modules/@uppy/dashboard/dist/style.css'
</style>
