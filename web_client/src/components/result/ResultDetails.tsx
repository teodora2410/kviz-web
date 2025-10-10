import React from "react";
import type { ResultDto } from "../../models/models";

interface ResultDetailsProps {
  result: ResultDto;
  allResults: ResultDto[];
  onBack: () => void;
}

export const ResultDetails: React.FC<ResultDetailsProps> = ({
  result,
  allResults,
  onBack,
}) => {
  const uniqueResults = Array.from(
    new Map(
      allResults.map((r) => [
        `${r.quizId}-${r.userId}-${new Date(r.solvedAt).toISOString()}`,
        r,
      ])
    ).values()
  ).filter((r) => r.quizId === result.quizId && r.userId === result.userId);

  const data = uniqueResults.map((r, i) => ({
    attempt: i + 1,
    score: calculatePercentage(r),
  }));

  const width = 600;
  const height = 300;
  const padding = 40;

  const maxScore = 100;
  const xScale = (attempt: number) =>
    padding + ((attempt - 1) / (data.length - 1 || 1)) * (width - 2 * padding);
  const yScale = (score: number) =>
    height - padding - (score / maxScore) * (height - 2 * padding);

  const linePath = data
    .map(
      (d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.attempt)} ${yScale(d.score)}`
    )
    .join(" ");

  return (
    <div className="mt-4">
      <button className="btn btn-secondary mb-3" onClick={onBack}>
        ← Back to all results
      </button>

      <div className="card mb-3">
        <div className="card-body">
          <h4>{result.quizDto.title}</h4>
          <p>
            User: {result.username} <br />
            Solved at: {new Date(result.solvedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Table */}
      <h5>Questions & Answers</h5>
      <table className="table table-bordered table-hover mt-2">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Question</th>
            <th>User Answer</th>
            <th>Correct Answer</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {result.quizDto.questions.map((q, idx) => {
            const userAns = result.userAnswers.find(
              (ua) => ua.questionId === q.id
            );
            const correct = q.answers
              .filter((a) => a.correct)
              .map((a) => a.text);
            const userAnswer = userAns?.userAnswer
              ? userAns.userAnswer
                  .split(",")
                  .map((a) => a.trim())
                  .filter((a) => a.length > 0)
              : [];

            const isCorrect =
              userAnswer.length === correct.length &&
              userAnswer.every((ans) => correct.includes(ans));

            return (
              <tr
                key={q.id}
                className={isCorrect ? "table-success" : "table-danger"}
              >
                <td>{idx + 1}</td>
                <td>{q.title}</td>
                <td>{userAns?.userAnswer || "No Answer"}</td>
                <td>{correct.join(", ")}</td>
                <td>{isCorrect ? "Correct" : "Wrong"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Progress Chart */}
      <h5 className="mt-4">Progress Chart</h5>
      <svg width={width} height={height} style={{ border: "1px solid #ddd" }}>
        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#000"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#000"
        />

        {/* Y labels (0, 50, 100) */}
        {[0, 50, 100].map((val) => (
          <g key={val}>
            <text x={5} y={yScale(val) + 4} fontSize="10">
              {val}%
            </text>
            <line
              x1={padding}
              y1={yScale(val)}
              x2={width - padding}
              y2={yScale(val)}
              stroke="#ccc"
              strokeDasharray="2,2"
            />
          </g>
        ))}

        {/* X labels (attempt numbers) */}
        {data.map((d) => (
          <text
            key={d.attempt}
            x={xScale(d.attempt)}
            y={height - padding + 15}
            fontSize="10"
            textAnchor="middle"
          >
            {d.attempt}
          </text>
        ))}

        {/* Line path */}
        <path d={linePath} fill="none" stroke="#0d6efd" strokeWidth={2} />

        {/* Data points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={xScale(d.attempt)}
            cy={yScale(d.score)}
            r={4}
            fill="#0d6efd"
          />
        ))}
      </svg>
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
      if (
        ua.length === correct.length &&
        ua.every((v) => correct.includes(v))
      ) {
        correctCount++;
      }
    }
  });
  return Math.round((correctCount / total) * 100);
}
