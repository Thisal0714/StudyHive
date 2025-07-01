import NotFound from '@/app/components/not-found';

export default function TestPage() {
  const show404 = true;

  if (show404) {
    return < NotFound /> ; // this will auto-route to app/not-found.tsx
  }

  return (
    <div>This page loaded fine 🎉</div>
  );
} 