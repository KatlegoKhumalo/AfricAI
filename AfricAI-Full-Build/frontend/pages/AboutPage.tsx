import React from 'react';
import GlassCard from '../components/GlassCard';
import AnimatedText from '../components/AnimatedText';

const teamMembers = [
  { name: 'Dr. Aisha Bello', role: 'Founder & CEO', avatar: 'https://i.pravatar.cc/150?u=aisha' },
  { name: 'David Kim', role: 'Head of Curriculum', avatar: 'https://i.pravatar.cc/150?u=david' },
  { name: 'Chinedu Okafor', role: 'Lead AI Engineer', avatar: 'https://i.pravatar.cc/150?u=chinedu' },
];

const AboutPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
            <section className="text-center pt-12">
                <AnimatedText text="Democratizing AI Education for Everyone" className="text-4xl md:text-5xl font-extrabold mb-6" />
                <p className="max-w-3xl mx-auto text-lg text-gray-300">
                    AfricAI was founded on the belief that education in artificial intelligence should be accessible, practical, and empowering for individuals everywhere. We are dedicated to building a future where anyone can harness the power of AI.
                </p>
            </section>

            <section className="grid md:grid-cols-2 gap-12 items-center">
                <GlassCard className="p-8">
                    <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                    <p className="text-gray-300">
                        Our mission is to empower the next generation of innovators, developers, and creators with high-quality, hands-on AI education. We strive to break down barriers to entry by providing affordable, expert-led courses and a supportive learning community. We believe in learning by doing, focusing on real-world projects that equip our students with the skills they need to excel in the fast-evolving tech landscape.
                    </p>
                </GlassCard>
                 <GlassCard className="p-8">
                    <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                    <p className="text-gray-300">
                        Founded by a team of passionate AI practitioners and educators, AfricAI started as a small initiative to share knowledge within our local community. We saw a huge demand for practical AI skills but a lack of accessible resources. What began as a series of workshops quickly grew into a global platform, driven by the success of our students and the dedication of our expert tutors. Today, we are proud to have helped thousands of learners from all walks of life unlock their potential.
                    </p>
                </GlassCard>
            </section>

            <section>
                <h2 className="text-4xl font-bold text-center mb-12">Meet the Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {teamMembers.map(member => (
                        <GlassCard key={member.name} className="p-6 text-center">
                            <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
                            <h3 className="font-bold text-lg">{member.name}</h3>
                            <p className="text-nebula-600">{member.role}</p>
                        </GlassCard>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
