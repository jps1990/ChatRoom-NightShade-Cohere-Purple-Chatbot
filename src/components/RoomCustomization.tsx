import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store';

const ROOM_ICONS = [
  '🌙', '👻', '🎭', '🖤', '🌌', '🎪', '🗝️', '🕯️', '🎩', '🔮',
  '⚰️', '🦇', '🕸️', '🌑', '🃏', '🗡️', '⚔️', '🏰', '🌘', '💀'
];

interface Props {
  room: {
    id: string;
    name: string;
    icon: string;
  };
  onClose: () => void;
}

export const RoomCustomization: React.FC<Props> = ({ room, onClose }) => {
  const { updateRoom } = useStore();
  const [name, setName] = useState(room.name);
  const [selectedIcon, setSelectedIcon] = useState(room.icon);

  const handleSave = () => {
    if (name.trim()) {
      updateRoom(room.id, {
        name: name.trim(),
        icon: selectedIcon,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-purple-900/30 backdrop-blur-lg rounded-lg p-6 w-96 border border-purple-500/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Customize Room</h2>
          <button onClick={onClose} className="p-2 hover:bg-purple-500/20 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Room Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-purple-900/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Room Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {ROOM_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`text-2xl p-2 rounded-lg hover:bg-purple-500/20 ${
                    selectedIcon === icon ? 'bg-purple-500/30' : ''
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-6 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCustomization;