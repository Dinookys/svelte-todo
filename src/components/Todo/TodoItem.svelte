<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { TodoItemSubItem, TodoItem as TodoType } from "./Todo";

  export let todo = {
    text: "",
    completed: false,
    items: [] as TodoItemSubItem[],
  } as TodoType;

  const dispatch = createEventDispatcher();

  const formatDate = (date: number) => {
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

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

    dispatch("update", todo);
  };

  const removeTask = (id: number) => {
    todo.items = todo.items.filter((item) => item.id !== id);
    dispatch("update", todo);
  };

  const updateTask = (task: TodoItemSubItem) => {
    todo.items = todo.items.map((item) => (item.id === task.id ? task : item));
    dispatch("update", todo);
  };

  let isCompleted = todo.completed;
  let showTasks = false;

  $: if (isCompleted != todo.completed) {
    dispatch("update", {
      ...todo,
      completed: isCompleted,
    });
  }
</script>

<div
  class="todo-item text-xs flex items-center bg-gray-600 rounded-md text-slate-50"
  class:completed={isCompleted}
>
  <button
    on:click|preventDefault={() => (isCompleted = !isCompleted)}
    class="rounded-full border border-sky-700 w-6 h-6 ml-3 {isCompleted &&
      'bg-sky-700'}"><span /></button
  >

  <div class="todo-text p-3 grow">
    <div>
      <button
        class="text flex items-center {isCompleted && 'line-through'}"
        on:click={() => (showTasks = !showTasks)}
        >{todo.text}
        <span class="bg-sky-700 text-white font-mono rounded-md pt-1 w-6 h-6 ml-2 text-xl" >
          {#if showTasks}&#708; {:else} &#709; {/if}
        </span>
      </button>
    </div>
    <div class="tasks my-2">
      {#if showTasks}
        {#if todo.items?.length}
          <ul class="bg-gray-700 rounded-md p-2 max-h-80 overflow-y-scroll">
            {#each todo.items as item (item.id)}
              <li class="flex justify-between p-2">
                <button
                  class="task-text {item.completed &&
                    'line-through text-gray-600'} "
                  on:click|preventDefault={(event) =>
                    updateTask({ ...item, completed: !item.completed })}
                  >{item.text}</button
                >
                <button
                  class="hover:text-red-500"
                  on:click|preventDefault={() => removeTask(item.id)}
                  >&times</button
                >
              </li>
            {/each}
          </ul>
        {/if}
        {#if !todo.completed}
          <div class="add-task actions mt-2">
            <input
              type="text"
              class="w-full"
              placeholder="+ Add step"
              on:keyup={addTask}
            />
          </div>
        {/if}
      {/if}
    </div>
    <div class="date">
      <span>Criado: {formatDate(todo.createdAt || 0)}</span> |
      <span>Atualizado: {formatDate(todo.updatedAt || 0)}</span>
    </div>
  </div>

  <div class="flex items-center h-full space-x-5 pr-5">
    <span
      >({todo.items?.filter((task) => task.completed).length || 0}/{todo.items
        ?.length || 0})</span
    >
    {#if !isCompleted}
      <button on:click={() => dispatch("edit", todo)} class="todo-edit"
        >Edit</button
      >
    {/if}
    <button
      class="text-white hover:text-red-600"
      on:click={() => dispatch("remove", todo.id)}>&times;</button
    >
  </div>
</div>
