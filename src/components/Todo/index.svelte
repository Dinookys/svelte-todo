<script lang="ts">
  import { todoStore, actions } from "./Todo";
  import TodoGroups from "./TodoGroups.svelte";
  import TodoList from "./TodoList.svelte";
  import TodoTasks from "./TodoTasks.svelte";

  actions.persistData();

  let showSidebar = true;

  const toggleSidebar = (event: KeyboardEvent) => {
    if (event.key == "b" && event.ctrlKey) {
      showSidebar = !showSidebar;
    }
  };
</script>

<svelte:window on:keyup={toggleSidebar} />

<div class="wrapper" class:showSidebar>
  <TodoGroups bind:showSidebar />
  <div class="w-4/6">
    {#if $todoStore.activeTodoGroup?.id}
      <TodoList />
    {/if}
  </div>
  <div class="w-2/6">
    <TodoTasks />
  </div>
</div>

<style>
  .wrapper {
    width: 100%;
    padding-left: 0px;
    transition: padding-left 0.5s;
    display: flex;
  }

  .wrapper.showSidebar {
    padding-left: var(--sidebarWidth);
  }
</style>
