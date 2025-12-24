"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, logout } from "@/lib/session";
import * as XLSX from "xlsx";

const ADMIN_EMAIL = "astha.j@srigorack.com";

type Result = {
  name: string;
  date: string;
  mcqScore: number;
  mcqTotal: number;
  wordsTyped: number;
  forcedSubmit: boolean;
};

export default function ResultPage() {
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }

    if (localStorage.getItem("authUser") !== ADMIN_EMAIL) {
      router.replace("/dashboard");
      return;
    }

    const stored = JSON.parse(
      localStorage.getItem("results") || "[]"
    );

    setResults(stored.reverse());
  }, []);

  /* ================= EXPORT TO EXCEL ================= */
  const exportToExcel = () => {
    const data = results.map((r) => ({
      Name: r.name,
      Date: r.date,
      "MCQ Score": r.mcqScore,
      "MCQ Total": r.mcqTotal,
      "Words Typed": r.wordsTyped,
      Status: r.forcedSubmit ? "Auto-submitted" : "Completed",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

    XLSX.writeFile(workbook, "assessment-results.xlsx");
  };

  return (
    <div className="layout results-scope">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>DAP</h2>

        <button
          className="btn-secondary"
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
        >
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="results-wrapper">
          <div className="results-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2>Assessment Results</h2>

              <button
                className="btn-primary"
                onClick={exportToExcel}
                disabled={results.length === 0}
              >
                Export to Excel
              </button>
            </div>

            {results.length === 0 ? (
              <p style={{ color: "#6b7280" }}>
                No results available yet.
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>MCQ Score</th>
                    <th>Words Typed</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((r, i) => (
                    <tr key={i}>
                      <td>{r.name}</td>
                      <td>
                        {r.mcqScore} / {r.mcqTotal}
                      </td>
                      <td>{r.wordsTyped}</td>
                      <td>{r.date}</td>
                      <td>
                        {r.forcedSubmit
                          ? "Auto-submitted"
                          : "Completed"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
