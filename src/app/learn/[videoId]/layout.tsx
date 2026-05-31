import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learning Player | K-MATE',
  description: 'Learn Korean with AI-powered subtitles and interactive vocabulary',
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark-500">
      {children}
    </div>
  );
}
