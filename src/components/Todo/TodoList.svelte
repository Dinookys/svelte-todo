<script lang="ts">
  import TodoItem from "./TodoItem.svelte";
  import BoxConfirmation from "../BoxConfirmation.svelte";
  import { todoStore, actions, type TodoItem as TodoType } from "./Todo";
  import ToolTip from "../ToolTip/ToolTip.svelte";
  import { Positions } from "../ToolTip/ToolTip";

  let totalTodos = 0;
  let totalCompletedTodos = 0;
  let completedPercent = "0%";
  let showModal = false;
  let todoToEdit = {} as TodoType;
  let originalTodoToEdit = {} as TodoType;

  const addTodo = (event: KeyboardEvent) => {
    const input = event.target as HTMLInputElement;
    if (event.key === "Enter" && input.value.trim() !== "") {
      actions.addTodo(input.value.trim());
      input.value = "";
    }
  };

  const showModalEdit = (todo: TodoType) => {
    todoToEdit = todo;
    originalTodoToEdit = JSON.parse(JSON.stringify(todo));
    showModal = true;
  };

  $: {
    totalTodos = $todoStore.activeTodoGroup.todos.length;
    totalCompletedTodos = $todoStore.activeTodoGroup.todos.filter(
      (todo) => todo.completed
    ).length;

    if (todoToEdit != originalTodoToEdit) actions.updateTodo(todoToEdit);
  }
</script>

<section class="wrapper-todos">
  <div>
    <h3 class="color-light">{$todoStore.activeTodoGroup.name}</h3>
    <div class="actions">
      <ToolTip
        position={Positions.BottomRight}
        class="flex-1"
      >
        <input
          type="text"
          name="todo"
          placeholder="What needs to be done?"
          on:keyup={addTodo}
          class="w-full"
        />
        <span slot="toolTipText" >
          Type and press <kbd>Enter</kbd> to create new item
        </span>
      </ToolTip>
      <div class="todo-count">{completedPercent}</div>
    </div>
  </div>
  <div class="todo-container">
    <div class="todo-list">
      {#each $todoStore.activeTodoGroup.todos.sort((a, b) => Number(a.completed) - Number(b.completed)) as todo (todo.id)}
        <TodoItem
          {todo}
          on:remove={() => actions.removeTodo(todo.id)}
          on:edit={(event) => showModalEdit(event.detail)}
          on:update={(event) => actions.updateTodo(event.detail)}
        />
      {/each}
      {#if totalTodos === 0}
        <div class="no-todos">No todos</div>
      {/if}
    </div>
  </div>
</section>

<BoxConfirmation bind:show={showModal}>
  <div style="width: 250px;">
    <p>
      <input style="width: 100%;" type="text" bind:value={todoToEdit.text} />
    </p>
    <div>
      <button
        style="width: 100%; padding: 5px"
        on:click={() => (showModal = false)}
        class="btn-primary">Close</button
      >
    </div>
  </div>
</BoxConfirmation>

<style>
  h3 {
    padding: 0;
    text-transform: uppercase;
    margin: 0 0 10px;
    padding: 5px;
    color: var(--color-gray-7);
    background-color: var(--color-gray-2);
    border-radius: var(--radius-sm);
    font-size: 15px;
    text-align: center;
  }

  .wrapper-todos {
    padding: 10px;
  }

  .todo-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 10px;
  }

  .todo-list {
    width: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .no-todos {
    text-align: center;
    font-style: italic;
    padding: 10px;
  }

  input {
    background-color: var(--color-gray-2);
    border-radius: var(--radius-sm);
    color: var(--color-main);
    padding-inline: 20px;
    padding-block: 10px;
    flex: 1 0 auto;
    outline: none;
    border: 0;
  }

  input:focus {
    color: var(--color-gray-7);
  }

  input::placeholder {
    color: inherit;
  }

  .actions {
    gap: 2px;
    align-items: normal;
  }

  .todo-count {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    padding: 1px 5px;
    border-radius: var(--radius-sm);
    background-color: var(--color-gray-2);
  }
</style>
