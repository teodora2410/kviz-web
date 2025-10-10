import React from "react"
import { useNavigate } from "react-router-dom"
import type { QuizDto } from "../../models/models"
import type { IQuizService } from "../../services/IQuizService"

interface QuizElementProps {
  quiz: QuizDto
  quizService: IQuizService
  role: string
  onDeleted: () => void
}

const QuizElement: React.FC<QuizElementProps> = ({ quiz, quizService, role, onDeleted }) => {
  const navigate = useNavigate()

  const handleDelete = async () => {
    const success = await quizService.delete(quiz.id)
    if (success) {
      onDeleted()
    } else {
      alert("Failed to delete quiz")
    }
  }

  return (
    <tr>
      <td>{quiz.title}</td>
      <td>{quiz.description.slice(0, 50)}...</td>
      <td>{quiz.timeLimit} sec</td>
      <td>{quiz.questions?.length || 0}</td>
      <td>{quiz.level}</td>
      <td>
        {role === "User" ? (
          <button className="btn btn-primary btn-sm me-2" onClick={() => navigate(`/play/${quiz.id}`)}>
            Play
          </button>
        ) : null}

        {role === "Admin" && (
          <>
            <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/edit/${quiz.id}`)}>
              Edit
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  )
}

export default QuizElement
