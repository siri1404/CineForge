import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline, ChatBubbleLeftIcon as ChatOutline } from '@heroicons/react/24/outline';
import { Review, UserMovie } from '../../contexts/MoviesContext';
import { useMovies } from '../../contexts/MoviesContext';

interface ReviewSectionProps {
  reviews: Review[];
  movieId: string;
  userMovie?: UserMovie;
}

export default function ReviewSection({ reviews, movieId, userMovie }: ReviewSectionProps) {
  const { likeReview, addReply } = useMovies();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleLike = (reviewId: string) => {
    likeReview(reviewId);
  };

  const handleReply = (reviewId: string) => {
    if (replyContent.trim()) {
      addReply(reviewId, replyContent);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-2xl border border-red-900/30 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Reviews & Ratings</h2>
        <div className="text-gray-400">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* User's Review Display */}
      {userMovie?.userRating && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-red-300">Your rating:</span>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon 
                  key={i} 
                  className={`h-4 w-4 ${i < userMovie.userRating! ? 'text-yellow-400' : 'text-gray-600'}`} 
                />
              ))}
            </div>
          </div>
          {userMovie.userReview && (
            <p className="text-gray-300 text-sm">{userMovie.userReview}</p>
          )}
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50"
            >
              {/* Review Header */}
              <div className="flex items-start space-x-4 mb-4">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  src={review.userAvatar} 
                  alt={review.userName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500/30"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-white">{review.userName}</h4>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{review.date}</p>
                </div>
              </div>

              {/* Review Content */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                className="text-gray-300 mb-4 leading-relaxed"
              >
                {review.review}
              </motion.p>

              {/* Review Actions */}
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLike(review.id)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${
                    review.isLiked 
                      ? 'bg-red-900/30 text-red-400' 
                      : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-red-400'
                  }`}
                >
                  {review.isLiked ? (
                    <HeartIcon className="h-4 w-4" />
                  ) : (
                    <HeartOutline className="h-4 w-4" />
                  )}
                  <span className="text-sm">{review.likes}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                  className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-white transition-colors"
                >
                  <ChatOutline className="h-4 w-4" />
                  <span className="text-sm">Reply</span>
                </motion.button>
              </div>

              {/* Reply Form */}
              {replyingTo === review.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-700/50"
                >
                  <div className="flex space-x-3">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      rows={2}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                    />
                    <div className="flex flex-col space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReply(review.id)}
                        disabled={!replyContent.trim()}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        Reply
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setReplyingTo(null)}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Replies */}
              {review.replies.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  className="mt-4 pt-4 border-t border-gray-700/50 space-y-3"
                >
                  {review.replies.map((reply, replyIndex) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + replyIndex * 0.1, duration: 0.4 }}
                      className="flex space-x-3 pl-4"
                    >
                      <img 
                        src={reply.userAvatar} 
                        alt={reply.userName}
                        className="w-8 h-8 rounded-full object-cover border border-red-500/30"
                      />
                      <div className="flex-1 bg-gray-800/60 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-white text-sm">{reply.userName}</span>
                          <span className="text-gray-500 text-xs">{reply.date}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{reply.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center py-8"
          >
            <ChatBubbleLeftIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No reviews yet. Be the first to share your thoughts!</p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}