import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { BookOpen, Users, Award, Clock, Star, Play, ChevronRight, TrendingUp, Target, Zap } from 'lucide-react'

export default function Home() {
  const featuredCourses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp 2024",
      instructor: "Dr. Sarah Johnson",
      rating: 4.8,
      students: 15420,
      price: 89.99,
      originalPrice: 199.99,
      image: "web-dev",
      category: "Development",
      duration: "42 hours",
      level: "Beginner",
      badge: "Bestseller"
    },
    {
      id: 2,
      title: "Data Science & Machine Learning A-Z",
      instructor: "Prof. Michael Chen",
      rating: 4.9,
      students: 12350,
      price: 94.99,
      originalPrice: 189.99,
      image: "data-science",
      category: "Data Science",
      duration: "38 hours",
      level: "Intermediate",
      badge: "Hot"
    },
    {
      id: 3,
      title: "UI/UX Design Masterclass",
      instructor: "Emily Rodriguez",
      rating: 4.7,
      students: 8920,
      price: 79.99,
      originalPrice: 159.99,
      image: "ui-ux",
      category: "Design",
      duration: "28 hours",
      level: "Beginner",
      badge: "New"
    },
    {
      id: 4,
      title: "Digital Marketing Complete Course",
      instructor: "Alex Thompson",
      rating: 4.6,
      students: 20150,
      price: 69.99,
      originalPrice: 149.99,
      image: "marketing",
      category: "Marketing",
      duration: "24 hours",
      level: "Beginner",
      badge: "Popular"
    }
  ]

  const categories = [
    { name: "Development", icon: "💻", courses: 1250, color: "bg-blue-500" },
    { name: "Business", icon: "💼", courses: 890, color: "bg-green-500" },
    { name: "Design", icon: "🎨", courses: 650, color: "bg-purple-500" },
    { name: "Marketing", icon: "📱", courses: 420, color: "bg-orange-500" },
    { name: "Data Science", icon: "📊", courses: 380, color: "bg-red-500" },
    { name: "Photography", icon: "📷", courses: 290, color: "bg-pink-500" }
  ]

  const stats = [
    { icon: Users, label: "Active Learners", value: "50,000+" },
    { icon: BookOpen, label: "Courses", value: "1,000+" },
    { icon: Award, label: "Expert Instructors", value: "500+" },
    { icon: Star, label: "Satisfaction Rate", value: "98%" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Learn Without Limits<br />
                <span className="text-purple-200">Start, Switch, or Advance Your Career</span>
              </h1>
              <p className="text-xl mb-8 text-purple-100">
                Access 1000+ courses from expert instructors. Build skills with courses, certificates, and degrees from world-class universities and companies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Explore Courses
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                  Start Learning Free
                </button>
              </div>
              <div className="flex items-center gap-8 mt-8">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">4.8/5</span>
                  <span className="text-purple-200">(15,000+ reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-300" />
                  <span>50,000+ Active Learners</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <BookOpen className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">1000+</div>
                    <div className="text-sm">Courses</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm">Instructors</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Award className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm">Success Rate</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Target className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Top Categories</h2>
            <p className="text-lg text-gray-600">Choose from our most popular categories and start learning today</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.courses} courses</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Courses</h2>
              <p className="text-lg text-gray-600">Hand-picked courses to help you achieve your goals</p>
            </div>
            <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium">
              View All Courses <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <div key={course.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-purple-600" />
                  </div>
                  {course.badge && (
                    <span className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {course.badge}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-purple-600 font-medium">{course.category}</span>
                    <span className="text-xs text-gray-500">• {course.level}</span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">${course.originalPrice}</span>
                    </div>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose LMS Pro?</h2>
            <p className="text-lg text-gray-600">Join thousands of learners achieving their goals</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join 50,000+ students already learning on LMS Pro. Start your free trial today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
              Browse Courses
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
