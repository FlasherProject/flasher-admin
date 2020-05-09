<template>
  <b-field
    label="Select user"
    :type="errors.sso_id ? 'is-danger' : ''"
    :message="errors.sso_id ? errors.sso_id[0] : null"
  >
    <b-autocomplete
      :data="filteredUsers"
      :loading="loading"
      placeholder="Search by username or email"
      field="username"
      @typing="getFilteredUsers"
      @select="selected"
    >
      <template slot-scope="props">
        {{ props.option.username }} - {{ props.option.email }}
      </template>
    </b-autocomplete>
  </b-field>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import User from '~/models/user'
import { showError } from '~/helpers/toast'

@Component({
  name: 'pick-one-user'
})
export default class PickOneUser extends Vue {
    @Prop()
    private userId?: number;

    @Prop()
    private user?: User;

    @Prop({ default: () => ({}), required: false })
    private errors?: object;

    private filteredUsers: User[] = [];
    private loading = false;

    selected (option: User): void {
      // this.user = option;
      this.$emit('update:user', option)
      // this.userId = option.id;
      this.$emit('update:userId', option.id)
    }

    getFilteredUsers (text: string): void {
      this.loading = true
      this.$axios
        .get('/api/admin/users', {
          params: {
            search: text
          }
        })
        .then(res => res.data)
        .then((res) => {
          this.filteredUsers = res.data
          this.loading = false
        })
        .catch((err) => {
          // this.filteredUsers = [];
          this.loading = false
          showError(
            this.$buefy,
            'Unable to load users, maybe you are offline?',
            () => this.getFilteredUsers(text)
          )
          throw err
        })
    }
}
</script>
