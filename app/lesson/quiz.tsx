"use client";

import { useState, useTransition } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useAudio, useWindowSize, useMount } from "react-use";
import { toast } from "sonner";

import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { MAX_HEARTS } from "@/constants";
import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { ResultCard } from "./result-card";

import { Translate } from "./translate";
import { FillInBlank } from "./fill-in-blank";
import { ListenAndType } from "./listen-and-type";
import { Match } from "./match";
import { Speak } from "./speak";
import { Video } from "./video";

type QuizProps = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  userSubscription:
    | (typeof userSubscription.$inferSelect & {
        isActive: boolean;
      })
    | null;
};

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
}: QuizProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: "/incorrect.wav",
  });
  const [finishAudio] = useAudio({
    src: "/finish.mp3",
    autoPlay: true,
  });
  const { width, height } = useWindowSize();

  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) openPracticeModal();
  });

  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });
  
  // Ordena os desafios pela coluna "order" do banco
const sortedChallenges = [...initialLessonChallenges].sort((a, b) => a.order - b.order);
const [challenges] = useState(sortedChallenges);
  
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );

    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];


  // === PROTEÇÃO FORTE: Evita qualquer renderização quando a lição termina ===
  if (!challenge) {
    return (
      <>
        {finishAudio}
        <Confetti
          recycle={false}
          numberOfPieces={800}
          tweenDuration={8000}
          width={width}
          height={height}
        />
        <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
          <Image src="/finish.svg" alt="Finish" height={120} width={120} />
          <h1 className="text-2xl font-bold text-neutral-700 lg:text-4xl">
            Great job! <br /> You completed the lesson!
          </h1>
          <div className="flex w-full items-center gap-x-4">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard
              variant="hearts"
              value={userSubscription?.isActive ? Infinity : hearts}
            />
          </div>
        </div>

        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const onSelect = (id: number) => {
    if (status !== "none") return;

    setSelectedOption(id);
  };

  const onContinue = () => {
  
  // Lógica padrão para os outros tipos (SELECT, ASSIST, MATCH, SPEAK, VIDEO)
  if (!selectedOption && status === "none") return;

  if (status === "wrong") {
    setStatus("none");
    setSelectedOption(undefined);
    return;
  }

  if (status === "correct") {
    onNext();
    setStatus("none");
    setSelectedOption(undefined);
    return;
  }

  const correctOption = options.find((option) => option.correct);

  if (!correctOption) return;

  if (correctOption.id === selectedOption) {
    startTransition(() => {
      upsertChallengeProgress(challenge.id)
        .then((response) => {
          if (response?.error === "hearts") {
            openHeartsModal();
            return;
          }

          void correctControls.play();
          setStatus("correct");
          setPercentage((prev) => prev + 100 / challenges.length);

          if (initialPercentage === 100) {
            setHearts((prev) => Math.min(prev + 1, MAX_HEARTS));
          }
        })
        .catch(() => toast.error("Something went wrong. Please try again."));
    });
  } else {
    startTransition(() => {
      reduceHearts(challenge.id)
        .then((response) => {
          if (response?.error === "hearts") {
            openHeartsModal();
            return;
          }

          void incorrectControls.play();
          setStatus("wrong");

          if (!response?.error) setHearts((prev) => Math.max(prev - 1, 0));
        })
        .catch(() => toast.error("Something went wrong. Please try again."));
    });
  }
};

const title = 
  (challenge.type as string) === "ASSIST" 
    ? "Select the correct answer:"
    : (challenge.type as string) === "VIDEO" 
    ? "Watch the video and answer:"
    : (challenge.type as string) === "SPEAK" 
    ? "Speak out loud:"
    : (challenge.type as string) === "LISTEN_AND_TYPE" 
    ? "Listen and type what you hear:"
    : (challenge.type as string) === "MATCH" 
    ? "Match the pairs:"
    : challenge.question || "Choose the correct answer:";



      
  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />

    <div className="flex-1">
    <div className="flex h-full items-center justify-center">
    <div className="flex w-full flex-col gap-y-12 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0">
                  <h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">
              {title}
            </h1>

            <div>
              {/* === ASSIST === */}
              {(challenge.type as string) === "ASSIST" && (
                <>
                  <QuestionBubble question={challenge.question} />

                  {/* Botão de áudio */}
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => {
                        const textToSpeak = challenge.question
                          .replace(/Escute e escolha:?\s*/i, "")
                          .replace(/Escute:?\s*/i, "")
                          .trim();

                        if (!textToSpeak) return;

                        const utterance = new SpeechSynthesisUtterance(textToSpeak);
                        utterance.lang = "en-US";
                        utterance.rate = 0.92;
                        utterance.pitch = 1.05;
                        window.speechSynthesis.cancel();
                        window.speechSynthesis.speak(utterance);
                      }}
                      className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white text-7xl shadow-2xl hover:scale-110 active:scale-95 transition-all"
                      title="Ouvir a frase"
                    >
                      🔊
                    </button>
                  </div>

                  {/* AS 4 OPÇÕES DE RESPOSTA (IMPORTANTE!) */}
                  <Challenge
                    options={options}
                    onSelect={onSelect}
                    status={status}
                    selectedOption={selectedOption}
                    disabled={pending}
                    type={challenge.type}
                  />
                </>
              )}

              {/* SELECT */}
              {(challenge.type as string) === "SELECT" && (
                <Challenge
                  options={options}
                  onSelect={onSelect}
                  status={status}
                  selectedOption={selectedOption}
                  disabled={pending}
                  type={challenge.type}
                />
              )}

              {/* TRANSLATE */}
              {(challenge.type as string) === "TRANSLATE" && (
                <Translate
                  challenge={challenge}
                  onSelect={onSelect}
                  status={status}
                  selectedOption={selectedOption}
                  disabled={pending}
                />
              )}

              {/* FILL_IN_BLANK */}
              {(challenge.type as string) === "FILL_IN_BLANK" && (
                <FillInBlank
                  challenge={challenge}
                  onSelect={onSelect}
                  status={status}
                  selectedOption={selectedOption}
                  disabled={pending}
                />
              )}

              {/* LISTEN_AND_TYPE */}
              {(challenge.type as string) === "LISTEN_AND_TYPE" && (
                <ListenAndType
                key={challenge.id}          // ← ADICIONE ESTA LINHA
                challenge={challenge}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending}
              />
              )}

              {/* MATCH */}
              {(challenge.type as string) === "MATCH" && (
                <Match
                  challenge={challenge}
                  onSelect={onSelect}
                  status={status}
                  disabled={pending}
                />
              )}

              {/* SPEAK */}
              {(challenge.type as string) === "SPEAK" && (
                <Speak
                  challenge={challenge}
                  onSelect={onSelect}
                  status={status}
                  disabled={pending}
                />
              )}

              {/* VIDEO */}
              {(challenge.type as string) === "VIDEO" && (
                <Video
                  challenge={challenge}
                  onSelect={onSelect}
                  status={status}
                  selectedOption={selectedOption}
                  disabled={pending}
                />
              )}

            </div>
     </div>
    </div>
    </div>






      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};
