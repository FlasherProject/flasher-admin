<template>
  <div>
    <section>
      <div class="buttons">
        <b-button
          :disabled="!checkedRows.length"
          type="is-danger"
          icon-left="trash-alt"
          @click="confirmDeleteSelectedInvitations()"
        >
          Delete checked
        </b-button>
        <b-button
          :to="{ name: 'invitations-create' }"
          tag="nuxt-link"
          type="is-success"
          icon-left="plus"
        >
          Create
        </b-button>
      </div>

      <b-table
        :data="invitations"
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
        detailed
        show-detail-icon
        @page-change="onPageChange"
        @sort="onSort"
      >
        <template slot-scope="invitation">
          <b-table-column
            field="email"
            label="E-mail"
            sortable
          >
            <nuxt-link
              :to="{
                name: 'invitations-edit',
                params: { id: invitation.row.id }
              }"
            >
              {{ invitation.row.email }}
            </nuxt-link>
          </b-table-column>

          <b-table-column
            field="confirmed_at"
            label="Confirmed"
            sortable
          >
            <b-icon
              v-if="invitation.row.confirmed_at"
              icon="check"
              type="is-success"
            />
            <b-icon
              v-else-if="invitation.row.expired"
              icon="times"
              type="is-danger"
            />
            <b-icon
              v-else
              icon="clock"
              type="is-info"
            />
          </b-table-column>
        </template>

        <template
          slot="detail"
          slot-scope="props"
        >
          <article>
            <p>
              {{ props.row.message }}
            </p>
          </article>
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
import Invitation from '~/models/invitation'
import { showError, showSuccess } from '~/helpers/toast'

@Component({
  name: 'InvitationsIndex'
})
export default class InvitationsIndex extends Vue {
    private invitations: Array<Invitation> = [];
    private checkedRows: Array<Invitation> = [];
    private total = 0;
    private page = 1;
    perPage = 10;
    private loading = false;
    private sortField = 'id';
    private sortOrder = 'desc';
    showDetailIcon = true;
    defaultSortOrder = 'desc';

    created (): void {
      this.fetchInvitations()
    }

    fetchInvitations (): void {
      this.loading = true
      const sortOrder = this.sortOrder === 'asc' ? '' : '-'

      this.$axios
        .get('/api/admin/invitations', {
          params: {
            page: this.page,
            sort: sortOrder + this.sortField
          }
        })
        .then(res => res.data)
        .then((res) => {
          this.perPage = res.meta.per_page
          this.total = res.meta.total
          this.invitations = res.data
          this.loading = false
        })
        .catch((err) => {
          this.invitations = []
          this.total = 0
          this.loading = false
          showError(
            this.$buefy,
            'Unable to load invitations, maybe you are offline?',
            this.fetchInvitations
          )
          throw err
        })
    }

    /*
     * Handle page-change event
     */
    onPageChange (page: number): void {
      this.page = page
      this.fetchInvitations()
    }

    /*
     * Handle sort event
     */
    onSort (field: string, order: string): void {
      this.sortField = field
      this.sortOrder = order
      this.fetchInvitations()
    }

    confirmDeleteSelectedInvitations (): void {
      this.$buefy.dialog.confirm({
        title: 'Deleting invitations',
        message:
                'Are you sure you want to <b>delete</b> these invitations? This action cannot be undone.',
        confirmText: 'Delete Invitations',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.deleteSelectedInvitations()
        }
      })
    }

    deleteSelectedInvitations (): void {
      this.checkedRows.forEach((invitation) => {
        this.$axios
          .delete(`/api/admin/invitations/${invitation.id}`)
          .then(() => {
            showSuccess(this.$buefy, 'Invitations deleted')
            this.fetchInvitations()
          })
          .catch((err) => {
            showError(
              this.$buefy,
                        `Unable to delete invitation <br> <small>${err.message}</small>`
            )
            throw err
          })
      })
    }
}
</script>
