import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CastMember, CrewMember } from '../../contexts/MoviesContext';

interface CastCrewProps {
  cast: CastMember[];
  crew: CrewMember[];
}

export default function CastCrew({ cast, crew }: CastCrewProps) {
  const [activeTab, setActiveTab] = useState<'cast' | 'crew'>('cast');

  const tabs = [
    { id: 'cast', label: 'Cast', data: cast },
    { id: 'crew', label: 'Crew', data: crew }
  ] as const;

  const activeData = tabs.find(tab => tab.id === activeTab)?.data || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-2xl border border-red-900/30 p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Cast & Crew</h2>

      {/* Tabs */}
      <div className="border-b border-gray-800 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
              }`}
            >
              {tab.label}
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                className="ml-2 bg-gray-800 text-gray-400 py-0.5 px-2 rounded-full text-xs"
              >
                {tab.data.length}
              </motion.span>
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Cast/Crew Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
      >
        {activeData.map((person, index) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.05, duration: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-gray-700/60 transition-all duration-300 border border-gray-700/50 hover:border-red-500/50 group cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="relative mb-3"
            >
              <img 
                src={person.profilePath} 
                alt={person.name}
                className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-gray-600 group-hover:border-red-500/50 transition-colors"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
            <h3 className="font-medium text-white text-sm mb-1 group-hover:text-red-400 transition-colors">
              {person.name}
            </h3>
            <p className="text-gray-400 text-xs">
              {activeTab === 'cast' 
                ? (person as CastMember).character 
                : (person as CrewMember).job
              }
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}