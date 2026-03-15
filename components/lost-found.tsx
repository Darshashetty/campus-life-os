"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchIcon, PlusIcon, MapPinIcon, ClockIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  createLostFoundItemViaGateway,
  contactLostFoundViaGateway,
  fetchLostFoundItemsViaGateway,
  type LostFoundItem,
} from "@/lib/api-gateway"

export function LostFound() {
  const [items, setItems] = useState<LostFoundItem[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)
  const [reportType, setReportType] = useState<"lost" | "found">("lost")
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
  })
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null)
  const [contactMessage, setContactMessage] = useState("")

  useEffect(() => {
    fetchLostFoundItemsViaGateway(searchTerm, "all").then(setItems).catch(() => undefined)
  }, [searchTerm])

  const addItem = async () => {
    if (newItem.title && newItem.description && newItem.location) {
      const createdItem = await createLostFoundItemViaGateway({
        ...newItem,
        type: reportType,
        contactName: "You",
      })
      setItems((current) => [createdItem, ...current])
      setNewItem({ title: "", description: "", location: "", category: "" })
      setOpen(false)
    }
  }

  const filteredLost = items.filter(
    (item) =>
      item.type === "lost" &&
      (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const filteredFound = items.filter(
    (item) =>
      item.type === "found" &&
      (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const ItemCard = ({ item }: { item: LostFoundItem }) => (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-base">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            </div>
            <Badge variant={item.type === "lost" ? "destructive" : "default"}>{item.type}</Badge>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPinIcon className="size-3" />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="size-3" />
              <span>{item.date}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="text-sm">
              <span className="text-muted-foreground">Contact: </span>
              <span className="font-medium">{item.contactName}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedItem(item)
                setContactDialogOpen(true)
              }}
            >
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lost & Found Manager</h1>
          <p className="text-muted-foreground mt-1">Report and find lost items on campus</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusIcon className="size-4" />
              Report Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report an Item</DialogTitle>
              <DialogDescription>Help the campus community by reporting lost or found items</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Button
                  variant={reportType === "lost" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setReportType("lost")}
                >
                  Lost Item
                </Button>
                <Button
                  variant={reportType === "found" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setReportType("found")}
                >
                  Found Item
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-title">Item Name</Label>
                <Input
                  id="item-title"
                  placeholder="e.g., Blue water bottle"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details to help identify the item"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Where was it lost/found?"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Electronics, Personal Items"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={addItem}>
                Submit Report
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Items Tabs */}
      <Tabs defaultValue="lost" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lost">Lost Items ({filteredLost.length})</TabsTrigger>
          <TabsTrigger value="found">Found Items ({filteredFound.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="lost" className="space-y-3">
          {filteredLost.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <SearchIcon className="size-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No lost items reported</p>
              </CardContent>
            </Card>
          ) : (
            filteredLost.map((item) => <ItemCard key={item.id} item={item} />)
          )}
        </TabsContent>

        <TabsContent value="found" className="space-y-3">
          {filteredFound.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <SearchIcon className="size-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No found items reported</p>
              </CardContent>
            </Card>
          ) : (
            filteredFound.map((item) => <ItemCard key={item.id} item={item} />)
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact {selectedItem?.contactName}</DialogTitle>
            <DialogDescription>Send a message about: {selectedItem?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="font-medium mb-1">{selectedItem?.title}</div>
              <div className="text-sm text-muted-foreground">{selectedItem?.description}</div>
              <div className="text-xs text-muted-foreground mt-2">Location: {selectedItem?.location}</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Hi, I think I found/lost your item..."
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={async () => {
                if (selectedItem && contactMessage) {
                  await contactLostFoundViaGateway(selectedItem.id, contactMessage)
                }
                setContactMessage("")
                setContactDialogOpen(false)
              }}
            >
              Send Message
            </Button>
            <Button variant="outline" onClick={() => setContactDialogOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
