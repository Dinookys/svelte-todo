<script lang="ts">
  import { fade, fly } from "svelte/transition";

  import type { TodoItemSubItem, TodoItem } from "./Types";
  import { actions, sanitizeHTML } from "./Todo";
  import { todoStore } from "./TodoStore";
  import { dragItem, dropZone } from "../../actions/dragDrop";

  let todo = {} as TodoItem;
  let draggableItem = {} as TodoItemSubItem;
  let dropTargetId = 0;
  let shortedTitle = "";

  const addTask = (event: KeyboardEvent) => {
    const input = event.target as HTMLInputElement;

    if (event.key !== "Enter") return;

    todo = {
      ...todo,
      items: [
        {
          text: input.value,
          completed: false,
          id: Date.now(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...todo.items,
      ],
    };

    input.value = "";

    actions.updateTodo(todo);
  };

  const removeTask = (id: number) => {
    todo.items = todo.items.filter((item) => item.id !== id);
    actions.updateTodo(todo);
  };

  const updateTask = (task: TodoItemSubItem) => {
    todo.items = todo.items.map((item) => (item.id === task.id ? task : item));
    actions.updateTodo(todo);
  };

  const onDragStart = (todoItem: TodoItemSubItem) => {
    draggableItem = todoItem;
  };

  const onDragOver = (id: number) => {
    dropTargetId = id;
  };

  const onDrop = () => {
    let filterTodos = todo.items.filter((todo) => todo.id !== draggableItem.id);
    const findDropTodoTargetIndex = todo.items.findIndex(
      (todo) => todo.id === dropTargetId
    );
    filterTodos.splice(findDropTodoTargetIndex, 0, draggableItem);
    todo.items = filterTodos;

    actions.updateTodo(todo);
  };

  $: if (todo?.id != $todoStore.activeTodoItem?.id) {
    todo = $todoStore.activeTodoItem;
  }

  $: if (todo) {
    shortedTitle =
      todo.text?.length > 50 ? `${todo.text.slice(0, 50)}...` : todo.text;
  }
</script>

{#if todo && todo.items}
  <div
    class="wrapper-tasks bg-slate-800 flex flex-col overflow-auto h-screen sticky top-0 text-white"
  >
    <div class="tasks p-3">
      <div class="actions mb-4 pt-2">
        <input
          type="text"
          class="w-full"
          placeholder="+ Add step"
          on:keyup={addTask}
        />
      </div>
      <div
        class="border-b-primary-600 border-b overflow-x-hidden relative w-full font-bold h-12 my-4 pb-1 flex items-center tracking-widest"
      >
        {#key todo}
          <h3
            class="text-primary-600 text-xs absolute whitespace-nowrap"
            in:fly={{ x: -200, delay: 400, duration: 100 }}
            out:fly={{ x: -200, duration: 300 }}
          >
            {shortedTitle}
          </h3>
        {/key}
      </div>
      <div use:dropZone on:drop={() => onDrop()}>
        {#each todo.items as item, i (item.id)}
          <div
            use:dragItem
            on:dragstart={() => onDragStart(item)}
            on:dragover={() => onDragOver(item.id)}
          >
            <div
              in:fade={{ delay: 50 * (i + 1), duration: 300 }}
              out:fade={{ duration: 0 }}
              class="flex justify-between p-2 bg-slate-600 rounded-md my-2"
            >
              <button
                class="task-text text-white text-left {item.completed &&
                  'line-through text-slate-500'} "
                on:click|preventDefault={(event) =>
                  updateTask({ ...item, completed: !item.completed })}
                >{@html sanitizeHTML(item.text)}</button
              >
              <button
                class="hover:text-red-400 text-white"
                on:click|preventDefault={() => removeTask(item.id)}
                >&times</button
              >
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
