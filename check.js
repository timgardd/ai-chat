const check = async () => {
  const res = await fetch("https://openrouter.ai/api/v1/models");
  const data = await res.json();
  const free = data.data.filter(
    (m) =>
      m.pricing && parseFloat(m.pricing.prompt) === 0 && parseFloat(m.pricing.completion) === 0,
  );
  console.log("Found", free.length, "free models. Top 5 are:");
  free.slice(0, 5).forEach((m) => console.log(m.id));
};
check();
