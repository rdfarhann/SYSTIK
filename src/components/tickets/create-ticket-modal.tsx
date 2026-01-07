// "use client"

// import * as React from "react"
// import { Plus, Paperclip, Loader2, X, Image as ImageIcon } from "lucide-react"
// import { useForm } from "react-hook-form"
// import { toast } from "sonner"
// import { createTicket } from "@/app/actions/create-ticket"
// import { CreateTicketInput } from "@/app/types/ticket"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog"

// export default function CreateTicketModal() {
//   const [open, setOpen] = React.useState(false)
//   const [loading, setLoading] = React.useState(false)
  
//   // State untuk manajemen gambar
//   const [preview, setPreview] = React.useState<string | null>(null)
//   const [base64, setBase64] = React.useState<string>("")

//   const { register, handleSubmit, setValue, reset } = useForm<CreateTicketInput>({
//     defaultValues: {
//       service: "",
//       category: "",
//       priority: "",
//       title: "",
//       description: "",
//     }
//   })

//   // Fungsi untuk handle perubahan file dan konversi ke Base64
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       // Validasi ukuran (opsional, misal max 2MB)
//       if (file.size > 2 * 1024 * 1024) {
//         toast.error("Ukuran gambar terlalu besar (Maks 2MB)")
//         return
//       }

//       setPreview(URL.createObjectURL(file))
      
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setBase64(reader.result as string)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const removeImage = () => {
//     setPreview(null)
//     setBase64("")
//   }

//   const onSubmit = async (data: CreateTicketInput) => {
//     setLoading(true)
//     try {
//       // Kirim data form dan string base64 ke action
//       const result = await createTicket(data, base64)
//       if (result.success) {
//         toast.success("Tiket berhasil dibuat!")
//         reset()
//         removeImage()
//         setOpen(false)
//       } else {
//         toast.error(result.error)
//       }
//     } catch (err: unknown) {
//       toast.error("Terjadi kesalahan sistem")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button size="sm" className="gap-2 shadow-sm bg-background text-foreground hover:bg-foreground hover:text-background">
//           <Plus className="h-4 w-4" />
//           Create New Ticket
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="w-[95vw] sm:max-w-lg p-0 overflow-hidden rounded-lg sm:rounded-xl border-none shadow-2xl">
//         <DialogHeader className="px-6 py-4 border-b bg-primary shrink-0">
//           <DialogTitle className="text-lg font-bold text-background text-left">Create New Ticket</DialogTitle>
//           <p className="text-[12px] text-background/80 mt-0.5 text-left leading-snug">
//             Mohon lengkapi formulir di bawah ini dengan benar.
//           </p>
//         </DialogHeader>

//         <ScrollArea className="max-h-[70vh] sm:max-h-[65vh]">
//           <form id="ticket-form" onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-6 space-y-5">
//             <div className="grid grid-cols-1 gap-4">
//               {/* Service Select */}
//               <div className="space-y-1.5">
//                 <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service</Label>
//                 <Select onValueChange={(v) => setValue("service", v)}>
//                   <SelectTrigger className="h-9">
//                     <SelectValue placeholder="Select Service..." />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="it">IT Support</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Category & Priority */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-1.5">
//                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
//                   <Select onValueChange={(v) => setValue("category", v)}>
//                     <SelectTrigger className="h-9">
//                       <SelectValue placeholder="Category..." />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="hardware">Hardware</SelectItem>
//                       <SelectItem value="software">Software</SelectItem>
//                       <SelectItem value="network">Network</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-1.5">
//                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Priority</Label>
//                   <Select onValueChange={(v) => setValue("priority", v)}>
//                     <SelectTrigger className="h-9">
//                       <SelectValue placeholder="Priority..." />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="LOW">Low</SelectItem>
//                       <SelectItem value="MEDIUM">Medium</SelectItem>
//                       <SelectItem value="HIGH">High</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               {/* Title Input */}
//               <div className="space-y-1.5">
//                 <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
//                   Title <span className="text-destructive">*</span>
//                 </Label>
//                 <Input 
//                   id="title" 
//                   {...register("title", { required: true })} 
//                   className="h-9" 
//                   placeholder="Example: PC Reinstallation Request" 
//                 />
//               </div>

//               {/* Description Textarea */}
//               <div className="space-y-1.5">
//                 <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
//                   Description <span className="text-destructive">*</span>
//                 </Label>
//                 <Textarea
//                   id="description"
//                   {...register("description", { required: true })}
//                   placeholder="Describe the problem clearly"
//                   className="min-h-[100px] text-sm resize-none"
//                 />
//               </div>

//               {/* Attachments Section with Preview */}
//               <div className="space-y-2 pt-1">
//                 <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Attachments</Label>
                
//                 {preview ? (
//                   <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-muted flex items-center justify-center group">
//                     <img src={preview} alt="Attachment Preview" className="h-full w-full object-contain" />
//                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                       <Button 
//                         type="button" 
//                         variant="destructive" 
//                         size="icon" 
//                         className="h-8 w-8 rounded-full"
//                         onClick={removeImage}
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 hover:border-primary/50 transition-colors bg-muted/5">
//                     <Paperclip className="h-5 w-5 text-muted-foreground mb-2 group-hover:text-primary" />
//                     <Input 
//                       type="file" 
//                       accept="image/*" 
//                       onChange={handleFileChange}
//                       className="absolute inset-0 opacity-0 cursor-pointer" 
//                     />
//                     <p className="text-[11px] text-muted-foreground text-center font-medium">
//                       Click or drag images here (Max 2MB)
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </form>
//         </ScrollArea>

//         <DialogFooter className="px-6 py-3 border-t bg-slate-50 flex flex-row gap-2 justify-end shrink-0">
//           <DialogClose asChild>
//             <Button variant="ghost" type="button" size="sm" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
//               Cancel
//             </Button>
//           </DialogClose>
//           <Button 
//             form="ticket-form"
//             type="submit" 
//             size="sm" 
//             disabled={loading}
//             className="min-w-[120px] font-bold text-xs uppercase tracking-widest"
//           >
//             {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Ticket"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }