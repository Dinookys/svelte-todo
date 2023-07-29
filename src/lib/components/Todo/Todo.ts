import { todoStore } from "./TodoStore";
import type { TodoGroupItem, TodoItem } from "./Types";

const { update } = todoStore

export const actions = {
    draggableItemId: 0,
    dropTargetId: 0,
    addTodo: (text: string) => {
        update((state) => {
            const createdAt = Date.now();
            const updatedAt = Date.now();
            state.activeTodoGroup.todos.push({ id: Date.now(), text, completed: false, items: [], createdAt, updatedAt });
            return state;
        });
    },
    updateTodo: (item: TodoItem) => {
        update((state) => {
            state.activeTodoGroup.todos = state.activeTodoGroup.todos.map((todo) => {
                if (todo.id !== item.id) return todo;
                return {
                    ...todo,
                    ...item,
                    updatedAt: todo.text !== item.text ? Date.now() : todo.updatedAt,
                };
            });
            return state;
        })
    },
    updateTodoGroup: (item: TodoGroupItem) => {
        update((state) => {
            state.todoGroups = state.todoGroups.map((group) => {
                if (group.id !== item.id) return group

                return {
                    ...group,
                    ...item
                };
            });
            return state;
        })
    },
    removeTodo: (id: number) => {
        update((state) => {
            state.activeTodoGroup.todos = state.activeTodoGroup.todos.filter((todo) => todo.id !== id);
            return state;
        });
    },
    addTodoGroup: (name: string) => {
        update((state) => {
            const newTodoGroup = { id: Date.now(), name, todos: [] };
            state.todoGroups.push(newTodoGroup);
            actions.setActiveTodoGroup(newTodoGroup.id);
            state.activeTodoItem = {} as TodoItem;
            return state;
        });
    },
    removeTodoGroup: (id: number) => {
        update((state) => {
            state.todoGroups = state.todoGroups.filter((todo) => todo.id !== id);

            if (state.activeIDTodoGroup === id) {
                state.activeTodoGroup = { id: 0, name: "", todos: [] } as TodoGroupItem;
                state.activeIDTodoGroup = 0;
            }
            state.activeTodoItem = {} as TodoItem;
            return state;
        });
    },
    setActiveTodoGroup: (id: number) => {
        update((state) => {
            state.todoGroups = state.todoGroups.map((todoGroup) => {
                if (todoGroup.id === state.activeTodoGroup.id) {
                    return { ...todoGroup, ...state.activeTodoGroup };
                }
                return todoGroup;
            })

            const todoGroup = state.todoGroups.find((todoGroup) => todoGroup.id === id);

            if (todoGroup) {
                state.activeTodoGroup = todoGroup;
                state.activeIDTodoGroup = id;
            }

            state.activeTodoItem = {} as TodoItem;
            return state;
        });
    },
    setActiveTodo: (todo: TodoItem) => {
        update((state) => {
            state.activeTodoItem = todo;
            return state;
        });
    },
    dragStart: (id: number) => {
        actions.draggableItemId = id;
    },
    dragEnter: (id: number) => {
        actions.dropTargetId = id;
    },
    dropTodo: () => {
        update((state) => {
            const findDragItem = state.activeTodoGroup.todos.find((todo) => todo.id == actions.draggableItemId);
            let filterTodos = state.activeTodoGroup.todos.filter((todo) => todo.id !== actions.draggableItemId);
            const findDropTodoTargetIndex = state.activeTodoGroup.todos.findIndex((todo) => todo.id === actions.dropTargetId);

            if (findDragItem) {
                filterTodos.splice(findDropTodoTargetIndex, 0, findDragItem)
                state.activeTodoGroup.todos = filterTodos
            }
            return state;
        })
    },
    dropTodoGroup: () => {
        update((state) => {
            const findDragItem = state.todoGroups.find((todo) => todo.id == actions.draggableItemId);
            let filterTodos = state.todoGroups.filter((todo) => todo.id !== actions.draggableItemId);
            const findDropTodoTargetIndex = state.todoGroups.findIndex((todo) => todo.id === actions.dropTargetId);

            if (findDragItem) {
                filterTodos.splice(findDropTodoTargetIndex, 0, findDragItem)
                state.todoGroups = filterTodos
            }
            return state;
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