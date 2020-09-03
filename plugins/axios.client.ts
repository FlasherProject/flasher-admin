import { Context } from '@nuxt/types'

export default function ({ $auth, $axios }: Context) {
  $axios.onError(async (error) => {
    if (error.response?.status === 401 && !$auth.check().valid) {
      // await $auth.loginWith('keycloak')
      await Promise.all([])
    }
    throw error
  })
}
