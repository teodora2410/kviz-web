import { Navigate, Route, Routes, Link, useNavigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import type { IAuthService } from "./services/IAuth";
import { AuthService } from "./services/Auth";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "./pages/HomePage";
import HomePage from "./pages/HomePage";
import type { IQuizService } from "./services/IQuizService";
import { QuizService } from "./services/QuizService";
import EditQuizPage from "./pages/EditQuizPage";
import PlayQuizPage from "./pages/PlayQuizPage";
import type { IResultService } from "./services/IResultService";
import { ResultService } from "./services/ResultService";
import ResultsPage from "./pages/ResultPage";
import RanksPage from "./pages/RankPage";

function App() {
  const authService: IAuthService = new AuthService();
  const quizService: IQuizService = new QuizService();
  const resultService: IResultService = new ResultService();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/");
  };

  const token = localStorage.getItem("jwt");
  let email = "";

  if (token) email = jwtDecode<{ email: string }>(token).email;

  return (
    <>
      {token && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm border-bottom">
          <div className="container">
            <Link className="navbar-brand fw-bold" to="/home">
              Quiz
            </Link>
            <div id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-lg-center">
                <span className="mr-3 text-primary"> {email}</span>
                <li className="nav-item">
                  <Link className="nav-link" to="/home">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/results">
                    Results
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/ranks">
                    Leadboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-danger ms-lg-3 mt-2 mt-lg-0"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<AuthPage authService={authService} />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute role="Admin,User">
              <HomePage quizService={quizService} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute role="Admin">
              <EditQuizPage quizService={quizService} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/play/:id"
          element={
            <ProtectedRoute role="User">
              <PlayQuizPage
                resultService={resultService}
                quizService={quizService}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute role="Admin,User">
              <ResultsPage resultService={resultService} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ranks"
          element={
            <ProtectedRoute role="Admin,User">
              <RanksPage
                resultService={resultService}
                quizService={quizService}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  role: string;
}> = ({ children, role }) => {
  const token = localStorage.getItem("jwt");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const roleJwt = jwtDecode<JwtPayload>(token);

  if (!role.includes(roleJwt.role)) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default App;
