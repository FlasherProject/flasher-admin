<template>
  <section>
    <h1 class="title">
      Create invitation
    </h1>

    <div class="card">
      <div class="card-content">
        <form @submit.prevent="createInvitation">
          <b-field
            :type="errors.email ? 'is-danger' : ''"
            :message="errors.email ? errors.email[0] : null"
            label="Email"
          >
            <b-input
              v-model="invitation.email"
              type="email"
            />
          </b-field>

          <pick-one-cosplayer
            :cosplayer-id.sync="invitation.cosplayer_id"
            :errors="errors"
          />

          <button class="button is-primary">
            Send invitation
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import Invitation from '~/models/invitation'
import Cosplayer from '~/models/cosplayer'
import { showError, showSuccess } from '~/helpers/toast'
import PickOneCosplayer from '~/components/PickOneCosplayer.vue'

@Component({
  components: {
    PickOneCosplayer
  }
})
export default class InvitationsCreate extends Vue {
    private invitation: Invitation = new Invitation();
    protected errors: object = {};
    private loading = false;
    private filteredCosplayers: Cosplayer[] = [];

    createInvitation (): void {
      this.$axios
        .post('/api/admin/invitations/', this.invitation)
        .then(res => res.data)
        .then(() => {
          showSuccess(this.$buefy, 'Invitation successfully created')
          this.$router.push({ name: 'invitations' })
        })
        .catch((err) => {
          showError(
            this.$buefy,
                    `Unable to create the invitation <br><small>${err.response.data.message}</small>`
          )
          this.errors = err.response.data.errors
        })
    }

    getFilteredCosplayers (text: string): void {
      this.loading = true
      this.$axios
        .get('/api/admin/cosplayers', {
          params: {
            'filter[name]': text
          }
        })
        .then(res => res.data)
        .then((res) => {
          this.filteredCosplayers = res.data
          this.loading = false
        })
        .catch((err) => {
          // this.filteredCosplayers = [];
          this.loading = false
          showError(
            this.$buefy,
            'Unable to load cosplayers, maybe you are offline?',
            () => this.getFilteredCosplayers(text)
          )
          throw err
        })
    }
}
</script>
