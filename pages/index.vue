<template>
  <div>
    <b-loading :is-full-page="false" :active="loading" />
    <div v-if="!loading">
      <section class="hero is-info welcome is-small has-margin-bottom-sm">
        <div class="hero-body">
          <div class="container">
            <h1 class="title is-1">
              Hello, {{ $auth.user.preferred_username }}.
            </h1>
            <h2 class="subtitle">
              I hope you are having a great day!
            </h2>
          </div>
        </div>
      </section>
      <section class="info-tiles">
        <div class="tile is-ancestor has-text-centered">
          <nuxt-link
            :to="{ name: 'users' }"
            class="tile is-parent"
          >
            <article class="tile is-child box">
              <p class="title">
                {{ usersCount }}
              </p>
              <p class="subtitle">
                Users
              </p>
            </article>
          </nuxt-link>

          <nuxt-link
            :to="{ name: 'albums' }"
            class="tile is-parent"
          >
            <article class="tile is-child box">
              <p class="title">
                {{ albumsCount }}
              </p>
              <p class="subtitle">
                Albums
              </p>
            </article>
          </nuxt-link>

          <nuxt-link
            :to="{ name: 'albums' }"
            class="tile is-parent"
          >
            <article class="tile is-child box">
              <p class="title">
                {{ albumMediasCount }}
              </p>
              <p class="subtitle">
                Medias
              </p>
            </article>
          </nuxt-link>

          <nuxt-link
            :to="{ name: 'cosplayers' }"
            class="tile is-parent"
          >
            <article class="tile is-child box">
              <p class="title">
                {{ cosplayersCount }}
              </p>
              <p class="subtitle">
                Cosplayers
              </p>
            </article>
          </nuxt-link>

          <a class="tile is-parent">
            <article class="tile is-child box">
              <p class="title">{{ contactsCount }}</p>
              <p class="subtitle">Contacts</p>
            </article>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { showError } from '~/helpers/toast'

@Component({ name: 'dashboard' })
class Dashboard extends Vue {
  loading = true
  cosplayersCount = 0
  usersCount = 0
  albumsCount = 0
  contactsCount = 0
  albumMediasCount = 0

  created (): void {
    this.fetchDashboard()
  }

  fetchDashboard (): void {
    this.loading = true

    this.$axios
      .get('/api/admin/dashboard')
      .then(res => res.data)
      .then((res) => {
        this.cosplayersCount = res.cosplayersCount
        this.usersCount = res.usersCount
        this.albumsCount = res.albumsCount
        this.contactsCount = res.contactsCount
        this.albumMediasCount = res.albumMediasCount
        this.loading = false
      })
      .catch((err) => {
        this.loading = false
        showError(
          this.$buefy,
          'Unable to load dashboard, maybe you are offline?',
          this.fetchDashboard
        )
        throw err
      })
  }
}

export default Dashboard
</script>

<style lang="scss">
  .has-margin-bottom-sm {
    margin-bottom: .5em;
  }
</style>
