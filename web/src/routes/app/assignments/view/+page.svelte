<script lang="ts">
  import {
    calculateDueDate,
    formatDate,
    statuses,
    type Assignment
  } from '$lib/assignment.js'
  import { req } from '$lib/req.js'
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { DateInput } from 'date-picker-svelte'
  import autosize from 'svelte-autosize'
  import { goto } from '$app/navigation'
  import Loader from '../../../../components/Loader.svelte'

  let oldAssignment: Assignment
  let assignment: Assignment
  let date: Date

  let editMode = false
  let showRelative = true

  let newResourceName = ''
  let newResourceUrl = ''

  async function save() {
    if (assignment.title === '') return alert('Tittel kan ikke være tom!')
    if (assignment.description === '')
      return alert('Beskrivelse kan ikke være tom!')

    const update = {}

    for (const key in assignment) {
      if (assignment[key] !== oldAssignment[key]) {
        if (key === 'dueDate') update[key] = date.getTime()
        else update[key] = assignment[key]
      }
    }

    const res = await req.patch(`/assignments/${assignment.id}`, {
      ...update,
      dueDate: date.getTime()
    })

    if (res.status !== 200) return alert('Noe gikk galt!')
    editMode = false
  }

  async function del() {
    if (!confirm('Er du sikker på at du vil slette denne oppgaven?'))
      return
    const res = await req.delete(`/assignments/${assignment.id}`)
    if (res.status !== 204) return alert('Noe gikk galt!')
    goto('/app/assignments')
  }

  async function archive() {
    if (!confirm('Er du sikker på at du vil arkivere denne oppgaven?'))
      return
    const res = await req.patch(`/assignments/${assignment.id}`, {
      archived: true
    })
    if (res.status !== 200) return alert('Noe gikk galt!')
    goto('/app/assignments')
  }

  async function unarchive() {
    if (
      !confirm(
        'Er du sikker på at du vil fjerne denne oppgaven fra arkivet?'
      )
    )
      return
    const res = await req.patch(`/assignments/${assignment.id}`, {
      archived: false
    })
    if (res.status !== 200) return alert('Noe gikk galt!')
    assignment.archived = false
  }

  async function markAsCompleted() {
    if (
      !confirm(
        'Er du sikker på at du vil markere denne oppgaven som ferdig?'
      )
    )
      return
    const res = await req.patch(`/assignments/${assignment.id}`, {
      status: 'COMPLETED'
    })
    if (res.status !== 200) return alert('Noe gikk galt!')
    assignment.status = 'COMPLETED'
  }

  onMount(async () => {
    const res = await req.get(
      `/assignments/${$page.url.searchParams.get('id')}`
    )
    if (res.status !== 200) return alert('Noe gikk galt!')

    assignment = res.data
    oldAssignment = JSON.parse(JSON.stringify(assignment))
    date = new Date(res.data.dueDate)
    // const d = convertTime(new Date(res.data.dueDate))
    // date = d.date
    // time = d.time
  })
</script>

