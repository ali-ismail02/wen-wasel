import React from 'react';
import { useSelector } from 'react-redux';
import { DrawerStack } from './DrawerStack';
import {OnboardingStack} from './OnboardingStack';

export function StackSwitcher() {
  const user = useSelector((state) => state?.user);

  // for drawer navigation
  return user?.userProfile ? <DrawerStack /> : <OnboardingStack />;
}
