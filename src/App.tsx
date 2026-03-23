import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutAuth from "./layout/LayoutAuth";
import Layout from "./layout/Layout";
import { Component, Suspense, lazy, type ReactNode } from "react";

const ProtectedRoute = lazy(() => import("./utils/ProtectedRoute"));
const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Board = lazy(() => import("./pages/board"));
const Team = lazy(() => import("./pages/team"));

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
        <Suspense
          fallback={
            <div style={{ color: "white", padding: "2rem", fontSize: "1rem" }}>
              Loading...
            </div>
          }
        >
          <Routes>
            <Route element={<LayoutAuth />}>
              <Route element={<Login />} path="/kaban-board/login" />
              <Route
                element={<Register />}
                path="/kaban-board/register"
              />
            </Route>
            <Route path="/" element={<Layout />}>
              <Route element={<ProtectedRoute />}>
                <Route element={<Home />} path="/kaban-board" />
                <Route
                  element={<Board />}
                  path="/kaban-board/board/:boardId"
                />
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
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
