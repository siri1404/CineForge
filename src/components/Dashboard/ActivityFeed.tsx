import React from 'react';
import { motion } from 'framer-motion';
import { FilmIcon, StarIcon, UserIcon } from '@heroicons/react/24/solid';

const activities = [
  {
    id: 1,
    user: 'Emily Chen',
    action: 'finished watching',
    movie: 'The Dark Knight',
    time: '2 hours ago',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
  },
  {
    id: 2,
    user: 'Michael Johnson',
    action: 'rated',
    movie: 'Inception',
    rating: 5,
    time: '4 hours ago',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
  },
  {
    id: 3,
    user: 'Sarah Wilson',
    action: 'started watching',
    movie: 'Pulp Fiction',
    time: '1 day ago',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
  }
];

export default function ActivityFeed() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-2xl border border-red-900/30 p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div 
            key={activity.id} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
            className="flex items-start space-x-3"
          >
            <img 
              src={activity.avatar} 
              alt={activity.user}
              className="w-8 h-8 rounded-full object-cover border border-red-500/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">
                <span className="font-medium">{activity.user}</span>
                {' '}{activity.action}{' '}
                <span className="font-medium text-red-400">{activity.movie}</span>
                {activity.rating && (
                  <span className="ml-1">
                    {Array.from({ length: activity.rating }).map((_, i) => (
                      <StarIcon key={i} className="inline h-3 w-3 text-yellow-400" />
                    ))}
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}