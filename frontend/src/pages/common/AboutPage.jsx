import React from 'react';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon,
  BookOpenIcon,
  UsersIcon,
  TrophyIcon,
  StarIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayIcon,
  ShieldCheckIcon,
  HeartIcon,
  LightBulbIcon,
  ClockIcon,
  ChartBarIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const stats = [
    { value: '50K+', label: 'Active Students', icon: UsersIcon },
    { value: '1000+', label: 'Expert Trainers', icon: AcademicCapIcon },
    { value: '500+', label: 'Premium Courses', icon: BookOpenIcon },
    { value: '98%', label: 'Success Rate', icon: TrophyIcon }
  ];

  const features = [
    {
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with real-world experience',
      icon: AcademicCapIcon,
      color: 'blue'
    },
    {
      title: 'Interactive Learning',
      description: 'Engage with hands-on projects, quizzes, and practical exercises',
      icon: LightBulbIcon,
      color: 'green'
    },
    {
      title: 'Flexible Schedule',
      description: 'Learn at your own pace with lifetime access to course materials',
      icon: ClockIcon,
      color: 'purple'
    },
    {
      title: 'Certification',
      description: 'Earn recognized certificates to advance your career',
      icon: ShieldCheckIcon,
      color: 'orange'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Full Stack Developer',
      company: 'Tech Corp',
      content: 'The courses here transformed my career. The practical approach and expert guidance helped me land my dream job.',
      rating: 5,
      avatar: 'https://via.placeholder.com/100x100'
    },
    {
      name: 'Michael Chen',
      role: 'Data Scientist',
      company: 'Data Analytics Inc',
      content: 'Outstanding curriculum and support. I went from beginner to job-ready in just 6 months.',
      rating: 5,
      avatar: 'https://via.placeholder.com/100x100'
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      company: 'Creative Studio',
      content: 'The design courses are comprehensive and up-to-date. I love the community and networking opportunities.',
      rating: 5,
      avatar: 'https://via.placeholder.com/100x100'
    }
  ];

  const trainers = [
    {
      name: 'Dr. John Smith',
      title: 'Senior Software Engineer',
      expertise: 'React, Node.js, Cloud Architecture',
      courses: 15,
      students: 5000,
      rating: 4.9,
      avatar: 'https://via.placeholder.com/100x100'
    },
    {
      name: 'Prof. Jane Williams',
      title: 'Data Science Expert',
      expertise: 'Machine Learning, Python, Statistics',
      courses: 12,
      students: 3500,
      rating: 4.8,
      avatar: 'https://via.placeholder.com/100x100'
    },
    {
      name: 'Robert Davis',
      title: 'UI/UX Design Lead',
      expertise: 'Design Systems, User Research, Prototyping',
      courses: 8,
      students: 2000,
      rating: 4.7,
      avatar: 'https://via.placeholder.com/100x100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Empowering Learning,
              <span className="block text-yellow-300">Transforming Careers</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Join thousands of learners worldwide in mastering new skills and achieving their professional goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="btn-premium bg-white text-blue-600 hover:bg-gray-100"
              >
                <BookOpenIcon className="h-5 w-5 mr-2" />
                Explore Courses
              </Link>
              <Link
                to="/register"
                className="btn-premium-outline border-white text-white hover:bg-white hover:text-blue-600"
              >
                <RocketLaunchIcon className="h-5 w-5 mr-2" />
                Start Free Trial
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ProTrain?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best learning experience with expert trainers and comprehensive courses
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-premium p-6 text-center"
              >
                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Learn from Industry Experts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our trainers are professionals with years of real-world experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainers.map((trainer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-premium p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={trainer.avatar}
                    alt={trainer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{trainer.name}</h3>
                    <p className="text-gray-600">{trainer.title}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {trainer.expertise.split(', ').map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{trainer.courses} courses</span>
                  <span>{trainer.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium">{trainer.rating}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied learners who have transformed their careers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-premium p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of students and professionals who are already learning with us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-premium bg-white text-blue-600 hover:bg-gray-100"
              >
                <RocketLaunchIcon className="h-5 w-5 mr-2" />
                Get Started Free
              </Link>
              <Link
                to="/courses"
                className="btn-premium-outline border-white text-white hover:bg-white hover:text-blue-600"
              >
                <BookOpenIcon className="h-5 w-5 mr-2" />
                Browse Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
