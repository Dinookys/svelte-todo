

export type TodoItemSubItem = { id: number; text: string; completed: boolean; createdAt?: number; updatedAt?: number };
export type TodoItem = { id: number; text: string; completed: boolean; createdAt?: number; updatedAt?: number, items: TodoItemSubItem[] };
export type TodoGroupItem = { id: number; name: string; todos: TodoItem[] }
export type TodoState = {
    todoGroups: TodoGroupItem[];
    activeTodoGroup: TodoGroupItem;
    activeIDTodoGroup: number;
    activeTodoItem: TodoItem;
}