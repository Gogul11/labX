import { create } from 'zustand';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  deleteTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  addTodo: (text: string) => 
    set((state) => ({
      todos: [
        {
          id: Date.now(),
          text: text.trim(),
          completed: false
        },
        ...state.todos
      ]
    })),
  deleteTodo: (id: number) => 
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id)
    })),
  toggleTodo: (id: number) => 
    set((state) => ({
      todos: state.todos.map((todo) => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    }))
}));