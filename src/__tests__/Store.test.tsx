// Test to verify stores are properly configured
import { create } from 'zustand';

interface TestStore {
  count: number;
  increment: () => void;
}

describe('Zustand Store', () => {
  it('should create a store with initial state', () => {
    const useTestStore = create<TestStore>((set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }));

    expect(useTestStore.getState().count).toBe(0);
  });

  it('should update state correctly', () => {
    const useTestStore = create<TestStore>((set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }));

    useTestStore.getState().increment();
    expect(useTestStore.getState().count).toBe(1);

    useTestStore.getState().increment();
    expect(useTestStore.getState().count).toBe(2);
  });
});
