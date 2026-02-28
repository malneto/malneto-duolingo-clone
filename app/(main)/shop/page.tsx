import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getUserSubscription } from "@/db/queries";

import { Items } from "./items";

const ShopPage = async () => {
  const [userProgress, userSubscription] = await Promise.all([
    getUserProgress(),
    getUserSubscription(),
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-col lg:flex-row-reverse gap-[48px] px-4 lg:px-6 pb-28 lg:pb-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        <Quests points={userProgress.points} />
      </StickyWrapper>

      <FeedWrapper>
        <div className="flex w-full flex-col items-center">

          {/* Icon with glow */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute h-24 w-24 rounded-full opacity-30 blur-2xl"
              style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }}
            />
            <Image src="/shop.svg" alt="Shop" height={90} width={90} className="relative drop-shadow-lg" />
          </div>

          <h1 className="my-5 text-center text-2xl font-extrabold text-white">
            🛸 Loja Galáctica
          </h1>
          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-indigo-300">
            Troque seus XP por poderes espaciais
          </p>

          {/* Divider */}
          <div className="mb-6 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)" }} />

          <Items
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={isPro}
          />
        </div>
      </FeedWrapper>
    </div>
  );
};

export default ShopPage;