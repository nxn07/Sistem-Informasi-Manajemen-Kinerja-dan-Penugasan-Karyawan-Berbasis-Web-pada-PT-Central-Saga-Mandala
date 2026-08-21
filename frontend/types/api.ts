export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface User {
  id: number;
  name: string;
  full_name?: string;
  email: string;
  role?: string;
  roles: string[];
  permissions: string[];
  employee_id?: number;
  created_at: string;
}

export interface Division {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  created_at?: string;
}

export interface Employee {
  id: number;
  user_id: number;
  division_id: number;
  nip: string;
  name: string;
  full_name?: string;
  position: string;
  phone?: string | null;
  address?: string | null;
  user?: User;
  division?: Division;
}

export interface KpiCriteria {
  id: number;
  criteria_name?: string;
  name?: string;
  weight_percentage?: number;
  weight?: number;
  target?: number;
  unit?: string;
  description?: string | null;
}

export interface TaskSubmission {
  id: number;
  task_id: number;
  employee_id: number;
  file_path?: string | null;
  submission_file?: string | null;
  submission_link?: string | null;
  notes?: string | null;
  status: string;
  submitted_at: string;
  reviewed_by_manager_id?: number | null;
  review_notes?: string | null;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  weight?: number;
  weight_score?: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'REVISION';
  start_date?: string | null;
  deadline?: string | null;
  due_date?: string | null;
  created_by_manager_id: number;
  created_by?: number;
  created_by_user_id?: number;
  creator_name?: string;
  assigned_employee_id: number;
  division_id?: number | null;
  manager?: User;
  employee?: Employee;
  division?: Division;
  submissions?: TaskSubmission[];
  submission_file?: string | null;
  submission_link?: string | null;
  submission_notes?: string | null;
  submitted_at?: string | null;
  updated_at?: string | null;
  doc_type?: string | null;
}

export interface PerformanceEvaluation {
  id: number;
  task_id: number;
  employee_id: number;
  kpi_criteria_id: number;
  score: number;
  feedback_notes?: string | null;
  task?: Task;
  employee?: Employee;
  kpi_criteria?: KpiCriteria;
  created_at: string;
}

export interface ActivityLog {
  id: number;
  log_name: string;
  description: string;
  subject_type: string;
  subject_id: number;
  causer_id?: number | null;
  causer?: User | null;
  properties?: any;
  created_at: string;
}
