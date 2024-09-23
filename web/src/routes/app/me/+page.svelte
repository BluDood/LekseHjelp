<script lang="ts">
  import { goto } from '$app/navigation'
  import { req } from '$lib/req.js'
  import { userStore } from '$lib/stores.js'
  import Loader from '../../../components/Loader.svelte'

  let editMode = false

  async function update() {
    if (!$userStore) return
    const res = await req.patch('/auth', { username: $userStore.username })
    if (res.status !== 200) return alert('Noe gikk galt!')
    editMode = false
  }

  async function del() {
    if (!confirm('Er du sikker på at du vil slette brukeren din?')) return
    const res = await req.delete('/auth')
    if (res.status !== 204) return alert('Noe gikk galt!')
    userStore.set(null)
    localStorage.removeItem('token')
    goto('/')
  }
</script>

{#if !$userStore}
  <div class="loading">
    <Loader />
  </div>
{:else}
  <main class="anim-appear">
    {#if editMode}
      <div class="me">
        <div class="material-icons profile">person</div>
        <input type="text" class="name" bind:value={$userStore.username} />
        <div class="actions">
          <button class="save" on:click={update}>
            <span class="material-icons"> save </span>
          </button>
          <button class="delete" on:click={del}>
            <span class="material-icons"> delete </span>
          </button>
        </div>
      </div>
    {:else}
      <div class="me">
        <div class="material-icons profile">person</div>
        <h1 class="selectable">{$userStore.username}</h1>
        <div class="actions">
          <button class="edit" on:click={() => (editMode = true)}>
            <span class="material-icons"> edit </span>
          </button>
          <button class="delete" on:click={del}>
            <span class="material-icons"> delete </span>
          </button>
        </div>
      </div>
    {/if}
  </main>
{/if}

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px;
  }

  .me {
    display: flex;
    align-items: center;
    gap: 20px;
    position: relative;
  }

  .profile {
    font-size: 100px;
    color: #fff;
    background: #111;
    padding: 20px;
    border-radius: 50%;
  }

  .actions {
    position: absolute;
    top: 0;
    right: 0;
  }

  .actions button {
    all: unset;
    padding: 10px;
    cursor: pointer;
  }

  .actions .edit {
    color: orange;
  }

  .actions .delete {
    color: red;
  }

  .actions .save {
    color: #0064ff;
  }

  input.name {
    all: unset;
    flex: 1;
    font-size: 32px;
    font-weight: 700;
    border-bottom: 1px solid rgba(103, 113, 137, 0.3);
  }
</style>
