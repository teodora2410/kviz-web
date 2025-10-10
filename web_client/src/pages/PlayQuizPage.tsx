import React from "react";
import { useParams } from "react-router-dom";
import type { IQuizService } from "../services/IQuizService";
import PlayQuizComponent from "../components/quiz/PlayQuizComponent";
import type { IResultService } from "../services/IResultService";

interface PlayQuizPageProps {
  quizService: IQuizService;
  resultService: IResultService;
}

const PlayQuizPage: React.FC<PlayQuizPageProps> = ({
  quizService,
  resultService,
}) => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <div>Invalid quiz id</div>;

  return (
    <PlayQuizComponent
      quizId={Number(id)}
      quizService={quizService}
      resultService={resultService}
    />
  );
};

export default PlayQuizPage;
