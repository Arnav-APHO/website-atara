import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Instagram, Mail, MapPin, Send } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { NextStepsNavigation } from "@/components/site/next-steps";
import { sendContactEmail } from "@/lib/contact-email";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Atara" },
      { name: "description", content: "Get in touch with Atara." },
      { property: "og:title", content: "Contact — Atara" },
      { property: "og:description", content: "Get in touch with Atara." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(100),
  email: z.string().trim().email("A valid email helps us reply").max(255),
  subject: z.string().trim().min(1, "Add a subject line").max(200),
  message: z.string().trim().min(5, "Tell us a little more").max(1500),
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Please check the form");
      return;
    }
    setSending(true);
    try {
      const result = await sendContactEmail({ data: form });
      if (result && !result.success) {
        toast.error(`Email Error: ${result.error || "Unknown"}`);
      } else {
        toast.success("Message sent! We'll reply to " + form.email);
        setForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong sending the email");
    }
    setSending(false);
  }

  return (
    <>
      <PageHero eyebrow="Contact" title="Say hello." italic="Say why.">
        <p className="text-lg leading-relaxed text-forest/80">
          Whether you're an NGO, a school, a sponsor or a student who wants in — send us a note. We reply to every one.
        </p>
      </PageHero>

      <section className="bg-cream pb-32">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 lg:grid-cols-[1fr_1.2fr] lg:px-10">
          <Reveal className="space-y-8">
            <div className="rounded-3xl border border-forest/10 bg-card p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-forest/50">Direct</p>
              <ul className="mt-6 space-y-5 text-forest">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-leaf" />
                  <a href="mailto:atara.wgs@gmail.com" className="story-link">atara.wgs@gmail.com</a>
                </li>
                <li className="flex items-start gap-3">
                  <Instagram className="mt-0.5 h-5 w-5 text-leaf" />
                  <a href="https://instagram.com/atara.fwgs" target="_blank" rel="noreferrer" className="story-link">@atara.fwgs</a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-leaf" />
                  <a
                    href="https://maps.app.goo.gl/Z4FgA49eLYyENNbv7"
                    target="_blank"
                    rel="noreferrer"
                    className="story-link"
                  >
                    Fountainhead Wockhardt Global School,<br />Aurangabad, Maharashtra, India
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="rounded-3xl border border-forest/10 bg-card p-8 lg:p-10">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.25em] text-forest/60">Name</span>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-xl border border-forest/15 bg-cream px-4 py-3 text-forest outline-none focus:border-leaf" maxLength={100} />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.25em] text-forest/60">Email</span>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-xl border border-forest/15 bg-cream px-4 py-3 text-forest outline-none focus:border-leaf" maxLength={255} />
                </label>
              </div>
              <label className="mt-6 block">
                <span className="text-xs uppercase tracking-[0.25em] text-forest/60">Subject</span>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-2 w-full rounded-xl border border-forest/15 bg-cream px-4 py-3 text-forest outline-none focus:border-leaf" maxLength={200} placeholder="What's this about?" />
              </label>
              <label className="mt-6 block">
                <span className="text-xs uppercase tracking-[0.25em] text-forest/60">Message</span>
                <textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-2 w-full resize-none rounded-xl border border-forest/15 bg-cream px-4 py-3 text-forest outline-none focus:border-leaf" maxLength={1500} />
              </label>
              <button type="submit" disabled={sending} className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-ink disabled:opacity-50">
                <Send className="h-4 w-4" />
                {sending ? "Sending…" : "Send message"}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <NextStepsNavigation
        title="Where to next?"
        subtitle="Explore our story and the impact we create together."
        steps={[
          {
            href: "/about",
            label: "About Atara",
            description: "How a Grade 9 project became a student-led movement for impact.",
          },
          {
            href: "/impact",
            label: "Our Impact",
            description: "Every rupee, event, and partnership we've stewarded since day one.",
          },
          {
            href: "/team",
            label: "Meet the Team",
            description: "The students behind every initiative, event, and partnership.",
          },
        ]}
      />
    </>
  );
}