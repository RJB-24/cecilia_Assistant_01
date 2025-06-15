
import React from 'react';
import ApiKeyManager from '@/components/settings/ApiKeyManager';
import MainLayout from '@/components/layout/MainLayout';

const Settings: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <ApiKeyManager />
      </div>
    </MainLayout>
  );
};

export default Settings;
