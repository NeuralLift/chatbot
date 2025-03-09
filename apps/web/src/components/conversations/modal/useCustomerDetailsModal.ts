import { create } from 'zustand';

interface CustomerDetailsModalState {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

export const useCustomerDetailsModalStore = create<CustomerDetailsModalState>(
  (set) => ({
    open: false,
    handleOpen: () => set({ open: true }),
    handleClose: () => set({ open: false }),
  })
);
