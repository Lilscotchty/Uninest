import React from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { MobileHome } from './MobileHome';
import { DesktopHome } from './DesktopHome';

export const Home: React.FC = () => {
  const isMobile = useIsMobile();

  return isMobile ? <MobileHome /> : <DesktopHome />;
};
