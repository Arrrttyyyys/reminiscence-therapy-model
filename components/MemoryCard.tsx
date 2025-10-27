'use client';

import { Memory } from '@/types';
import { format } from 'date-fns';
import { Calendar, Tag } from 'lucide-react';

interface MemoryCardProps {
  memory: Memory;
  onClick?: () => void;
}

export default function MemoryCard({ memory, onClick }: MemoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-pink-100"
    >
      {memory.type === 'photo' && (
        <div className="relative aspect-square bg-gradient-to-br from-pink-200 to-purple-200">
          {memory.content && (
            <img
              src={memory.content}
              alt={memory.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}
      
      {memory.type === 'video' && (
        <div className="relative aspect-square bg-gradient-to-br from-blue-200 to-cyan-200 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 ml-1 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {memory.type === 'audio' && (
        <div className="relative aspect-square bg-gradient-to-br from-green-200 to-teal-200 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14v-4c0-2.21-1.79-4-4-4s-4 1.79-4 4v4c0 2.21 1.79 4 4 4s4-1.79 4-4zm-2-4c0-1.1.9-2 2-2s2 .9 2 2v4c0 1.1-.9 2-2 2s-2-.9-2-2v-4z" />
            </svg>
          </div>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 text-lg">{memory.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{memory.description}</p>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(memory.date), 'MMMM d, yyyy')}</span>
        </div>

        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {memory.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

