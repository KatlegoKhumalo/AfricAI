// FIX: Removed self-import of `User` which caused a conflict with the local declaration.

export type QuizQuestionType = 'mcq' | 'true-false';

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuizQuestionType;
  options: string[];
  correctAnswer: string;
}

export interface Test {
  courseId: string;
  questions: QuizQuestion[];
}

export interface TestResult {
  id: string;
  userId: string;
  courseId: string;
  score: number; // Percentage
  status: 'Pass' | 'Fail';
  dateTaken: string; // ISO String
}

export interface Chapter {
  id: string;
  title: string;
  duration: number; // in minutes
  videoUrl: string;
  content: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  category: string;
  imageUrl: string;
  chapters: Chapter[];
  price: number;
  rating?: number;
  reviews?: number;
  progress?: number; // percentage
  score?: number; // student's latest test score
  tutor?: Tutor;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface LiveSession {
    id:string;
    title: string;
    startTime: Date;
    endTime: Date;
    timezone: string;
    capacity: number;
    bookedStudents: string[]; // Array of student user IDs
}

export interface TutorSubscription {
    status: 'active' | 'inactive' | 'past_due';
    nextBillingDate: Date;
    fee: number;
}

export interface Tutor {
    id: string;
    publicId: string;
    name: string;
    avatarUrl: string;
    title: string;
    bio: string;
    rating: number;
    reviews: number;
    courses: Course[];
    schedule: LiveSession[];
    subscription: TutorSubscription;
    verified?: boolean;
    joinDate: Date;
}

export type UserRole = 'learner' | 'tutor' | 'admin';

export interface PaymentMethod {
    cardNumber: string;
    expiryDate: string; // MM/YY
    cvv: string;
    nameOnCard: string;
    billingAddress: string;
    zipCode: string;
}

export interface User {
    id: string;
    publicId: string;
    name: string;
    email: string;
    avatarUrl: string;
    role: UserRole;
    bio?: string;
    verified?: boolean;
    joinDate: Date;
    paymentMethod?: PaymentMethod;
}

export interface Invoice {
    id: string;
    date: Date;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    description: string;
}

export interface Transaction {
    id: string;
    user: {
        id: string;
        name: string;
    };
    type: 'Course Sale' | 'Tutor Subscription';
    amount: number;
    date: Date;
    description: string;
}