<template>
  <div>
    <section>
      <div class="buttons">
        <b-button
          :to="{ name: 'social-medias-create' }"
          tag="nuxt-link"
          type="is-success"
          icon-left="plus"
        >
          Add
        </b-button>
        <b-button
          :disabled="!checkedRows.length"
          type="is-danger"
          icon-left="trash-alt"
          @click="confirmDeleteSelectedSocialMedias()"
        >
          Delete checked
        </b-button>
      </div>

      <b-table
        :data="socialMedias"
        :loading="loading"
        :total="total"
        :per-page="perPage"
        :default-sort-direction="defaultSortOrder"
        :default-sort="[sortField, sortOrder]"
        :checked-rows.sync="checkedRows"
        striped
        hoverable
        mobile-cards
        paginated
        backend-pagination
        backend-sorting
        checkable
        @page-change="onPageChange"
        @sort="onSort"
      >
        <template slot-scope="socialMedia">
          <b-table-column
            field="name"
            label="Name"
            sortable
          >
            <nuxt-link
              :to="{
                name: 'social-medias-id',
                params: { id: socialMedia.row.id }
              }"
            >
              {{ socialMedia.row.name }}
            </nuxt-link>
          </b-table-column>

          <b-table-column
            field="url"
            label="Url"
            sortable
          >
            <nuxt-link
              :to="{
                name: 'social-medias-id',
                params: { id: socialMedia.row.id }
              }"
            >
              {{ socialMedia.row.url }}
            </nuxt-link>
          </b-table-column>

          <b-table-column
            field="active"
            label="Active"
            sortable
          >
            {{ socialMedia.row.active }}
          </b-table-column>
        </template>

        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon
                  icon="sad-tear"
                  size="is-large"
                />
              </p>
              <p>Nothing here.</p>
            </div>
          </section>
        </template>

        <template slot="bottom-left">
          <b>Total checked</b>
          : {{ checkedRows.length }}
        </template>
      </b-table>
    </section>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import SocialMedia from '~/models/social-media'
import { showError, showSuccess } from '~/helpers/toast'

@Component({
  name: 'SocialMediasIndex'
})
export default class SocialMediasIndex extends Vue {
    private socialMedias: Array<SocialMedia> = [];
    private checkedRows: Array<SocialMedia> = [];
    private total = 0;
    private page = 1;
    perPage = 10;
    private loading = false;
    private sortField = 'id';
    private sortOrder = 'desc';
    showDetailIcon = true;
    defaultSortOrder = 'desc';

    created (): void {
      this.fetchSocialMedias()
    }

    fetchSocialMedias (): void {
      this.loading = true
      const sortOrder = this.sortOrder === 'asc' ? '' : '-'

      this.$axios
        .get('/api/admin/social-medias', {
          params: {
            page: this.page,
            sort: sortOrder + this.sortField
          }
        })
        .then(res => res.data)
        .then((res) => {
          this.perPage = res.meta.per_page
          this.total = res.meta.total
          this.socialMedias = res.data
          this.loading = false
        })
        .catch((err) => {
          this.socialMedias = []
          this.total = 0
          this.loading = false
          showError(
            this.$buefy,
            'Unable to load socialMedias, maybe you are offline?',
            this.fetchSocialMedias
          )
          throw err
        })
    }

    /*
     * Handle page-change event
     */
    onPageChange (page: number): void {
      this.page = page
      this.fetchSocialMedias()
    }

    /*
     * Handle sort event
     */
    onSort (field: string, order: string): void {
      this.sortField = field
      this.sortOrder = order
      this.fetchSocialMedias()
    }

    confirmDeleteSelectedSocialMedias (): void {
      this.$buefy.dialog.confirm({
        title: 'Deleting socialMedias',
        message:
                'Are you sure you want to <b>delete</b> these socialMedias? This action cannot be undone.',
        confirmText: 'Delete SocialMedias',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.deleteSelectedSocialMedias()
        }
      })
    }

    deleteSelectedSocialMedias (): void {
      this.checkedRows.forEach((socialMedia) => {
        this.$axios
          .delete(`/api/admin/social-medias/${socialMedia.id}`)
          .then(() => {
            showSuccess(this.$buefy, 'SocialMedias deleted')
            this.fetchSocialMedias()
          })
          .catch((err) => {
            showError(
              this.$buefy,
                        `Unable to delete socialMedia <br> <small>${err.message}</small>`
            )
            throw err
          })
      })
    }
}
</script>
