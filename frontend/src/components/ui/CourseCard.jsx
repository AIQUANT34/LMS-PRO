import React from 'react'

export default function CourseCard({ course }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm flex items-start gap-4">
      <div className="w-12 h-12 bg-indigo-100 rounded flex items-center justify-center text-indigo-600 font-semibold">{course.abbr}</div>
      <div>
        <div className="font-semibold text-gray-800">{course.title}</div>
        <div className="text-sm text-gray-500">{course.enrolled} students • {course.progress}% complete</div>
      </div>
    </div>
  )
}
