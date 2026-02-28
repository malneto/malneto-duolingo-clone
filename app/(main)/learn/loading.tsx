const Loading = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4"
      style={{
        background: "linear-gradient(180deg, #f0fdf4 0%, #f0f9ff 100%)",
      }}
    >
      {/* Animated mascot */}
      <div className="animate-bounce text-7xl">🦉</div>

      {/* Loading dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-3 w-3 rounded-full bg-green-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <p className="text-sm font-bold text-green-600 tracking-wide">
        Preparando sua aventura...
      </p>
    </div>
  );
};

export default Loading;