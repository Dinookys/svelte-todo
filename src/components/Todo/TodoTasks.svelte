<script lang="ts">
  import DragItem from "../Drop/DragItem.svelte";
  import DropZone from "../Drop/DropZone.svelte";
  import { fly } from "svelte/transition";

  import {
    todoStore,
    actions,
    type TodoItemSubItem,
    type TodoItem,
  } from "./Todo";

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
</script>

<div
  class="wrapper-tasks bg-slate-800 flex flex-col overflow-auto h-screen sticky top-0 text-white"
>
  <div class="tasks p-3">
    {#if todo}
      <div class="actions mb-4">
        <input
          type="text"
          class="w-full"
          placeholder="+ Add step"
          on:keyup={addTask}
        />
      </div>
    {/if}
    {#if todo?.text}
      <div class="bg-yellow-700 rounded-md p-2 text-md text-center mb-4">
        {todo.text.length > 40 ? todo?.text?.slice(0, 40) + "..." : todo.text}
      </div>
    {/if}
    {#if todo && todo?.items?.length}
      <ul>
        <DropZone on:drop={() => onDrop()}>
          {#each todo.items as item, i (item.id)}
            <DragItem
              on:dragstart={() => onDragStart(item)}
              on:dragover={() => onDragOver(item.id)}
            >
              <li class="flex justify-between p-2 bg-slate-700 rounded-md my-1" in:fly={{ y: 300, delay: i * 100 }} >
                <button
                  class="task-text text-white {item.completed &&
                    'line-through text-slate-600'} "
                  on:click|preventDefault={(event) =>
                    updateTask({ ...item, completed: !item.completed })}
                  >{item.text}</button
                >
                <button
                  class="hover:text-red-500 text-white"
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
