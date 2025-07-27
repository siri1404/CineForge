import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StreamingProvider } from '../../contexts/MoviesContext';

interface StreamingProvidersProps {
  providers: StreamingProvider[];
}

export default function StreamingProviders({ providers }: StreamingProvidersProps) {
  const [activeTab, setActiveTab] = useState<'stream' | 'rent' | 'buy'>('stream');

  const streamProviders = providers.filter(p => p.type === 'stream');
  const rentProviders = providers.filter(p => p.type === 'rent');
  const buyProviders = providers.filter(p => p.type === 'buy');

  const tabs = [
    { id: 'stream', label: 'Stream', providers: streamProviders },
    { id: 'rent', label: 'Rent', providers: rentProviders },
    { id: 'buy', label: 'Buy', providers: buyProviders }
  ] as const;

  const activeProviders = tabs.find(tab => tab.id === activeTab)?.providers || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-2xl border border-red-900/30 p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Where to Watch</h2>

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
              {tab.providers.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  className="ml-2 bg-gray-800 text-gray-400 py-0.5 px-2 rounded-full text-xs"
                >
                  {tab.providers.length}
                </motion.span>
              )}
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Provider Cards */}
      {activeProviders.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {activeProviders.map((provider, index) => (
            <motion.a
              key={provider.provider}
              href={provider.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 30px rgba(239, 68, 68, 0.3)" 
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-gray-700/60 transition-all duration-300 border border-gray-700/50 hover:border-red-500/50 group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {provider.logo}
              </div>
              <p className="text-white font-medium text-sm group-hover:text-red-400 transition-colors">
                {provider.provider}
              </p>
              <p className="text-gray-400 text-xs mt-1 capitalize">
                {provider.type}
              </p>
            </motion.a>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center py-8"
        >
          <p className="text-gray-400">
            No {activeTab} options available at the moment
          </p>
        </motion.div>
      )}
    </motion.section>
  );
}