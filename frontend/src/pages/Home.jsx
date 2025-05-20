import { useState } from "react";
import Sidebar from "../components/Sidebar";


export default function Home() {
 const [columns, setColumns] = useState([
  {
    id: 1,
    noteType: "Markdown",
    dotColor: "bg-green-500",
    notes: [
      { id: 1, title: "Design Moodboard" },
      { id: 2, title: "Product Ideas" },
      { id: 3, title: "Feature Ideas" },
      { id: 4, title: "Research Findings" },
    ],
  },
  {
    id: 2,
    noteType: "General",
    dotColor: "bg-purple-500",
    notes: [
      { id: 1, title: "API Design" },
      { id: 2, title: "Hi-Fi Prototypes" },
      { id: 3, title: "Edge Case Designs" },
    ],
  },
  {
    id: 3,
    noteType: "To-do",
    dotColor: "bg-yellow-500",
    notes: [
      { id: 1, title: "Information Architecture" },
      { id: 2, title: "Code Convention" },
      { id: 3, title: "Competitor Analysis" },
      { id: 4, title: "Wireframes" },
    ],
  },
]);


  return (
    <div className="flex h-full text-gray-800 font-sans no-scrollbar">
      <Sidebar className="bg-black" />

      {/* Main Content */}
      <div className="flex flex-col flex-1 p-6 ">
        <div className="flex gap-5 h-full overflow-x-auto no-scrollbar">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-72 flex flex-col bg-gray-50 rounded-lg shadow-sm"
            >
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full ${column.dotColor} mr-2`}
                  ></div>
                  <h3 className="font-medium text-sm">{column.noteType || "Untitled"}</h3>
                </div>
              </div>
              <div className="flex flex-col gap-2 p-2 overflow-auto no-scrollbar">
                {column.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    {note.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
