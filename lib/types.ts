export type Subject = { id: string; name: string; slug: string; description: string | null };
export type Exam = Subject;
export type Note = {
  id: string; title: string; description: string | null; pdf_path: string; created_at: string;
  subject_id: string; exam_id: string | null;
  subject: { name: string; slug: string } | null;
  exam: { name: string; slug: string } | null;
};
export type Review = { id: string; note_id: string; user_id: string; author_name: string; rating: number; comment: string | null; created_at: string };
export type Video = { id: string; title: string; youtube_url: string; note_id: string | null };

export const NOTE_SELECT =
  "id,title,description,pdf_path,created_at,subject_id,exam_id,subject:subjects(name,slug),exam:exams(name,slug)";
