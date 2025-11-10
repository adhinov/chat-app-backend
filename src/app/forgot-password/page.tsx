import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground">This is a placeholder for the forgot password page.</p>
        <Link href="/" className="mt-4 inline-block text-accent hover:underline">
          &larr; Back to Login
        </Link>
      </div>
    </div>
  );
}
