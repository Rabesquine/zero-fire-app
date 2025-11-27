'use client';

import { useState } from 'react';
import { Users, Heart, MessageCircle, Send, Plus } from 'lucide-react';
import { CommunityPost } from '@/lib/types';

interface CommunityProps {
  posts: CommunityPost[];
  currentUserDays: number;
  onNewPost: (content: string) => void;
  onLike: (postId: string) => void;
}

export function Community({ posts, currentUserDays, onNewPost, onLike }: CommunityProps) {
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsPosting(true);
    await onNewPost(newPostContent);
    setNewPostContent('');
    setIsPosting(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-4 bg-[#FF0000]/10 rounded-2xl border border-[#FF0000]/20 mb-4">
          <Users className="w-8 h-8 text-[#FF0000]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-geist-sans text-white font-bold">
          Comunidade
        </h2>
        <p className="text-white/60 font-inter">
          Compartilhe sua jornada e apoie outras pessoas
        </p>
      </div>

      {/* New Post Form */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Compartilhe sua experiência, uma vitória ou peça apoio..."
            rows={4}
            className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3 text-white font-inter placeholder:text-white/30 focus:outline-none focus:border-[#FF0000]/50 transition-colors resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40 font-inter">
              {currentUserDays} dias sem fumar
            </span>
            <button
              type="submit"
              disabled={isPosting || !newPostContent.trim()}
              className="px-6 py-2 bg-gradient-to-r from-[#FF0000] to-[#CC0000] text-white font-inter font-semibold rounded-lg hover:shadow-lg hover:shadow-[#FF0000]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPosting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Publicar
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="inline-flex p-6 bg-white/5 rounded-2xl">
              <Users className="w-12 h-12 text-white/30" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-geist-sans text-white font-semibold">
                Nenhuma publicação ainda
              </h3>
              <p className="text-sm text-white/60 font-inter">
                Seja o primeiro a compartilhar sua jornada!
              </p>
            </div>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 rounded-xl p-6 hover:border-[#FF0000]/20 transition-all duration-300"
            >
              {/* Post Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF0000]/20 to-[#CC0000]/20 border border-[#FF0000]/30 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-lg font-geist-sans text-[#FF0000] font-bold">
                    {post.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-geist-sans text-white font-semibold">
                      {post.userName}
                    </h4>
                    <span className="px-2 py-0.5 bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-full text-xs font-inter text-[#FF0000]">
                      {post.daysSmokeFree} dias
                    </span>
                  </div>
                  <p className="text-xs text-white/40 font-inter">
                    {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-sm text-white/80 font-inter leading-relaxed mb-4">
                {post.content}
              </p>

              {/* Post Actions */}
              <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                <button
                  onClick={() => onLike(post.id)}
                  className="flex items-center gap-2 text-white/60 hover:text-[#FF0000] transition-colors group"
                >
                  <Heart className="w-5 h-5 group-hover:fill-[#FF0000]" />
                  <span className="text-sm font-inter">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-inter">{post.comments}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Community Guidelines */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#FF0000]/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#FF0000]/10 rounded-xl border border-[#FF0000]/20 shrink-0">
            <Users className="w-6 h-6 text-[#FF0000]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-geist-sans text-white font-semibold">
              Juntos somos mais fortes
            </h3>
            <p className="text-sm text-white/60 font-inter leading-relaxed">
              Esta é uma comunidade de apoio. Seja gentil, compartilhe suas experiências e
              celebre as vitórias de todos. Cada pessoa está em sua própria jornada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
