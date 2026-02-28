"use client";

import { Challenge } from "./challenge";

type ChallengeOption = {
  id: number;
  text: string;
  correct: boolean;
  imageSrc: string | null;
  audioSrc: string | null;
  challengeId: number;
  matchGroup: number | null;
};

type ChallengeType = {
  id: number;
  type: string;
  question: string;
  challengeOptions: ChallengeOption[];
};

type VideoProps = {
  challenge: ChallengeType;
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
};

export const Video = ({ challenge, onSelect, status, selectedOption, disabled }: VideoProps) => {
  const getYouTubeId = (url: string) => {
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(challenge.question || "");

  return (
    <div className="space-y-8 px-4">
      <p className="text-center text-sm font-bold uppercase tracking-widest text-indigo-300">
        🎬 Assista e responda
      </p>

      {videoId ? (
        <div
          className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl"
          style={{
            border: "2px solid rgba(99,102,241,0.4)",
            boxShadow: "0 0 40px rgba(99,102,241,0.2), 0 0 80px rgba(99,102,241,0.08)",
          }}
        >
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-3xl"
            />
          </div>
        </div>
      ) : (
        <div
          className="mx-auto flex max-w-3xl items-center justify-center rounded-3xl py-16"
          style={{
            border: "2px solid rgba(248,113,113,0.4)",
            background: "rgba(248,113,113,0.08)",
          }}
        >
          <p className="text-base font-bold" style={{ color: "#fca5a5" }}>
            ⚠️ Link do YouTube inválido ou não informado
          </p>
        </div>
      )}

      <Challenge
        options={challenge.challengeOptions}
        onSelect={onSelect}
        status={status}
        selectedOption={selectedOption}
        disabled={disabled}
        type={challenge.type}
      />
    </div>
  );
};