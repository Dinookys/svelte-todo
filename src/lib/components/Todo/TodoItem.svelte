<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import type { TodoItemSubItem, TodoItem as TodoType } from "./Types";
  import { actions, sanitizeHTML } from "./Todo";

  //ICONS
  import TrashIcon from "svelte-icons/fa/FaTrash.svelte";
  import PenIcon from "svelte-icons/fa/FaPen.svelte";
  import FaCheck from "svelte-icons/fa/FaCheck.svelte";
  import FaCircle from "svelte-icons/fa/FaRegCircle.svelte";

  export let todo = {
    text: "",
    completed: false,
    items: [] as TodoItemSubItem[],
  } as TodoType;

  export let isActive = false;

  const dispatch = createEventDispatcher();

  const formatDate = (date: number) => {
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  let isCompleted = todo.completed;

  $: if (isCompleted != todo.completed) {
    actions.updateTodo({
      ...todo,
      completed: isCompleted,
    });
  }
</script>

<div
  class="todo-item text-xs flex items-center rounded-md text-slate-50 transition-colors hover:bg-slate-800 group {isActive
    ? 'bg-slate-800'
    : 'bg-slate-600'}"
  role="button"
  tabindex="0"
  class:completed={isCompleted}
  {...$$restProps}
>
  <div class="todo-text p-3 w-10/12">
    <button
      class="text text-left w-full group-hover:text-primary-600 {isActive &&
        'text-primary-600'}"
      on:click={() => dispatch("active")}
    >
      {@html sanitizeHTML(todo.text)}
    </button>
  </div>
  <div class="flex-shrink mr-4">
    <button
      on:click|preventDefault={() => (isCompleted = !isCompleted)}
      class="text rounded-full border w-6 h-6 p-1 ml-3 border-none {isCompleted
        ? 'text-primary-600'
        : 'text-slate-100'}"
    >
      {#if isCompleted}
        <span transition:fly={{ y: -5, duration: 50 }}>
          <FaCheck />
        </span>
      {:else}
        <span transition:fly={{ y: -5, duration: 50 }}>
          <FaCircle />
        </span>
      {/if}
    </button>
  </div>

  <div class="flex items-center h-full space-x-5 pr-5 ml-auto">
    <span
      >({todo.items?.filter((task) => task.completed).length || 0}/{todo.items
        ?.length || 0})</span
    >
    <button
      on:click={() => dispatch("edit", todo)}
      class="text-white hover:text-blue-500 transition-colors w-3 h-3"
    >
      <PenIcon />
    </button>
    <button
      class="text-white hover:text-red-500 transition-colors w-3 h-3"
      on:click={() => actions.removeTodo(todo.id)}
    >
      <TrashIcon />
    </button>
  </div>
</div>
<div class="date text-slate-400 p-1" style="font-size: 10px;">
  <span>Criado: {formatDate(todo.createdAt || 0)}</span> |
  <span>Atualizado: {formatDate(todo.updatedAt || 0)}</span>
</div>

<style>
  .text {
    line-height: 150%;
    font-size: 1rem;
  }
</style>
