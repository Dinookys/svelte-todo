<script lang="ts">
  import { actions } from "./Todo";
  import { todoStore } from "./TodoStore";
  import type { TodoGroupItem } from "./Types";
  import { Positions } from "../ToolTip/ToolTip";

  import TodoGroup from "./TodoGroup.svelte";
  import Dialog from "../Dialog.svelte";
  import ToolTip from "../ToolTip/ToolTip.svelte";  
  import { dragItem, dropZone } from "../../actions/dragDrop";

  //ICONS
  import ChevronLeft from "svelte-icons/fa/FaChevronLeft.svelte";
  import ChevronRight from "svelte-icons/fa/FaChevronRight.svelte";

  export let showSidebar = true;

  let confirmRemove = false;
  let removeGroupId = 0;
  let showEdit = false;
  let editTodoGroup = {} as TodoGroupItem;
  let orignalTodo = {} as TodoGroupItem;

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
    closeDialog();
  };

  const showDialog = (index: number) => {
    removeGroupId = index;
    confirmRemove = true;
  };

  const closeDialog = () => {
    confirmRemove = false;
    removeGroupId = 0;
  };

  const showModalEdit = async (todoGroup: TodoGroupItem) => {
    showEdit = !showEdit;

    if (!showEdit) {
      return;
    }

    if (showEdit) {
      editTodoGroup = todoGroup;
      orignalTodo = JSON.parse(JSON.stringify(todoGroup));
    }
  };

  const closeModalEdit = () => {
    editTodoGroup = {} as TodoGroupItem;
    showEdit = false;
  };

  $: actions.updateTodoGroup(editTodoGroup);
</script>

<aside
  class="wrapper-groups bg-slate-800 flex flex-col overflow-auto p-4"
  class:showSidebar
>
  <div class="actions mb-6">
    <input
      type="text"
      name="todo"
      placeholder="+ New Group Todo"
      class="text-slate-100"
      on:keyup={addTodoGroup}
    />
  </div>
  <div class="todo-container">
    <div use:dropZone on:drop={() => actions.dropTodoGroup()}>
      <nav class="todo-list flex flex-col gap-2">
        {#each [...$todoStore.todoGroups].reverse() as todoGroup (todoGroup.id)}
          <div
            use:dragItem
            on:dragstart={(event) => actions.dragStart(todoGroup.id)}
            on:dragover={(event) => actions.dragEnter(todoGroup.id)}
          >
            <TodoGroup
              {todoGroup}
              isActive={$todoStore.activeIDTodoGroup === todoGroup.id}
              on:active={() => active(todoGroup.id)}
              on:remove={() => showDialog(todoGroup.id)}
              on:edit={(event) => showModalEdit(event.detail)}
            />
          </div>
        {/each}
      </nav>
    </div>
  </div>
  <div class="todo-key" class:hiddenSidebar={!showSidebar}>
    <ToolTip position={Positions.TopLeft}>
      <div slot="toolTipText">
        <kbd>Crtl+b</kbd> to show/hide sidebar
      </div>
      <button
        class="bg-primary-600 text-white flex justify-center items-center rounded-full w-8 h-8 p-2 font-mono"
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

<Dialog show={confirmRemove}>
  <div>Are you sure you want to delete this todo group?</div>
  <div class="flex justify-between mt-3 pt-3 border-t border-t-slate-800">
    <button
      class="text-slate-400 hover:text-slate-300 text-xs"
      type="button"
      on:click={() => closeDialog()}>Cancel</button
    >
    <button
      type="button"
      class="text-red-500 hover:text-red-400 text-xs"
      on:click={() => confirmRemoveItem(removeGroupId)}>Confirm</button
    >
  </div>
</Dialog>

<Dialog show={showEdit} on:afterClose={() => (showEdit = false)}>
  <div class="actions w-96">
    <textarea bind:value={editTodoGroup.name} />
  </div>
  <div class="text-center">
    <button type="button" on:click={closeModalEdit}>Close</button>
  </div>
</Dialog>

<style>
  .wrapper-groups {
    width: var(--sidebarWidth);
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
    width: auto;
  }
</style>
