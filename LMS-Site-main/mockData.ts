import type { Course, Tutor, User, Invoice, LiveSession, Transaction } from './types';

const mockChapters = [
  { id: 'c1-1', title: 'Introduction to Generative AI', duration: 15 },
  { id: 'c1-2', title: 'Setting up Your Dev Environment', duration: 30 },
  { id: 'c1-3', title: 'Building a Simple AI Chatbot', duration: 60 },
  { id: 'c1-4', title: 'Integrating AI with a Frontend', duration: 45 },
  { id: 'c1-5', title: 'Advanced Prompt Engineering', duration: 50 },
  { id: 'c1-6', title: 'Project Deployment', duration: 40 },
];

const categories = ['Development', 'Data Science', 'Creative', 'Design', 'Business', 'AI Ethics'];
const courseAdjectives = ['Ultimate', 'Complete', 'Advanced', 'Practical', 'Zero to Hero', 'Modern', 'Next-Gen'];
const courseNouns = ['Web Development', 'Machine Learning', 'Data Visualization', 'UI/UX Design', 'Digital Marketing', 'Python Programming', 'Generative Art', 'Cloud Computing', 'Cybersecurity', 'AI for Business'];

const firstNames = ["Aisha", "David", "Chinedu", "Fatima", "Kwame", "Amara", "Bello", "Evelyn", "Kenji", "Lila", "Mateo", "Nia", "Omar", "Priya", "Rayan", "Sofia", "Tariq", "Uma", "Victor", "Wanjiru", "Yara", "Zane"];
const lastNames = ["Bello", "Kim", "Okafor", "Hassan", "Nkrumah", "Adekunle", "Abubakar", "Reed", "Tanaka", "Sharma", "Garcia", "Jones", "Ali", "Patel", "Chen", "Rodriguez", "Khan", "Gupta", "Silva", "Mwangi", "Al-Jamil", "Maxwell"];
const tutorTitles = ['Principal AI Scientist', 'Creative Technologist', 'Senior Data Scientist', 'Lead UX Designer', 'Growth Marketing Expert', 'Staff Software Engineer', 'Cybersecurity Analyst', 'Cloud Solutions Architect'];

export const generateUniqueId = () => Math.random().toString(36).substr(2, 9);
const generate7DigitId = () => Math.floor(1000000 + Math.random() * 9000000).toString();

const generateNextBillingDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    date.setDate(Math.floor(Math.random() * 28) + 1);
    return date;
};

export const generateRandomPastDate = () => {
    const date = new Date();
    const randomDays = Math.floor(Math.random() * 365 * 2);
    date.setDate(date.getDate() - randomDays);
    return date;
}


const generatedTutors: Omit<Tutor, 'courses' | 'schedule'>[] = Array.from({ length: 22 }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[(i + 5) % lastNames.length];
    return {
        id: `t${i + 1}`,
        publicId: generate7DigitId(),
        name: `${firstName} ${lastName}`,
        avatarUrl: `https://i.pravatar.cc/150?u=${firstName}${lastName}`,
        title: tutorTitles[i % tutorTitles.length],
        bio: `${firstName} is a leading expert in their field, passionate about making complex topics accessible. With years of industry experience, ${firstName} brings real-world insights into the classroom.`,
        rating: +(4.5 + Math.random() * 0.5).toFixed(1),
        reviews: Math.floor(500 + Math.random() * 2000),
        subscription: {
            status: i % 4 === 0 ? 'inactive' : 'active', // Some tutors inactive for demo
            nextBillingDate: generateNextBillingDate(),
            fee: 2000,
        },
        verified: i < 5, // Verify the first 5 tutors
        joinDate: generateRandomPastDate(),
    };
});

let courseCounter = 1;
export const mockCourses: Course[] = [];

generatedTutors.forEach(tutor => {
    const coursesPerTutor = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < coursesPerTutor; i++) {
        const category = categories[courseCounter % categories.length];
        const title = `${courseAdjectives[courseCounter % courseAdjectives.length]} ${courseNouns[courseCounter % courseNouns.length]}`;
        const course = {
            id: `${courseCounter}`,
            title,
            description: `A comprehensive course on ${title}. Learn everything from the basics to advanced techniques and build real-world projects. This course is perfect for beginners and experienced professionals alike.`,
            category,
            imageUrl: `https://picsum.photos/seed/${title.replace(/\s/g, '')}/600/400`,
            chapters: mockChapters,
            price: 99 + Math.floor(Math.random() * 20) * 10,
            rating: +(4.5 + Math.random() * 0.5).toFixed(1),
            reviews: Math.floor(300 + Math.random() * 1500),
            tutor: { ...tutor, courses: [], schedule: [] } // avoid circular reference for now
        };
        mockCourses.push(course);
        courseCounter++;
    }
});

