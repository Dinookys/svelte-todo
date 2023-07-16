import { onMount } from "svelte";
import { writable } from "svelte/store";

export type TodoItemSubItem = { id: number; text: string; completed: boolean; createdAt?: number; updatedAt?: number };
export type TodoItem = { id: number; text: string; completed: boolean; createdAt?: number; updatedAt?: number, items: TodoItemSubItem[] };
export type TodoGroupItem = { id: number; name: string; todos: TodoItem[] }
export type TodoState = {
    todoGroups: TodoGroupItem[];
    activeTodoGroup: TodoGroupItem;
    activeIDTodoGroup: number;
}

export const todoStore = writable<TodoState>({
    todoGroups: [],
    activeTodoGroup: { id: 0, name: "", todos: [] } as TodoGroupItem,
    activeIDTodoGroup: 0,
});

export const actions = {
    addTodo: (text: string) => {
        todoStore.update((store) => {
            const createdAt = Date.now();
            const updatedAt = Date.now();
            store.activeTodoGroup.todos.push({ id: Date.now(), text, completed: false, items: [], createdAt, updatedAt });
            return store;
        });
    },
    updateTodo: (item: TodoItem) => {
        todoStore.update((store) => {
            store.activeTodoGroup.todos = store.activeTodoGroup.todos.map((todo) => {
                if (todo.id === item.id) {
                    return {
                        ...todo,
                        ...item,
                        updatedAt: Date.now(),
                    };
                }
                return todo;
            });
            return store;
        })
    },
    removeTodo: (id: number) => {
        todoStore.update((store) => {
            store.activeTodoGroup.todos = store.activeTodoGroup.todos.filter((todo) => todo.id !== id);
            return store;
        });
    },
    addTodoGroup: (name: string) => {
        todoStore.update((store) => {
            const newTodoGroup = { id: Date.now(), name, todos: [] };
            store.todoGroups.push(newTodoGroup);
            actions.setActiveTodoGroup(newTodoGroup.id);
            return store;
        });
    },
    removeTodoGroup: (id: number) => {
        todoStore.update((store) => {
            store.todoGroups = store.todoGroups.filter((todo) => todo.id !== id);

            if (store.activeIDTodoGroup === id) {
                store.activeTodoGroup = { id: 0, name: "", todos: [] } as TodoGroupItem;
                store.activeIDTodoGroup = 0;
            }

            return store;
        });
    },
    setActiveTodoGroup: (id: number) => {
        todoStore.update((store) => {
            store.todoGroups = store.todoGroups.map((todoGroup) => {
                if (todoGroup.id === store.activeTodoGroup.id) {
                    return { ...todoGroup, ...store.activeTodoGroup };
                }
                return todoGroup;
            })

            const todoGroup = store.todoGroups.find((todoGroup) => todoGroup.id === id);

            if (todoGroup) {
                store.activeTodoGroup = todoGroup;
                store.activeIDTodoGroup = id;
            }

            return store;
        });
    },

    persistData: () => {
        onMount(() => {
            if (localStorage?.todoStore) {
                const store = JSON.parse(localStorage?.todoStore);
                todoStore.set({ ...store });
            }

            todoStore.subscribe((store) => {
                localStorage.setItem("todoStore", JSON.stringify(store));
            })
        })
    }
}