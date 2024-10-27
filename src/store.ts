import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface ChatRoom {
  id: string;
  name: string;
  icon: string;
  messages: Message[];
  users: User[];
  isPermanent?: boolean;
}

interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
  isBot?: boolean;
  expiresAt: number;
}

interface Store {
  currentUser: User | null;
  rooms: ChatRoom[];
  currentRoom: string | null;
  showSettings: boolean;
  setCurrentUser: (user: User) => void;
  addRoom: (room: Omit<ChatRoom, 'id'>) => void;
  updateRoom: (roomId: string, updates: Partial<ChatRoom>) => void;
  setCurrentRoom: (roomId: string) => void;
  toggleSettings: () => void;
  addMessage: (roomId: string, message: Omit<Message, 'id' | 'timestamp' | 'expiresAt'>) => Promise<void>;
  deleteExpiredMessages: () => void;
  initializeBotRoom: () => void;
}

const MESSAGE_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes

const BOT_ROOM: ChatRoom = {
  id: 'bot-room',
  name: "Jester's Asylum",
  icon: '🃏',
  messages: [],
  users: [],
  isPermanent: true,
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      currentUser: null,
      rooms: [BOT_ROOM],
      currentRoom: null,
      showSettings: false,
      setCurrentUser: (user) => {
        set({ currentUser: user });
        const state = get();
        const botRoom = state.rooms.find(r => r.id === 'bot-room');
        if (botRoom && !botRoom.users.some(u => u.id === user.id)) {
          set({
            rooms: state.rooms.map(room =>
              room.id === 'bot-room'
                ? { ...room, users: [...room.users, user] }
                : room
            ),
          });
        }
      },
      addRoom: (room) => 
        set((state) => ({ 
          rooms: [...state.rooms, { ...room, id: nanoid() }] 
        })),
      updateRoom: (roomId, updates) =>
        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.id === roomId && !room.isPermanent ? { ...room, ...updates } : room
          ),
        })),
      setCurrentRoom: (roomId) => set({ currentRoom: roomId }),
      toggleSettings: () => set((state) => ({ showSettings: !state.showSettings })),
      addMessage: async (roomId, message) => {
        return new Promise((resolve) => {
          set((state) => ({
            rooms: state.rooms.map((room) =>
              room.id === roomId
                ? {
                    ...room,
                    messages: [
                      ...room.messages,
                      {
                        ...message,
                        id: nanoid(),
                        timestamp: Date.now(),
                        expiresAt: Date.now() + MESSAGE_EXPIRY_TIME,
                      },
                    ],
                  }
                : room
            ),
          }));
          resolve();
        });
      },
      deleteExpiredMessages: () =>
        set((state) => ({
          rooms: state.rooms.map((room) => ({
            ...room,
            messages: room.messages.filter(
              (msg) => msg.expiresAt > Date.now()
            ),
          })),
        })),
      initializeBotRoom: () => {
        const state = get();
        if (!state.rooms.some(room => room.id === 'bot-room')) {
          set({ rooms: [BOT_ROOM, ...state.rooms] });
        }
      },
    }),
    {
      name: 'nightshade-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        rooms: state.rooms.map(room => ({
          ...room,
          messages: room.messages.filter(msg => msg.expiresAt > Date.now())
        })),
      }),
    }
  )
);