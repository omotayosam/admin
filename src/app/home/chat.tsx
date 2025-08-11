'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User, Loader2 } from 'lucide-react';
import { apiService, ChatMessage } from './service/ai';

interface ChatComponentProps {
  className?: string;
}

export default function ChatComponent({ className = '' }: ChatComponentProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.sendChatMessage(input.trim(), messages);

      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to get response');
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.text,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);

      // Add error message to chat
      const errorChatMessage: ChatMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <Card className={`flex h-96 flex-col ${className}`}>
      <CardHeader className='flex-shrink-0'>
        <CardTitle className='flex items-center gap-2'>
          <MessageCircle className='h-5 w-5 text-blue-600' />
          Sports Assistant
          {messages.length > 0 && (
            <Button
              onClick={clearChat}
              variant='outline'
              size='sm'
              className='ml-auto'
            >
              Clear Chat
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className='flex flex-1 flex-col gap-4 p-4'>
        <ScrollArea className='flex-1 pr-4' ref={scrollAreaRef}>
          <div className='space-y-4'>
            {messages.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-8 text-center text-gray-500'>
                <Bot className='mb-2 h-12 w-12 text-gray-300' />
                <p className='text-sm'>
                  Ask me anything about sports management, athletes, or
                  performances!
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className='flex-shrink-0'>
                      <Bot className='h-6 w-6 text-blue-600' />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className='whitespace-pre-wrap'>{message.content}</p>
                    {message.timestamp && (
                      <p
                        className={`mt-1 text-xs ${
                          message.role === 'user'
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className='flex-shrink-0'>
                      <User className='h-6 w-6 text-gray-600' />
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className='flex justify-start gap-3'>
                <Bot className='h-6 w-6 flex-shrink-0 text-blue-600' />
                <div className='rounded-lg bg-gray-100 px-3 py-2 text-sm'>
                  <div className='flex items-center gap-2'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span className='text-gray-600'>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {error && (
          <div className='rounded border border-red-200 bg-red-50 p-2 text-sm text-red-600'>
            {error}
          </div>
        )}

        <div className='flex gap-2'>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Ask about athletes, performances, or stats...'
            disabled={isLoading}
            className='flex-1'
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            size='sm'
          >
            {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Send className='h-4 w-4' />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
