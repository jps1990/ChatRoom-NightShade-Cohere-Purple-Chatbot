import React from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  isGenerating: boolean;
}

export const BotMessage: React.FC<Props> = ({ isGenerating }) => {
  if (!isGenerating) return null;

  return (
    <div className="flex justify-start px-4 pb-4">
      <div className="bg-blue-500/20 text-blue-100 p-3 rounded-lg flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Crafting a witty response...
      </div>
    </div>
  );
};