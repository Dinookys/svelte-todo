<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import FaPen from "svelte-icons/fa/FaPen.svelte";
  import FaTrash from "svelte-icons/fa/FaTrash.svelte";

  const dispatch = createEventDispatcher();

  export let todoGroup = {} as {
    id: number;
    name: string;
    todos: { id: number; text: string; completed: boolean }[];
  };

  export let isActive = false;
</script>

<div
  class="todo-group flex hover:bg-slate-600 group  transition-colors rounded-md {isActive
    ? 'bg-slate-600 text-primary-600'
    : 'bg-slate-700 text-white'}"
>
  <button
    class="grow text-left p-2"
    on:click={() => dispatch("active", todoGroup)}
    class:active={isActive}>{todoGroup.name}</button
  >
  <button
    class="p-2 bg-transparent text-white border-l border-l-slate-800 hover:text-blue-500 transition-colors"
    on:click={() => dispatch("edit", todoGroup)}
  >
    <span class="block w-3 h-3">
      <FaPen />
    </span>
  </button>
  <button
    class="p-2 bg-transparent text-white border-l border-l-slate-800 rounded-r-md hover:text-red-500 transition-colors"
    on:click={() => dispatch("remove", todoGroup.id)}
  >
    <span class="block w-3 h-3">
      <FaTrash />
    </span>
  </button>
</div>
