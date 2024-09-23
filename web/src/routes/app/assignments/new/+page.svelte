<script lang="ts">
  import type { Assignment } from '$lib/assignment.js'
  import { req } from '$lib/req.js'
  import { goto } from '$app/navigation'
  import { DateInput } from 'date-picker-svelte'
  import autosize from 'svelte-autosize'

  let assignment: Partial<Assignment> = {
    title: '',
    description: '',
    status: 'PENDING'
  }

  let date = new Date()

  async function add() {
    if (assignment.title === '') return alert('Tittel kan ikke være tom!')
    if (assignment.description === '')
      return alert('Beskrivelse kan ikke være tom!')

    const res = await req.post('/assignments', {
      ...assignment,
      dueDate: date.getTime()
    })

    if (res.status !== 201) return alert('Noe gikk galt!')
    goto(`/app/assignments/view/?id=${res.data.id}`)
  }
</script>

<main class="anim-appear">
  <button class="back" on:click={() => history.back()}>
    <div class="material-icons">arrow_back</div>
    Tilbake
  </button>
  <h2 class="new">Opprett ny lekse</h2>

  <div class="toolbar">
    <input type="text" class="title" bind:value={assignment.title} />
    <div class="actions">
      <button class="save" on:click={add}>
        <div class="material-icons">save</div>
      </button>
    </div>
  </div>
  <textarea
    class="description"
    use:autosize
    bind:value={assignment.description}
  />
  <div class="info">
    <div class="field">
      <h3>Status</h3>
      <select class="status" bind:value={assignment.status}>
        <option value="PENDING">Venter</option>
        <option value="IN_PROGRESS">Pågår</option>
        <option value="COMPLETED">Ferdig</option>
      </select>
    </div>
    <div class="field">
      <h3>Frist</h3>
      <DateInput
        bind:value={date}
        timePrecision={'minute'}
        format={'yyyy-MM-dd HH:mm'}
      />
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
  }

  .back {
    all: unset;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    color: #0064ff;
    margin-bottom: 10px;
  }

  .new {
    margin-bottom: 20px;
  }

  .info {
    display: flex;
    gap: 30px;
  }

  .field {
    display: flex;
    gap: 5px;
    flex-direction: column;
  }

  .field h3 {
    font-size: 18px;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: space-between;
  }

  .toolbar button {
    all: unset;
    padding: 5px;
    cursor: pointer;
  }

  .toolbar button.save {
    color: #0064ff;
  }

  input.title {
    all: unset;
    flex: 1;
    font-size: 32px;
    font-weight: 700;
    border-bottom: 1px solid rgba(103, 113, 137, 0.3);
  }

  textarea.description {
    font-family: inherit;
    color: inherit;
    background: transparent;
    border: 1px solid rgba(103, 113, 137, 0.3);
    padding: 10px;
    border-radius: 3px;
    resize: none;
  }

  select.status {
    width: 100px;
    background: #111;
    color: #fff;
    border: 1px solid rgba(103, 113, 137, 0.3);
    padding: 4px 6px;
    border-radius: 3px;
    font-family: inherit;
  }
</style>
