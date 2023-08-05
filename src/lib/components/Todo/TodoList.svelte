<script lang="ts">
  import TodoItem from "./TodoItem.svelte";
  import Dialog from "../Dialog.svelte";
  import type { TodoItem as TodoType } from "./Types";
  import { actions } from "./Todo";
  import { todoStore } from "./TodoStore";
  import { fade, fly } from "svelte/transition";
  import { dragItem, dropZone } from "../../actions/dragDrop";
  import FaSearch from "svelte-icons/fa/FaSearch.svelte";
  import FaPlus from "svelte-icons/fa/FaPlusCircle.svelte";
  import autoRow from "$lib/actions/autoRow";

  let totalTodos = 0;
  let showModal = false;
  let showModalAdd = false;
  let todoToEdit = {} as TodoType;
  let expanded = true;
  let filterTodo = "";
  let inputAdd = "";

  const addTodo = () => {
    actions.addTodo(inputAdd.trim());
    inputAdd = "";
    showModalAdd = false;
  };

  const showModalEdit = (todo: TodoType) => {
    showModal = !showModal;
    todoToEdit = todo;
  };

  $: {
    totalTodos = $todoStore.activeTodoGroup.todos.length;
    actions.updateTodo(todoToEdit);
  }
</script>

<div>
  <section class="wrapper-todos overflow-auto h-screen px-4 py-2">
    <div class="my-3 sticky top-0 z-40">
      <div class="actions flex gap-4 items-center">
        <button
          class="w-7 h-7 text-primary-600 flex items-center justify-center"
          type="button"
          on:click={() => (showModalAdd = true)}
        >
          <FaPlus />
        </button>
        <div class="grow">
          <input
            type="text"
            placeholder="Search"
            bind:value={filterTodo}
            class="text-slate-100 w-full"
            on:focus={() => (expanded = false)}
          />
          <span
            class="text-primary-400 w-4 h-4 inline-block absolute top-2/4 -translate-y-2/4 right-4"
          >
            <FaSearch />
          </span>
        </div>
      </div>
    </div>

    <div
      class="border-b-primary-600 border-b overflow-hidden relative font-bold h-12 my-4 mb-4 flex items-center tracking-widest uppercase"
    >
      {#key $todoStore.activeTodoGroup.id}
        <h3
          class="text-primary-600 absolute"
          in:fly={{ x: -200, delay: 400, duration: 100 }}
          out:fly={{ x: -200, duration: 300 }}
        >
          {$todoStore.activeTodoGroup.name}
        </h3>
      {/key}
    </div>

    <div class="todo-container">
      <div
        use:dropZone
        class="todo-list flex flex-col gap-4"
        on:drop={() => actions.dropTodo()}
      >
        {#each $todoStore.activeTodoGroup.todos
          .filter((todo) => todo.text.toLocaleLowerCase().includes(filterTodo))
          .reverse() as todo, i (todo.id)}
          <div
            use:dragItem
            on:dragstart={(event) => actions.dragStart(todo.id)}
            on:dragover={(event) => actions.dragEnter(todo.id)}
          >
            <div
              in:fade={{ delay: 50 * (i + 1), duration: 300 }}
              out:fade={{ duration: 0 }}
            >
              <TodoItem
                {todo}
                on:edit={() => showModalEdit(todo)}
                on:active={() => actions.setActiveTodo(todo)}
                isActive={todo.id === $todoStore.activeTodoItem.id}
              />
            </div>
          </div>
        {/each}
        {#if totalTodos === 0}
          <div class="no-todos text-primary-600 font-semibold text-center">
            No todos
          </div>
        {/if}
      </div>
    </div>
  </section>
</div>

<Dialog show={showModal} on:afterClose={() => (showModal = false)} class="max-w-3xl w-screen">
  <div class="actions w-full">
    <div class="text-center mb-4">Todo Edit</div>
    <div class="actions">
      <textarea style="width: 100%;" bind:value={todoToEdit.text} use:autoRow />
    </div>
  </div>
</Dialog>

<Dialog show={showModalAdd} on:afterClose={() => (showModalAdd = false)} class="max-w-3xl w-screen">
  <div class="actions w-full">
    <div class="text-center mb-4">Todo</div>
    <div class="actions">
      <textarea        
        style="width: 100%;"
        placeholder="What needs to be done?"
        bind:value={inputAdd}
        use:autoRow
      />
    </div>
    <div class="text-right pt-4">
      <button
        on:click={addTodo}
        class="border border-primary-600 text-primary-600 rounded-md p-2"
      >
        <span class="w-3 h-3 inline-block"><FaPlus /></span> Add
      </button>
    </div>
  </div>
</Dialog>
