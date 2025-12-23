"use client"

import { Plus, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

export default function CreateTicketModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2 shadow-sm bg-background text-foreground hover:bg-foreground hover:text-background">
          <Plus className="h-4 w-4" />
          Create New Ticket
        </Button>
      </DialogTrigger>

      {/* MODIFIKASI: w-[95vw] agar tidak mentok layar hp, sm:max-w-2xl untuk desktop */}
      <DialogContent className="w-[95vw] max-w-2xl p-0 overflow-hidden rounded-lg sm:rounded-xl">
        <DialogHeader className="px-6 py-4 border-b bg-primary shrink-0">
          <DialogTitle className="text-xl font-bold text-background text-left">Create New Ticket</DialogTitle>
          <p className="text-[13px] text-background/90 mt-0.5 text-left leading-snug">
            Complete the form below. Make sure the information you enter is correct.
          </p>
        </DialogHeader>

        {/* MODIFIKASI: max-h menggunakan vh yang dinamis agar tidak terpotong di layar pendek */}
        <ScrollArea className="max-h-[60vh] sm:max-h-[70vh]">
          <form className="p-4 sm:p-6 space-y-6">
            
            <div className="space-y-5">
              
              <div className="space-y-2">
                <Label htmlFor="service" className="text-sm font-semibold">Service</Label>
                <Select>
                  <SelectTrigger id="service" className="w-full">
                    <SelectValue placeholder="Select Service..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">IT Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
                <Select>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select Category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hardware">Hardware</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-semibold">Priority</Label>
                <Select>
                  <SelectTrigger id="priority" className="w-full">
                    <SelectValue placeholder="Select Priority..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="label" className="text-sm font-semibold">Label</Label>
                <Select>
                  <SelectTrigger id="label" className="w-full">
                    <SelectValue placeholder="Select Label..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="request">Request</SelectItem>
                    <SelectItem value="incident">Incident</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input id="title" className="w-full" placeholder="Example: PC Reinstallation Request" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the problem clearly"
                  className="min-h-[120px] resize-none w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference" className="text-sm font-semibold">Reference (DOF Number)</Label>
                <Input id="reference" className="w-full" placeholder="Example: 2462" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="extension" className="text-sm font-semibold">
                  No Extension <span className="text-destructive">*</span>
                </Label>
                <Input id="extension" className="w-full" placeholder="Contoh: 1234" />
              </div>

              <div className="space-y-2 pt-2 pb-4">
                <Label className="text-sm font-semibold">Attachments</Label>
                <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 hover:border-primary/50 transition-colors bg-muted/5">
                  <Paperclip className="h-6 w-6 text-muted-foreground mb-2 group-hover:text-primary" />
                  <Input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    multiple 
                  />
                  <p className="text-sm text-muted-foreground text-center">Click or drag files here</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">PDF, PNG, JPG (Maks. 1MB)</p>
                </div>
              </div>

            </div>
          </form>
        </ScrollArea>

        {/* MODIFIKASI: flex-row-reverse agar tombol utama (Submit) berada di kanan/atas pada mobile */}
        <DialogFooter className="px-6 py-4 border-t bg-muted/20 flex flex-row gap-3 justify-end shrink-0">
          <Button variant="outline" type="button" className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 sm:min-w-[140px]">
            Submit Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}