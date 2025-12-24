const TOTAL_TIME = 30 * 60; // 30 minutes in seconds

export const startTestTimer = () => {
  if (!localStorage.getItem("testStartTime")) {
    localStorage.setItem("testStartTime", Date.now().toString());
  }
};

export const getRemainingTime = () => {
  const start = Number(localStorage.getItem("testStartTime"));
  const elapsed = Math.floor((Date.now() - start) / 1000);
  return Math.max(TOTAL_TIME - elapsed, 0);
};

export const clearTestTimer = () => {
  localStorage.removeItem("testStartTime");
};
