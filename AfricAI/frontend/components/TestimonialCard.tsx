import React from 'react';
import GlassCard from './GlassCard';

interface Testimonial {
  name: string;
  avatarUrl: string;
  role: string;
  text: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <GlassCard className="p-6 h-full flex flex-col">
      <p className="text-gray-300 italic flex-grow mb-6">"{testimonial.text}"</p>
      <div className="flex items-center">
        <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <p className="font-bold">{testimonial.name}</p>
          <p className="text-sm text-gray-400">{testimonial.role}</p>
        </div>
      </div>
    </GlassCard>
  );
};

export default TestimonialCard;