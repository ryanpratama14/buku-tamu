import { type Session } from "next-auth";
import { create } from "zustand";

type StateItems = {
  session: Session | null;
  setSession: (session: Session) => void;
};

export const useZustand = create<StateItems>((set) => ({
  session: null,
  setSession: (session) => set(() => ({ session })),
}));
