"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { typingTests } from "@/data/typing-tests";

const ADMIN_EMAIL = "astha.j@srigorack.com";
const QUESTION_TIME = 150; // 2 min 30 sec
const TOTAL_TESTS = 5;

export default function TypingTestPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [submitted, setSubmitted] = useState(false);

  /* =============================
     AUTH CHECK (SAFE)
  ============================== */
  useEffect(() => {
    const e = localStorage.getItem("authUser");
    setEmail(e);

    if (e === ADMIN_EMAIL) {
      router.replace("/dashboard");
    }
  }, []);

  /* =============================
     TIMER (VISIBLE + RESET)
  ============================== */
  useEffect(() => {
    if (timeLeft <= 0) {
      submitCurrentTest(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  /* =============================
     TAB CHANGE → AUTO SUBMIT
  ============================== */
  useEffect(() => {
    const handleAutoSubmit = () => {
      submitCurrentTest(true);
    };

    window.addEventListener("blur", handleAutoSubmit);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) handleAutoSubmit();
    });

    return () => {
      window.removeEventListener("blur", handleAutoSubmit);
    };
  }, [currentIndex, text]);

  /* =============================
     SUBMIT CURRENT QUESTION
  ============================== */
  const submitCurrentTest = (forced: boolean) => {
    if (submitted) return;
    setSubmitted(true);

    const wordsTyped = text.trim()
      ? text.trim().split(/\s+/).length
      : 0;

    const progress = JSON.parse(
      localStorage.getItem("typingProgress") ||
        JSON.stringify({ index: 0, words: [], forced: false })
    );

    progress.words[currentIndex] = wordsTyped;
    progress.index = currentIndex + 1;
    progress.forced = progress.forced || forced;

    localStorage.setItem("typingProgress", JSON.stringify(progress));

    // ➡ Next typing test
    if (progress.index < TOTAL_TESTS) {
      setCurrentIndex(progress.index);
      setText("");
      setTimeLeft(QUESTION_TIME); // 🔑 TIMER RESET
      setSubmitted(false);
      return;
    }

    // ➡ Final submission
    const baseResult = JSON.parse(
      localStorage.getItem("currentResult")!
    );

    const totalWords = progress.words.reduce(
      (a: number, b: number) => a + b,
      0
    );

    const finalResult = {
      ...baseResult,
      typing: progress.words,
      totalWords,
      forcedSubmit: baseResult.forcedSubmit || progress.forced,
    };

    const results = JSON.parse(
      localStorage.getItem("results") || "[]"
    );

    results.push(finalResult);
    localStorage.setItem("results", JSON.stringify(results));

    localStorage.removeItem("typingProgress");
    localStorage.removeItem("currentResult");

    router.replace("/dashboard");
  };

  /* =============================
     RENDER (ALWAYS)
  ============================== */
  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className="candidate-scope">
      {/* HEADER — TIMER IS HERE */}
      <div className="exam-header">
        <span>
          Typing Test {currentIndex + 1} / {TOTAL_TESTS}
        </span>
        <span>
          ⏱ {minutes}:{seconds}
        </span>
      </div>

      <div className="exam-wrapper">
        <div className="exam-card">
          <div className="exam-paragraph">
            {typingTests[currentIndex].text}
          </div>

          <textarea
            className="exam-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitted}
            placeholder="Start typing here..."
          />

          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <button
              className="btn-primary"
              onClick={() => submitCurrentTest(false)}
              disabled={submitted}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
