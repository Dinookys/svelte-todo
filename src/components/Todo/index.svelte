<script lang="ts">
  import { todoStore, actions } from "./Todo";
  import TodoGroups from "./TodoGroups.svelte";
  import TodoList from "./TodoList.svelte";

  actions.persistData();

  let showSidebar = false;

  const toggleSidebar = (event: KeyboardEvent) => {
    if (event.key == "b" && event.ctrlKey) {
      showSidebar = !showSidebar;
    }
  };
</script>

<svelte:window on:keyup={toggleSidebar} />

<div class="wrapper" class:fullTodoList={!showSidebar}>
  {#if showSidebar}
    <TodoGroups />
  {/if}
  
  {#if $todoStore.activeTodoGroup?.id}
    <TodoList />
  {/if}
</div>

<style>
  .wrapper {
    display: grid;
    width: 100%;
    grid-template-columns: 300px 1fr;
  }

  .wrapper.fullTodoList {
    grid-template-columns: 1fr;
  }
</style>
