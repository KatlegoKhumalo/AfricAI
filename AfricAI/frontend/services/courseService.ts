import { Course } from '../types';

export interface CreateCourseInput {
	title: string;
	description: string;
	category: string;
	price: number;
	difficulty: string;
	imageUrl?: string;
	chapters?: Array<{ title: string; duration: number; videoUrl: string; content: string }>;
	tutorId: string;
}

export interface CreatedCourse extends Course {
	// align with existing Course shape; includes generated id
}

const STORAGE_KEY = 'africai-courses';

function readCourses(): Course[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as Course[]) : [];
	} catch {
		return [];
	}
}

function writeCourses(courses: Course[]) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
	} catch (e) {
		// If quota exceeded, drop images and retry
		try {
			const sanitized = courses.map((c: any) => ({ ...c, imageUrl: undefined }));
			localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
		} catch {
			// As a last resort, keep only the most recent 10 entries without images
			const trimmed = courses.slice(-10).map((c: any) => ({ ...c, imageUrl: undefined }));
			localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
		}
	}
}

export async function createCourse(input: CreateCourseInput): Promise<CreatedCourse> {
	const id = `course_${Date.now()}`;
	// Enforce price range [49, 99]
	const clampedPrice = Math.min(99, Math.max(49, input.price));
	const newCourse: any = {
		id,
		title: input.title,
		description: input.description,
		category: input.category,
		price: clampedPrice,
		difficulty: input.difficulty,
		imageUrl: input.imageUrl,
		chapters: input.chapters || [],
		tutor: { id: input.tutorId },
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	const courses = readCourses();
	courses.push(newCourse);
	writeCourses(courses);

	return newCourse as CreatedCourse;
}

export function listCoursesByTutor(tutorId: string): Course[] {
    return readCourses().filter((c: any) => c?.tutor?.id === tutorId);
}

export function getCourseById(courseId: string): Course | null {
    return readCourses().find((c: any) => c.id === courseId) || null;
}

export function updateCourse(courseId: string, updates: Partial<Course>): Course | null {
    const courses = readCourses();
    const idx = courses.findIndex((c: any) => c.id === courseId);
    if (idx === -1) return null;
    const updated: any = {
        ...courses[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    courses[idx] = updated;
    writeCourses(courses);
    return updated as Course;
}

export function deleteCourse(courseId: string): boolean {
    const courses = readCourses();
    const next = courses.filter((c: any) => c.id !== courseId);
    if (next.length === courses.length) return false;
    writeCourses(next);
    return true;
}


