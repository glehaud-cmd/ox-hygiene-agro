import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import EditableText from './cms/EditableText';
import { ArrowRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { NewsItem } from '../types/news';
import NewsCard from './news/NewsCard';

export default function News() {
  const { content } = useCMS();

  const recentNews = useMemo(() => {
    try {
      const items: NewsItem[] = JSON.parse(content.news_items || '[]');
      return items.slice(0, 3); // Show top 3 recent news
    } catch (e) {
      console.error("Error parsing news_items", e);
      return [];
    }
  }, [content.news_items]);

  return (
    <section id="actualite" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <motion.h2 
              className="text-accent font-semibold tracking-wider uppercase mb-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <EditableText contentKey="news_title" />
            </motion.h2>
            <motion.h3 
              className="text-3xl md:text-4xl font-bold text-primary"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <EditableText contentKey="news_subtitle" />
            </motion.h3>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              to="/actualites"
              className="flex items-center gap-2 text-accent font-semibold hover:text-primary transition-colors"
            >
              Voir tous les articles <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentNews.map((item, index) => (
            <NewsCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
