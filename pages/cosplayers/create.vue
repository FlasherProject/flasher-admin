<template>
  <div class="card">
    <div class="card-content">
      <b-field
        :type="errors.name ? 'is-danger' : ''"
        :message="errors.name ? errors.name[0] : null"
        label="Name"
      >
        <b-input v-model="cosplayer.name" />
      </b-field>

      <b-field
        :type="errors.description ? 'is-danger' : ''"
        :message="errors.description ? errors.description[0] : null"
        label="Description"
      >
        <quill-editor
          ref="myQuillEditor"
          v-model="cosplayer.description"
          :options="editorOption"
        />
      </b-field>

      <div class="columns">
        <div class="column">
          <div v-if="cosplayer.avatar">
            <label class="label">Current avatar</label>
            <img
              :src="cosplayer.avatar.thumb"
              alt=""
            >
            <b-button
              type="is-danger"
              icon-right="trash-alt"
              @click="cosplayer.avatar = null"
            />
          </div>

          <b-field
            v-else
            :type="errors.avatar ? 'is-danger' : ''"
            :message="errors.avatar ? errors.avatar[0] : null"
            label="Upload avatar"
          >
            <b-upload
              v-model="cosplayer.avatar"
              drag-drop
            >
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <b-icon
                      icon="upload"
                      size="is-large"
                    />
                  </p>
                  <p>
                    Drop your files here or click to upload
                  </p>
                  <span
                    v-if="cosplayer.avatar"
                    class="file-name"
                  >
                    {{ cosplayer.avatar.name }}
                  </span>
                </div>
              </section>
            </b-upload>
          </b-field>
        </div>
        <div class="column">
          <b-field
            :type="errors.user_id ? 'is-danger' : ''"
            :message="errors.user_id ? errors.user_id[0] : null"
            label="Linked user"
          >
            <b-autocomplete
              v-model="cosplayer.user.id"
              :data="searchUsers"
              placeholder="e.g. Anne"
              keep-first
              open-on-focus
              field="id"
              @typing="searchUser"
              @select="option => (selected = option)"
            >
              <template slot-scope="props">
                <div>
                  {{ props.option.name }}
                  <br>
                  <small>
                    Email: {{ props.option.email }}, role
                    <b>{{ props.option.role }}</b>
                  </small>
                </div>
              </template>
            </b-autocomplete>
          </b-field>
        </div>
      </div>

      <b-button
        :loading="loading"
        type="is-primary"
        @click="createCosplayer()"
      >
        Create
      </b-button>
    </div>
  </div>
</template>

<script lang="ts">
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { Component, Vue } from 'vue-property-decorator'
import User from '~/models/user'
import Cosplayer from '~/models/cosplayer'
import { showError, showSuccess } from '~/helpers/toast'

@Component({
  name: 'CosplayersCreate',
  components: {
    quillEditor
  }
})
export default class CosplayersCreate extends Vue {
    private cosplayer: Cosplayer = new Cosplayer();
    private loading = false;
    private searchUsers: Array<User> = [];
    protected errors: object = {};

    protected editorOption: object = {
      placeholder: 'Enter your description...',
      theme: 'snow'
    };

    created (): void {
      this.cosplayer.user = new User()
    }

    createCosplayer (): void {
      this.loading = true

      const formData: FormData = this.cosplayerToFormData(this.cosplayer)
      this.$axios
        .post('/api/admin/cosplayers', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => res.data)
        .then(() => {
          this.errors = {}
          this.loading = false
          showSuccess(this.$buefy, 'Cosplayer created')
          this.$router.push({ name: 'cosplayers' })
        })
        .catch((err) => {
          this.loading = false
          showError(this.$buefy, 'Unable to create cosplayer')
          this.errors = err.response.data.errors
          throw err
        })
    }

    searchUser (): void {
      this.$axios
        .get('/api/admin/users', {
          params: { 'filter[name]': this.cosplayer.user?.id }
        })
        .then(res => res.data)
        .then((res) => {
          this.searchUsers = res.data
        })
        .catch((err) => {
          showError(
            this.$buefy,
            'Unable to load users, maybe you are offline?'
          )
          throw err
        })
    }

    cosplayerToFormData (cosplayer: Cosplayer): FormData {
      const formData = new FormData()
      // TODO Rewrite
      if (cosplayer.name) {
        formData.append('name', cosplayer.name)
      }
      if (cosplayer.description) {
        formData.append('description', cosplayer.description)
      }
      if (cosplayer.user && cosplayer.user.id) {
        formData.append('user.id', String(cosplayer.user.id))
      }
      if (cosplayer.avatar != null) {
        formData.append('avatar', cosplayer.avatar)
      }

      return formData
    }
}
</script>
