<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let todoGroup = {} as {
    id: number;
    name: string;
    todos: { id: number; text: string; completed: boolean }[];
  };

  export let isActive = false;
</script>

<div
  class="todo-group flex rounded-md {isActive
    ? 'bg-slate-500'
    : 'bg-slate-700 text-white'}"
>
  <button
    class="grow text-left p-2"
    on:click={() => dispatch("active", todoGroup)}
    class:active={isActive}>{todoGroup.name}</button
  >
  <button
    class="p-2 bg-transparent text-white border-l border-l-gray-800 rounded-r-md hover:bg-red-600 transition-colors"
    on:click={() => dispatch("remove", todoGroup.id)}>&times;</button
  >
</div>
