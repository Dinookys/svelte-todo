<script>
  import Todo from "../components/Todo/index.svelte";
</script>

<svelte:head>
  <title>Todo List</title>
  <meta name="description" content="Todo List" />
</svelte:head>

<section class="flex flex-col items-center flex-1 bg-gray-700">
  <Todo />
</section>