{#if !assignment}
  <div class="loading">
    <Loader />
  </div>
{:else}
  <main class="anim-appear">
    <button class="back" on:click={() => history.back()}>
      <div class="material-icons">arrow_back</div>
      Tilbake
    </button>
    {#if editMode}
      <div class="toolbar">
        <input type="text" class="title" bind:value={assignment.title} />
        <div class="actions">
          <button class="save" on:click={save}>
            <div class="material-icons">save</div>
          </button>
          <button class="delete" on:click={del}>
            <div class="material-icons">delete</div>
          </button>
        </div>
      </div>
      <textarea
        class="description"
        use:autosize
        bind:value={assignment.description}
      />
      <h2>Ressurser</h2>
      <div class="resources edit">
        {#each assignment.resources as resource}
          <div class="link">
            <div class="name">
              <div class="material-icons">link</div>
              {resource.name}
            </div>
            <button
              class="delete"
              on:click={() => {
                assignment.resources = assignment.resources.filter(
                  r => r !== resource
                )
              }}
            >
              <span class="material-icons"> delete </span>
            </button>
          </div>
        {/each}
      </div>
      <div class="addResource">
        <input
          type="text"
          placeholder="Navn..."
          bind:value={newResourceName}
        />
        <input
          type="text"
          class="url"
          placeholder="URL..."
          bind:value={newResourceUrl}
        />
        <button
          on:click={() => {
            if (newResourceName === '' || newResourceUrl === '') return
            if (!/^(http|https):\/\/[^ "]+$/.test(newResourceUrl))
              return alert('Ugyldig URL!')

            assignment.resources = [
              ...assignment.resources,
              { name: newResourceName, url: newResourceUrl }
            ]
            newResourceName = ''
            newResourceUrl = ''
          }}
        >
          <div class="material-icons">add</div>
        </button>
      </div>
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
    {:else}
      <div class="toolbar">
        <h1 class="selectable">{assignment.title}</h1>
        <div class="actions">
          {#if assignment.status !== 'COMPLETED'}
            <button class="completed" on:click={markAsCompleted}>
              <div class="material-icons">check_circle</div>
            </button>
          {/if}
          <button
            class={assignment.archived ? 'unarchive' : 'archive'}
            on:click={assignment.archived ? unarchive : archive}
          >
            <div class="material-icons">
              {assignment.archived ? 'unarchive' : 'archive'}
            </div>
          </button>
          <button class="edit" on:click={() => (editMode = true)}>
            <div class="material-icons">edit</div>
          </button>
          <button class="delete" on:click={del}>
            <div class="material-icons">delete</div>
          </button>
        </div>
      </div>
      <p class="selectable">{assignment.description}</p>
      {#if assignment.resources.length !== 0}
        <h2>Ressurser</h2>
        <div class="resources">
          {#each assignment.resources as resource}
            <a target="_blank" href={resource.url} class="link">
              <div class="material-icons">link</div>
              {resource.name}
            </a>
          {/each}
        </div>
      {/if}
      <div class="info">
        <div class="field">
          <h3>Status</h3>
          <p>{statuses[assignment.status]}</p>
        </div>
        <div class="field">
          <h3>Frist</h3>
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          {#if assignment.trashed || assignment.archived}
            <p class="frist">
              {formatDate(new Date(assignment.dueDate))}
            </p>
          {:else}
            <p
              class="frist"
              class:clickable={!assignment.trashed && !assignment.archived}
              on:click={() => (showRelative = !showRelative)}
            >
              {showRelative
                ? calculateDueDate(new Date(assignment.dueDate))
                : formatDate(new Date(assignment.dueDate))}
            </p>
          {/if}
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

  .back {
    all: unset;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    color: #0064ff;
    margin-bottom: 10px;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px;
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

  .field p {
    font-size: 16px;
  }

  .toolbar {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
  }

  .toolbar button {
    all: unset;
    padding: 5px;
    cursor: pointer;
  }

  .toolbar button.delete {
    color: red;
  }

  .toolbar button.edit {
    color: orange;
  }

  .toolbar button.save {
    color: #0064ff;
  }

  .toolbar button.archive {
    color: #00ff00;
  }

  .toolbar button.unarchive {
    color: #0064ff;
  }

  .toolbar button.completed {
    color: #00ff00;
  }

  .resources {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 500px;
  }

  .resources .link {
    background: #111;
    padding: 8px 12px;
    border-radius: 4px;
    color: white;
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .resources.edit .link {
    justify-content: space-between;
  }

  .resources .link .name {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .resources .link .delete {
    all: unset;
    cursor: pointer;
    display: flex;
  }

  .resources .link .delete {
    color: red;
  }

  .addResource {
    display: flex;
    gap: 10px;
    align-items: center;
    max-width: 500px;
  }

  .addResource input {
    all: unset;
    width: 150px;
    padding: 5px;
    border: 1px solid rgba(103, 113, 137, 0.3);
    border-radius: 3px;
  }

  .addResource input.url {
    flex: 1;
  }

  .addResource button {
    all: unset;
    display: flex;
    padding: 4px;
    cursor: pointer;
    background: #111;
    color: white;
    border-radius: 3px;
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

  .frist.clickable {
    cursor: pointer;
  }
</style>
