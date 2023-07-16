<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { TodoItemSubItem, TodoItem as TodoType } from "./Todo";
  import TodoSubItem from "./TodoSubItem.svelte";

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

<div class="todo-item" class:completed={isCompleted}>
  <div>
    <a
      href="//#"
      on:click|preventDefault={() => (isCompleted = !isCompleted)}
      class="todo-check"
    >
      <span />
    </a>
    <div class="todo-text">
      <div class="text">{todo.text}</div>
      <div class="tasks">
        {#if showTasks}
          {#if todo.items?.length}
            <ul>
              {#each todo.items as item (item.id)}
                <li>
                  <div>
                    <TodoSubItem
                      {item}
                      on:completed={(event) => updateTask(event.detail)}
                    />
                  </div>
                  <button on:click={() => removeTask(item.id)}>&times</button>
                </li>
              {/each}
            </ul>
          {/if}
          {#if !todo.completed}
            <div class="add-task actions">
              <input type="text" placeholder="Add task..." on:keyup={addTask} />
            </div>
          {/if}
        {/if}
      </div>
      <div class="date">
        <span>Criado: {formatDate(todo.createdAt || 0)}</span> |
        <span>Atualizado: {formatDate(todo.updatedAt || 0)}</span>
      </div>
    </div>
  </div>
  <button on:click={() => (showTasks = !showTasks)} class="todo-edit"
    >Tasks ({todo.items?.length || 0})</button
  >
  {#if !isCompleted}
    <button on:click={() => dispatch("edit", todo)} class="todo-edit"
      >Edit</button
    >
  {/if}
  <button on:click={() => dispatch("remove", todo.id)}>&times;</button>
</div>

<style>
  .todo-item {
    background-color: var(--color-gray-3);
    border-radius: 5px;
    min-height: 50px;
    display: flex;
    align-items: center;
  }

  .todo-item > div {
    display: flex;
    flex-grow: 1;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  .todo-item .todo-text {
    background-color: transparent;
    color: var(--color-gray-6);
    font-size: inherit;
    border: none;
    width: 100%;
    padding: 0;
    flex: 1;
  }

  .todo-item .date {
    font-size: 11px;
    margin-top: 10px;
  }

  .todo-item.completed {
    background-color: var(--color-gray-4);
  }

  .todo-item.todo-item.completed {
    color: var(--color-gray-6);
  }

  .todo-item.todo-item.completed .todo-text > .text {
    text-decoration: line-through;
    font-style: italic;
  }

  .todo-item .todo-text {
    display: flex;
    padding: 10px;
    flex: 1 0 0;
    flex-direction: column;
  }

  .todo-item .todo-check {
    align-items: center;
    display: flex;
    padding: 10px;
  }

  .todo-item .tasks ul {
    background-color: var(--color-gray-2);
    color: var(--color-main);
    border-radius: var(--radius-sm);
    font-size: 13px;
    list-style: none;
    padding: 5px;
  }

  .todo-item .tasks ul li {
    display: flex;
    gap: 10px;
    padding: 4px;
    align-items: center;
  }

  .todo-item .tasks ul li div {
    flex: 1;
  }

  .todo-item .tasks ul li:nth-child(2n) {
    background-color: var(--color-gray-4);
    border-radius: var(--radius-sm);
  }

  .todo-item .add-task {
    display: flex;
    padding: 2px;
    gap: 5px;
    margin-top: 10px;
  }

  .todo-item.todo-item .todo-check span {
    background-color: var(--color-gray-3);
    border: 1px solid var(--color-main);
    display: inline-block;
    border-radius: 999px;
    height: 20px;
    width: 20px;
  }

  .todo-item.todo-item.completed .todo-check span {
    background-color: var(--color-main);
  }

  .todo-item > button,
  .todo-item .tasks ul li button:last-child {
    background: transparent;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 10px;
    color: white;
    border: 0;
  }

  .todo-item > button:last-child {
    border-bottom-right-radius: var(--radius-sm);
    border-top-right-radius: var(--radius-sm);
  }

  button.todo-edit {
    font-size: 12px;
    color: white;
  }

  button.todo-edit:hover {
    background-color: var(--color-main);
  }
</style>
