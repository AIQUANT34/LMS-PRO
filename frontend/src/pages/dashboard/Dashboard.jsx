
import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { BookOpen, Award, Clock, TrendingUp, Users, Target } from 'lucide-react'

export default function Dashboard(){
    const { auth } = useContext(AuthContext)

    const stats = [
        { icon: BookOpen, label: "Courses Enrolled", value: "12", color: "bg-blue-500" },
        { icon: Award, label: "Certificates Earned", value: "8", color: "bg-green-500" },
        { icon: Clock, label: "Learning Hours", value: "156", color: "bg-purple-500" },
        { icon: TrendingUp, label: "Completion Rate", value: "85%", color: "bg-orange-500" },
        { icon: Users, label: "Study Groups Joined", value: "4", color: "bg-red-500" }
    ]

    const recentCourses = [
        { title: "React Development", progress: 75, nextLesson: "Hooks Deep Dive" },
        { title: "Node.js Backend", progress: 60, nextLesson: "Database Integration" },
        { title: "UI/UX Design", progress: 90, nextLesson: "Final Project" },
        { title: "Python Basics", progress: 45, nextLesson: "Data Structures" }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {auth?.user?.name || 'Student'}! 👋
                    </h1>
                    <p className="text-gray-600">Continue your learning journey and track your progress</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                            </div>
                            <p className="text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Courses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Continue Learning</h2>
                        <div className="space-y-4">
                            {recentCourses.map((course, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                                        <span className="text-sm text-purple-600 font-medium">{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                        <div 
                                            className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600">Next: {course.nextLesson}</p>
                                    <button className="mt-3 text-purple-600 hover:text-purple-700 font-medium text-sm">
                                        Continue →
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Goals</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                <Target className="h-5 w-5 text-purple-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Complete 3 courses this month</p>
                                    <p className="text-sm text-gray-600">2 of 3 completed</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                <Users className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Join study groups</p>
                                    <p className="text-sm text-gray-600">Connect with peers</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                <Award className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Earn certificates</p>
                                    <p className="text-sm text-gray-600">2 more to go</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-8 text-white">
                    <h2 className="text-2xl font-bold mb-4">Ready for more?</h2>
                    <p className="text-purple-100 mb-6">Explore new courses and expand your knowledge</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            Browse Courses
                        </button>
                        <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                            View Certificates
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}