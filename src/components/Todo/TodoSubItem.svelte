<script lang="ts">
  import type { TodoItemSubItem } from "./Todo";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let item = {} as TodoItemSubItem;

  let isCompleted = item.completed;

  $: if (isCompleted != item.completed) {
    dispatch("completed", {
      ...item,
      completed: isCompleted,
    });
  }
</script>

<div>
  <a href="//#" on:click|preventDefault={() => (isCompleted = !isCompleted)} class:completed={isCompleted}>    
    <div class="todo-text">
      <div class="text">{item.text}</div>      
    </div>
  </a>
</div>

<style>
    a {
        color: inherit;
        padding: 5px;
        display: block;
        text-decoration: none;
    }

    a.completed {
        text-decoration: line-through;
        color: var(--color-bg-gray-6);
    }
</style>