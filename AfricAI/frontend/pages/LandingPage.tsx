import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import AnimatedText from '../components/AnimatedText';
import CourseCard from '../components/CourseCard';
import CourseCardSkeleton from '../components/CourseCardSkeleton';
import TestimonialCard from '../components/TestimonialCard';
import FeatureCard from '../components/FeatureCard';
import TopTutorsCarousel from '../components/TopTutorsCarousel';
import { mockCourses, mockTestimonials } from '../mockData';
import { BrainCircuitIcon } from '../components/icons/BrainCircuitIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import { FileCodeIcon } from '../components/icons/FileCodeIcon';
import Logo from '../components/Logo';
import type { Course } from '../types';

const features = [
  {
    icon: UsersIcon,
    title: 'Expert Tutors',
    description: 'Learn from industry leaders and AI pioneers who bring real-world experience to every lesson.'
  },
  {
    icon: BrainCircuitIcon,
    title: 'AI-Powered Learning',
    description: 'Leverage our 24/7 AI Tutor to get instant help, clarify concepts, and accelerate your learning curve.'
  },
  {
    icon: FileCodeIcon,
    title: 'Hands-on Projects',
    description: 'Build a portfolio of impressive, real-world projects that showcase your skills to potential employers.'
  }
];

const LandingPage: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

    useEffect(() => {
        setIsLoadingCourses(true);
        const timer = setTimeout(() => {
            setFeaturedCourses(mockCourses.slice(0, 4));
            setIsLoadingCourses(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 text-center flex flex-col items-center">
        <Logo className="h-40 w-auto mb-8" />
        <AnimatedText text="Unlock Your Potential with AI-Powered Learning" className="text-4xl md:text-6xl font-extrabold mb-6" />
        <p className="max-w-3xl mx-auto text-lg text-gray-300 mb-10">
          Explore cutting-edge courses in AI, development, and design. Master new skills with expert-led instruction and our revolutionary AI Tutor.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/courses">
            <Button variant="primary" size="lg">Explore Courses</Button>
          </Link>
          <Link to="/ai-tutor">
            <Button variant="secondary" size="lg">Try AI Tutor</Button>
          </Link>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoadingCourses ? (
                Array.from({ length: 4 }).map((_, index) => <CourseCardSkeleton key={index} />)
            ) : (
                featuredCourses.map(course => (
                     <Link to={`/course/${course.id}`} key={course.id}>
                        <CourseCard course={course} />
                    </Link>
                ))
            )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose AfricAI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(feature => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      {/* Top Tutors Section */}
       <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Learn from the Best</h2>
          <TopTutorsCarousel />
       </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockTestimonials.map(testimonial => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-nebula-800 to-nebula-700 rounded-xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-lg text-nebula-200 mb-8 max-w-2xl mx-auto">Join thousands of learners and take the next step in your tech career. Sign up today and get access to our entire course library.</p>
            <Link to="/signup">
                <Button variant="primary" size="lg" className="bg-white text-nebula-900 hover:bg-nebula-100">Join Our Community</Button>
            </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;