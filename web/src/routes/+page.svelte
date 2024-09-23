<script lang="ts">
  import { req } from '$lib/req.js'
  import { onMount } from 'svelte'

  let username: string | null = null

  onMount(async () => {
    if (localStorage.getItem('token')) {
      const res = await req.get('/auth/')

      if (res.status === 200) {
        username = res.data.username
      } else {
        localStorage.removeItem('token')
      }
    }
  })

  async function logout() {
    if (!confirm('Er du sikker på at du vil logge ut?')) return
    const res = await req.post('/auth/logout')
    if (res.status !== 204) return alert('Noe gikk galt!')
    localStorage.removeItem('token')
    username = null
  }
</script>

<main>
  <img src="/img/icon-192.png" alt="" />
  <h1>Velkommen til LekseHjelp!</h1>
  {#if username}
    <p>Logget inn som {username}.</p>
    <div class="buttons">
      <a class="item" href="/app/assignments">Lekser</a>
      <button class="item" on:click={logout}>Logg ut</button>
    </div>
  {:else}
    <div class="buttons">
      <a class="item" href="/auth/login">Logg inn</a>
      <a class="item" href="/auth/register">Registrer deg</a>
    </div>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 20px;
  }

  img {
    width: 100px;
    height: 100px;
  }

  .buttons {
    display: flex;
    gap: 10px;
    margin-top: 5px;
  }

  .buttons .item {
    all: unset;
    cursor: pointer;
    padding: 10px 20px;
    background-color: #0064ff;
    border-radius: 8px;
    text-decoration: none;
    color: #fff;
  }
</style>
