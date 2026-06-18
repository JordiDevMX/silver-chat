import { Plus, Camera } from "lucide-react";
import { myStory, recentStories, viewedStories, type Story } from "@/data/mockStories";

function StoryRow({ story, isMine = false }: { story: Story; isMine?: boolean }) {
  const ringClass = isMine
    ? "ring-2 ring-border"
    : story.viewed
      ? "ring-2 ring-border"
      : "ring-2 ring-[var(--neon)] shadow-glow";

  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-muted/60 transition-colors text-left"
    >
      <div className="relative shrink-0">
        <div
          className={`size-14 rounded-full p-[2px] ${ringClass}`}
          style={{ background: isMine ? undefined : "transparent" }}
        >
          <div
            className="size-full rounded-full border-2 border-background"
            style={{ background: story.avatarGradient }}
          />
        </div>
        {isMine && (
          <span className="absolute -bottom-0.5 -right-0.5 size-5 rounded-full bg-[var(--neon)] text-primary-foreground grid place-items-center border-2 border-background">
            <Plus className="size-3" strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground truncate">{story.author}</p>
        <p className="text-xs text-muted-foreground truncate">
          {isMine ? "Tap to add to your story" : story.caption}
        </p>
      </div>
      <span className="text-xs text-muted-foreground shrink-0">{story.time}</span>
    </button>
  );
}

function StoryCard({ story }: { story: Story }) {
  return (
    <button
      type="button"
      className="relative shrink-0 w-28 h-44 rounded-2xl overflow-hidden text-left shadow-silver group"
      style={{ background: story.preview }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div
        className={`absolute top-2 left-2 size-9 rounded-full p-[2px] ${
          story.viewed ? "ring-2 ring-white/40" : "ring-2 ring-[var(--neon)]"
        }`}
      >
        <div
          className="size-full rounded-full border-2 border-black/30"
          style={{ background: story.avatarGradient }}
        />
      </div>
      <p className="absolute bottom-2 left-2 right-2 text-xs font-medium text-white truncate">
        {story.author.split(" ")[0]}
      </p>
    </button>
  );
}

export function Updates() {
  return (
    <div className="pb-24">
      {/* My status row */}
      <section className="px-2 pt-4">
        <h2 className="px-4 mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Status
        </h2>
        {myStory && <StoryRow story={myStory} isMine />}
      </section>

      {/* Recent updates carousel */}
      <section className="mt-2">
        <h2 className="px-6 mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recent updates
        </h2>
        <div className="flex gap-3 overflow-x-auto px-4 pb-3 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {/* Add-to-story card */}
          <button
            type="button"
            className="relative shrink-0 w-28 h-44 rounded-2xl overflow-hidden text-left border border-dashed border-border bg-muted/40 grid place-items-center hover:bg-muted transition-colors"
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="size-10 rounded-full bg-[var(--neon)] text-primary-foreground grid place-items-center shadow-glow">
                <Camera className="size-5" />
              </div>
              <span className="text-xs font-medium">Add story</span>
            </div>
          </button>
          {recentStories.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </div>
      </section>

      {/* Viewed updates list */}
      <section className="mt-4 px-2">
        <h2 className="px-4 mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Viewed updates
        </h2>
        <div className="flex flex-col">
          {viewedStories.map((s) => (
            <StoryRow key={s.id} story={s} />
          ))}
        </div>
      </section>
    </div>
  );
}
