let todoIdCounter = 0;
export const makeTodoId = () => `todo-${Date.now()}-${todoIdCounter++}`;
export const emptyTodoItem = () => ({ id: makeTodoId(), text: "", done: false });
