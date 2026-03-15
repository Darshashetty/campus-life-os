"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircleIcon, SendIcon, XIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { sendHelpBotMessageViaGateway } from "@/lib/api-gateway"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function HelpBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm Campus HelpBot. I can help you with forms, deadlines, and finding skilled peers. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")

  const [isSending, setIsSending] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || isSending) return

    const currentInput = input.trim()

    const userMessage: Message = {
      id: messages.length + 1,
      text: currentInput,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      setIsSending(true)
      const response = await sendHelpBotMessageViaGateway(currentInput)
      const botResponse: Message = {
        id: Date.now(),
        text: response.reply,
        sender: "bot",
        timestamp: new Date(response.timestamp),
      }
      setMessages((prev) => [...prev, botResponse])
    } catch {
      const botResponse: Message = {
        id: Date.now(),
        text: "HelpBot is temporarily unavailable. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          size="lg"
          className="fixed bottom-6 right-6 size-14 rounded-full shadow-lg z-50"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircleIcon className="size-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-primary flex items-center justify-center">
                <MessageCircleIcon className="size-4 text-primary-foreground" />
              </div>
              <CardTitle className="text-base">Campus HelpBot</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <XIcon className="size-4" />
            </Button>
          </CardHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <CardContent className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isSending}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendMessage()
                  }
                }}
              />
              <Button size="icon" onClick={sendMessage} disabled={isSending}>
                <SendIcon className="size-4" />
              </Button>
            </div>
            {isSending && <p className="mt-2 text-xs text-muted-foreground">HelpBot is typing...</p>}
          </CardContent>
        </Card>
      )}
    </>
  )
}
