import { Button } from '../ui/button';

interface Props {
  user: { id: number; email: string };
  onLogout: () => void;
}

export default function UserHeader({ user, onLogout }: Props) {
  return (
    <div className="w-full flex justify-between items-center px-6 py-3 bg-amber-200/80 border-b-2 border-amber-400 backdrop-blur-sm">
      <span className="text-amber-900 text-sm">
        Logged in as <strong>{user.email}</strong>
      </span>
      <Button
        onClick={onLogout}
        variant="outline"
        className="text-sm border-amber-500 text-amber-800 hover:bg-amber-300"
      >
        Logout
      </Button>
    </div>
  );
}
