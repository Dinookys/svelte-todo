import { writable } from 'svelte/store'
import type { TodoGroupItem, TodoItem, TodoState } from './Types';
import { onMount } from 'svelte';

export const todoStore = writable<TodoState>({
    todoGroups: [],
    activeTodoGroup: { id: 0, name: "", todos: [] } as TodoGroupItem,
    activeIDTodoGroup: 0,
    activeTodoItem: {} as TodoItem
});

export const persistLocalData = () => {
    onMount(() => {
        if (localStorage?.todoStore) {
            todoStore.set(JSON.parse(localStorage.todoStore));
        }

        todoStore.subscribe((state) => {
            localStorage.setItem("todoStore", JSON.stringify(state));
        })
    })
}