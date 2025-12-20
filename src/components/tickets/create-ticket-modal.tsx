"use client"

import { Plus } from "lucide-react"
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
} from "@/components/ui/dialog"

export default function CreateTicketModal() {
  return (
    <Dialog>
      {/* TRIGGER BUTTON */}
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Ticket
        </Button>
      </DialogTrigger>

      {/* MODAL */}
      <DialogContent className="max-w-4xl p-0">
        {/* HEADER */}
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Create New Ticket</DialogTitle>
        </DialogHeader>

        {/* BODY (SCROLLABLE) */}
        <ScrollArea className="max-h-[65vh] px-6 py-6">
          <form className="space-y-6 pb-10">
            {/* SELECTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Service</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">IT Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hardware">Hardware</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Label</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="request">Request</SelectItem>
                    <SelectItem value="incident">Incident</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* TITLE */}
            <div className="space-y-1">
              <Label>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input placeholder="Contoh: Permintaan Install Ulang PC" />
            </div>

            {/* TEXT */}
            <div className="space-y-1">
              <Label>
                Text <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Deskripsikan permasalahan secara jelas"
                className="min-h-[140px] resize-none"
              />
            </div>

            {/* ATTACHMENTS */}
            <div className="space-y-1">
              <Label>Attachments</Label>
              <Input type="file" multiple />
              <p className="text-xs text-muted-foreground">
                Word, Excel, PDF, Images — max 1MB each (up to 5 files)
              </p>
            </div>

            {/* REFERENCE */}
            <div className="space-y-1">
              <Label>Reference (DOF Number)</Label>
              <Input placeholder="Contoh: 2462" />
            </div>

            {/* EXTENSION */}
            <div className="space-y-1">
              <Label>
                No Extension <span className="text-red-500">*</span>
              </Label>
              <Input placeholder="Contoh: 1234" />
            </div>
          </form>
        </ScrollArea>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-background">
          <Button className="bg-background text-foreground border hover:bg-red-500">Cancel</Button>
          <Button className="bg-background text-foreground border hover:bg-primary">Submit Ticket</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
