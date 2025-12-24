export const getNameFromEmail = (email: string) => {
  const [namePart] = email.split("@");
  const [first, last] = namePart.split(".");
  return (
    first.charAt(0).toUpperCase() +
    first.slice(1) +
    " " +
    last.charAt(0).toUpperCase()
  );
};

export const getCurrentDate = () => {
  const d = new Date();
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatTimeTaken = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};
