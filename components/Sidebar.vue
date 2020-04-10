<template>
  <div>
    <b-menu>
      <b-menu-list label="Administration">
        <b-menu-item
          :to="{ name: 'index' }"
          label="Dashboard"
          icon="home"
          tag="nuxt-link"
          exact
        />
        <b-menu-item
          :to="{ name: 'albums' }"
          label="Albums"
          icon="images"
          tag="nuxt-link"
        />
        <b-menu-item
          :to="{ name: 'categories' }"
          label="Categories"
          icon="tags"
          tag="nuxt-link"
        />
        <b-menu-item
          :to="{ name: 'cosplayers' }"
          label="Cosplayers"
          icon="user-tag"
          tag="nuxt-link"
        />
        <b-menu-item
          :to="{ name: 'contacts' }"
          label="Contacts"
          icon="pen-fancy"
          tag="nuxt-link"
        />
        <b-menu-item
          :to="{ name: 'users' }"
          label="Users"
          icon="user"
          tag="nuxt-link"
        />
        <b-menu-item
          :to="{ name: 'testimonials' }"
          label="Testimonials"
          icon="book"
          tag="nuxt-link"
        />
        <b-menu-item
          :to="{ name: 'social-medias' }"
          label="Social medias"
          icon="external-link-alt"
          tag="nuxt-link"
        />
        <b-menu-item
          :to="{ name: 'invitations' }"
          label="Invitations"
          icon="envelope-open-text"
          tag="nuxt-link"
        />
      </b-menu-list>

      <b-menu-list label="Settings">
        <b-menu-item
          :to="{ name: 'settings' }"
          label="Settings"
          icon="cog"
          tag="nuxt-link"
        />
      </b-menu-list>
      <b-menu-list label="Others">
        <b-menu-item
          href="https://jkanda.fr"
          label="Return to website"
          icon="chevron-circle-left"
          tag="a"
        />
      </b-menu-list>
    </b-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
class Sidebar extends Vue {}

export default Sidebar
</script>
