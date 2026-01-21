import { TicketPriority } from "@/types/ticket";

export function calculateSLADeadline(priority: TicketPriority, createdAt: Date): Date {
  const deadline = new Date(createdAt);
  
  switch (priority) {
    case 'URGENT':
      deadline.setHours(deadline.getHours() + 2); 
      break;
    case 'HIGH':
      deadline.setHours(deadline.getHours() + 4); 
      break;
    case 'MEDIUM':
      deadline.setHours(deadline.getHours() + 8); 
      break;
    case 'LOW':
      deadline.setHours(deadline.getHours() + 24); 
      break;
  }
  return deadline;
}