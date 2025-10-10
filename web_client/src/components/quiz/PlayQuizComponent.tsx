import React, { useEffect, useState, useRef } from "react";
import type { QuestionDto, QuizDto, ResultDto } from "../../models/models";
import type { IQuizService } from "../../services/IQuizService";
import type { IResultService } from "../../services/IResultService";
import { jwtDecode } from "jwt-decode";

interface PlayQuizProps {
  quizId: number;
  quizService: IQuizService;
  resultService: IResultService;
  onCompleted?: () => void;
}

interface DetailedResult {
  question: QuestionDto;
  correctAnswer: string[];
  userAnswer: string[];
  isCorrect: boolean;
}

const PlayQuizComponent: React.FC<PlayQuizProps> = ({
  quizId,
  quizService,
  resultService,
  onCompleted,
}) => {
  const [quiz, setQuiz] = useState<QuizDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<
    Record<number, number | number[] | string>
  >({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<{
    total: number;
    correct: number;
    percentage: number;
    detailed: DetailedResult[];
  } | null>(null);

  const timerRef = useRef<number>(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      const data = await quizService.getById(quizId);
      if (data) {
        setQuiz(data);
        setTimeLeft(data.timeLimit);

        const initialAnswers: Record<number, number | number[] | string> = {};
        data.questions.forEach((q) => {
          if (q.type === 1) {
            initialAnswers[q.id] = [];
          } else if (q.type === 3) {
            initialAnswers[q.id] = "";
          } else {
            initialAnswers[q.id] = 0;
          }
        });
        setUserAnswers(initialAnswers);
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [quizId, quizService]);

  useEffect(() => {
    if (!quiz || finished) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, finished]);

  const handleAnswerChange = (
    questionId: number,
    value: number | number[] | string
  ) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = React.useCallback(async () => {
    if (!quiz) return;
    if (finished) return;

    setFinished(true);
    clearInterval(timerRef.current);

    setUserAnswers((latestAnswers) => {
      const detailedResults: DetailedResult[] = [];
      let correctCount = 0;

      quiz.questions.forEach((q) => {
        const userAns = latestAnswers[q.id];
        let isCorrect = false;
        const correctIds = q.answers.filter((a) => a.correct).map((a) => a.id);

        if (q.type === 3) {
          const correctAnswersRaw = q.answers
            .filter((a) => a.correct)
            .map((a) => a.text);

          const correctTexts = correctAnswersRaw.map((t) =>
            t.trim().toLowerCase()
          );

          const userText = (typeof userAns === "string" ? userAns : "").trim();
          isCorrect = correctTexts.includes(userText.toLowerCase());

          if (isCorrect) correctCount++;

          detailedResults.push({
            question: q,
            correctAnswer: correctAnswersRaw,
            userAnswer: [userText],
            isCorrect,
          });
          return;
        }

        let userSelectedIds: number[] = [];
        if (q.type === 1) {
          userSelectedIds = Array.isArray(userAns) ? userAns : [];
        } else {
          userSelectedIds =
            userAns && typeof userAns === "number" ? [userAns] : [];
        }

        isCorrect =
          userSelectedIds.length === correctIds.length &&
          userSelectedIds.every((id) => correctIds.includes(id));

        if (isCorrect) correctCount++;

        detailedResults.push({
          question: q,
          correctAnswer: correctIds.map(
            (id) => q.answers.find((a) => a.id === id)?.text || ""
          ),
          userAnswer: userSelectedIds.map(
            (id) => q.answers.find((a) => a.id === id)?.text || ""
          ),
          isCorrect,
        });
      });

      const total = quiz.questions.length;
      const percentage = Math.round((correctCount / total) * 100);
      setResult({
        total,
        correct: correctCount,
        percentage,
        detailed: detailedResults,
      });

      const { id, email } = jwtDecode<{ id: string; email: string }>(
        localStorage.getItem("jwt") ?? ""
      );

      const resultDto: ResultDto = {
        id: 0,
        quizId: quizId,
        userId: parseInt(id || "0"),
        username: email,
        solvedAt: new Date().toISOString(),
        quizDto: quiz,
        userAnswers: Object.entries(latestAnswers).map(([qId, ans]) => {
          if (typeof ans === "string") {
            return {
              id: 0,
              resultId: 0,
              questionId: parseInt(qId),
              userAnswer: ans,
            };
          }

          const uaIds = Array.isArray(ans) ? ans : [ans as number];
          const texts = uaIds
            .map((id) => {
              const question = quiz.questions.find(
                (q) => q.id === parseInt(qId)
              );
              const answer = question?.answers.find((a) => a.id === id);
              return answer?.text || "";
            })
            .filter((t) => t !== "");
          return {
            id: 0,
            resultId: 0,
            questionId: parseInt(qId),
            userAnswer: texts.join(", "),
          };
        }),
      };

      resultService.recordResult(resultDto);
      onCompleted?.();

      return latestAnswers;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, finished, resultService, onCompleted]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading) return <div>Loading quiz...</div>;
  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div className="container mt-4">
      <h3>{quiz.title}</h3>
      <p>{quiz.description}</p>

      {!finished && (
        <div className="mb-3">
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${(timeLeft / quiz.timeLimit) * 100}%` }}
            >
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      )}

      {/* Quiz form */}
      {!finished && (
        <form>
          {quiz.questions.map((q, idx) => {
            const ua = userAnswers[q.id];

            return (
              <div key={q.id} className="border p-2 mb-3">
                <strong>
                  {idx + 1}. {q.title}
                </strong>
                <div className="mt-2">
                  {/* Single choice - Radio */}
                  {q.type === 0 &&
                    q.answers.map((a) => (
                      <div key={`q${q.id}a${a.id}`} className="form-check">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          id={`q-${q.id}-a-${a.id}`}
                          className="form-check-input"
                          checked={ua === a.id}
                          onChange={() => handleAnswerChange(q.id, a.id)}
                        />
                        <label
                          htmlFor={`q-${q.id}-a-${a.id}`}
                          className="form-check-label"
                        >
                          {a.text}
                        </label>
                      </div>
                    ))}

                  {/* Multiple choice - Checkbox */}
                  {q.type === 1 &&
                    q.answers.map((a) => {
                      const checked = Array.isArray(ua) && ua.includes(a.id);
                      return (
                        <div key={`q${q.id}a${a.id}`} className="form-check">
                          <input
                            type="checkbox"
                            id={`q-${q.id}-a-${a.id}`}
                            className="form-check-input"
                            checked={checked}
                            onChange={() => {
                              const current = Array.isArray(ua) ? [...ua] : [];
                              const newAns = current.includes(a.id)
                                ? current.filter((x) => x !== a.id)
                                : [...current, a.id];
                              handleAnswerChange(q.id, newAns);
                            }}
                          />
                          <label
                            htmlFor={`q-${q.id}-a-${a.id}`}
                            className="form-check-label"
                          >
                            {a.text}
                          </label>
                        </div>
                      );
                    })}

                  {/* True/False Dropdown */}
                  {q.type === 2 && (
                    <select
                      className="form-select"
                      value={ua ? String(ua) : ""}
                      onChange={(e) =>
                        handleAnswerChange(q.id, Number(e.target.value))
                      }
                    >
                      <option value="">Select</option>
                      {["true", "false"].map((tf) => {
                        const existing = q.answers.find((a) => a.text === tf);
                        return existing ? (
                          <option key={existing.id} value={existing.id}>
                            {tf}
                          </option>
                        ) : (
                          <option key={tf} value={tf === "true" ? -1 : -2}>
                            {tf}
                          </option>
                        );
                      })}
                    </select>
                  )}

                  {/* Text Input */}
                  {q.type === 3 && (
                    <input
                      type="text"
                      className="form-control"
                      value={typeof ua === "string" ? ua : ""}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />
                  )}
                </div>
              </div>
            );
          })}

          <button
            type="button"
            className="btn btn-danger mt-2 mb-4"
            onClick={handleSubmit}
          >
            End Attempt
          </button>
        </form>
      )}

      {/* Results */}
      {finished && result && (
        <div className="mt-4">
          <h4>Result</h4>
          <p>
            Total Questions: {result.total} | Correct: {result.correct} |
            Percentage: {result.percentage}%
          </p>
          {result.detailed.map((d, i) => (
            <div
              key={i}
              className={`border p-2 mb-2 ${
                d.isCorrect ? "border-success" : "border-danger"
              }`}
            >
              <strong>
                {i + 1}. {d.question.title}
              </strong>
              <div>User Answer: {d.userAnswer.join(", ") || "No Answer"}</div>
              <div>Correct Answer: {d.correctAnswer.join(", ")}</div>
              {!d.isCorrect && <div className="text-danger">Wrong!</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayQuizComponent;
