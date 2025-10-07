import React, { useEffect, useState } from "react";
import type { ResultDto, QuizDto } from "../models/models";
import type { IResultService } from "../services/IResultService";
import type { IQuizService } from "../services/IQuizService";
import Leaderboard from "../components/leaderboard/Leaderboard";

interface RanksPageProps {
  resultService: IResultService;
  quizService: IQuizService;
}

const RanksPage: React.FC<RanksPageProps> = ({
  resultService,
  quizService,
}) => {
  const [results, setResults] = useState<ResultDto[]>([]);
  const [quizzes, setQuizzes] = useState<QuizDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuizId, setSelectedQuizId] = useState<number | "">("");
  const [timeFilter, setTimeFilter] = useState<"all" | "weekly" | "monthly">(
    "all"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allResults, allQuizzes] = await Promise.all([
          resultService.getAllResults(),
          quizService.getAll(),
        ]);
        setResults(allResults);
        setQuizzes(allQuizzes ?? []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [resultService, quizService]);

  if (loading) return <div className="container mt-4">Loading ranks...</div>;

  return (
    <div className="container mt-4">
      <h3>Leaderboard</h3>
      <Leaderboard
        results={results}
        quizzes={quizzes}
        selectedQuizId={selectedQuizId}
        timeFilter={timeFilter}
        onQuizChange={setSelectedQuizId}
        onTimeFilterChange={setTimeFilter}
      />
    </div>
  );
};

export default RanksPage;
