import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import LayoutAuth from "./layout/LayoutAuth";
import Layout from "./layout/Layout";
import Board from "./pages/board";
import Team from "./pages/team";
import { Component, type ReactNode } from "react";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: string | null }
> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) {
    return { error: e.message };
  }
  render() {
    if (this.state.error)
      return (
        <div style={{ color: "red", padding: "2rem", fontSize: "1rem" }}>
          <b>Error:</b> {this.state.error}
        </div>
      );
    return this.props.children;
  }
}

function App() {

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route element={<LayoutAuth />}>
            <Route element={<Login />} path="/kaban-board/login" />
            <Route element={<Register />} path="/kaban-board/register" />
          </Route>
          <Route path="/" element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route element={<Home />} path="/kaban-board" />
              <Route element={<Board />} path="/kaban-board/board/:boardId" />
              <Route element={<Team />} path="/kaban-board/team" />
            </Route>
          </Route>
          <Route
            path="*"
            element={
              <div style={{ color: "red" }}>
                NO ROUTE MATCH: {window.location.pathname}
              </div>
            }
          />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
