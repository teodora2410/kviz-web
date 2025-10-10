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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await quizService.create(quiz);
    if (success) {
      alert("Quiz created");
      onCreated();
    } else {
      alert("Failed to create quiz");
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h4>Create Quiz</h4>
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

        {/* Questions */}
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
  const setAnswers = (answers: AnswerDto[]) =>
    onChange({ ...question, answers });
  const updateAnswer = (i: number, updated: AnswerDto) => {
    const ans = [...question.answers];
    ans[i] = updated;
    setAnswers(ans);
  };

  const ensureAnswers = (count: number) => {
    while (question.answers.length < count) {
      question.answers.push({
        id: 0,
        quizId: question.quizId,
        questionId: question.id,
        text: "",
        correct: false,
      });
    }
  };

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
          onChange({ ...question, type: Number(e.target.value) })
        }
      >
        <option value={0}>Single Choice</option>
        <option value={1}>Multiple Choice</option>
        <option value={2}>True/False</option>
        <option value={3}>Input</option>
      </select>

      {/* Answer Inputs based on type */}
      {question.type === 0 || question.type === 1 ? (
        <>
          {ensureAnswers(4)}
          {question.answers.map((a, i) => (
            <div key={i} className="input-group mb-1">
              <input
                type="text"
                className="form-control"
                value={a.text}
                onChange={(e) =>
                  updateAnswer(i, { ...a, text: e.target.value })
                }
              />
              {question.type === 0 ? (
                <input
                  type="radio"
                  className="form-check-input ms-2"
                  name={`q-${question.id}`}
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
        </>
      ) : null}

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
