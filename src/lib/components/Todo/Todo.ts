import { todoStore } from "./TodoStore";
import type { TodoGroupItem, TodoItem } from "./Types";


export const actions = {
    draggableItemId: 0,
    dropTargetId: 0,
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
                        updatedAt: todo.text !== item.text ? Date.now() : todo.updatedAt,
                    };
                }
                return todo;
            });
            return store;
        })
    },
    updateTodoGroup: (item: TodoGroupItem) => {
        todoStore.update((store) => {
            store.todoGroups = store.todoGroups.map((group) => {
                if (group.id === item.id) {
                    return {
                        ...group,
                        ...item
                    };
                }
                return group;
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
            store.activeTodoItem = {} as TodoItem;
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
            store.activeTodoItem = {} as TodoItem;
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

            store.activeTodoItem = {} as TodoItem;

            return store;
        });
    },
    setActiveTodo: (todo: TodoItem) => {
        todoStore.update((store) => {
            store.activeTodoItem = todo;
            return store;
        });
    },
    dragStart: (id: number) => {
        actions.draggableItemId = id;
    },
    dragEnter: (id: number) => {
        actions.dropTargetId = id;
    },
    dropTodo: () => {
        todoStore.update((store) => {
            const findDragItem = store.activeTodoGroup.todos.find((todo) => todo.id == actions.draggableItemId);
            let filterTodos = store.activeTodoGroup.todos.filter((todo) => todo.id !== actions.draggableItemId);
            const findDropTodoTargetIndex = store.activeTodoGroup.todos.findIndex((todo) => todo.id === actions.dropTargetId);

            if (findDragItem) {
                filterTodos.splice(findDropTodoTargetIndex, 0, findDragItem)
                store.activeTodoGroup.todos = filterTodos
            }
            return store;
        })
    },
    dropTodoGroup: () => {
        todoStore.update((store) => {
            const findDragItem = store.todoGroups.find((todo) => todo.id == actions.draggableItemId);
            let filterTodos = store.todoGroups.filter((todo) => todo.id !== actions.draggableItemId);
            const findDropTodoTargetIndex = store.todoGroups.findIndex((todo) => todo.id === actions.dropTargetId);

            if (findDragItem) {
                filterTodos.splice(findDropTodoTargetIndex, 0, findDragItem)
                store.todoGroups = filterTodos
            }
            return store;
        })
    }
}

export const sanitizeHTML = (html: string) => {

    const regexTextThrough = /\~(.+)\~/g;
    const regexTextItalic = /\_(.+)\_/g;
    const regexTextBold = /\*(.+)\*/g;

    return html.replace(/<\/script>/g, '')
        .replace(/\n/g, '<br/>')
        .replace(regexTextThrough, "<s>$1</s>")
        .replace(regexTextItalic, "<i>$1</i>")
        .replace(regexTextBold, "<b>$1</b>")
}