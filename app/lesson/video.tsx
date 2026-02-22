"use client";

type ChallengeOption = {
  id: number;
  text: string;
  correct: boolean;
};

type Challenge = {
  id: number;
  type: string;
  question: string; // Aqui vai o link completo do YouTube
  challengeOptions: ChallengeOption[];
};

type VideoProps = {
  challenge: Challenge;
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
};

export const Video = ({
  challenge,
  onSelect,
  status,
  selectedOption,
  disabled,
}: VideoProps) => {
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(challenge.question || "");

  return (
    <div className="space-y-6 px-4">
      <div className="text-center">
        <p className="text-2xl font-medium text-neutral-700 mb-4">
          
        </p>
      </div>

      {videoId ? (
        <div className="aspect-video w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
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
      ) : (
        <p className="text-red-500 text-center text-lg">
          Link do YouTube inválido ou não informado
        </p>
      )}

      <div className="pt-8 text-center text-neutral-500 text-sm">
        
      </div>
    </div>
  );
};