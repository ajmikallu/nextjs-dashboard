import { auth } from '@/auth';

export async function UserBadge() {
  const session = await auth();

  return (
    <div className="flex items-center gap-2" aria-label={`Logged in as ${session?.user?.name}, role: ${session?.user?.role}`}>
      <span>{session?.user?.name}</span>
      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
        {session?.user?.role}
      </span>
    </div>
  );
}