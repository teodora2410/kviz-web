import React, { useState } from "react";
import type { QuizDto, QuestionDto, AnswerDto } from "../../models/models";
import type { IQuizService } from "../../services/IQuizService";

interface CreateQuizProps {
  quizService: IQuizService;
  onCreated: () => void;
}

const CreateQuizComponent: React.FC<CreateQuizProps> = ({
  quizService,
  onCreated,
}) => {
  const [quiz, setQuiz] = useState<QuizDto>({
    id: 0,
    title: "",
    description: "",
    categories: "",
    timeLimit: 60,
    level: "Easy",
    isDeleted: false,
    originalQuizId: 0,
    questions: [],
  });

  const [errors, setErrors] = useState<string[]>([]);

  const addQuestion = () => {
    const newQuestion: QuestionDto = {
      id: 0,
      quizId: quiz.id,
      title: "",
      type: 0,
      answers: [],
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  const removeQuestion = (index: number) => {
    const questions = [...quiz.questions];
    questions.splice(index, 1);
    setQuiz({ ...quiz, questions });
  };

  const updateQuestion = (index: number, updated: QuestionDto) => {
    const questions = [...quiz.questions];
    questions[index] = updated;
    setQuiz({ ...quiz, questions });
  };

  const validateQuiz = (): boolean => {
    const newErrors: string[] = [];

    if (!quiz.title.trim()) newErrors.push("Title is required.");
    if (!quiz.description.trim()) newErrors.push("Description is required.");
    if (!quiz.categories.trim()) newErrors.push("Categories are required.");
    if (quiz.timeLimit <= 0) newErrors.push("Time limit must be greater than 0.");
    if (!quiz.level) newErrors.push("Difficulty level is required.");

    if (quiz.questions.length === 0) {
      newErrors.push("Quiz must have at least one question.");
    } else {
      quiz.questions.forEach((q, i) => {
        if (!q.title.trim()) newErrors.push(`Question ${i + 1} must have a title.`);
        if (q.type === 0 || q.type === 1) {
          if (q.answers.length === 0)
            newErrors.push(`Question ${i + 1} must have answers.`);
          const hasCorrect = q.answers.some((a) => a.correct);
          if (!hasCorrect)
            newErrors.push(
              `Question ${i + 1} must have at least one correct answer.`
            );
          q.answers.forEach((a, j) => {
            if (!a.text?.trim())
              newErrors.push(`Answer ${j + 1} in question ${i + 1} cannot be empty.`);
          });
        }
        if (q.type === 2 || q.type === 3) {
          if (!q.answers[0] || !q.answers[0].text?.trim())
            newErrors.push(`Question ${i + 1} must have a valid answer.`);
        }
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateQuiz()) return;
    const success = await quizService.create(quiz);
    if (success) {
      window.location.reload();
      onCreated();
    } else {
      alert("Failed to create quiz");
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h4>Create Quiz</h4>
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <ul className="mb-0">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={quiz.description}
            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Categories</label>
          <input
            type="text"
            className="form-control"
            value={quiz.categories}
            onChange={(e) => setQuiz({ ...quiz, categories: e.target.value })}
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Time Limit (seconds)</label>
          <input
            type="number"
            className="form-control"
            value={quiz.timeLimit}
            onChange={(e) =>
              setQuiz({ ...quiz, timeLimit: Number(e.target.value) })
            }
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Difficulty</label>
          <select
            className="form-select"
            value={quiz.level}
            onChange={(e) => setQuiz({ ...quiz, level: e.target.value })}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div className="mt-3">
          <h5>Questions</h5>
          {quiz.questions.map((q, idx) => (
            <QuestionForm
              key={idx}
              question={q}
              onChange={(updated) => updateQuestion(idx, updated)}
              onRemove={() => removeQuestion(idx)}
            />
          ))}
          <button
            type="button"
            className="btn btn-secondary mt-2"
            onClick={addQuestion}
          >
            Add Question
          </button>
        </div>
        <button type="submit" className="btn btn-success mt-3">
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuizComponent;

interface QuestionFormProps {
  question: QuestionDto;
  onChange: (q: QuestionDto) => void;
  onRemove: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  onChange,
  onRemove,
}) => {
  const setAnswers = (answers: AnswerDto[]) => onChange({ ...question, answers });

  const updateAnswer = (i: number, updated: AnswerDto) => {
    const ans = [...question.answers];
    ans[i] = updated;
    setAnswers(ans);
  };

  const ensureAnswers = (count: number) => {
    const newAnswers = [...question.answers];
    while (newAnswers.length < count) {
      newAnswers.push({
        id: 0,
        quizId: question.quizId,
        questionId: question.id,
        text: "",
        correct: false,
      });
    }
    if (newAnswers.length !== question.answers.length) {
      setAnswers(newAnswers);
    }
  };

  if (question.type === 0 || question.type === 1) {
    ensureAnswers(4);
  }

  return (
    <div className="border rounded p-2 mb-3">
      <label className="form-label">Question Title</label>
      <input
        type="text"
        className="form-control mb-2"
        value={question.title}
        onChange={(e) => onChange({ ...question, title: e.target.value })}
      />
      <label className="form-label">Type</label>
      <select
        className="form-select mb-2"
        value={question.type}
        onChange={(e) =>
          onChange({ ...question, type: Number(e.target.value), answers: [] })
        }
      >
        <option value={0}>Single Choice</option>
        <option value={1}>Multiple Choice</option>
        <option value={2}>True/False</option>
        <option value={3}>Input</option>
      </select>
      {(question.type === 0 || question.type === 1) &&
        question.answers.map((a, i) => (
          <div key={i} className="input-group mb-1 align-items-center">
            <input
              type="text"
              className="form-control"
              value={a.text}
              onChange={(e) => updateAnswer(i, { ...a, text: e.target.value })}
            />
            {question.type === 0 ? (
              <input
                type="radio"
                className="form-check-input ms-2"
                name={`q-${question.title}-${i}`}
                checked={a.correct}
                onChange={() =>
                  setAnswers(
                    question.answers.map((x, j) => ({
                      ...x,
                      correct: j === i,
                    }))
                  )
                }
              />
            ) : (
              <input
                type="checkbox"
                className="form-check-input ms-2"
                checked={a.correct}
                onChange={(e) =>
                  updateAnswer(i, { ...a, correct: e.target.checked })
                }
              />
            )}
          </div>
        ))}
      {question.type === 2 && (
        <select
          className="form-select"
          value={question.answers[0]?.text || ""}
          onChange={(e) =>
            setAnswers([
              {
                id: 0,
                quizId: question.quizId,
                questionId: question.id,
                text: e.target.value,
                correct: true,
              },
            ])
          }
        >
          <option value="">Select</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      )}
      {question.type === 3 && (
        <input
          type="text"
          className="form-control"
          placeholder="Correct Answer"
          value={question.answers[0]?.text || ""}
          onChange={(e) =>
            setAnswers([
              {
                id: 0,
                quizId: question.quizId,
                questionId: question.id,
                text: e.target.value,
                correct: true,
              },
            ])
          }
        />
      )}
      <button
        type="button"
        className="btn btn-danger btn-sm mt-2"
        onClick={onRemove}
      >
        Remove Question
      </button>
    </div>
  );
};

