import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  TrophyIcon,
  MagnifyingGlassIcon,
  FireIcon,
  SparklesIcon,
  BeakerIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  GiftIcon,
  CrownIcon,
  HeartIcon,
  BoltIcon,
  ShieldCheckIcon,
  GemIcon,
  BanknotesIcon,
  ArrowUpTrayIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  FunnelIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  DocumentTextIcon,
  ServerIcon,
  GlobeAltIcon,
  LockClosedIcon,
  KeyIcon,
  FlagIcon,
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  LinkIcon,
  CameraIcon,
  VideoCameraIcon,
  PhotoIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  DocumentIcon,
  CurrencyDollarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  TruckIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  ListBulletIcon,
  TableCellsIcon,
  ChartPieIcon,
  CircleStackIcon,
  ArchiveBoxIcon,
  InboxIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  BellIcon,
  CogIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  HandRaisedIcon,
  LightBulbIcon,
  BrainIcon,
  CpuChipIcon,
  TargetIcon,
  PuzzlePieceIcon,
  GamepadIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const GamificationSystem = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [badges, setBadges] = useState([]);
  const [streaks, setStreaks] = useState([]);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // Mock user profile
  const mockUserProfile = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://via.placeholder.com/100x100',
    level: 12,
    points: 2450,
    streak: 15,
    rank: 23,
    totalUsers: 1234,
    joinDate: '2024-01-15',
    lastActive: '2024-03-07',
    stats: {
      coursesCompleted: 8,
      lessonsCompleted: 45,
      quizzesPassed: 23,
      averageScore: 87,
      timeSpent: 120, // hours
      achievementsUnlocked: 15,
      badgesEarned: 8,
      challengesCompleted: 12,
      rewardsRedeemed: 5
    },
    progress: {
      currentLevelPoints: 450,
      nextLevelPoints: 500,
      percentageToNext: 90
    }
  };

  // Mock achievements
  const mockAchievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: AcademicCapIcon,
      category: 'beginner',
      points: 50,
      unlocked: true,
      unlockedAt: '2024-01-15',
      rarity: 'common',
      progress: 100,
      requirement: 'Complete 1 lesson'
    },
    {
      id: 2,
      title: 'Quiz Master',
      description: 'Score 100% on 5 quizzes',
      icon: StarIcon,
      category: 'quiz',
      points: 100,
      unlocked: true,
      unlockedAt: '2024-02-01',
      rarity: 'uncommon',
      progress: 100,
      requirement: '5 perfect quizzes'
    },
    {
      id: 3,
      title: 'Speed Learner',
      description: 'Complete 10 lessons in one day',
      icon: BoltIcon,
      category: 'speed',
      points: 150,
      unlocked: false,
      rarity: 'rare',
      progress: 70,
      requirement: '10 lessons in 24 hours'
    },
    {
      id: 4,
      title: 'Consistency King',
      description: 'Maintain a 30-day streak',
      icon: FireIcon,
      category: 'streak',
      points: 200,
      unlocked: false,
      rarity: 'epic',
      progress: 50,
      requirement: '30 days consecutive'
    },
    {
      id: 5,
      title: 'Knowledge Seeker',
      description: 'Complete 50 lessons across different courses',
      icon: BookOpenIcon,
      category: 'learning',
      points: 250,
      unlocked: false,
      rarity: 'legendary',
      progress: 90,
      requirement: '50 lessons total'
    }
  ];

  // Mock leaderboard
  const mockLeaderboard = [
    {
      rank: 1,
      user: {
        id: 1,
        name: 'Sarah Johnson',
        avatar: 'https://via.placeholder.com/50x50',
        level: 25,
        points: 5432,
        streak: 45
      },
      badges: ['Top Performer', 'Quiz Master', 'Consistency King'],
      change: 0
    },
    {
      rank: 2,
      user: {
        id: 2,
        name: 'Mike Wilson',
        avatar: 'https://via.placeholder.com/50x50',
        level: 23,
        points: 5210,
        streak: 30
      },
      badges: ['Speed Learner', 'Knowledge Seeker'],
      change: 1
    },
    {
      rank: 3,
      user: {
        id: 3,
        name: 'Emily Chen',
        avatar: 'https://via.placeholder.com/50x50',
        level: 22,
        points: 4890,
        streak: 28
      },
      badges: ['Quiz Master', 'First Steps'],
      change: -1
    },
    {
      rank: 23,
      user: {
        id: 4,
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/50x50',
        level: 12,
        points: 2450,
        streak: 15
      },
      badges: ['First Steps', 'Quiz Master'],
      change: 5
    }
  ];

  // Mock rewards
  const mockRewards = [
    {
      id: 1,
      title: 'Premium Course Access',
      description: 'Unlock any premium course for 7 days',
      icon: GiftIcon,
      category: 'course',
      points: 1000,
      available: true,
      quantity: 10,
      redeemed: 45,
      expiryDate: '2024-12-31',
      rarity: 'common'
    },
    {
      id: 2,
      title: 'Study Buddy Pass',
      description: 'Invite a friend to study together for 30 days',
      icon: UserGroupIcon,
      category: 'social',
      points: 500,
      available: true,
      quantity: 25,
      redeemed: 12,
      expiryDate: '2024-12-31',
      rarity: 'common'
    },
    {
      id: 3,
      title: 'Mentor Session',
      description: '1-hour session with an expert instructor',
      icon: AcademicCapIcon,
      category: 'learning',
      points: 2000,
      available: true,
      quantity: 5,
      redeemed: 8,
      expiryDate: '2024-12-31',
      rarity: 'rare'
    },
    {
      id: 4,
      title: 'Certificate Voucher',
      description: '50% discount on any course certificate',
      icon: TrophyIcon,
      category: 'certificate',
      points: 750,
      available: true,
      quantity: 20,
      redeemed: 23,
      expiryDate: '2024-12-31',
      rarity: 'uncommon'
    },
    {
      id: 5,
      title: 'Exclusive Badge',
      description: 'Limited edition "Early Adopter" badge',
      icon: StarIcon,
      category: 'badge',
      points: 1500,
      available: false,
      quantity: 0,
      redeemed: 50,
      expiryDate: '2024-03-31',
      rarity: 'legendary'
    }
  ];

  // Mock challenges
  const mockChallenges = [
    {
      id: 1,
      title: 'Weekly Quiz Challenge',
      description: 'Complete 10 quizzes this week',
      icon: QuestionMarkCircleIcon,
      category: 'quiz',
      difficulty: 'medium',
      points: 200,
      startDate: '2024-03-04',
      endDate: '2024-03-11',
      progress: 7,
      total: 10,
      completed: false,
      participants: 234,
      reward: {
        type: 'points',
        value: 200
      }
    },
    {
      id: 2,
      title: 'Speed Learning Sprint',
      description: 'Complete 5 lessons in 2 hours',
      icon: BoltIcon,
      category: 'speed',
      difficulty: 'hard',
      points: 300,
      startDate: '2024-03-07',
      endDate: '2024-03-07',
      progress: 2,
      total: 5,
      completed: false,
      participants: 156,
      reward: {
        type: 'badge',
        value: 'Speed Demon'
      }
    },
    {
      id: 3,
      title: 'Knowledge Marathon',
      description: 'Study for 10 hours this week',
      icon: ClockIcon,
      category: 'time',
      difficulty: 'medium',
      points: 250,
      startDate: '2024-03-04',
      endDate: '2024-03-11',
      progress: 6.5,
      total: 10,
      completed: false,
      participants: 189,
      reward: {
        type: 'points',
        value: 250
      }
    }
  ];

  // Mock badges
  const mockBadges = [
    {
      id: 1,
      name: 'First Steps',
      description: 'Completed first lesson',
      icon: AcademicCapIcon,
      category: 'achievement',
      rarity: 'common',
      earned: true,
      earnedAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Quiz Master',
      description: 'Scored 100% on 5 quizzes',
      icon: StarIcon,
      category: 'skill',
      rarity: 'uncommon',
      earned: true,
      earnedAt: '2024-02-01'
    },
    {
      id: 3,
      name: 'Consistency King',
      description: '30-day learning streak',
      icon: FireIcon,
      category: 'streak',
      rarity: 'epic',
      earned: false,
      earnedAt: null
    },
    {
      id: 4,
      name: 'Speed Demon',
      description: 'Completed challenge in record time',
      icon: BoltIcon,
      category: 'challenge',
      rarity: 'rare',
      earned: false,
      earnedAt: null
    }
  ];

  // Mock streaks
  const mockStreaks = [
    {
      type: 'daily',
      current: 15,
      longest: 23,
      lastActive: '2024-03-07',
      multiplier: 1.5
    },
    {
      type: 'weekly',
      current: 3,
      longest: 8,
      lastActive: '2024-03-07',
      multiplier: 2.0
    },
    {
      type: 'monthly',
      current: 2,
      longest: 4,
      lastActive: '2024-03-07',
      multiplier: 3.0
    }
  ];

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setUserProfile(mockUserProfile);
      setAchievements(mockAchievements);
      setLeaderboard(mockLeaderboard);
      setRewards(mockRewards);
      setChallenges(mockChallenges);
      setBadges(mockBadges);
      setStreaks(mockStreaks);
      setPoints(mockUserProfile.points);
      setLevel(mockUserProfile.level);
    }, 500);
  }, []);

  const handleRedeemReward = (reward) => {
    if (points >= reward.points && reward.available) {
      setSelectedReward(reward);
      setShowRewardModal(true);
    }
  };

  const confirmRedeemReward = () => {
    if (selectedReward) {
      setPoints(points - selectedReward.points);
      setShowRewardModal(false);
      setSelectedReward(null);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'uncommon': return 'text-green-600 bg-green-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUpIcon className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDownIcon className="h-4 w-4 text-red-600" />;
    return <ArrowRightIcon className="h-4 w-4 text-gray-400" />;
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* User Stats */}
      {userProfile && (
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img 
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{userProfile.name}</h2>
                <p className="text-gray-600">Level {userProfile.level} • Rank #{userProfile.rank}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{userProfile.points.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FireIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userProfile.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <AcademicCapIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userProfile.stats.coursesCompleted}</div>
              <div className="text-sm text-gray-600">Courses</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <StarIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userProfile.stats.averageScore}%</div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <TrophyIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userProfile.stats.achievementsUnlocked}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Level Progress</span>
              <span className="text-sm text-gray-900">
                {userProfile.progress.currentLevelPoints} / {userProfile.progress.nextLevelPoints} XP
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${userProfile.progress.percentageToNext}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Challenges */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Challenges</h3>
        <div className="space-y-4">
          {challenges.filter(c => !c.completed).slice(0, 3).map((challenge) => (
            <div key={challenge.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <challenge.icon className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{challenge.title}</h4>
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">
                      {challenge.participants} participants
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{challenge.points}</div>
                <div className="text-sm text-gray-600">points</div>
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1">
                    {challenge.progress} / {challenge.total}
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.filter(a => a.unlocked).slice(0, 4).map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getRarityColor(achievement.rarity)}`}>
                <achievement.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">+{achievement.points} points</span>
                  <span className="text-xs text-gray-500">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AchievementsTab = () => (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg border-2 ${
                achievement.unlocked 
                  ? 'border-yellow-400 bg-yellow-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getRarityColor(achievement.rarity)}`}>
                  <achievement.icon className="h-6 w-6" />
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getRarityColor(achievement.rarity)}`}>
                  {achievement.rarity}
                </span>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-1">{achievement.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">+{achievement.points} points</span>
                {achievement.unlocked && (
                  <span className="text-xs text-gray-500">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              {!achievement.unlocked && (
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{achievement.progress}% complete</span>
                    <span>{achievement.requirement}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {achievement.unlocked && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Unlocked</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const LeaderboardTab = () => (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Leaderboard</h3>
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div 
              key={entry.rank}
              className={`flex items-center justify-between p-4 rounded-lg ${
                entry.user.name === userProfile?.name 
                  ? 'bg-blue-50 border-2 border-blue-500' 
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  entry.rank === 1 ? 'bg-yellow-500 text-white' :
                  entry.rank === 2 ? 'bg-gray-400 text-white' :
                  entry.rank === 3 ? 'bg-orange-600 text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {entry.rank}
                </div>
                
                <img 
                  src={entry.user.avatar}
                  alt={entry.user.name}
                  className="w-10 h-10 rounded-full"
                />
                
                <div>
                  <h4 className="font-semibold text-gray-900">{entry.user.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Level {entry.user.level}</span>
                    <span>•</span>
                    <span>{entry.user.points.toLocaleString()} points</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <FireIcon className="h-4 w-4 text-orange-600" />
                      <span>{entry.user.streak}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{entry.user.points.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">points</div>
                </div>
                
                <div className="flex items-center gap-1">
                  {getChangeIcon(entry.change)}
                  {entry.change !== 0 && (
                    <span className={`text-sm font-medium ${
                      entry.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Math.abs(entry.change)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const RewardsTab = () => (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Rewards Store</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Your Points:</span>
            <span className="text-lg font-bold text-blue-600">{points.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <motion.div
              key={reward.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg border-2 ${
                !reward.available 
                  ? 'border-gray-200 bg-gray-50 opacity-50' 
                  : points >= reward.points
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getRarityColor(reward.rarity)}`}>
                  <reward.icon className="h-6 w-6" />
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getRarityColor(reward.rarity)}`}>
                  {reward.rarity}
                </span>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-1">{reward.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-900">{reward.points}</span>
                <span className="text-sm text-gray-600">points</span>
              </div>
              
              <div className="text-xs text-gray-500 mb-3">
                {reward.quantity} available • {reward.redeemed} redeemed
              </div>
              
              <button
                onClick={() => handleRedeemReward(reward)}
                disabled={!reward.available || points < reward.points}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  !reward.available || points < reward.points
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {!reward.available ? 'Out of Stock' : 
                 points < reward.points ? 'Not Enough Points' : 
                 'Redeem Reward'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const RewardModal = () => (
    <AnimatePresence>
      {showRewardModal && selectedReward && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 ${getRarityColor(selectedReward.rarity)}`}>
                <selectedReward.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Redeem Reward?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to redeem <strong>{selectedReward.title}</strong> for {selectedReward.points} points?
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowRewardModal(false)}
                className="btn-premium-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmRedeemReward}
                className="btn-premium"
              >
                Redeem Reward
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <TrophyIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gamification System</h1>
                <p className="text-gray-600">Earn points, unlock achievements, and climb the leaderboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FireIcon className="h-5 w-5 text-orange-600" />
                <span className="font-bold text-gray-900">{userProfile?.streak || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <StarIcon className="h-5 w-5 text-yellow-600" />
                <span className="font-bold text-gray-900">{points.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {['overview', 'achievements', 'leaderboard', 'rewards'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  selectedTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {selectedTab === 'overview' && <OverviewTab />}
          {selectedTab === 'achievements' && <AchievementsTab />}
          {selectedTab === 'leaderboard' && <LeaderboardTab />}
          {selectedTab === 'rewards' && <RewardsTab />}
        </div>
      </div>

      {/* Modals */}
      <RewardModal />
    </div>
  );
};

export default GamificationSystem;
