<script lang="ts">
  import { goto } from '$app/navigation'
  import {
    calculateDueDate,
    formatDate,
    statuses,
    type Assignment
  } from '$lib/assignment.js'
  import { req } from '$lib/req.js'
  import { onMount } from 'svelte'
  import Loader from '../../../components/Loader.svelte'

  let assignments: Assignment[]
  let shownAssignments: Assignment[] = []
  let sortBy: 'title' | 'status' | 'dueDate' = 'dueDate'
  let sortReverse = false

  let showArchived = false
  let showTrashed = false

  const statusNum = {
    PENDING: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2
  }

  async function filter(by?: 'archived' | 'trashed') {
    if (by === 'archived') {
      showArchived = !showArchived
      showTrashed = false
    } else if (by === 'trashed') {
      showTrashed = !showTrashed
      showArchived = false
    }

    if (showArchived) {
      shownAssignments = assignments.filter(a => a.archived === true)
    } else if (showTrashed) {
      shownAssignments = assignments.filter(a => a.trashed === true)
    } else {
      shownAssignments = assignments.filter(a => !a.archived && !a.trashed)
    }
  }

  async function sort(by?: 'title' | 'status' | 'dueDate') {
    if (by) {
      if (by === sortBy) {
        sortReverse = !sortReverse
      } else {
        sortBy = by
        sortReverse = false
      }
    }
    const sorted = assignments.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'status') {
        if (a.status === b.status) return 0
        return statusNum[a.status] - statusNum[b.status]
      }
      if (sortBy === 'dueDate')
        return (
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        )
      return 0
    })
    shownAssignments = sortReverse ? sorted.reverse() : sorted
    filter()
  }

  onMount(async () => {
    const res = await req.get('/assignments')
    if (res.status !== 200) return alert('Noe gikk galt!')

    assignments = res.data
    sort()
  })
</script>

{#if !assignments}
  <div class="loading">
    <Loader />
  </div>
{:else}
  <main class="anim-appear">
    <h2>Dine lekser</h2>
    {#if assignments.length === 0}
      Ingen lekser her ennå.
      <a href="/app/assignments/new"> Legg til en ny! </a>
    {:else}
      <div class="filters">
        <button
          class:active={showArchived}
          on:click={() => filter('archived')}
        >
          Arkiverte
        </button>
        <button
          class:active={showTrashed}
          on:click={() => filter('trashed')}
        >
          Søppelbøtte
        </button>
      </div>
      <table cellspacing="0" cellpadding="0">
        <tr>
          <th on:click={() => sort('title')}>
            Tittel
            <div class="material-icons" class:active={sortBy === 'title'}>
              {sortReverse ? 'arrow_downward' : 'arrow_upward'}
            </div>
          </th>
          <th>Beskrivelse</th>
          <th on:click={() => sort('status')}>
            Status
            <div class="material-icons" class:active={sortBy === 'status'}>
              {sortReverse ? 'arrow_downward' : 'arrow_upward'}
            </div>
          </th>
          <th on:click={() => sort('dueDate')}>
            Frist
            <div
              class="material-icons"
              class:active={sortBy === 'dueDate'}
            >
              {sortReverse ? 'arrow_downward' : 'arrow_upward'}
            </div>
          </th>
        </tr>
        {#each shownAssignments as assignment}
          <tr
            on:click={() =>
              goto(`/app/assignments/view/?id=${assignment.id}`)}
          >
            <td>
              <span>{assignment.title}</span>
            </td>
            <td>
              <span>{assignment.description}</span>
            </td>
            <td>
              {statuses[assignment.status]}
            </td>
            <td>
              {showArchived || showTrashed
                ? formatDate(new Date(assignment.dueDate))
                : calculateDueDate(new Date(assignment.dueDate))}
            </td>
          </tr>
        {/each}
      </table>
    {/if}
  </main>
{/if}

<style>
  main {
    padding: 20px;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px;
  }

  table {
    width: 100%;
    max-width: 800px;
  }

  th {
    text-wrap: nowrap;
    text-align: left;
    padding: 10px 30px;
    border-bottom: 1px solid #333;
    cursor: pointer;
    min-width: 100px;
  }

  th .material-icons {
    font-size: 16px;
    vertical-align: middle;
    opacity: 0.5;
  }

  th .material-icons.active {
    opacity: 1;
  }

  tr {
    transition: background 200ms ease;
  }

  tr th:first-child {
    padding-left: 10px;
  }

  tr td:first-child {
    padding-left: 10px;
  }

  td {
    padding: 10px 30px;
    border-bottom: 1px solid #333;
  }

  td span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  tr:has(td) {
    cursor: pointer;
  }

  tr:nth-child(odd) {
    background-color: #000;
  }

  tr:nth-child(even) {
    background-color: #111;
  }

  tr:has(td):hover {
    background-color: #181818;
  }

  .filters {
    display: flex;
    margin-top: 10px;
    gap: 10px;
  }

  .filters button {
    all: unset;
    font-size: 15px;
    padding: 5px 10px;
    background-color: #111;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .filters button.active {
    background-color: #333;
  }
</style>
