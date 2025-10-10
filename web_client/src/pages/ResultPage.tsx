import React, { useEffect, useState } from "react";
import type { ResultDto } from "../models/models";
import type { IResultService } from "../services/IResultService";
import { jwtDecode } from "jwt-decode";
import { ResultDetails } from "../components/result/ResultDetails";

interface ResultsPageProps {
  resultService: IResultService;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ resultService }) => {
  const [results, setResults] = useState<ResultDto[]>([]);
  const [selectedResult, setSelectedResult] = useState<ResultDto | null>(null);
  const [loading, setLoading] = useState(true);

  const { id, role } = jwtDecode<{ id: string; role: string }>(
    localStorage.getItem("jwt") ?? ""
  );

  const currentUserId = parseInt(id || "0");
  const currentRole = role || "User";

  useEffect(() => {
    const fetchResults = async () => {
      try {
        let data = await resultService.getAllResults();

        if (currentRole !== "Admin") {
          data = data.filter((r: ResultDto) => r.userId === currentUserId);
        }

        const uniqueData = Array.from(
          new Map(
            data.map((r) => [
              `${r.quizId}-${r.userId}-${new Date(r.solvedAt).toISOString()}`,
              r,
            ])
          ).values()
        );

        setResults(uniqueData);
      } catch (err) {
        console.error("Failed to load results", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [resultService, currentUserId, currentRole]);

  if (loading) return <div className="container mt-4">Loading results...</div>;

  return (
    <div className="container mt-4">
      <h3>{currentRole === "Admin" ? "All Results" : "My Results"}</h3>

      {/* Results list */}
      {!selectedResult && (
        <div className="row mt-3">
          {results.map((res) => (
            <div key={res.id} className="col-md-6 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{res.quizDto.title}</h5>
                  <p className="card-text">
                    Solved at: {new Date(res.solvedAt).toLocaleString()} <br />
                    User: {res.username}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setSelectedResult(res)}
                  >
                    View details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Result details */}
      {selectedResult && (
        <ResultDetails
          result={selectedResult}
          allResults={results}
          onBack={() => setSelectedResult(null)}
        />
      )}
    </div>
  );
};

export default ResultsPage;
