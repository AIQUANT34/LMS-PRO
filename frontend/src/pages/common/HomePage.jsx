import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button'
import { 
  BriefcaseIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlayIcon,
  StarIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const features = [
    {
      icon: BookOpenIcon,
      title: 'Expert-Led Training',
      description: 'Develop professional skills with industry-expert led corporate training programs',
    },
    {
      icon: UserGroupIcon,
      title: 'Team Collaboration',
      description: 'Engage with trainers and colleagues in a collaborative corporate learning environment',
    },
    {
      icon: ChartBarIcon,
      title: 'Progress Tracking',
      description: 'Monitor professional development with detailed analytics and reporting',
    },
    {
      icon: PlayIcon,
      title: 'Interactive Content',
      description: 'High-quality interactive content for optimal corporate training experience',
    },
  ];

  const stats = [
    { label: 'Active Learners', value: '50,000+', icon: UserGroupIcon },
    { label: 'Expert Trainers', value: '500+', icon: BriefcaseIcon },
    { label: 'Training Programs', value: '1,000+', icon: BookOpenIcon },
    { label: 'Completion Rate', value: '98%', icon: ChartBarIcon },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl shadow-lg mb-6"
            >
              <BriefcaseIcon className="h-8 w-8 text-black" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Develop Your <span className="text-gradient-premium">Career</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Advance your professional skills with expert-led corporate training, interactive learning, and personalized development. Join thousands of learners growing their careers.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register" className="btn-premium">
                <SparklesIcon className="h-5 w-5 mr-2" />
                Start Training
              </Link>
              <Link to="/courses" className="btn-premium-outline">
                <BookOpenIcon className="h-5 w-5 mr-2" />
                Browse Programs
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-gradient-premium">Corporate LMS</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need to succeed in your professional development
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-6 text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Advance Your Career?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of learners already training with ProTrain
          </p>
          <Link to="/register" className="btn-accent">
           
            <Button size="lg">
             Start Training Today
            </Button>
            
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
