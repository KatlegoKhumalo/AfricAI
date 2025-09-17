import type { Course, Tutor, User, Invoice, LiveSession, Transaction, Chapter, Test, QuizQuestion, QuizQuestionType } from './types';

interface ChapterBlueprint {
  title: string;
  duration: number;
  videoUrl: string;
  content: string;
}

// ... existing chapterBlueprints data ...

const chapterBlueprints: Record<string, ChapterBlueprint[]> = {
  Development: [
    { title: "Foundations: HTML, CSS, & JavaScript", duration: 25, videoUrl: "https://www.youtube.com/watch?v=G3e-cpL7ofc", content: "Start from scratch and build a solid foundation in the <strong>three core technologies</strong> of the web. <ul><li>Understand how HTML structures content</li><li>CSS styles it</li><li>and JavaScript adds interactivity.</li></ul>" },
    { title: "Introduction to React & JSX", duration: 35, videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk", content: "Dive into the most popular frontend library. Learn about <u>component-based architecture</u>, JSX syntax, and how to manage state with React hooks like <i>useState</i> and <i>useEffect</i>." },
    { title: "Building a Backend with Node.js & Express", duration: 50, videoUrl: "https://www.youtube.com/watch?v=SccSCuHhOw0", content: "Go beyond the frontend and build a powerful backend server. Learn to create RESTful APIs, handle requests and responses, and manage routes using the Express framework." },
    { title: "Working with APIs and Data Fetching", duration: 30, videoUrl: "https://www.youtube.com/watch?v=cuEtnrL9-H0", content: "Learn how to make your application dynamic by fetching and sending data to your backend API. Master the Fetch API and asynchronous JavaScript (async/await) to handle data seamlessly." },
    { title: "Database Essentials with MongoDB", duration: 40, videoUrl: "https://www.youtube.com/watch?v=c2M-rlkkT5o", content: "Understand how to persist data for your application. This chapter covers the basics of NoSQL databases, focusing on MongoDB for storing, querying, and managing your application's data." },
    { title: "Deployment and DevOps Fundamentals", duration: 45, videoUrl: "https://www.youtube.com/watch?v=3c-iBn73dDE", content: "Take your project live! Learn the fundamentals of deployment using Docker for containerization and services like Vercel or Heroku to make your application accessible to the world." },
  ],
  'Data Science': [
    { title: "Python for Data Analysis with Pandas", duration: 30, videoUrl: "https://www.youtube.com/watch?v=LHBE6Q9XlzI", content: "Get up to speed with the essential Python libraries for data science. This chapter focuses on: <ol><li><strong>NumPy</strong> for numerical operations</li><li><strong>Pandas</strong> for data manipulation and analysis.</li></ol>" },
    { title: "Data Cleaning and Preprocessing", duration: 40, videoUrl: "https://www.youtube.com/watch?v=gtjxAH8uaP0", content: "Real-world data is messy. Learn the critical skills of handling missing values, correcting data types, and transforming data into a clean, usable format for analysis and modeling." },
    { title: "Exploratory Data Analysis (EDA)", duration: 35, videoUrl: "https://www.youtube.com/watch?v=3BzrN-s_32U", content: "Uncover insights from your data through visualization. This chapter introduces Matplotlib and Seaborn to create charts and graphs that reveal patterns, trends, and correlations." },
    { title: "Introduction to Machine Learning Concepts", duration: 25, videoUrl: "https://www.youtube.com/watch?v=ukzFI9rgM34", content: "Demystify machine learning. Understand the core concepts, including supervised vs. unsupervised learning, regression vs. classification, and the model training/testing workflow." },
    { title: "Building Your First Predictive Model", duration: 50, videoUrl: "https://www.youtube.com/watch?v=I_Pipv_1Gg8", content: "Apply your knowledge by building a real predictive model using Scikit-learn. You'll train the model, evaluate its performance, and learn how to make predictions on new data." },
  ],
  Design: [
    { title: "Core Principles of UI/UX Design", duration: 20, videoUrl: "https://www.youtube.com/watch?v=cKstfY3g_0I", content: "Learn the foundational principles that separate good design from bad. We'll cover hierarchy, contrast, repetition, alignment, and proximity to create intuitive user interfaces." },
    { title: "Getting Started with Figma", duration: 45, videoUrl: "https://www.youtube.com/watch?v=eZJOSK4gXl4", content: "Master the industry-standard tool for UI design. This chapter provides a hands-on introduction to Figma's interface, tools, and collaborative features." },
    { title: "User Research and Creating Personas", duration: 30, videoUrl: "https://www.youtube.com/watch?v=A4sv22D5_24", content: "Understand your users, understand the problem. Learn techniques for conducting user research and synthesizing your findings into actionable user personas that guide your design decisions." },
    { title: "Wireframing and Prototyping", duration: 40, videoUrl: "https://www.youtube.com/watch?v=WavAxT4WdJc", content: "Bring your ideas to life. Learn how to create low-fidelity wireframes to map out user flows and build high-fidelity interactive prototypes in Figma to test your designs." },
    { title: "Introduction to Design Systems", duration: 25, videoUrl: "https://www.youtube.com/watch?v=I2tFPC3_g8c", content: "Learn how to design for scale and consistency. This chapter introduces the concept of design systems, reusable components, and style guides to streamline your workflow." },
  ],
  Creative: [
    { title: "Introduction to Creative Coding with p5.js", duration: 30, videoUrl: "https://www.youtube.com/watch?v=yPWkPOfnGsw", content: "Unleash your creativity with code. This chapter introduces the p5.js library, a beginner-friendly way to create interactive visuals, animations, and generative art right in your browser." },
    { title: "Generative Art Algorithms", duration: 45, videoUrl: "https://www.youtube.com/watch?v=sZBfLqQ_T6Q", content: "Learn the logic behind beautiful generative patterns. We'll explore algorithms based on noise, randomness, and recursion to create complex and organic visual designs from simple rules." },
    { title: "Working with Audio and Video in the Browser", duration: 40, videoUrl: "https://www.youtube.com/watch?v=w3jL2aGAy-4", content: "Make your creative projects multi-sensory. Learn how to load, play, and manipulate sound and video, and even create audio visualizations that react to music in real-time." },
    { title: "Introduction to Midjourney and Prompt Crafting", duration: 35, videoUrl: "https://www.youtube.com/watch?v=hN5_v44iN8U", content: "Explore the world of AI image generation with Midjourney. Learn the art of crafting effective text prompts to guide the AI and create stunning, high-quality images from your imagination." },
  ],
  Business: [
    { title: "Digital Marketing Fundamentals", duration: 25, videoUrl: "https://www.youtube.com/watch?v=nU-IIXBWlS4", content: "Get a comprehensive overview of the digital marketing landscape. Understand key channels like SEO, SEM, social media, and email marketing, and how they work together to build a brand." },
    { title: "SEO for Beginners", duration: 40, videoUrl: "https://www.youtube.com/watch?v=OYRkIGaIt8A", content: "Learn how to get your website discovered on Google. This chapter covers the basics of Search Engine Optimization, including keyword research, on-page SEO, and link building." },
    { title: "Content Marketing Strategy", duration: 30, videoUrl: "https://www.youtube.com/watch?v=0R_3i-i_8e8", content: "Attract and retain customers by creating valuable content. Learn how to develop a content strategy, create engaging blog posts and videos, and measure your success." },
    { title: "Social Media Marketing", duration: 35, videoUrl: "https://www.youtube.com/watch?v=s5-qgCe_Iew", content: "Leverage the power of social media to grow your business. This chapter covers creating a strategy for platforms like Instagram, Twitter, and LinkedIn to engage with your audience." },
  ],
  'AI Ethics': [
    { title: "Introduction to AI Ethics", duration: 20, videoUrl: "https://www.youtube.com/watch?v=TeeH-d-K-gQ", content: "Explore the critical importance of ethics in the age of artificial intelligence. This chapter introduces key ethical challenges, including bias, fairness, transparency, and accountability in AI systems." },
    { title: "Understanding Algorithmic Bias", duration: 35, videoUrl: "https://www.youtube.com/watch?v=59bMh59JQDo", content: "AI is only as good as its data. Learn how biases in data can lead to unfair and discriminatory outcomes in AI models, and explore real-world examples from hiring to criminal justice." },
    { title: "Fairness, Accountability, and Transparency (FAT)", duration: 30, videoUrl: "https://www.youtube.com/watch?v=j2-a9g9g9aI", content: "Dive into the core pillars of responsible AI. Understand the concepts of Fairness, Accountability, and Transparency (FAT) and why they are essential for building trustworthy AI systems." },
    { title: "Privacy in the AI Era", duration: 25, videoUrl: "https://www.youtube.com/watch?v=J_Kx2 cio5qY", content: "Examine the impact of AI on personal privacy. This chapter discusses data collection practices, the risks of surveillance, and the importance of privacy-preserving techniques in AI development." },
  ]
};

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
            fee: 350,
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
        
        const blueprint = chapterBlueprints[category] || chapterBlueprints['Development'];
        const chapterCount = 4 + Math.floor(Math.random() * (blueprint.length - 3)); // 4 to max chapters
        const courseChapters: Chapter[] = blueprint.slice(0, chapterCount).map((chap, index) => ({
            ...chap,
            id: `c${courseCounter}-${index + 1}`,
        }));

        const course: Course = {
            id: `${courseCounter}`,
            title,
            description: `A comprehensive course on ${title}. Learn everything from the basics to advanced techniques and build real-world projects. This course is perfect for beginners and experienced professionals alike.`,
            category,
            imageUrl: `https://picsum.photos/seed/${courseCounter}/400/300`,
            chapters: courseChapters,
            price: 149 + (courseChapters.length * (Math.floor(Math.random() * 50) + 25)),
            rating: +(4.5 + Math.random() * 0.5).toFixed(1),
            reviews: Math.floor(300 + Math.random() * 1500),
            tutor: { ...tutor, courses: [], schedule: [] } // avoid circular reference for now
        };
        mockCourses.push(course);
        courseCounter++;
    }
});

