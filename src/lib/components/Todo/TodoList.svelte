<script lang="ts">
  import TodoItem from "./TodoItem.svelte";
  import Dialog from "../Dialog.svelte";
  import type { TodoItem as TodoType } from "./Types";
  import { actions } from "./Todo";
  import { todoStore } from "./TodoStore";
  import ToolTip from "../ToolTip/ToolTip.svelte";
  import { Positions } from "../ToolTip/ToolTip";
  import DropZone from "../Drop/DropZone.svelte";
  import DragItem from "../Drop/DragItem.svelte";
  import { fly } from "svelte/transition";

  let totalTodos = 0;
  let showModal = false;
  let todoToEdit = {} as TodoType;

  const addTodo = (event: KeyboardEvent) => {
    const input = event.target as HTMLInputElement;
    if (event.key === "Enter" && input.value.trim() !== "") {
      actions.addTodo(input.value.trim());
      input.value = "";
    }
  };

  const showModalEdit = (todo: TodoType) => {
    todoToEdit = todo;
    showModal = true;
  };

  const closeModalEdit = () => {
    todoToEdit = {} as TodoType;
    showModal = false;
  };

  $: {
    totalTodos = $todoStore.activeTodoGroup.todos.length;
    actions.updateTodo(todoToEdit);
  }
</script>

<div>
  <section class="wrapper-todos overflow-auto h-screen">
    <div class="p-2 mt-3">
      <div class="actions">
        <ToolTip position={Positions.BottomRight} class="flex-1">
          <input
            type="text"
            name="todo"
            placeholder="What needs to be done?"
            on:keyup={addTodo}
            class="w-full text-slate-100"
          />
          <span slot="toolTipText">
            Type and press <kbd>Enter</kbd> to create new item
          </span>
        </ToolTip>
      </div>
    </div>

    <h3 class="text-slate-50 p-2 m-2 rounded-md text-center bg-yellow-700 mb-4">
      {$todoStore.activeTodoGroup.name}
    </h3>

    <div class="todo-container p-2">
      <DropZone
        class="todo-list flex flex-col gap-2"
        on:drop={() => actions.dropTodo()}
      >
        {#each [...$todoStore.activeTodoGroup.todos].reverse() as todo, i (todo.id)}
          <DragItem
            on:dragstart={(event) => actions.dragStart(todo.id)}
            on:dragover={(event) => actions.dragEnter(todo.id)}
          >
            <div in:fly={{ y: 300 * i, duration: 300 }}>
              <TodoItem
                {todo}
                on:remove={() => actions.removeTodo(todo.id)}
                on:edit={(event) => showModalEdit(event.detail)}
                on:update={(event) => actions.updateTodo(event.detail)}
                on:active={() => actions.setActiveTodo(todo)}
                isActive={todo.id === $todoStore.activeTodoItem.id}
              />
            </div>
          </DragItem>
        {/each}
        {#if totalTodos === 0}
          <div class="no-todos text-yellow-700 font-semibold text-center">
            No todos
          </div>
        {/if}
      </DropZone>
    </div>
  </section>  
</div>

<Dialog bind:show={showModal}>
  <div class="actions w-96">
    <div class="actions">
      <textarea style="width: 100%;" bind:value={todoToEdit.text} />
    </div>
    <div class="text-center">
      <button type="button" on:click={closeModalEdit}>Close</button>
    </div>
  </div>
</Dialog>
