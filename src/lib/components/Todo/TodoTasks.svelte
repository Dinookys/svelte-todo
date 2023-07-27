<script lang="ts">
  import DragItem from "../Drop/DragItem.svelte";
  import DropZone from "../Drop/DropZone.svelte";
  import { fly } from "svelte/transition";

  import type { TodoItemSubItem, TodoItem } from "./Types";
  import { actions } from "./Todo";
  import { todoStore } from "./TodoStore";

  let todo = {} as TodoItem;
  let draggableItem = {} as TodoItemSubItem;
  let dropTargetId = 0;

  const addTask = (event: KeyboardEvent) => {
    const input = event.target as HTMLInputElement;

    if (event.key !== "Enter") return;

    todo.items.push({
      text: input.value,
      completed: false,
      id: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as TodoItemSubItem);

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

  $: todo = $todoStore.activeTodoItem;

  $: shortedTitle =
    todo.text?.length > 50 ? `${todo.text.slice(0, 50)}...` : todo.text;
</script>

<div
  class="wrapper-tasks bg-slate-800 flex flex-col overflow-auto h-screen sticky top-0 text-white"
>
  <div class="tasks p-3">
    {#if todo}
      <div class="actions mb-4 pt-2">
        <input
          type="text"
          class="w-full"
          placeholder="+ Add step"
          on:keyup={addTask}
        />
      </div>
    {/if}
    {#if todo?.text}
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
    {/if}
    {#if todo && todo?.items?.length}
      <ul>
        <DropZone on:drop={() => onDrop()}>
          {#each [...todo.items].reverse() as item, i (item.id)}
            <DragItem
              on:dragstart={() => onDragStart(item)}
              on:dragover={() => onDragOver(item.id)}
            >
              <li
                class="flex justify-between p-2 bg-slate-600 rounded-md my-1"
                in:fly={{ y: 300, delay: i * 100 }}
              >
                <button
                  class="task-text text-white {item.completed &&
                    'line-through text-slate-500'} "
                  on:click|preventDefault={(event) =>
                    updateTask({ ...item, completed: !item.completed })}
                  >{item.text}</button
                >
                <button
                  class="hover:text-red-400 text-white"
                  on:click|preventDefault={() => removeTask(item.id)}
                  >&times</button
                >
              </li>
            </DragItem>
          {/each}
        </DropZone>
      </ul>
    {/if}
  </div>
</div>
