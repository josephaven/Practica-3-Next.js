type Props = { title: string; desc: string };
export default function FeatureCard({ title, desc }: Props) {
    return (
        <article className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{desc}</p>
        </article>
    );
}
