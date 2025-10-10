import React from "react";
import type { ResultDto, QuizDto } from "../../models/models";

interface LeaderboardProps {
  results: ResultDto[];
  quizzes: QuizDto[];
  selectedQuizId: number | "";
  timeFilter: "all" | "weekly" | "monthly";
  onQuizChange: (quizId: number | "") => void;
  onTimeFilterChange: (filter: "all" | "weekly" | "monthly") => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  results,
  quizzes,
  selectedQuizId,
  timeFilter,
  onQuizChange,
  onTimeFilterChange,
}) => {
  const filteredResults = results.filter((res) => {
    if (selectedQuizId && res.quizId !== selectedQuizId) return false;

    const solvedDate = new Date(res.solvedAt);
    const now = new Date();

    if (timeFilter === "weekly") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      if (solvedDate < oneWeekAgo) return false;
    }

    if (timeFilter === "monthly") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      if (solvedDate < oneMonthAgo) return false;
    }

    return true;
  });

  const bestResultsMap = new Map<string, {
    id: number;
    userId: number;
    username: string;
    quizId: number;
    quizTitle: string;
    score: number;
    solvedAt: string;
  }>();

  filteredResults.forEach((res) => {
    const key = `${res.userId}-${res.quizId}`;
    const score = calculatePercentage(res);

    const existing = bestResultsMap.get(key);
    if (!existing || score > existing.score || (score === existing.score && new Date(res.solvedAt) < new Date(existing.solvedAt))) {
      bestResultsMap.set(key, {
        id: res.id,
        userId: res.userId,
        username: res.username,
        quizId: res.quizId,
        quizTitle: res.quizDto.title,
        score,
        solvedAt: res.solvedAt,
      });
    }
  });

  const leaderboard = Array.from(bestResultsMap.values()).sort((a, b) => {
    if (b.score === a.score) {
      return new Date(a.solvedAt).getTime() - new Date(b.solvedAt).getTime();
    }
    return b.score - a.score;
  });

  return (
    <div className="container py-4">
      <div className="row mb-4 g-3">
        <div className="col-md-6 col-lg-4">
          <label className="form-label fw-bold">Select Quiz</label>
          <select
            className="form-select"
            value={selectedQuizId}
            onChange={(e) => onQuizChange(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="">All Quizzes</option>
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>{q.title}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6 col-lg-4">
          <label className="form-label fw-bold">Time Period</label>
          <select
            className="form-select"
            value={timeFilter}
            onChange={(e) => onTimeFilterChange(e.target.value as "all" | "weekly" | "monthly")}
          >
            <option value="all">All Time</option>
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {leaderboard.length > 0 ? (
          leaderboard.map((entry, idx) => (
            <div className="col" key={`${entry.userId}-${entry.quizId}`}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    <span className="badge bg-primary me-2">{idx + 1}</span>
                    {entry.username}
                  </h5>
                  <p className="card-text mb-1">
                    <strong>Quiz:</strong> {entry.quizTitle}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Score:</strong>{" "}
                    <span className={`badge ${entry.score >= 90 ? "bg-success" : entry.score >= 70 ? "bg-warning text-dark" : "bg-secondary"}`}>
                      {entry.score}%
                    </span>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">Solved: {new Date(entry.solvedAt).toLocaleString()}</small>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info text-center">No results found.</div>
          </div>
        )}
      </div>
    </div>
  );
};

function calculatePercentage(result: ResultDto): number {
  const total = result.quizDto.questions.length;
  let correctCount = 0;

  result.quizDto.questions.forEach((q) => {
    const userAns = result.userAnswers.find((ua) => ua.questionId === q.id);
    const correct = q.answers.filter((a) => a.correct).map((a) => a.text);

    if (userAns) {
      const ua = userAns.userAnswer
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      if (ua.length === correct.length && ua.every((v) => correct.includes(v))) {
        correctCount++;
      }
    }
  });

  return Math.round((correctCount / total) * 100);
}

export default Leaderboard;
