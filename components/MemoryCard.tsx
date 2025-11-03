'use client';

import { useState } from 'react';
import { Memory } from '@/types';
import { format } from 'date-fns';
import { Calendar, Tag, Trash2, Edit2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface MemoryCardProps {
  memory: Memory;
  onClick?: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (memory: Memory) => void;
}

export default function MemoryCard({ memory, onClick, onDelete, onEdit }: MemoryCardProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(memory.id);
    }
    setShowConfirmDialog(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(memory);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-900/50 border border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:border-teal-500/50 hover-pop relative group"
    >
      {/* Action Buttons */}
      <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEdit}
          className="p-2 bg-teal-500/80 hover:bg-teal-600 rounded-lg"
          aria-label="Edit memory"
        >
          <Edit2 className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg"
          aria-label="Delete memory"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      </div>
      {memory.type === 'photo' && (
        <div className="relative aspect-square bg-gradient-to-br from-teal-900/50 to-cyan-900/50">
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
        <div className="relative aspect-square bg-gradient-to-br from-blue-900/50 to-cyan-900/50 flex items-center justify-center">
          <div className="w-16 h-16 bg-teal-500/80 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 ml-1 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {memory.type === 'audio' && (
        <div className="relative aspect-square bg-gradient-to-br from-green-900/50 to-teal-900/50 flex items-center justify-center">
          <div className="w-16 h-16 bg-teal-500/80 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14v-4c0-2.21-1.79-4-4-4s-4 1.79-4 4v4c0 2.21 1.79 4 4 4s4-1.79 4-4zm-2-4c0-1.1.9-2 2-2s2 .9 2 2v4c0 1.1-.9 2-2 2s-2-.9-2-2v-4z" />
            </svg>
          </div>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 text-lg">{memory.title}</h3>
        <p className="text-sm text-gray-300 mb-3 line-clamp-2">{memory.description}</p>
        
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(memory.date), 'MMMM d, yyyy')}</span>
        </div>

        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {memory.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-1 bg-teal-500/20 text-teal-400 rounded-full text-xs border border-teal-500/30"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Delete Memory"
        message={`Are you sure you want to delete "${memory.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmDialog(false)}
        variant="danger"
      />
    </div>
  );
}

