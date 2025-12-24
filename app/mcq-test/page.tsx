"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import mcqs from "@/data/mcqs.json";
import { getCurrentDate, getNameFromEmail } from "@/lib/utils";


export default function MCQTestPage() {
  const ADMIN_EMAIL = "astha.j@srigorack.com";
  const router = useRouter();

  const email = localStorage.getItem("authUser");
  if (email === ADMIN_EMAIL) {
    router.replace("/dashboard");
    return null;
  }

  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategory(data.category);
      } catch (err) {
        console.error("Failed to load category", err);
      }
    };

    loadCategory();
  }, []);

  const questions = mcqs.filter(q => q.category === category);

  const [answers, setAnswers] = useState<number[]>(
    Array(questions.length).fill(-1)
  );

  // 🚨 Auto-submit on tab change
  useEffect(() => {
    const autoSubmit = () => submitMCQ(true);
    window.addEventListener("blur", autoSubmit);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) autoSubmit();
    });
    return () => window.removeEventListener("blur", autoSubmit);
  }, []);

  const submitMCQ = (forced: boolean) => {
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) score++;
    });

    const result = {
      name: getNameFromEmail(email!),
      date: getCurrentDate(),
      mcqScore: score,
      mcqTotal: questions.length,
      wordsTyped: 0,
      forcedSubmit: forced,
    };

    localStorage.setItem("currentResult", JSON.stringify(result));
    router.replace("/typing-test");
  };

  return (
    <div className="candidate-scope">
      <div className="exam-header">
        <span>MCQ Test — {category}</span>
        <span>{questions.length} Questions</span>
      </div>

      <div className="exam-wrapper">
        {questions.map((q, i) => (
          <div className="exam-card" key={i}>
            <h4>{i + 1}. {q.question}</h4>
            {q.options.map((opt, idx) => (
              <label className="exam-option" key={idx}>
                <input
                  type="radio"
                  checked={answers[i] === idx}
                  onChange={() => {
                    const copy = [...answers];
                    copy[i] = idx;
                    setAnswers(copy);
                  }}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
      </div>

      <button
        className="btn-primary btn-sticky"
        onClick={() => submitMCQ(false)}
      >
        Submit MCQs
      </button>
    </div>
  );
}
