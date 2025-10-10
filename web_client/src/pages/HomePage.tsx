import React, { useEffect, useMemo, useState } from "react";
import type { QuizDto } from "../models/models";
import type { IQuizService } from "../services/IQuizService";
import CreateQuizComponent from "../components/quiz/CreateQuizComponent";
import QuizElement from "../components/quiz/QuizElement";
import { jwtDecode } from "jwt-decode";

interface HomePageProps {
  quizService: IQuizService
}

export interface JwtPayload {
  id: string
  email: string
  role: string
  exp: number
}

const HomePage: React.FC<HomePageProps> = ({ quizService }) => {
  const [quizzes, setQuizzes] = useState<QuizDto[]>([])
  const [role, setRole] = useState<string>("")

  // filters
  const [category, setCategory] = useState<string>("")
  const [level, setLevel] = useState<string>("")
  const [keyword, setKeyword] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("")

  const fetchQuizzes = async () => {
    const data = await quizService.getAll()
    setQuizzes(data ?? [])
  }

  useEffect(() => {
    fetchQuizzes()
    const token = localStorage.getItem("jwt")
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token)
        setRole(decoded.role)
      } catch {
        setRole("")
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // unique categories from quizzes
  const categories = useMemo(() => {
    const set = new Set<string>()
    quizzes.forEach((q) => {
      if (q.categories) set.add(q.categories)
    })
    return Array.from(set)
  }, [quizzes])

  // filtered & sorted quizzes
  const filteredQuizzes = useMemo(() => {
    let result = [...quizzes]

    if (category) {
      result = result.filter((q) => q.categories.toLowerCase() === category.toLowerCase())
    }

    if (level) {
      result = result.filter((q) => q.level.toLowerCase() === level.toLowerCase())
    }

    if (keyword) {
      const lower = keyword.toLowerCase()
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(lower) ||
          q.description.toLowerCase().includes(lower)
      )
    }

    if (sortBy) {
      switch (sortBy) {
        case "title":
          result.sort((a, b) => a.title.localeCompare(b.title))
          break
        case "time":
          result.sort((a, b) => a.timeLimit - b.timeLimit)
          break
        case "level":
          result.sort((a, b) => a.level.localeCompare(b.level))
          break
        case "questions":
          result.sort((a, b) => (a.questions?.length || 0) - (b.questions?.length || 0))
          break
      }
    }

    return result
  }, [quizzes, category, level, keyword, sortBy])

  return (
    <div className="container mt-4">
      <h2>All Quizzes</h2>

      {/* Admin can add quiz */}
      {role === "Admin" && (
        <CreateQuizComponent quizService={quizService} onCreated={fetchQuizzes} />
      )}

      {/* Filters */}
      <div className="card p-3 mb-3 shadow-sm">
        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c: string, i: number) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Sort By</option>
              <option value="title">Title</option>
              <option value="time">Time Limit</option>
              <option value="level">Level</option>
              <option value="questions"># Questions</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-secondary w-100" onClick={() => { setKeyword(""); setCategory(""); setLevel(""); setSortBy(""); }}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Time Limit</th>
            <th>Questions</th>
            <th>Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz: QuizDto) => (
              <QuizElement
                key={quiz.id}
                quiz={quiz}
                quizService={quizService}
                role={role}
                onDeleted={fetchQuizzes}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">No quizzes found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default HomePage