import React, { useState, useEffect, useRef } from "react";
import { FiPlus, FiTrash2, FiCheck, FiCircle } from "react-icons/fi";
import { useTodoStore } from "../stores/todoStore";

const TodoList: React.FC = () => {
  const { todos, addTodo, deleteTodo, toggleTodo } = useTodoStore();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleAddTodo = () => {
    if (!input.trim()) return;
    addTodo(input);
    setInput("");
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="h-screen bg-[#282c34] flex flex-col">
      <div className="p-4 max-w-4xl mx-auto w-full flex-shrink-0">

        {/* Input Section */}
        <div className=" mt-4 mb-6 p-4 border border-gray-700 rounded-lg bg-gray-800 flex flex-col justify-center gap-4">
          <div className="flex gap-3 items-start">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-3 py-2 border border-gray-600 rounded resize-none focus:outline-none focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
              style={{ minHeight: "60px", maxHeight: "120px" }}
              rows={2}
            />
            <button
              onClick={handleAddTodo}
              disabled={!input.trim()}
              className="h-10 w-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlus size={18} />
            </button>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{activeTodosCount} active</span>
            <span>{completedTodosCount} completed</span>
            <span>{todos.length} total</span>
          </div>
        </div>
      </div>

      {/* Scrollable Todos List */}
      <div className="flex-1 overflow-y-auto px-4 max-w-4xl mx-auto w-full">
        <div className="space-y-3 pb-4">
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">
                <FiCircle size={32} className="mx-auto" />
              </div>
              <p className="text-gray-400">No todos yet. Create your first todo above.</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`border border-gray-700 rounded-lg p-4 bg-gray-800 hover:bg-gray-750 transition-colors duration-200 ${
                  todo.completed ? "opacity-75" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`h-6 w-6 rounded-full flex items-center justify-center transition duration-200 mt-1 flex-shrink-0 ${
                      todo.completed
                        ? "bg-green-600 text-white"
                        : "border-2 border-gray-500 hover:border-green-500"
                    }`}
                  >
                    {todo.completed && <FiCheck size={14} />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`whitespace-pre-wrap break-words leading-relaxed ${
                      todo.completed 
                        ? "text-gray-400 line-through" 
                        : "text-gray-100"
                    }`}>
                      {todo.text}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition duration-200"
                    title="Delete todo"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;