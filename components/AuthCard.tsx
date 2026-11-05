'use client';

import React from 'react';
import { LoginForm } from './auth/LoginForm';
import { SignUpForm } from './auth/SignUpForm';

export { LoginForm } from './auth/LoginForm';
export { SignUpForm } from './auth/SignUpForm';

interface AuthCardProps {
  initialMode?: 'login' | 'signup';
}

export function AuthCard({ initialMode = 'login' }: AuthCardProps) {
  return initialMode === 'signup' ? <SignUpForm /> : <LoginForm />;
}
