// import { Clock, MessageSquare } from 'lucide-react';

// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from '@/components/ui/sheet';
// import { Conversation } from '@/types/interface/chat';
// import { useCustomerDetailsModalStore } from './useCustomerDetailsModal';

// type CustomerDetailsModalProps = {
//   selectedConversation: Conversation | null;
// };

// export default function CustomerDetailsModal({
//   selectedConversation,
// }: CustomerDetailsModalProps) {
//   const { open, handleClose } = useCustomerDetailsModalStore();

//   return (
//     <Sheet open={open} onOpenChange={handleClose} modal>
//       <SheetContent className="w-full sm:max-w-md">
//         <SheetHeader>
//           <SheetTitle>Customer Details</SheetTitle>
//         </SheetHeader>
//         <div className="space-y-4 py-4">
//           <div>
//             <h4 className="text-sm font-medium">Contact</h4>
//             <p className="text-muted-foreground text-sm">
//               {selectedConversation?.customer.email}
//             </p>
//             <p className="text-muted-foreground text-sm">
//               Status: {selectedConversation?.customer.status}
//               {selectedConversation?.customer.lastSeen &&
//                 ` (Last seen: ${selectedConversation?.customer.lastSeen})`}
//             </p>
//           </div>
//           <Separator />
//           <div>
//             <h4 className="text-sm font-medium">Status</h4>
//             <div className="mt-1 flex items-center gap-2">
//               <Badge>{selectedConversation?.status}</Badge>
//               <Badge variant="outline">{selectedConversation?.category}</Badge>
//             </div>
//           </div>
//           <Separator />
//           <div>
//             <h4 className="text-sm font-medium">Timeline</h4>
//             <div className="mt-2 space-y-2">
//               <div className="flex items-center gap-2 text-sm">
//                 <Clock className="text-muted-foreground h-4 w-4" />
//                 <span>Created {selectedConversation?.created_at}</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <MessageSquare className="text-muted-foreground h-4 w-4" />
//                 <span>{selectedConversation?.messages?.length} messages</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// }
