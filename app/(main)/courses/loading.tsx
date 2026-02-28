const Loading = () => {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-4"
      style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #0f172a 100%)" }}
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div
          className="absolute h-full w-full animate-spin rounded-full border-2 border-transparent"
          style={{ borderTopColor: "#22d3ee", borderRightColor: "rgba(34,211,238,0.2)", animationDuration: "1.2s" }}
        />
        <div
          className="absolute h-3/4 w-3/4 animate-spin rounded-full border-2 border-transparent"
          style={{ borderTopColor: "#8b5cf6", borderLeftColor: "rgba(139,92,246,0.2)", animationDuration: "0.8s", animationDirection: "reverse" }}
        />
        <span className="text-2xl">🪐</span>
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 animate-pulse">
        Carregando planetas...
      </p>
    </div>
  );
};

export default Loading;