import { NurseCheckinForm } from '@/components/nurse-checkin-form';

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-hero-radial opacity-90" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <NurseCheckinForm />
      </div>
    </main>
  );
}
