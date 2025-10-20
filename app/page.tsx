import { Hero, FeaturesSection, TeamSection } from "@/components/home";

export default function Home() {
    return (
        <main className="min-h-screen bg-white text-slate-900">
            <Hero />
            <FeaturesSection />
            <div className="my-12 border-t border-slate-200" />
            <TeamSection />
        </main>
    );
}
