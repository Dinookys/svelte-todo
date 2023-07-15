<script lang="ts">
  import { todoStore, actions } from "./Todo";
  import TodoGroup from "./TodoGroup.svelte";
  import BoxConfirmation from "./../BoxConfirmation.svelte";
  
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

<aside class="wrapper-groups">
  <div class="actions">
    <input
      type="text"
      name="todo"
      placeholder="+ New Todo List"
      on:keyup={addTodoGroup}
    />
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
        class="btn-primary"
        on:click={() => confirmRemoveItem(removeGroupId)}>Confirm</button
      >
    </div>
  </BoxConfirmation>
</aside>

<style>
  .wrapper-groups {
    background-color: var(--color-bg-gray-2);
    height: 100vh;
    padding: 1rem;
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
</style>
