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
  DialogClose,
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

      {/* PERUBAHAN: max-w-lg (lebih kecil dari 2xl) untuk desktop yang lebih ramping */}
      <DialogContent className="w-[95vw] sm:max-w-lg p-0 overflow-hidden rounded-lg sm:rounded-xl border-none shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b bg-primary shrink-0">
          <DialogTitle className="text-lg font-bold text-background text-left">Create New Ticket</DialogTitle>
          <p className="text-[12px] text-background/80 mt-0.5 text-left leading-snug">
            Mohon lengkapi formulir di bawah ini dengan benar.
          </p>
        </DialogHeader>

        {/* ScrollArea dengan tinggi yang pas untuk desktop */}
        <ScrollArea className="max-h-[70vh] sm:max-h-[65vh]">
          <form className="p-5 sm:p-6 space-y-5">
            
            <div className="grid grid-cols-1 gap-4">
              
              <div className="space-y-1.5">
                <Label htmlFor="service" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service</Label>
                <Select>
                  <SelectTrigger id="service" className="h-9">
                    <SelectValue placeholder="Select Service..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">IT Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Menggunakan grid 2 kolom pada desktop agar hemat ruang vertikal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
                  <Select>
                    <SelectTrigger id="category" className="h-9">
                      <SelectValue placeholder="Category..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hardware">Hardware</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="priority" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Priority</Label>
                  <Select>
                    <SelectTrigger id="priority" className="h-9">
                      <SelectValue placeholder="Priority..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input id="title" className="h-9" placeholder="Example: PC Reinstallation Request" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the problem clearly"
                  className="min-h-[100px] text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="reference" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reference (DOF)</Label>
                  <Input id="reference" className="h-9" placeholder="Example: 2462" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="extension" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Ext <span className="text-destructive">*</span>
                  </Label>
                  <Input id="extension" className="h-9" placeholder="Example: 1234" />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Attachments</Label>
                <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 hover:border-primary/50 transition-colors bg-muted/5">
                  <Paperclip className="h-4 w-4 text-muted-foreground mb-1 group-hover:text-primary" />
                  <Input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    multiple 
                  />
                  <p className="text-[11px] text-muted-foreground text-center font-medium">Click or drag files here</p>
                </div>
              </div>

            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="px-6 py-3 border-t bg-slate-50 flex flex-row gap-2 justify-end shrink-0">
          <DialogClose asChild>
            <Button variant="ghost" type="button" size="sm" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" size="sm" className="min-w-[120px] font-bold text-xs uppercase tracking-widest">
            Submit Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}