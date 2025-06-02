import type { CustomerOrder } from 'dtos';
import { create } from 'zustand';

interface OrderStore {
  selectedCustomerOrder: CustomerOrder | null;
  setSelectedCustomerOrder: (order: CustomerOrder | null) => void;
};


const useOrderStore = create<OrderStore>((set) => ({
  selectedCustomerOrder: null,
  setSelectedCustomerOrder: (order: CustomerOrder | null) => set({ selectedCustomerOrder: order }),
}));

export default useOrderStore