const difficulties: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
mockCourses.forEach((course, index) => {
    course.difficulty = difficulties[index % difficulties.length];
});

// Make one course free for filtering demonstration
if (mockCourses.length > 2) {
    mockCourses[2].price = 0;
}


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
    { id: 'inv_1', date: new Date(new Date().setMonth(new Date().getMonth() - 1)), amount: 350, status: 'paid', description: 'Monthly Subscription' },
    { id: 'inv_2', date: new Date(new Date().setMonth(new Date().getMonth() - 2)), amount: 350, status: 'paid', description: 'Monthly Subscription' },
    { id: 'inv_3', date: new Date(new Date().setMonth(new Date().getMonth() - 3)), amount: 350, status: 'paid', description: 'Monthly Subscription' },
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

export const mockTransactions: Transaction[] = Array.from({length: 50}, (_, i): Transaction => {
    const isSubscription = i % 5 === 0;
    const user = isSubscription ? mockTutors[i % mockTutors.length] : { id: `learner${i}`, name: `Learner ${i}`};
    const course = mockCourses[i % mockCourses.length];

    return {
        id: `txn_${generateUniqueId()}`,
        user: { id: user.id, name: user.name },
        type: isSubscription ? 'Tutor Subscription' : 'Course Sale',
        amount: isSubscription ? 350 : course.price,
        date: generateRandomPastDate(),
        description: isSubscription ? 'Monthly Tutor Fee' : `Enrollment: ${course.title}`
    };
}).sort((a,b) => b.date.getTime() - a.date.getTime());

