<script lang="ts">
  import { fly } from "svelte/transition";
  import TodoGroups from "./TodoGroups.svelte";
  import TodoList from "./TodoList.svelte";
  import { todoStore, persistLocalData } from "./TodoStore";
  import TodoTasks from "./TodoTasks.svelte";

  void persistLocalData();

  let showSidebar = true;

  const toggleSidebar = (event: KeyboardEvent) => {
    if (event.key == "b" && event.ctrlKey) {
      showSidebar = !showSidebar;
    }
  };
</script>

<svelte:window on:keyup={toggleSidebar} />

<div class="wrapper overflow-x-hidden" class:showSidebar>
  <TodoGroups bind:showSidebar />
  {#if $todoStore.activeTodoGroup?.id}
    <div class="grow w-full">
      <TodoList />
    </div>

    {#if $todoStore.activeTodoItem.id}
      <div class="grow w-1/3">
        <TodoTasks />
      </div>
    {/if}
  {/if}
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
