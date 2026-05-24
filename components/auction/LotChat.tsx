// filepath: d:/PROYECTOS/REMATE CAMPO/components/auction/LotChat.tsx
// @visual: ui-ux-pro-max - Chat en vivo ultra interactivo utilizando Supabase Realtime Broadcast (en memoria y velocidad de la luz) con burbujas animadas estilo WhatsApp Premium

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useBidder } from '@/components/providers/BidderProvider'
import { Send, MessageSquare, Users, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LotChatProps {
  lotId: number
}

interface ChatMessage {
  id: string
  name: string
  text: string
  timestamp: number
  isSystem?: boolean
}

export function LotChat({ lotId }: LotChatProps) {
  const { bidder, isLoaded } = useBidder()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', name: 'Sistema', text: '¡Bienvenido al chat en vivo de este lote! Las consultas se responden al instante.', timestamp: Date.now(), isSystem: true }
  ])
  const [inputText, setInputText] = useState('')
  const [activeUsersCount, setActiveUsersCount] = useState(1)
  const chatChannelRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll al recibir mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const supabase = createClient()
    
    // Suscribirse al canal de Broadcast de Supabase para este lote específico
    const channel = supabase.channel(`lot-chat-${lotId}`, {
      config: {
        broadcast: { self: false }
      }
    })

    // Escuchar mensajes entrantes
    channel.on('broadcast', { event: 'shout' }, (payload: any) => {
      const msg = payload.payload as ChatMessage
      setMessages((prev) => [...prev, msg])
    })

    // Habilitar Presence para contar usuarios activos en tiempo real (FOMO)
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      const count = Object.keys(state).length
      setActiveUsersCount(count > 0 ? count : 1)
    })

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Registrar presencia del usuario
        await channel.track({
          user: bidder.name || 'Espectador Anónimo',
          online_at: new Date().toISOString(),
        })
      }
    })

    chatChannelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [lotId, bidder.name])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !chatChannelRef.current) return

    const displayName = bidder.name || 'Espectador Anónimo'
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      name: displayName,
      text: inputText.trim(),
      timestamp: Date.now()
    }

    // Emitir mensaje por Broadcast a todos los usuarios conectados en este lote
    chatChannelRef.current.send({
      type: 'broadcast',
      event: 'shout',
      payload: newMsg
    })

    // Agregar a mi vista local
    setMessages((prev) => [...prev, newMsg])
    setInputText('')
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-premium overflow-hidden flex flex-col h-[350px]">
      {/* Cabecera del Chat */}
      <div className="px-4 py-3 bg-[var(--color-earth)] text-[var(--color-cream)] flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[var(--color-wheat)] animate-pulse" />
          <span className="font-display font-bold text-xs uppercase tracking-wider">Chat de Negociación</span>
        </div>
        
        {/* Presencia / FOMO Activo */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full text-[10px] font-sans font-bold">
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 animate-pulse">{activeUsersCount} online</span>
        </div>
      </div>

      {/* Cuerpo / Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin bg-neutral-50/50">
        {messages.map((msg) => {
          const isSystem = msg.isSystem
          const isMe = msg.name === (bidder.name || 'Espectador Anónimo') && !isSystem

          if (isSystem) {
            return (
              <div key={msg.id} className="w-full flex justify-center my-1.5">
                <span className="px-3 py-1 bg-[var(--color-wheat)]/10 border border-[var(--color-wheat)]/30 rounded-lg text-[10px] text-neutral-500 font-sans text-center max-w-[90%] leading-relaxed flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[var(--color-earth)] shrink-0" />
                  {msg.text}
                </span>
              </div>
            )
          }

          return (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[75%] rounded-2xl px-3.5 py-2.5 shadow-subtle text-xs animate-[fadeIn_0.2s_ease-out]",
                isMe
                  ? "self-end bg-[var(--color-forest)] text-white rounded-tr-none"
                  : "self-start bg-white border border-neutral-200 text-[var(--color-earth)] rounded-tl-none"
              )}
            >
              {!isMe && (
                <span className="font-display font-black text-[9px] uppercase tracking-wider text-[var(--color-earth-600)] mb-1 block">
                  {msg.name}
                </span>
              )}
              <p className="font-sans font-medium break-words leading-relaxed">{msg.text}</p>
              <span
                className={cn(
                  "text-[8px] mt-1.5 text-right block font-mono opacity-60",
                  isMe ? "text-white/80" : "text-neutral-400"
                )}
              >
                {new Date(msg.timestamp).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input / Enviar */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-neutral-200 flex gap-2">
        <input
          type="text"
          placeholder={bidder.name ? "Escribe un mensaje al martillero..." : "Ingresa tu perfil arriba para chatear"}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={!isLoaded}
          className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 focus:border-[var(--color-forest)] rounded-xl outline-none text-xs transition-premium placeholder-neutral-400 font-sans"
        />
        <button
          type="submit"
          className="p-2.5 bg-[var(--color-forest)] hover:bg-[var(--color-forest-dark)] text-white rounded-xl shadow-premium transition-premium shrink-0 active:scale-[0.97]"
          aria-label="Enviar mensaje"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
