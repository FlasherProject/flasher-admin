<template>
  <div>
    <section>
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <div class="buttons">
              <b-button
                :to="{ name: 'admin-cosplayers-create' }"
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
                @click="confirmDeleteSelectedCosplayers"
              >
                Delete checked
              </b-button>
            </div>
          </div>
        </div>

        <div class="level-right">
          <b-field class="is-pulled-right">
            <b-input
              v-model="search"
              :loading="loading"
              placeholder="Search..."
              type="search"
              icon="search"
              @input="fetchCosplayers()"
            />
          </b-field>
        </div>
      </div>

      <b-table
        :data="cosplayers"
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
        icon-pack="fas"
        checkable
        @page-change="onPageChange"
        @sort="onSort"
      >
        <template slot-scope="cosplayer">
          <b-table-column
            field="name"
            label="Name"
            sortable
          >
            <nuxt-link
              :to="{
                name: 'admin-cosplayers-slug',
                params: { slug: cosplayer.row.slug }
              }"
            >
              {{ cosplayer.row.name }}
            </nuxt-link>
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
import Cosplayer from '../../../models/cosplayer'
import { showError, showSuccess } from '~/helpers/toast'

@Component({
  name: 'CosplayersIndex',
  filters: {
    /**
         * Filter to truncate string, accepts a length parameter
         */
    truncate (value: string, length: number): string {
      return value.length > length
        ? value.substr(0, length) + '...'
        : value
    }
  }
})
export default class CosplayersIndex extends Vue {
    private cosplayers: Array<Cosplayer> = [];
    private checkedRows: Array<Cosplayer> = [];
    private total = 0;
    private page = 1;
    perPage = 10;
    private loading = false;
    private sortField = 'id';
    private sortOrder = 'desc';
    showDetailIcon = true;
    defaultSortOrder = 'desc';
    private search = '';

    created (): void {
      this.fetchCosplayers()
    }

    fetchCosplayers (): void {
      this.loading = true
      const sortOrder = this.sortOrder === 'asc' ? '' : '-'

      this.$axios
        .get('/api/admin/cosplayers', {
          params: {
            page: this.page,
            sort: sortOrder + this.sortField,
            'filter[name]': this.search
          }
        })
        .then(res => res.data)
        .then((res) => {
          this.perPage = res.meta.per_page
          this.total = res.meta.total
          this.cosplayers = res.data
          this.loading = false
        })
        .catch((err) => {
          this.cosplayers = []
          this.total = 0
          this.loading = false
          showError(
            this.$buefy,
            'Unable to load cosplayers, maybe you are offline?',
            this.fetchCosplayers
          )
          throw err
        })
    }

    /*
     * Handle page-change event
     */
    onPageChange (page: number): void {
      this.page = page
      this.fetchCosplayers()
    }

    /*
     * Handle sort event
     */
    onSort (field: string, order: string): void {
      this.sortField = field
      this.sortOrder = order
      this.fetchCosplayers()
    }

    confirmDeleteSelectedCosplayers (): void {
      this.$buefy.dialog.confirm({
        title: 'Deleting Cosplayers',
        message:
                'Are you sure you want to <b>delete</b> these cosplayers? This action cannot be undone.',
        confirmText: 'Delete Cosplayers',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.deleteSelectedCosplayers()
        }
      })
    }

    /**
     * Delete cosplayer from slug
     */
    deleteSelectedCosplayers (): void {
      this.checkedRows.forEach((cosplayer) => {
        this.$axios
          .delete(`/api/admin/cosplayers/${cosplayer.slug}`)
          .then(() => {
            showSuccess(this.$buefy, 'Cosplayers deleted')
            this.fetchCosplayers()
          })
          .catch((err) => {
            showError(
              this.$buefy,
                        `Unable to delete cosplayer <br> <small>${err.message}</small>`
            )
            throw err
          })
      })
    }
}
</script>
