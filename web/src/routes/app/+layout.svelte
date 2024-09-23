<script lang="ts">
  import { onMount } from 'svelte'
  import Footer from '../../components/Footer.svelte'
  import Header from '../../components/Header.svelte'
  import { req } from '$lib/req.js'
  import { userStore } from '$lib/stores.js'
  import { goto } from '$app/navigation'

  onMount(async () => {
    const res = await req.get('/auth')

    if (res.status !== 200) {
      userStore.set(null)
      return goto('/auth/login')
    }

    userStore.set(res.data)
  })
</script>

<main>
  <Header />
  <div class="slot">
    <slot />
  </div>
  <Footer />
</main>

<style>
</style>
