import React from 'react';
import GlassCard from '../components/GlassCard';
import AnimatedText from '../components/AnimatedText';

const teamMembers = [
  {
    name: 'Katlego William Khumalo',
    role: 'CEO · Team Lead · Frontend Developer & Backend Integration',
    avatar: '/assets/images/william.jpg',
    bio: 'Sets vision and product direction; crafts user‑first experiences with seamless backend integration.'
  },
    {
    name: 'Njabulo Garry Mazibuko',
    role: 'COO · Backend Architect · QA',
    avatar: '/assets/images/njabulo.jpg',
    bio: 'Oversees daily operations, backend architecture, and quality to deliver a robust, high‑performing platform.'
  },
  {
    name: 'Botlhlale Tumelo Mphai',
    role: 'CSO · Backend Developer · DevOps Lead',
    avatar: '/assets/images/botlhale.jpg',
    bio: 'Leads strategy, scaling, and DevOps to ensure reliability, security, and growth across AfricAI services.'
  },
  {
    name: 'Ayabulela Jilimba',
    role: 'CFO · Creative Director · Legal · Backend Developer',
    avatar: '/assets/images/ayabulela.jpg',
    bio: 'Drives financial strategy and creative direction while ensuring legal compliance and contributing to backend development.'
  }
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
                 <GlassCard className="p-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                    <p className="text-gray-300 max-w-3xl mx-auto">
                        We envision a world where knowledge is a currency for growth, not a barrier. Our goal is to be the leading catalyst for technological empowerment, creating a global ecosystem of learners, creators, and innovators who are equipped to solve the challenges of tomorrow. We see a future where your location does not determine your access to world-class education.
                    </p>
                </GlassCard>
            </section>

            <section>
                <h2 className="text-4xl font-bold text-center mb-12">Meet the AfricAI Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {teamMembers.map(member => (
                        <GlassCard key={member.name} className="p-0 overflow-hidden transition-all duration-300 hover:bg-white/10 hover:scale-[1.01]">
                            <div className="flex flex-col h-full">
                                <div className="w-full aspect-[4/5] bg-black/20">
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const el = e.currentTarget as HTMLImageElement;
                                            // Fallback to a deterministic picsum image like course covers
                                            const seed = encodeURIComponent(member.name.replace(/\s+/g, '-').toLowerCase());
                                            el.src = `https://picsum.photos/seed/${seed}/600/750`;
                                        }}
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                                    <p className="text-nebula-500 font-semibold mb-3 leading-snug">{member.role}</p>
                                    <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </section>

            <section className="text-center">
                 <GlassCard className="p-10">
                    <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
                    <p className="max-w-3xl mx-auto text-lg text-gray-300 mb-8">
                        Whether you're starting your journey or looking to advance your skills, you have a place at AfricAI. Explore our courses, connect with tutors, and become part of a vibrant community dedicated to lifelong learning and innovation.
                    </p>
                    <a href="/courses" className="bg-gradient-to-r from-nebula-600 to-nebula-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform hover:scale-105 inline-block">
                        Explore Courses
                    </a>
                </GlassCard>
            </section>
        </div>
    );
};

export default AboutPage;
