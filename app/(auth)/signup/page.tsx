import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function SignUpPage() {
  async function handleSignUp(formData: FormData) {
    'use server'
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    
    if (!error) {
      redirect('/app');
    } else {
      return { error: error.message };
    }
  }
  
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-surface rounded-xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold font-syne text-text-primary mb-6">Create Account</h1>
        
        <form action={handleSignUp} className="space-y-4 font-dm-sans">
          <div>
            <label htmlFor="fullName" className="block text-sm text-text-secondary mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2 text-text-primary focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm text-text-secondary mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2 text-text-primary focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm text-text-secondary mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2 text-text-primary focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-2 px-4 rounded-lg transition duration-150"
            >
              Sign Up
            </button>
          </div>
          
          {/** Error messages will appear here */}
          <div id="error-message" className="text-red-400 text-sm"></div>
          
          <div className="text-center text-sm text-text-muted mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-accent hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}