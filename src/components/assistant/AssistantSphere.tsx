
import React from 'react';
import ThreeJSScene from './ThreeJSScene';

interface AssistantSphereProps {
  isListening: boolean;
  isSpeaking: boolean;
  responseText: string;
}

const AssistantSphere: React.FC<AssistantSphereProps> = ({ isListening, isSpeaking, responseText }) => {
  return (
    <ThreeJSScene 
      isListening={isListening}
      isSpeaking={isSpeaking}
      responseText={responseText}
    />
  );
};

export default AssistantSphere;
