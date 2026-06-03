"use client";

import { SubmitEvent, useEffect, useState } from "react";
import io from "socket.io-client";

interface Message {
  message: string;
  author: string;
  date: string;
}

export default function Home() {
  const socket = io("http://localhost:8080");

  const [messages, setMessages] = useState([] as Message[]);
  const [author, setAuthor] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      socket.on("message", (data: Message) => {
        setMessages((oldState) => [...oldState, data]);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  function handleSubmite(e: SubmitEvent) {
    e.preventDefault();
    fetch("http://localhost:8080/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: newMessage,
        author,
        data: new Date().toISOString(),
      }),
    })
      .catch(() => alert("Erro ao enviar a mensagem"))
      .finally(() => setNewMessage(""));
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        * {
          font-family: 'Press Start 2P', 'Courier New', monospace;
        }

        body {
          margin: 0;
          padding: 0;
          background-color: #0a0a0a;
          color: #e0e0e0;
        }

        @keyframes slideInPixel {
          from {
            transform: translateY(4px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        ::-webkit-scrollbar-thumb {
          background: #333333;
          border-radius: 0;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #444444;
        }
      `}</style>

      <main className="w-screen h-screen bg-[#0a0a0a] text-[#e0e0e0] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="h-[12%] border-b-2 border-[#2a2a2a] bg-[#0f0f0f] p-4 flex flex-col justify-center">
          <div className="text-xs tracking-widest text-[#888888] mb-3">
            ▼ MENSAGENS
          </div>
          <input
            className="px-3 py-2 bg-[#1a1a1a] border-2 border-[#333333] text-[#e0e0e0] placeholder-[#666666] focus:outline-none focus:border-[#555555] text-xs uppercase"
            placeholder="Seu nome (deixe em branco para anônimo)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#0a0a0a] flex flex-col">
          {messages.length === 0 && (
            <div className="text-center text-[#555555] text-xs py-8 self-center">
              ▲ nenhuma mensagem ▲
            </div>
          )}
          
          <div className="space-y-3 flex flex-col">
            {messages.map((message, index) => {
              const isOwnMessage = message.author === author && author !== "";
              const displayAuthor = message.author || "anônimo";
              
              return (
                <div
                  key={index}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} animate-slideInPixel`}
                  style={{ animation: "slideInPixel 0.3s ease-out" }}
                >
                  <div
                    className={`max-w-[60%] border-2 p-3 ${
                      isOwnMessage
                        ? "border-[#444444] bg-[#1a1a1a]"
                        : "border-[#2a2a2a] bg-[#121212]"
                    }`}
                  >
                    {!isOwnMessage && (
                      <div className="text-[#888888] text-xs font-bold mb-1">
                        {displayAuthor}
                      </div>
                    )}
                    <p className="text-xs leading-relaxed wrap-break-word text-[#d0d0d0]">
                      {message.message}
                    </p>
                    <div className={`text-[7px] mt-2 ${isOwnMessage ? "text-right" : "text-left"} text-[#666666]`}>
                      {new Date(message.date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input Area */}
        <div className="h-[16%] border-t-2 border-[#2a2a2a] bg-[#0f0f0f] p-4">
          <form className="flex flex-col gap-2 h-full" onSubmit={handleSubmite}>
            <input
              className="flex-1 px-3 py-2 bg-[#1a1a1a] border-2 border-[#333333] text-[#e0e0e0] placeholder-[#666666] focus:outline-none focus:border-[#555555] text-xs uppercase"
              placeholder="Digite sua mensagem"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />

            <button
              className={`px-4 py-2 border-2 text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-100 ${
                !newMessage
                  ? "border-[#333333] text-[#555555] bg-[#0a0a0a] cursor-not-allowed opacity-60"
                  : "border-[#444444] text-[#e0e0e0] bg-[#1a1a1a] hover:bg-[#252525] hover:border-[#666666] active:scale-95"
              }`}
              type="submit"
              disabled={!newMessage}
            >
              ▶ Enviar
            </button>
          </form>
        </div>

        {/* Footer Status */}
        <div className="h-[4%] border-t-2 border-[#2a2a2a] bg-[#0f0f0f] px-4 flex items-center justify-between text-[7px] text-[#666666]">
          <span>◆ online</span>
          <span>{messages.length} mensagens</span>
        </div>
      </main>
    </>
  );
}