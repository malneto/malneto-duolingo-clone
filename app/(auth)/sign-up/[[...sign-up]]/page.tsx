import { SignUp } from "@clerk/nextjs";

const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  top: `${(i * 37 + 11) % 100}%`,
  left: `${(i * 61 + 7) % 100}%`,
  size: (i % 3) + 1,
  opacity: 0.12 + (i % 5) * 0.07,
}));

const SignUpPage = () => {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-4"
      style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #0f172a 60%, #1e1040 100%)" }}
    >
      {/* Starfield */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {STARS.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{ width: s.size, height: s.size, top: s.top, left: s.left, opacity: s.opacity }}
          />
        ))}
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #0891b2, transparent)" }} />
      </div>

      {/* Eyebrow */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <span className="text-4xl">🌌</span>
        <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-300">
          Sua aventura galáctica começa aqui!
        </p>
      </div>

      {/* Clerk sign-up widget */}
      <div className="relative z-10">
        <SignUp />
      </div>
    </div>
  );
};

export default SignUpPage;