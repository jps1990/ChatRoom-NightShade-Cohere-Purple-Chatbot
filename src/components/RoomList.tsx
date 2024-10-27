import React from 'react';
import { Hash, Bot } from 'lucide-react';
import { useStore } from '../store';

const RoomList: React.FC = () => {
  const { rooms, currentRoom, setCurrentRoom } = useStore();

  return (
    <div className="space-y-2">
      {rooms.map((room) => (
        <button
          key={room.id}
          onClick={() => setCurrentRoom(room.id)}
          className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentRoom === room.id
              ? 'bg-purple-500/30'
              : 'hover:bg-purple-500/20'
          }`}
        >
          {room.isPermanent ? (
            <Bot className="w-4 h-4" />
          ) : (
            <Hash className="w-4 h-4" />
          )}
          <span className="truncate">{room.name}</span>
        </button>
      ))}
    </div>
  );
};

export default RoomList;