<template>
  <div>
    <section class="section">
      <div class="card">
        <div class="card-header">
          <div class="card-header-title">
            <h2>Cache</h2>
          </div>
        </div>
        <div class="card-content">
          <b-button
            type="is-danger"
            @click="clearCache"
          >
            Clear cache
          </b-button>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="card">
        <div class="card-header">
          <div class="card-header-title">
            <h2>Settings</h2>
          </div>
        </div>
        <div class="card-content">
          <div
            v-for="(setting, index) in settings"
            :key="index"
          >
            <b-field :label="setting.title">
              <b-numberinput
                v-if="setting.type === 'numeric'"
                v-model="setting.value"
              />
              <b-checkbox
                v-else-if="setting.type === 'bool'"
                v-model="setting.value"
                true-value="1"
                false-value="0"
              >
                {{ setting.description }}
              </b-checkbox>
              <quill-editor
                v-else-if="setting.type === 'textarea'"
                ref="myQuillEditor"
                v-model="setting.value"
                :options="editorOption"
              />
              <section v-else-if="setting.type === 'media'">
                <vue-dropzone
                  v-if="setting.value === null"
                  id="dropzone"
                  ref="myVueDropzone"
                  :options="getDropzoneOptions(setting)"
                  class="has-margin-bottom-md"
                  @vdropzone-sending="sendingEvent"
                  @vdropzone-complete="fetchSettings"
                />

                <img
                  v-if="setting.value"
                  :src="setting.value.url"
                  :alt="setting.value.name"
                >

                <div
                  v-if="setting.value"
                  class="tags"
                >
                  <span class="tag is-primary">
                    {{ setting.value.name }}
                    <button
                      class="delete is-small"
                      type="button"
                      @click="setting.value = null"
                    />
                  </span>
                </div>
              </section>
              <b-input
                v-else-if="setting.type === 'email'"
                v-model="setting.value"
                type="email"
                maxlength="30"
              />
              <b-input
                v-else
                v-model="setting.value"
                expanded
              />
            </b-field>
            <div class="control">
              <button
                v-if="setting.type !== 'media'"
                class="button is-primary"
                @click="sendSetting(setting)"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import { DropzoneOptions } from 'dropzone'
import { Component, Vue } from 'vue-property-decorator'
import { showError, showSuccess } from '~/helpers/toast'
import Setting from '~/models/setting'

  @Component({
    name: 'Settings',
    components: {
      quillEditor,
      vueDropzone: vue2Dropzone
    }
  })
export default class Settings extends Vue {
    private loading = false;
    private settings: Setting[] = [];
    editorOption: object = {
      placeholder: 'Enter your value...',
      theme: 'snow'
    }

    getDropzoneOptions (setting: Setting): DropzoneOptions {
      return {
        url: process.env.remoteApi + `/api/admin/settings/${setting.id}`,
        thumbnailWidth: 200,
        addRemoveLinks: true,
        parallelUploads: 5,
        // Setup chunking
        chunking: false,
        method: 'PATCH',
        maxFilesize: 400000000,
        chunkSize: 1000000,
        retryChunks: true,
        retryChunksLimit: 5,
        maxThumbnailFilesize: 25,
        // If true, the individual chunks of a file are being uploaded simultaneously.
        // parallelChunkUploads: true,
        acceptedFiles: 'image/*',
        dictDefaultMessage: "<i class='fas fa-images'></i> Upload"
        // headers: {
        //   'X-CSRF-Token': (document.head.querySelector(
        //     'meta[name="csrf-token"]'
        //   ) as HTMLMetaElement).content
        // }
      }
    }

    sendingEvent (_file: File, xhr: XMLHttpRequest): void {
      xhr.setRequestHeader('Authorization', this.$auth.strategy.token.get())
    }

    created (): void {
      this.fetchSettings()
    }

    sendSetting (setting: Setting): void {
      this.loading = true

      this.$axios
        .patch(`/api/admin/settings/${setting.id}`, {
          value: setting.value,
          test: 'test'
        })
        .then(res => res.data)
        .then(() => {
          this.loading = false
          showSuccess(this.$buefy, 'Setting updated')
        })
        .catch((err) => {
          this.loading = false
          showError(
            this.$buefy,
            'Unable to save setting, maybe you are offline?',
            () => this.sendSetting(setting)
          )
          throw err
        })
    }

    fetchSettings (): void {
      this.loading = true

      this.$axios
        .get('/api/admin/settings')
        .then(res => res.data)
        .then((res) => {
          this.settings = res.data
          this.loading = false
        })
        .catch((err) => {
          this.settings = []
          this.loading = false
          showError(
            this.$buefy,
            'Unable to load settings, maybe you are offline?',
            this.fetchSettings
          )
          throw err
        })
    }

    clearCache (): void {
      this.loading = true

      this.$axios
        .get('/api/admin/clear-cache')
        .then(res => res.data)
        .then(() => {
          this.loading = false
          showSuccess(this.$buefy, 'Cache successfully cleared!')
        })
        .catch((err) => {
          this.loading = false
          showError(this.$buefy, 'Unable to clear cache')
          throw err
        })
    }
}
</script>
