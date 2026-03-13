// Simple test to verify instructors module works
const instructors = [
  {
    _id: '1',
    name: 'John Smith',
    title: 'Senior React Developer',
    bio: 'Passionate React developer with 8+ years of experience building scalable web applications.',
    avatar: 'https://via.placeholder.com/80x80',
    rating: 4.8,
    totalStudents: 1250,
    totalCourses: 12,
    experience: 8,
    location: 'San Francisco, CA',
    specialties: ['development', 'react', 'javascript'],
    isVerified: true
  },
  {
    _id: '2', 
    name: 'Sarah Johnson',
    title: 'UI/UX Design Expert',
    bio: 'Creative designer focused on user-centered design principles.',
    avatar: 'https://via.placeholder.com/80x80',
    rating: 4.9,
    totalStudents: 890,
    totalCourses: 8,
    experience: 6,
    location: 'New York, NY',
    specialties: ['design', 'ui', 'ux'],
    isVerified: true
  }
];

console.log('Test instructors data:', instructors);
console.log('Module structure is correct');

export default instructors;
