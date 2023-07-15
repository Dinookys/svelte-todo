<script>
  import Todo from "../components/Todo/index.svelte";
</script>

<svelte:head>
	<title>Todo List</title>
	<meta name="description" content="Todo List" />
</svelte:head>

<section>
	<Todo />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1 0 auto;
	}
</style>
