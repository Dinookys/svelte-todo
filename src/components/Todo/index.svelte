<script lang="ts">
  import { todoStore, actions } from "./Todo";
  import TodoGroups from "./TodoGroups.svelte";
  import TodoList from "./TodoList.svelte";

  actions.persistData();

  let showSidebar = true;

  const toggleSidebar = (event: KeyboardEvent) => {
    if (event.key == "b" && event.ctrlKey) {
      showSidebar = !showSidebar;
    }
  };
</script>

<svelte:window on:keyup={toggleSidebar} />

<div class="wrapper" class:showSidebar={showSidebar} >  
  <TodoGroups bind:showSidebar={showSidebar} />
  {#if $todoStore.activeTodoGroup?.id}
    <TodoList />
  {/if}
</div>

<style>
  .wrapper {    
    width: 100%;
    padding-left: 0px;
    transition: padding-left 0.5s;
  }
  
  .wrapper.showSidebar {
    padding-left: 300px;
  }
</style>