// --- MOCK TEST DATA ---

type QuestionBlueprint = Omit<QuizQuestion, 'id'>;

const mockQuestionBank: Record<string, QuestionBlueprint[]> = {
  Development: [
    { question: "What does HTML stand for?", type: 'mcq', options: ["HyperText Markup Language", "High-level Text Machine Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"], correctAnswer: "HyperText Markup Language" },
    { question: "React is a JavaScript framework.", type: 'true-false', options: ["True", "False"], correctAnswer: "False" },
    { question: "Which CSS property is used to change the text color of an element?", type: 'mcq', options: ["font-color", "text-color", "color", "background-color"], correctAnswer: "color" },
    { question: "Node.js can be used to build backend services.", type: 'true-false', options: ["True", "False"], correctAnswer: "True" },
    { question: "What is the correct syntax for a JavaScript comment?", type: 'mcq', options: ["<!-- comment -->", "/* comment */", "// comment", "Both // and /* */"], correctAnswer: "Both // and /* */" },
    { question: "`let` and `const` are the only ways to declare variables in JavaScript.", type: 'true-false', options: ["True", "False"], correctAnswer: "False" },
    { question: "What does API stand for?", type: 'mcq', options: ["Application Programming Interface", "Advanced Programming Interface", "Application Protocol Interface", "Algorithmic Programming Interface"], correctAnswer: "Application Programming Interface" },
    { question: "MongoDB is a relational database.", type: 'true-false', options: ["True", "False"], correctAnswer: "False" },
    { question: "Which hook is used to manage state in a React functional component?", type: 'mcq', options: ["useEffect", "useState", "useContext", "useReducer"], correctAnswer: "useState" },
    { question: "Git is a programming language.", type: 'true-false', options: ["True", "False"], correctAnswer: "False" },
  ],
  'Data Science': [
    { question: "Pandas is a popular Python library for data analysis.", type: 'true-false', options: ["True", "False"], correctAnswer: "True" },
    { question: "Which of the following is NOT a type of machine learning?", type: 'mcq', options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Sub-optimal Learning"], correctAnswer: "Sub-optimal Learning" },
    { question: "Data cleaning is an optional step in the data science workflow.", type: 'true-false', options: ["True", "False"], correctAnswer: "False" },
    { question: "What is the primary purpose of a regression model?", type: 'mcq', options: ["To classify data into categories", "To predict a continuous value", "To cluster similar data points", "To find hidden patterns"], correctAnswer: "To predict a continuous value" },
    { question: "A 'DataFrame' is a key data structure in which library?", type: 'mcq', options: ["NumPy", "Scikit-learn", "Pandas", "Matplotlib"], correctAnswer: "Pandas" },
    { question: "Overfitting occurs when a model performs well on training data but poorly on new, unseen data.", type: 'true-false', options: ["True", "False"], correctAnswer: "True" },
    { question: "Which chart is best for showing the relationship between two continuous variables?", type: 'mcq', options: ["Bar Chart", "Pie Chart", "Scatter Plot", "Histogram"], correctAnswer: "Scatter Plot" },
    { question: "SQL stands for Structured Query Language.", type: 'true-false', options: ["True", "False"], correctAnswer: "True" },
    { question: "What does EDA stand for?", type: 'mcq', options: ["Exploratory Data Analysis", "Estimated Data Arrangement", "Experimental Data Analytics", "External Data Aggregation"], correctAnswer: "Exploratory Data Analysis" },
    { question: "Python is the only language used for data science.", type: 'true-false', options: ["True", "False"], correctAnswer: "False" },
  ],
  // Add similar question banks for 'Design', 'Creative', 'Business', 'AI Ethics'
  // For brevity, we'll just use the Development and Data Science questions and sample from them for other categories
};

mockQuestionBank['Design'] = mockQuestionBank['Development'];
mockQuestionBank['Creative'] = mockQuestionBank['Data Science'];
mockQuestionBank['Business'] = mockQuestionBank['Development'];
mockQuestionBank['AI Ethics'] = mockQuestionBank['Data Science'];


export const generateMockTest = (courseId: string, category: string): Test => {
    const bank = mockQuestionBank[category] || mockQuestionBank['Development'];
    const questions: QuizQuestion[] = [];
    for (let i = 0; i < 50; i++) {
        const blueprint = bank[i % bank.length];
        questions.push({
            ...blueprint,
            id: `q-${courseId}-${i + 1}`,
        });
    }
    return { courseId, questions };
};

export const mockTests: Test[] = mockCourses.map(course => generateMockTest(course.id, course.category));
