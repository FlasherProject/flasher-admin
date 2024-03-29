<template>
  <div class="card">
    <div class="card-content">
      <b-field
        :type="errors.name ? 'is-danger' : ''"
        :message="errors.name ? errors.name[0] : null"
        label="Name"
      >
        <b-input v-model="category.name" />
      </b-field>

      <b-field
        :type="errors.meta_description ? 'is-danger' : ''"
        :message="
          errors.meta_description ? errors.meta_description[0] : null
        "
        label="Meta description"
      >
        <b-input
          v-model="category.meta_description"
          maxlength="155"
          type="textarea"
          placeholder="Helpful description for SEO"
        />
      </b-field>

      <b-field
        :type="errors.description ? 'is-danger' : ''"
        :message="errors.description ? errors.description[0] : null"
        label="Description"
      >
        <quill-editor
          ref="myQuillEditor"
          v-model="category.description"
          :options="editorOption"
        />
      </b-field>

      <b-button
        :loading="loading"
        type="is-primary"
        @click="createCategory()"
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
import Category from '~/models/category'
import { showError, showSuccess } from '~/helpers/toast'

@Component({
  name: 'CategoriesEdit',
  components: {
    quillEditor
  }
})
export default class CategoriesCreate extends Vue {
    private category: Category = new Category();
    private loading = false;
    private searchUsers: Array<User> = [];
    protected errors: object = {};

    protected editorOption: object = {
      placeholder: 'Enter your description...',
      theme: 'snow'
    };

    createCategory (): void {
      this.loading = true

      this.$axios
        .post('/api/admin/categories', this.category)
        .then(res => res.data)
        .then((res) => {
          this.errors = {}
          this.loading = false
          this.category = res.data
          showSuccess(this.$buefy, 'Category created')
          this.$router.push({ name: 'categories' })
        })
        .catch((err) => {
          this.loading = false
          showError(
            this.$buefy,
            'Unable to load category, maybe you are offline?',
            this.createCategory
          )
          this.errors = err.response.data.errors
          throw err
        })
    }
}
</script>
