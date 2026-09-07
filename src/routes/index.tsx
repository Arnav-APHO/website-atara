import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

import heroImg from "@/assets/hero-botanical.jpg";
import { Reveal, RevealText } from "@/components/site/reveal";
import { Magnetic } from "@/components/site/magnetic";
import { Tilt } from "@/components/site/tilt";
import { Counter } from "@/components/site/counter";
import { AtaraMark } from "@/components/site/logo";
import { NextStepsNavigation } from "@/components/site/next-steps";
import { stats, causes, events, team } from "@/lib/atara-content";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <Whisper />
      <Stats />
      <Causes />
      <FeaturedEvents />
      <TeamOverview />
      <CtaBand />
      <NextStepsNavigation
        title="Where to next?"
        subtitle="Every section of Atara opens a new way to participate."
        steps={[
          {
            href: "/about",
            label: "Our Story",
            description: "How a Grade 9 Service as Action project became a student-led movement for impact.",
          },
          {
            href: "/causes",
            label: "Five Causes",
            description: "Education, animal welfare, healthcare, awareness, and community — pick your path.",
          },
          {
            href: "/team",
            label: "Meet the Team",
            description: "The students behind every event, reel, fundraiser, and partnership.",
          },
        ]}
      />
    </>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "-58%"]);
  const cardRotateY = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const cardRotateZ = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const cardScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <section ref={ref} data-cursor-tone="dark" className="relative h-[100svh] min-h-[720px] w-full overflow-hidden bg-ink">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img
          src={heroImg}
          alt="Atara hero botanical background"
          className="h-full w-full object-cover"
          width={1920}
          height={1280}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/30 to-ink/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent" />
      </motion.div>

      {/* A dimensional field-note card echoes the brochure's editorial layout. */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{ y: cardY, rotateY: cardRotateY, rotateZ: cardRotateZ, scale: cardScale }}
        className="perspective-scene absolute right-10 top-28 z-10 hidden lg:block"
      >
        <div data-cursor="hover" className="w-52 rounded-[1.5rem] border border-cream/25 bg-cream/10 p-5 text-cream shadow-[0_28px_80px_-28px_rgb(0_0_0_/_0.8)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <AtaraMark className="h-9 w-9 text-leaf" />
            <span className="text-[0.6rem] uppercase tracking-[0.28em] text-cream/65">Field note</span>
          </div>
          <p className="mt-8 font-display text-3xl font-light leading-none">2026</p>
          <div className="mt-5 h-px bg-cream/25" />
          <p className="mt-4 text-xs leading-relaxed text-cream/75">
            A living record of young people turning care into action.
          </p>
          <div className="mt-5 flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-leaf">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-leaf" />
            Current season
          </div>
        </div>
      </motion.div>

      <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-24 lg:px-10 lg:pb-32">
        <RevealText
          as="h1"
          delay={0.7}
          stagger={0.05}
          text="Small hands."
          className="font-display text-[clamp(3.2rem,10vw,9rem)] font-light leading-[0.9] text-cream text-balance"
        />
        <RevealText
          as="h1"
          delay={0.9}
          stagger={0.05}
          text="Lasting impact."
          className="font-display text-[clamp(3.2rem,10vw,9rem)] font-light italic leading-[0.9] text-leaf text-balance"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.9 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-cream/80"
        >
          ATARA is a student-led social impact initiative under the IB Service
          as Action Programme at Fountainhead Wockhardt Global School —
          transforming student talent into meaningful social impact through
          purpose driven events and initiatives.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.9 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic strength={0.35}>
            <Link
              to="/donate"
              className="group inline-flex items-center gap-3 rounded-full bg-cream px-7 py-4 text-sm font-medium text-forest transition-colors hover:bg-leaf hover:text-cream"
            >
              Support our mission
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
          </Magnetic>
          <Magnetic strength={0.35}>
            <Link
              to="/join"
              className="group inline-flex items-center gap-3 rounded-full border border-cream/30 px-7 py-4 text-sm font-medium text-cream backdrop-blur-md transition-colors hover:border-cream hover:bg-cream/10"
            >
              Join Atara
              <Sparkles className="h-4 w-4" />
            </Link>
          </Magnetic>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 1 }}
          className="absolute bottom-8 right-6 hidden items-center gap-3 text-xs uppercase tracking-[0.35em] text-cream/60 lg:flex lg:right-10"
        >
          <span>Scroll to explore</span>
          <div className="relative h-14 w-px bg-cream/30 overflow-hidden">
            <motion.div
              className="absolute inset-x-0 top-0 h-4 bg-leaf"
              animate={{ y: [-16, 56] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Whisper() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.15, 1, 1, 0.2]);
  const chapterY = useTransform(scrollYProgress, [0, 1], ["18%", "-24%"]);
  const chapterRotate = useTransform(scrollYProgress, [0, 1], [8, -6]);

  return (
    <section ref={ref} data-cursor-tone="light" className="paper-grid relative overflow-hidden bg-cream py-32 lg:py-52">
      <motion.span
        aria-hidden
        style={{ y: chapterY, rotateX: chapterRotate, transformPerspective: 1200 }}
        className="pointer-events-none absolute -right-6 top-10 hidden font-display text-[15rem] font-light leading-none text-forest/[0.055] lg:block"
      >
        01
      </motion.span>
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <p className="mb-8 text-xs uppercase tracking-[0.4em] text-forest/60">Our reason</p>
        <motion.h2
          style={{ opacity }}
          className="font-display text-[clamp(2rem,5vw,4.5rem)] font-light leading-[1.1] text-forest text-balance"
        >
          We believe leadership begins with compassion —{" "}
          <span className="italic text-leaf">
            and that every student has the power to create meaningful change.
          </span>{" "}
          Every event we run, every rupee we raise, every reel we post reflects
          our commitment to transforming talent into impact and ideas into action.
        </motion.h2>
      </div>
    </section>
  );
}