export const mockTutors: Tutor[] = generatedTutors.map(tutor => {
    const assignedCourses = mockCourses.filter(c => c.tutor?.id === tutor.id);
    const generateSchedule = (): LiveSession[] => [
            { id: generateUniqueId(), title: `Live Q&A: ${assignedCourses[0]?.title || 'General Topics'}`, startTime: new Date(Date.now() + 1000 * 60 * 60 * (24 * (tutor.id.length % 7))), endTime: new Date(Date.now() + 1000 * 60 * 60 * (24 * (tutor.id.length % 7) + 1)), timezone: 'America/New_York', capacity: 30, bookedStudents: Array.from({ length: Math.floor(Math.random() * 30) }, () => `student_${Math.random()}`) },
            { id: generateUniqueId(), title: 'Office Hours', startTime: new Date(Date.now() + 1000 * 60 * 60 * (24 * ((tutor.id.length + 3) % 7))), endTime: new Date(Date.now() + 1000 * 60 * 60 * (24 * ((tutor.id.length + 3) % 7) + 1)), timezone: 'Europe/London', capacity: 30, bookedStudents: Array.from({ length: Math.floor(Math.random() * 30) }, () => `student_${Math.random()}`) }
        ];

    return {
        ...tutor,
        courses: assignedCourses,
        schedule: generateSchedule(),
    }
});

mockCourses.forEach(course => {
    const tutor = mockTutors.find(t => t.id === course.tutor?.id);
    if(tutor) course.tutor = tutor;
});

export const mockLearnerUser: User = {
    id: 'user123',
    publicId: generate7DigitId(),
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=alex',
    role: 'learner',
    bio: 'A lifelong learner passionate about AI and technology.',
    verified: true,
    joinDate: generateRandomPastDate(),
    paymentMethod: {
        cardNumber: '4242424242424242',
        expiryDate: '12/26',
        cvv: '123',
        nameOnCard: 'Alex Doe',
        billingAddress: '123 AI Lane, Tech City',
        zipCode: '90210',
    }
};

export const mockInvoices: Invoice[] = [
    { id: 'inv_1', date: new Date(new Date().setMonth(new Date().getMonth() - 1)), amount: 2000, status: 'paid', description: 'Monthly Subscription' },
    { id: 'inv_2', date: new Date(new Date().setMonth(new Date().getMonth() - 2)), amount: 2000, status: 'paid', description: 'Monthly Subscription' },
    { id: 'inv_3', date: new Date(new Date().setMonth(new Date().getMonth() - 3)), amount: 2000, status: 'paid', description: 'Monthly Subscription' },
];

export const mockTestimonials = [
  {
    name: 'Chinedu Okafor',
    avatarUrl: 'https://i.pravatar.cc/150?u=chinedu',
    role: 'AI Developer, Lagos',
    text: 'AfricAI transformed my understanding of machine learning. The hands-on projects were invaluable for my career, helping me land a top job in the industry.',
  },
  {
    name: 'Fatima Hassan',
    avatarUrl: 'https://i.pravatar.cc/150?u=fatima',
    role: 'Data Scientist, Cairo',
    text: 'The quality of the instructors is unmatched. They are true experts who know how to make complex topics easy to understand. The AI Tutor was a game-changer for me.',
  },
  {
    name: 'Kwame Nkrumah',
    avatarUrl: 'https://i.pravatar.cc/150?u=kwame',
    role: 'Student, Accra',
    text: 'As a university student, AfricAI gave me the practical skills I wasn\'t getting in my lectures. It\'s the perfect supplement for anyone serious about a career in tech.',
  },
];

// FIX: Explicitly add return type `Transaction` to the callback to fix type inference issue.
export const mockTransactions: Transaction[] = Array.from({length: 50}, (_, i): Transaction => {
    const isSubscription = i % 5 === 0;
    const user = isSubscription ? mockTutors[i % mockTutors.length] : { id: `learner${i}`, name: `Learner ${i}`};
    const course = mockCourses[i % mockCourses.length];

    return {
        id: `txn_${generateUniqueId()}`,
        user: { id: user.id, name: user.name },
        type: isSubscription ? 'Tutor Subscription' : 'Course Sale',
        amount: isSubscription ? 2000 : course.price,
        date: generateRandomPastDate(),
        description: isSubscription ? 'Monthly Tutor Fee' : `Enrollment: ${course.title}`
    };
}).sort((a,b) => b.date.getTime() - a.date.getTime());