<script lang="ts">
  import { goto } from '$app/navigation'
  import { req } from '$lib/req.js'
  import { userStore } from '$lib/stores.js'

  async function logout() {
    if (!confirm('Er du sikker på at du vil logge ut?')) return
    const res = await req.post('/auth/logout')
    if (res.status !== 204) return alert('Noe gikk galt!')
    userStore.set(null)
    localStorage.removeItem('token')
    goto('/')
  }
</script>

<div class="header">
  <a href="/app" class="title">LekseHjelp</a>
  <div class="actions">
    <a class="item" href="/app/assignments/new">
      <span class="material-icons">add</span>
    </a>
    <a class="item" href="/app/me">
      {$userStore?.username ?? ''}
      <span class="material-icons">person</span>
    </a>
    <button class="item delete" on:click={logout}>
      <span class="material-icons">logout</span>
    </button>
  </div>
</div>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #222;
    background: #111;
  }

  .title {
    color: inherit;
    font-size: 22px;
    font-weight: 700;
    padding: 10px;
  }

  .actions {
    display: flex;
  }

  .actions .item {
    all: unset;
    color: #0064ff;
    cursor: pointer;
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .actions .item.delete {
    color: red;
  }
</style>
