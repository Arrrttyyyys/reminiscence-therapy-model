'use client';

import { useState } from 'react';
import { Album } from '@/types';
import { format } from 'date-fns';
import { Calendar, Tag, Trash2, Edit2, Images } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface AlbumCardProps {
  album: Album;
  onClick?: (album: Album) => void;
  onDelete?: (id: string) => void;
  onEdit?: (album: Album) => void;
}

export default function AlbumCard({ album, onClick, onDelete, onEdit }: AlbumCardProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(album.id);
    }
    setShowConfirmDialog(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(album);
    }
  };

  const coverImage = album.coverImage || (album.memories.find(m => m.type === 'photo')?.content);

  return (
    <div
      onClick={() => onClick?.(album)}
      className="bg-gray-900/50 border border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:border-purple-500/50 hover-pop relative group"
    >
      {/* Action Buttons */}
      <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEdit}
          className="p-2 bg-purple-500/80 hover:bg-purple-600 rounded-lg"
          aria-label="Edit album"
        >
          <Edit2 className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg"
          aria-label="Delete album"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Cover Image */}
      <div className="relative aspect-square bg-gradient-to-br from-purple-900/50 to-pink-900/50">
        {coverImage ? (
          <img
            src={coverImage}
            alt={album.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Images className="w-16 h-16 text-purple-400" />
          </div>
        )}
        {/* Album Badge */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
            <Images className="w-4 h-4 text-purple-400" />
            <span className="text-white text-sm font-medium">{album.memories.length} items</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 text-lg">{album.title}</h3>
        <p className="text-sm text-gray-300 mb-3 line-clamp-2">{album.description}</p>
        
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(album.date), 'MMMM d, yyyy')}</span>
        </div>

        {album.tags && album.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {album.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs border border-purple-500/30"
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
        title="Delete Album"
        message={`Are you sure you want to delete "${album.title}"? This will remove the album and all its contents. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmDialog(false)}
        variant="danger"
      />
    </div>
  );
}

