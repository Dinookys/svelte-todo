<script lang="ts">
  import { todoStore, actions } from "./Todo";
  import TodoGroup from "./TodoGroup.svelte";
  import BoxConfirmation from "./../BoxConfirmation.svelte";
  import ToolTip from "../ToolTip/ToolTip.svelte";
  import { Positions } from "../ToolTip/ToolTip";

  //ICONS
  import ChevronLeft from "svelte-icons/fa/FaChevronLeft.svelte";
  import ChevronRight from "svelte-icons/fa/FaChevronRight.svelte";

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

<aside
  class="wrapper-groups bg-gray-800 flex flex-col overflow-auto"
  class:showSidebar
>
  <div class="actions mb-6">
    <ToolTip
      class="flex-1"
      toolTipWidth="300px"
      position={Positions.CenterRight}
    >
      <input
        type="text"
        name="todo"
        placeholder="+ New Group Todo"
        class="text-gray-100"
        on:keyup={addTodoGroup}
      />
      <span slot="toolTipText">
        Type and press <kbd>Enter</kbd> to create new group
      </span>
    </ToolTip>
  </div>
  <div class="todo-container">
    <nav class="todo-list flex flex-col gap-4">
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
    <div class="flex justify-between mt-3 pt-3 border-t border-t-gray-800">
      <button
        class="text-gray-500 hover:text-gray-400 text-xs"
        type="button"
        on:click={() => closeBoxConfirmation()}>Cancel</button
      >
      <button
        type="button"
        class="text-red-600 hover:text-red-500 text-xs"
        on:click={() => confirmRemoveItem(removeGroupId)}>Confirm</button
      >
    </div>
  </BoxConfirmation>
  <div class="todo-key" class:hiddenSidebar={!showSidebar}>
    <ToolTip position={Positions.TopLeft}>
      <div slot="toolTipText">
        <kbd>Crtl+b</kbd> to show/hide sidebar
      </div>
      <button
        class="bg-sky-700 text-white flex justify-center items-center rounded-full w-8 h-8 p-2 font-mono"
        on:click={() => (showSidebar = !showSidebar)}
      >
        {#if showSidebar}
          <ChevronLeft />
        {:else}
          <ChevronRight />
        {/if}
      </button>
    </ToolTip>
  </div>
</aside>

<style>
  .wrapper-groups {
    width: var(--sidebarWidth);
    padding: 1rem;
    left: calc(var(--sidebarWidth) * -1);
    position: fixed;
    transition: left 0.5s;
    top: 0;
    bottom: 0;
  }

  .wrapper-groups.showSidebar {
    left: 0px;
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
