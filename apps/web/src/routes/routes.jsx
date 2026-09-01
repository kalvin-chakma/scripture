import { Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import Landing from "../pages/Landing";
import SignIn from "../pages/signin";
import SignUp from "../pages/signup";
import BaseLayout from "../layout/BaseLayout";
import SimpleLayout from "../layout/SimpleLayout";
import MarkdownNoteEditor from "../note-editor/MarkdownNoteEditor";
import StructuredNoteEditor from "../note-editor/StructuredNoteEditor";
import TodoNoteEditor from "../note-editor/TodoNoteEditor";
import ProtectedRoute from "./protectedRoute";
import NoteDetails from "../pages/NoteDetails";
import NoteDetailLayout from "../layout/NoteDetailLayout";
import UpdateRouteHandler from "./updateRouteHandler";
import OAuthSuccess from "../services/OAuthSuccess";

export const routes = (
  <>
    <Route path="/" element={<Landing />} />
    <Route element={<BaseLayout />}>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Route>
    <Route element={<SimpleLayout />}>
      <Route path="/user/signup" element={<SignUp />} />
      <Route path="/user/signin" element={<SignIn />} />
    </Route>
    <Route element={<SimpleLayout />}>
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route
        path="/markdown-editor"
        element={
          <ProtectedRoute>
            <MarkdownNoteEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/structured-editor"
        element={
          <ProtectedRoute>
            <StructuredNoteEditor />
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
        path="/update/:id/:title"
        element={
          <ProtectedRoute>
            <UpdateRouteHandler />
          </ProtectedRoute>
        }
      />
    </Route>
    <Route element={<NoteDetailLayout />}>
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
