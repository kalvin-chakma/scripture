import { IoAddOutline, IoTrashOutline } from "react-icons/io5";

export default function TodoList({
  items,
  isEditing,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
}) {
  return (
    <div className="space-y-1 max-w-2xl mx-auto">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2 group">
          <input
            type="checkbox"
            checked={item.done}
            readOnly={!isEditing}
            onChange={(e) =>
              isEditing && onUpdateItem(item.id, { done: e.target.checked })
            }
            className="w-4 h-4 flex-shrink-0"
          />
          {isEditing ? (
            <input
              type="text"
              value={item.text}
              onChange={(e) => onUpdateItem(item.id, { text: e.target.value })}
              placeholder="To-do item"
              className={`flex-1 bg-transparent border-b border-transparent focus:border-gray-200 dark:focus:border-gray-700 focus:outline-none py-1 dark:text-white ${
                item.done ? "line-through text-gray-400 dark:text-gray-500" : ""
              }`}
            />
          ) : (
            <span
              className={`flex-1 py-1 dark:text-white ${
                item.done ? "line-through text-gray-400 dark:text-gray-500" : ""
              }`}
            >
              {item.text}
            </span>
          )}
          {isEditing && (
            <button
              type="button"
              onClick={() => onRemoveItem(item.id)}
              className="text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity duration-150 dark:text-gray-600"
            >
              <IoTrashOutline className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}

      {isEditing && (
        <button
          type="button"
          onClick={onAddItem}
          className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-150 mt-2"
        >
          <IoAddOutline className="w-4 h-4 mr-1" />
          Add item
        </button>
      )}
    </div>
  );
}
