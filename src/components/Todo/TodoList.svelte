<script lang="ts">
  import TodoItem from "./TodoItem.svelte";
  import BoxConfirmation from "../BoxConfirmation.svelte";
  import { todoStore, actions, type TodoItem as TodoType } from "./Todo";
  import ToolTip from "../ToolTip/ToolTip.svelte";
  import { Positions } from "../ToolTip/ToolTip";
  import DropZone from "../Drop/DropZone.svelte";
  import DragItem from "../Drop/DragItem.svelte";

  let totalTodos = 0;
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
    if (todoToEdit != originalTodoToEdit) actions.updateTodo(todoToEdit);
  }
</script>

<section class="wrapper-todos">
  <h3 class="text-slate-50 p-2 text-center bg-gray-600 mb-4">
    {$todoStore.activeTodoGroup.name}
  </h3>
  <div class="p-2">
    <div class="actions">
      <ToolTip position={Positions.BottomRight} class="flex-1">
        <input
          type="text"
          name="todo"
          placeholder="What needs to be done?"
          on:keyup={addTodo}
          class="w-full"
        />
        <span slot="toolTipText">
          Type and press <kbd>Enter</kbd> to create new item
        </span>
      </ToolTip>
    </div>
  </div>
  <div class="todo-container p-2">
    <DropZone
      class="todo-list flex flex-col gap-2 pt-5"
      on:drop={() => actions.dropTodo()}
    >
      {#each $todoStore.activeTodoGroup.todos as todo (todo.id)}
        <DragItem
          on:dragstart={(event) => actions.dragStartTodo(todo)}
          on:dragover={(event) => actions.dragEnterTodo(todo.id)}          
          class="border-2 border-transparent rounded-md"
        >
          <TodoItem
            {todo}
            on:remove={() => actions.removeTodo(todo.id)}
            on:edit={(event) => showModalEdit(event.detail)}
            on:update={(event) => actions.updateTodo(event.detail)}
          />
        </DragItem>
      {/each}
      {#if totalTodos === 0}
        <div class="no-todos text-sky-700 font-semibold text-center">
          No todos
        </div>
      {/if}
    </DropZone>
  </div>
</section>

<BoxConfirmation bind:show={showModal}>
  <div style="min-width: 250px;">
    <p class="actions">
      <textarea style="width: 100%;" bind:value={todoToEdit.text} />
    </p>
    <div class="text-center">
      <button
        class="text-gray-500 hover:text-gray-400 text-xs"
        on:click={() => (showModal = false)}>Close</button
      >
    </div>
  </div>
</BoxConfirmation>
