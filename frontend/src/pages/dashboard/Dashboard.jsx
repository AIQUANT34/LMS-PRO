
import React from 'react'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import StatCard from '../../components/ui/StatCard'
import CourseCard from '../../components/ui/CourseCard'

const sampleStats = [
    { title: 'Courses', value: 12 },
    { title: 'Students', value: 342 },
    { title: 'Active', value: 8 },
]

const sampleCourses = [
    { abbr: 'JS', title: 'JavaScript Basics', enrolled: 120, progress: 64 },
    { abbr: 'PY', title: 'Python for Data', enrolled: 80, progress: 42 },
    { abbr: 'DB', title: 'Intro to Databases', enrolled: 60, progress: 78 },
]

export default function Dashboard(){
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {sampleStats.map((s) => (
                            <StatCard key={s.title} title={s.title} value={s.value} />
                        ))}
                    </section>

                    <section className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Your Courses</h3>
                        <div className="space-y-3">
                            {sampleCourses.map((c) => (
                                <CourseCard key={c.title} course={c} />
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                        <div className="bg-white p-4 rounded shadow-sm text-gray-600">No recent activity.</div>
                    </section>
                </main>
            </div>
        </div>
    )
}