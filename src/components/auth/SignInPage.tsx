import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const SignInPage: React.FC = () => {
  return (
    <div className="flex justify-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'bg-transparent shadow-none',
            headerTitle: 'text-white',
            headerSubtitle: 'text-gray-400',
            socialButtonsBlockButton: {
              backgroundColor: 'rgb(31, 41, 55)',
              border: '1px solid rgb(75, 85, 99)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgb(55, 65, 81)',
              },
            },
            dividerLine: 'bg-gray-600',
            dividerText: 'text-gray-400',
            formFieldLabel: 'text-gray-300',
            formFieldInput: 'bg-gray-700 border-gray-600 text-white',
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
            footerActionLink: 'text-blue-400 hover:text-blue-300',
          },
          layout: {
            socialButtonsPlacement: 'bottom' as const,
            socialButtonsVariant: 'iconButton' as const,
            privacyPageUrl: 'https://clerk.com/privacy',
            termsPageUrl: 'https://clerk.com/terms',
          },
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        redirectUrl="/workspace"
        afterSignInUrl="/workspace"
      />
    </div>
  );
};

export default SignInPage;
