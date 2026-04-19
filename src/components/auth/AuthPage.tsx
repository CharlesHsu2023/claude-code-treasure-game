import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface Props {
  onLogin: (user: { id: number; email: string }) => void;
  onGuest?: () => void;
}

export default function AuthPage({ onLogin, onGuest }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl text-center mb-6 text-amber-900">🏴‍☠️ Treasure Hunt</h1>
        <Card className="border-2 border-amber-300 shadow-lg">
          <CardHeader>
            <CardTitle className="text-amber-900 text-center">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mode === 'login' ? (
              <LoginForm onLogin={onLogin} onSwitch={() => setMode('register')} />
            ) : (
              <RegisterForm onLogin={onLogin} onSwitch={() => setMode('login')} />
            )}
          </CardContent>
        </Card>
        {onGuest && (
          <div className="mt-4 text-center">
            <button
              onClick={onGuest}
              className="text-amber-700 text-sm underline hover:text-amber-900"
            >
              Play as Guest (scores won't be saved)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
