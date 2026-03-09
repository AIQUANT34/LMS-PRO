import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  BookOpenIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  PlusIcon,
  MinusIcon,
  DocumentTextIcon,
  FolderIcon,
  ServerIcon,
  BeakerIcon,
  SparklesIcon,
  FireIcon,
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PrinterIcon,
  ShareIcon,
  LinkIcon,
  CameraIcon,
  VideoCameraIcon,
  PhotoIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  DocumentIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  TruckIcon,
  PackageIcon,
  ClipboardDocumentListIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  ChartPieIcon,
  ChartLineIcon,
  CubeIcon,
  CircleStackIcon,
  ArchiveBoxIcon,
  InboxIcon,
  BriefcaseIcon,
  BellIcon,
  Cog6TootIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  ArrowRightIcon as ArrowRightIconOutline,
  PlayIcon,
  PauseIcon,
  StopIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  HeartIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Contact form submitted:', formData);
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: 'Email',
      value: 'support@lms-pro.com',
      description: 'Get help with your account or courses'
    },
    {
      icon: PhoneIcon,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri: 9AM-6PM EST'
    },
    {
      icon: MapPinIcon,
      title: 'Office',
      value: '123 Learning Street, San Francisco, CA 94102',
      description: 'Visit our headquarters'
    }
  ];

  const faqs = [
    {
      question: 'How do I enroll in a course?',
      answer: 'Simply browse our course catalog, select a course, and click the "Enroll Now" button. You\'ll need to create an account if you don\'t have one.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all courses. If you\'re not satisfied, contact our support team.'
    },
    {
      question: 'Do you offer certificates?',
      answer: 'Yes, all courses come with a certificate of completion that you can share with employers or on LinkedIn.'
    },
    {
      question: 'How long do I have access to courses?',
      answer: 'Once you enroll, you get lifetime access to the course content, including any future updates.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
              We're here to help you with any questions about our courses or platform
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-900 font-medium mb-1">{info.value}</p>
                <p className="text-gray-600 text-sm">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card-premium p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="How can we help you?"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us more about your question or feedback..."
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-premium px-8 py-3"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>

            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg text-center ${
                  submitStatus === 'success' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {submitStatus === 'success' ? (
                  <>
                    <CheckCircleIcon className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-semibold">Message sent successfully!</p>
                    <p className="text-sm">We'll get back to you within 24 hours.</p>
                  </>
                ) : (
                  <>
                    <ExclamationTriangleIcon className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-semibold">Something went wrong</p>
                    <p className="text-sm">Please try again later.</p>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our platform
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-premium p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of students and start your learning journey today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="btn-premium bg-white text-blue-600 hover:bg-gray-100"
              >
                <BookOpenIcon className="h-5 w-5 mr-2" />
                Browse Courses
              </Link>
              <Link
                to="/register"
                className="btn-premium-outline border-white text-white hover:bg-white hover:text-blue-600"
              >
                <UsersIcon className="h-5 w-5 mr-2" />
                Sign Up Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
