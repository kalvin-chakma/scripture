import { Route } from "react-router-dom";
import Home from "../pages/Home";
import SignIn from "../pages/signin";
import SignUp from "../pages/signup";
import BaseLayout from "../layout/BaseLayout";
import SimpleLayout from "../layout/SimpleLayout";
import MarkdownNoteEditor from "../note-editor/MarkdownNoteEditor";
import GeneralNoteEditor from "../note-editor/GeneralNoteEditor";
import TodoNoteEditor from "../note-editor/TodoNoteEditor";
import ProtectedRoute from "./protectedRoute";
import NoteDetails from "../pages/NoteDetails";

export const routes = (
  <>
    <Route element={<BaseLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/user/signup" element={<SignUp />} />
      <Route path="/user/signin" element={<SignIn />} />
    </Route>
    <Route element={<SimpleLayout />}>
      <Route
        path="/markdown-editor"
        element={
          <ProtectedRoute>
            <MarkdownNoteEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/general-editor"
        element={
          <ProtectedRoute>
            <GeneralNoteEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/todo-editor"
        element={
          <ProtectedRoute>
            <TodoNoteEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/note-details/:id/:title"
        element={
          <ProtectedRoute>
            <NoteDetails />
          </ProtectedRoute>
        }
      />
    </Route>
  </>
);
