import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { IQuizService } from "../services/IQuizService"
import EditQuizComponent from "../components/quiz/EditQuizComponent"

interface EditQuizPageProps {
  quizService: IQuizService
}

const EditQuizPage: React.FC<EditQuizPageProps> = ({ quizService }) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) return <div>Invalid Quiz ID</div>

  return (
    <div className="container mt-4">
      <h2>Edit Quiz</h2>
      <EditQuizComponent
        quizId={Number(id)}
        quizService={quizService}
        onUpdated={() => navigate("/")}
      />
    </div>
  )
}

export default EditQuizPage
