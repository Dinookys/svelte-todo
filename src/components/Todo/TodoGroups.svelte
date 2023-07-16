<script lang="ts">
  import { todoStore, actions } from "./Todo";
  import TodoGroup from "./TodoGroup.svelte";
  import BoxConfirmation from "./../BoxConfirmation.svelte";
  import ToolTip from "../ToolTip/ToolTip.svelte";
  import { Positions } from "../ToolTip/ToolTip";

  export let showSidebar = true;

  let confirmRemove = false;
  let removeGroupId = 0;

  const addTodoGroup = (event: KeyboardEvent) => {
    const input = event.target as HTMLInputElement;
    if (event.key === "Enter" && input.value.trim() !== "") {
      actions.addTodoGroup(input.value.trim());
      input.value = "";
    }
  };

  const active = (index: number) => {
    actions.setActiveTodoGroup(index);
  };

  const confirmRemoveItem = (index: number) => {
    actions.removeTodoGroup(index);
    closeBoxConfirmation();
  };

  const showBoxConfirmation = (index: number) => {
    removeGroupId = index;
    confirmRemove = true;
  };

  const closeBoxConfirmation = () => {
    confirmRemove = false;
    removeGroupId = 0;
  };
</script>

<aside class="wrapper-groups" class:showSidebar>
  <div class="actions">
    <ToolTip      
      class="flex-1"      
      toolTipWidth="300px"
      position={Positions.CenterRight}
    >
      <input
        type="text"
        name="todo"
        placeholder="+ New Group Todo"
        on:keyup={addTodoGroup}
        class="w-full"
      />
      <span slot="toolTipText" >
        Type and press <kbd>Enter</kbd> to create new group
      </span>
    </ToolTip>
  </div>
  <div class="todo-container">
    <nav class="todo-list">
      {#each $todoStore.todoGroups as todoGroup (todoGroup.id)}
        <TodoGroup
          {todoGroup}
          isActive={$todoStore.activeIDTodoGroup === todoGroup.id}
          on:active={() => active(todoGroup.id)}
          on:remove={() => showBoxConfirmation(todoGroup.id)}
        />
      {/each}
    </nav>
  </div>
  <BoxConfirmation show={confirmRemove}>
    <div>Are you sure you want to delete this todo group?</div>
    <div class="BoxConfirmation-actions">
      <button
        class="btn-light"
        type="button"
        on:click={() => closeBoxConfirmation()}>Cancel</button
      >
      <button
        type="button"
        class="btn-red"
        on:click={() => confirmRemoveItem(removeGroupId)}>Confirm</button
      >
    </div>
  </BoxConfirmation>
  <div class="todo-key" class:hiddenSidebar={!showSidebar} >
    <ToolTip position={Positions.TopLeft}>      
      <div slot="toolTipText">
        <kbd>Crtl+b</kbd> to show/hide sidebar
      </div>
      <button class="btn-primary" on:click={() => (showSidebar = !showSidebar)}>
        {#if showSidebar}
          <span>&leftarrow;</span>
        {:else}
          <span>&rightarrow;</span>
        {/if}
      </button>
    </ToolTip>
  </div>
</aside>

<style>
  .wrapper-groups {
    background-color: var(--color-gray-2);
    height: 100vh;
    width: var(--sidebarWidth);
    padding: 1rem;
    left: -300px;
    position: absolute;
    transition: left 0.5s;
    display: flex;
    flex-direction: column;
  }

  .wrapper-groups.showSidebar {
    left: 0px;
  }

  .wrapper-groups .todo-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .BoxConfirmation-actions {
    display: flex;
    justify-content: space-between;
    margin: 10px 0 0 0;
  }

  .todo-key {
    margin-top: auto;
    display: block;
    width: 100%;
    padding: 2px;
    position: fixed;
    left: 5px;    
    bottom: 5px;
  }
</style>
