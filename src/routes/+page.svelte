<script lang="ts">
  import TodoGroups from "$lib/components/Todo/TodoGroups.svelte";
  import TodoList from "$lib/components/Todo/TodoList.svelte";
  import { todoStore } from "$lib/components/Todo/TodoStore";
  import TodoTasks from "$lib/components/Todo/TodoTasks.svelte";
  import { onMount } from "svelte";

  export let data;

  let showSidebar = true;

  const { loadDataFromLocalStorage } = data;

  const toggleSidebar = (event: KeyboardEvent) => {
    if (event.key == "b" && event.ctrlKey) {
      showSidebar = !showSidebar;
    }
  };

  onMount(() => {
    loadDataFromLocalStorage();
  })
</script>

<svelte:head>
  <title>Todo</title>
  <meta name="description" content="Todo" />
</svelte:head>

<svelte:window on:keyup={toggleSidebar} />

<section class="flex flex-col items-center flex-1 bg-slate-700">
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
</section>

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