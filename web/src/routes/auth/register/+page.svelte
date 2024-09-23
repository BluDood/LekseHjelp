<script lang="ts">
  import { goto } from '$app/navigation'
  import { req } from '$lib/req.js'

  let username: string
  let password: string
  let confirmPassword: string

  let loading = false

  async function register() {
    if (!username) return alert('Brukernavn er påkrevd')
    if (!password) return alert('Passord er påkrevd')
    if (password !== confirmPassword)
      return alert('Passordene er ikke like')
    if (password.length < 8) return alert('Passord må være minst 8 tegn!')

    loading = true

    const res = await req.post('/auth/register', {
      username,
      password
    })

    loading = false

    if (res.status !== 200) return alert('Something went wrong!')

    console.log(res.data)

    localStorage.setItem('token', res.data.token)

    goto('/app')
  }
</script>

<svelte:window on:keydown={e => e.key === 'Enter' && register()} />

<main>
  <h2>Registrer deg på LekseHjelp</h2>

  <div class="inputs">
    <input
      bind:value={username}
      type="username"
      placeholder="Brukernavn"
    />
    <input bind:value={password} type="password" placeholder="Passord" />
    <input
      bind:value={confirmPassword}
      type="password"
      placeholder="Gjenta passord"
    />
  </div>
  <p class="login">
    Har du allerede en konto? <a href="/auth/login">Logg inn</a>
  </p>
  <button disabled={loading} on:click={register}> Registrer deg </button>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .inputs {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  input {
    all: unset;
    padding: 8px;
    border: 1px solid #777;
    border-radius: 8px;
  }

  button {
    all: unset;
    padding: 10px 30px;
    border-radius: 8px;
    background-color: #0064ff;
    cursor: pointer;
    transition: opacity 200ms ease;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .login {
    color: #999;
    font-size: 14px;
  }
</style>
