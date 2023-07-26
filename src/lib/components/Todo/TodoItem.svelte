<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { TodoItemSubItem, TodoItem as TodoType } from "./Types";

  //ICONS
  import TrashIcon from "svelte-icons/fa/FaTrash.svelte";
  import PenIcon from "svelte-icons/fa/FaPen.svelte";

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
    dispatch("update", {
      ...todo,
      completed: isCompleted,
    });
  }
</script>

<div
  class="todo-item text-xs flex items-center rounded-md text-slate-50 transition-colors hover:bg-slate-500 {isActive ?
    'bg-slate-500' : 'bg-slate-600'}"
  class:completed={isCompleted}
  {...$$restProps}
>
  <div class="flex-shrink">
    <button
      on:click|preventDefault={() => (isCompleted = !isCompleted)}
      class="text rounded-full border w-6 h-6 ml-3 border-none {isCompleted
        ? 'bg-yellow-700'
        : 'bg-slate-100'}"><span /></button
    >
  </div>

  <div class="todo-text p-3 w-10/12">
    <button class="text text-left w-full" on:click={() => dispatch("active")}>
      {todo.text}
    </button>
  </div>

  <div class="flex items-center h-full space-x-5 pr-5 ml-auto">
    <span
      >({todo.items?.filter((task) => task.completed).length || 0}/{todo.items
        ?.length || 0})</span
    >
    {#if !isCompleted}
      <button
        on:click={() => dispatch("edit", todo)}
        class="text-white hover:text-blue-600 transition-colors w-3 h-3"
      >
        <PenIcon />
      </button>
    {/if}
    <button
      class="text-white hover:text-red-600 transition-colors w-3 h-3"
      on:click={() => dispatch("remove", todo.id)}
    >
      <TrashIcon />
    </button>
  </div>
</div>
<div class="date text-slate-500 p-1" style="font-size: 10px;">
  <span>Criado: {formatDate(todo.createdAt || 0)}</span> |
  <span>Atualizado: {formatDate(todo.updatedAt || 0)}</span>
</div>

<style>
  .text {
    line-height: 150%;
    font-size: 1rem;
  }
</style>
