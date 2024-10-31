import { SignUp } from '@clerk/clerk-react';

export function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <SignUp 
        routing="path" 
        path="/sign-up" 
        signInUrl="/sign-in"
        afterSignUpUrl="/"
        appearance={{
          elements: {
            formButtonPrimary: 
              'bg-teal-500 hover:bg-teal-600 text-white rounded-lg px-4 py-2 w-full',
            socialButtonsProviderIcon: 
              'w-6 h-6',
            formFieldInput: 
              'w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            card: 
              'bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 w-full max-w-md'
          }
        }}
      />
    </div>
  );
}