"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, logout } from "@/lib/session";

const ADMIN_EMAIL = "astha.j@srigorack.com";

const CATEGORIES = [
  "Bleeding",
  "Cardiac Arrest",
  "Seizure",
  "Headache",
];

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }

    const userEmail = localStorage.getItem("authUser");
    setEmail(userEmail);

    const loadCategory = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setActiveCategory(data.category);
      } catch (err) {
        console.error("Failed to load category", err);
      }
    };

    loadCategory();
  }, []);

  const saveCategory = async () => {
    if (!selectedCategory) return;

    await fetch("/api/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: selectedCategory }),
    });

    setActiveCategory(selectedCategory);
    setSelectedCategory(null);
  };


  if (!email) return null;

  /* ================= ADMIN ================= */
  if (email === ADMIN_EMAIL) {
    return (
      <div className="layout admin-scope">
        <aside className="sidebar">
          <h2>DAP</h2>

          <button
            className="btn-primary"
            onClick={() => router.push("/result")}
          >
            View Results
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

        <main className="main">
          <h1>Admin Dashboard</h1>

          <div className="card" style={{ marginTop: "24px" }}>
            <h3>Select MCQ Category</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                const isSelected = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    className="btn-secondary"
                    style={{
                      border: isActive
                        ? "2px solid #10b981"
                        : isSelected
                        ? "2px solid #4f46e5"
                        : "1px solid #e5e7eb",
                    }}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {isActive ? "✔ " : ""}
                    {cat}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: "16px" }}>
              <button
                className="btn-primary"
                disabled={!selectedCategory}
                onClick={saveCategory}
              >
                Save Category
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* ================= CANDIDATE ================= */
  /* ================= CANDIDATE ================= */
  const categoryNotSet = !activeCategory;

  return (
    <div className="candidate-scope">
      <div className="exam-wrapper">
        <div className="exam-card">
          <h2>Assessment Instructions</h2>

          <p style={{ marginTop: "10px" }}>
            Category:{" "}
            <strong>
              {activeCategory ?? "Waiting for admin"}
            </strong>
          </p>

          {categoryNotSet && (
            <p style={{ color: "#dc2626", marginTop: "12px" }}>
              Test category has not been set by admin yet.
            </p>
          )}

          <div style={{ marginTop: "24px" }}>
            <button
              className="btn-primary"
              disabled={categoryNotSet}
              onClick={() => router.push("/mcq-test")}
            >
              Start Test
            </button>

            <button
              className="btn-secondary"
              style={{ marginLeft: "12px" }}
              onClick={() => {
                logout();
                router.replace("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

}
