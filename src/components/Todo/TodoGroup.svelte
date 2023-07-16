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

<div class="todo-group" >
  <button on:click={() => dispatch("active", todoGroup)}
    class:active={isActive} >{todoGroup.name}</button
  >
  <button on:click={() => dispatch("remove", todoGroup.id)} >&times;</button>
</div>

<style>
  button {
    border: 1px solid var(--color-gray-3);
    background-color: transparent;
    text-transform: uppercase;
    font-weight: bold;
    cursor: pointer;    
    padding: 10px;    
    color: white;
  }

  button.active {
    background-color: var(--color-gray-3);
  }

  .todo-group {
    display: flex;
  }

  .todo-group button:first-child {
    flex-grow: 1;    
    width: 100%;
    border-start-start-radius: var(--radius-sm);
    border-end-start-radius: var(--radius-sm);
  }

  .todo-group button:last-child{    
    flex-shrink: 1;
    text-align: center;
    border-start-end-radius: var(--radius-sm);
    border-end-end-radius: var(--radius-sm);    
    border-left: none;
  }
</style>