function Stats() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const gridY = useTransform(scrollYProgress, [0, 0.45, 1], ["16%", "0%", "-6%"]);
  const gridRotate = useTransform(scrollYProgress, [0, 0.45, 1], [9, 0, -2]);

  return (
    <section ref={ref} data-cursor-tone="dark" className="relative overflow-hidden bg-forest py-24 text-cream lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-cream/60">By the numbers</p>
            <h2 className="max-w-2xl font-display text-4xl font-light leading-[1.05] md:text-6xl">
              Real impact,
              <br />
              measured honestly.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-cream/70">
            Every figure below is tracked and traceable to a specific event,
            donation or partner. Transparency is the currency of trust.
          </p>
        </Reveal>

        <motion.div
          style={{ y: gridY, rotateX: gridRotate, transformPerspective: 1400 }}
          className="grid gap-px overflow-hidden rounded-3xl border border-cream/10 shadow-[0_34px_80px_-48px_rgb(0_0_0_/_0.8)] md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              data-cursor-card
              className="stats-card group bg-forest p-8 lg:p-10"
            >
              <Counter
                to={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                className="stats-counter block font-display text-6xl font-light text-leaf lg:text-7xl"
              />
              <p className="stats-label mt-6 text-sm leading-relaxed text-cream/75">
                {s.label}
              </p>
            </Reveal>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Causes() {
  return (
    <section data-cursor-tone="light" className="relative overflow-hidden bg-cream py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-forest/60">Causes we support</p>
            <h2 className="max-w-2xl font-display text-4xl font-light leading-[1.05] text-forest md:text-6xl">
              Five threads,
              <br />
              <span className="italic text-leaf">one shared root.</span>
            </h2>
          </div>
          <Link
            to="/causes"
            className="story-link inline-flex items-center gap-2 self-start text-sm font-medium text-forest md:self-end"
          >
            All causes <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 perspective-scene">
          {causes.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06}>
              <Tilt className="w-full">
                <Link
                  to="/causes/$slug"
                  params={{ slug: c.slug }}
                  data-cursor="hover"
                  className="group relative block h-full overflow-hidden rounded-[2rem] border border-forest/10 bg-card"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={c.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${c.tone} mix-blend-multiply`} />
                  </div>
                  <div className="p-7">
                    <p className="text-xs uppercase tracking-[0.3em] text-forest/50">{c.title}</p>
                    <h3 className="mt-3 font-display text-2xl font-medium text-forest">{c.lead}</h3>
                    <div className="mt-6 flex items-center justify-between text-sm text-forest/70">
                      <span>Read more</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                  </Link>
                </Tilt>
              </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedEvents() {
  return (
    <section data-cursor-tone="dark" className="relative overflow-hidden bg-ink py-28 text-cream lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-cream/50">Fundraisers & Events</p>
            <h2 className="max-w-2xl font-display text-4xl font-light leading-[1.05] md:text-6xl">
              Stages we've built for
              <br />
              <span className="italic text-leaf">young voices.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2 perspective-scene">
          {events.map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.08}>
              <Tilt className="w-full">
                <Link
                  to="/events/$slug"
                  params={{ slug: e.slug }}
                  data-cursor="hover"
                  className="group relative block h-full overflow-hidden rounded-[2rem] border border-cream/10"
                >
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <img
                      src={e.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                    <div className="absolute inset-x-8 bottom-8">
                      <p className="text-xs uppercase tracking-[0.3em] text-leaf">
                        {e.kicker} · {e.date}
                      </p>
                      <h3 className="mt-3 font-display text-3xl font-light lg:text-4xl">
                        {e.title}
                      </h3>
                      <p className="mt-3 hidden max-w-md text-sm text-cream/75 md:block">
                        {e.summary}
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.25em] text-cream/60">
                        <span>{e.participants}+ participants</span>
                        <span className="text-cream/30">•</span>
                        <span>For {e.beneficiaries}</span>
                      </div>
                    </div>
                  </div>
                  </Link>
                </Tilt>
              </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamOverview() {
  const coreTeam = team.filter((member) => member.role !== "Volunteer");

  return (
    <section data-cursor-tone="light" className="relative overflow-hidden bg-cream py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-forest/60">Our Team</p>
            <RevealText
              as="h2"
              stagger={0.05}
              text="A team of changemakers. One shared vision."
              className="font-display text-4xl font-light leading-[1.15] text-forest md:text-6xl text-balance"
            />
            <Reveal delay={0.3} className="mt-6 text-base leading-relaxed text-forest/80">
              <p>
                What began as a Service as Action project became a full initiative
                the moment other students said, <em>"can I help?"</em> That single
                question is the reason ATARA exists — and it's the reason we keep
                choosing bigger causes than we're supposed to. We are young people
                building the muscle to care in public, one initiative at a time.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.5}>
            <Magnetic strength={0.35}>
              <Link
                to="/team"
                className="group inline-flex items-center gap-3 rounded-full border border-forest/30 px-7 py-4 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-cream"
              >
                Meet the full team
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
            </Magnetic>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {coreTeam.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.04}>
              <article
                data-cursor-card
                className="team-card group relative overflow-hidden rounded-3xl border border-forest/10 bg-card p-6"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem]">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                </div>
                <h3 className="mt-6 font-display text-xl font-medium">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] opacity-60">
                  {member.role}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section data-cursor-tone="light" className="relative overflow-hidden bg-leaf py-28 text-forest lg:py-40">
      <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply">
        <div className="absolute -left-40 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-forest blur-3xl" />
        <div className="absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-palm blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-10">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-forest/70">The next chapter</p>
        <RevealText
          as="h2"
          stagger={0.05}
          text="Be part of what happens next."
          className="font-display text-5xl font-light leading-[1.05] md:text-7xl text-balance"
        />
        <Reveal delay={0.2} className="mx-auto mt-8 max-w-xl text-lg text-forest/80">
          Support a cause, join the team, or start your own impact journey with
          ATARA. Every hand shapes the next change we make.
        </Reveal>
        <Reveal delay={0.35} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Magnetic strength={0.35}>
            <Link
              to="/donate"
              className="inline-flex items-center gap-3 rounded-full bg-forest px-8 py-4 text-sm font-medium text-cream transition-colors hover:bg-ink"
            >
              Support us <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Magnetic>
          <Magnetic strength={0.35}>
            <Link
              to="/join"
              className="inline-flex items-center gap-3 rounded-full border-2 border-forest/40 px-8 py-4 text-sm font-medium text-forest transition-colors hover:border-forest hover:bg-forest/10"
            >
              Join the team
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
