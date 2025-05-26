import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BaseLayout from "./layout/BaseLayout";
import SimpleLayout from "./layout/SimpleLayout";
import MarkdownNoteEditor from "./note-editor/MarkdownNoteEditor";
import GeneralNoteEditor from "./note-editor/GeneralNoteEditor";
import TodoNoteEditor from "./note-editor/TodoNoteEditor";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";

export default function App() {

  return (
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/user/signup" element={<SignUp/>} />
          <Route path="/user/signin" element={<SignIn />} />
        </Route>
        <Route element={<SimpleLayout />}>
          <Route path="/markdown-editor" element={<MarkdownNoteEditor />} />
          <Route path="/general-editor" element={<GeneralNoteEditor />} />
          <Route path="/todo-editor" element={<TodoNoteEditor />} />
        </Route>
      </Routes>
  );
}
