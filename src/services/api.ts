// API Configuration
const API_BASE_URL = 'https://wolflike-merri-nugatory.ngrok-free.dev';

// Types
export interface LoginRequest {
  email: string;
  password: string;
  latitude?: string;
  longitude?: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: "patient" | "doctor";
  specialization?: string;
  degree_file?: File;
  latitude?: string;
  longitude?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  errors?: Record<string, string[]>;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface BookAppointmentRequest {
  doctor_id: number;
  date: string;
  start_time: string;
  end_time: string;
}

export interface UpdatePatientProfileRequest {
  age: number;
  height: number;
  weight: number;
  phone: string;
}

export interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  specialty: string;
  specialization: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  available: boolean;
  lat: number;
  lng: number;
  profile_image: string | null;
}

export interface DoctorScheduleDay {
  date: string;
  day_of_week: number;
  day_name: string;
  is_open: number;
  slots: Array<{
    id: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
  }>;
}

// API Service
class ApiService {
  private async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${API_BASE_URL}${endpoint}`;

    // إنشاء الهيدرز الافتراضية
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    };

    // إضافة التوكن إذا وجد
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers, // دمج الهيدرز القادمة من الـ options إن وجدت
      },
    };

    return fetch(url, config);
  }

  // Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('Login request:', {
        email: credentials.email,
        latitude: credentials.latitude,
        longitude: credentials.longitude
      });

      const response = await this.request('/api/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
        return { success: true, message: data.message || 'تم تسجيل الدخول بنجاح', ...data };
      }
      console.log(data)

      return { success: false, message: data.message || 'فشل تسجيل الدخول', ...data };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }

  }

  // Register
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const formData = new FormData();

      // Add all text fields
      formData.append('first_name', userData.first_name);
      formData.append('last_name', userData.last_name);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('role', userData.role);

      // Add location data if available
      if (userData.latitude) {
        formData.append('latitude', userData.latitude);
      }
      if (userData.longitude) {
        formData.append('longitude', userData.longitude);
      }

      // Add optional fields for doctors
      if (userData.role === 'doctor') {
        if (userData.specialization) {
          formData.append('specialization', userData.specialization);
        }
        if (userData.degree_file) {
          formData.append('degree_file', userData.degree_file);
        }
      }

      console.log('Register request data:', {
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        role: userData.role,
        specialization: userData.specialization,
        latitude: userData.latitude,
        longitude: userData.longitude,
        has_file: !!userData.degree_file
      });

      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header for FormData - browser will set it with boundary
      });

      let data: any = {};
      
      // Handle 204 No Content or empty responses
      const contentType = response.headers.get('content-type');
      if (response.status !== 204 && contentType?.includes('application/json')) {
        data = await response.json();
      }

      console.log('Register API Response:', data);
      console.log('Register API Errors:', data.errors);

      if (response.ok) {
        // Store token and user data
        console.log("response.ok");
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
        return { success: true, message: data.message || 'تم إنشاء الحساب بنجاح', ...data };
      }
      
      console.log(data)
      return { success: false, message: data.message || 'فشل إنشاء الحساب', ...data };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // Forgot Password - إرسال رابط إعادة التعيين
  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await this.request('/api/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      let result: any = {};
      const contentType = response.headers.get('content-type');
      if (response.status !== 204 && contentType?.includes('application/json')) {
        result = await response.json();
      }

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ');
        error.status = response.status;
        error.errors = result.errors;
        throw error;
      }

      return { success: true, message: result.message || 'تم إرسال رابط إعادة التعيين', ...result };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Reset Password - تغيير كلمة المرور
  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
    try {
      const url = `/api/reset-password?token=${encodeURIComponent(data.token)}&email=${encodeURIComponent(data.email)}`;
      const response = await this.request(url, {
        method: 'POST',
        body: JSON.stringify({
          password: data.password,
          password_confirmation: data.password_confirmation,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ');
        error.status = response.status;
        error.errors = result.errors;
        throw error;
      }

      // Auto-login if token returned
      if (result.token) {
        localStorage.setItem('authToken', result.token);
      }
      if (result.user) {
        localStorage.setItem('userData', JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<AuthResponse> {
    try {
      const response = await this.request('/api/logout', {
        method: 'GET',
      });

      const data = await response.json();

      // Clear local storage regardless of response
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');

      if (response.ok) {
        return { success: true, message: data.message || 'تم تسجيل الخروج بنجاح' };
      }

      return { success: false, message: data.message || 'فشل تسجيل الخروج' };
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage even on error
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      return { success: true, message: 'تم تسجيل الخروج' };
    }
  }

  // Get current user
  getCurrentUser(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Book Appointment
  async bookAppointment(data: BookAppointmentRequest): Promise<AuthResponse> {
    try {
      const response = await this.request('/api/patient/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ');
        error.status = response.status;
        error.errors = result.errors;
        throw error;
      }

      return { success: true, message: result.message || 'تم حجز الموعد بنجاح', ...result };
    } catch (error) {
      console.error('Book appointment error:', error);
      throw error;
    }
  }

  // Get Doctors
  async getDoctors(): Promise<{ success: boolean; data: Doctor[]; message?: string }> {
    try {
      const response = await this.request('/api/patient/doctors', {
        method: 'GET',
      });

      const result = await response.json();
      console.log('Doctors API Response:', result);
      console.log('Raw doctor data:', result.doctors);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ');
        error.status = response.status;

        // Handle 401 Unauthorized - clear token and redirect
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          window.location.href = '/login';
        }

        throw error;
      }

      // API returns { doctors: [...], status: "success" }
      // Transform API response to match Doctor interface
      const transformedDoctors = (result.doctors || []).map((doc: any) => {
        console.log(`Doctor ${doc.id} raw data:`, {
          price: doc.price,
          lat: doc.lat,
          lng: doc.lng,
          latitude: doc.latitude,
          longitude: doc.longitude,
          allFields: Object.keys(doc)
        });

        return {
          id: doc.id,
          first_name: doc.first_name,
          last_name: doc.last_name,
          name: `${doc.first_name} ${doc.last_name}`,
          specialty: doc.specialization,
          specialization: doc.specialization,
          location: doc.location || 'غير محدد',
          price: doc.price || 0,
          rating: doc.rating || 0,
          reviews: doc.reviews || 0,
          available: doc.available !== false,
          lat: doc.lat || doc.latitude ? Number(doc.latitude) : 36.8065,
          lng: doc.lng || doc.longitude ? Number(doc.longitude) : 5.7600,
          profile_image: doc.profile_image
        };
      });

      return { success: true, data: transformedDoctors, message: result.message };
    } catch (error) {
      console.error('Get doctors error:', error);
      throw error;
    }
  }

  // Get Doctor Booking Info
  async getDoctorBookingInfo(doctorId: number): Promise<{ success: boolean; data: DoctorScheduleDay[]; message?: string }> {
    try {
      console.log(`Fetching booking info for doctor ${doctorId}...`);
      const response = await this.request(`/api/patient/${doctorId}/booking-info`, {
        method: 'GET',
      });

      const result = await response.json();
      console.log('Doctor Booking Info API Response:', result);
      console.log('Response structure:', {
        status: response.status,
        ok: response.ok,
        dataType: typeof result,
        isArray: Array.isArray(result),
        keys: Object.keys(result),
        dataKeys: result.data ? Object.keys(result.data) : 'no data property'
      });

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ');
        error.status = response.status;
        throw error;
      }

      return { success: true, data: result.days || [], message: result.message };
    } catch (error) {
      console.error('Get doctor booking info error:', error);
      throw error;
    }
  }

  // Get Doctor Schedule
  async getDoctorSchedule(doctorId: number): Promise<{ success: boolean; data: DoctorScheduleDay[]; message?: string }> {
    try {
      const response = await this.request(`/api/patient/doctors/${doctorId}/schedule`, {
        method: 'GET',
      });

      const result = await response.json();
      console.log('Doctor Schedule API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ');
        error.status = response.status;
        throw error;
      }

      return { success: true, data: result.data || result, message: result.message };
    } catch (error) {
      console.error('Get doctor schedule error:', error);
      throw error;
    }
  }

  // Update Patient Profile
  async updatePatientProfile(data: UpdatePatientProfileRequest): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const response = await this.request('/api/patient/profile', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('Update Patient Profile API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء تحديث الملف الشخصي');
        error.status = response.status;
        error.errors = result.errors;
        throw error;
      }

      return { success: true, message: result.message || 'تم تحديث الملف الشخصي بنجاح', data: result.data };
    } catch (error) {
      console.error('Update patient profile error:', error);
      throw error;
    }
  }

  // Get Patient Profile
  async getPatientProfile(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await this.request('/api/patient/profile', {
        method: 'GET',
      });

      const result = await response.json();
      console.log('Get Patient Profile API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء جلب الملف الشخصي');
        error.status = response.status;
        throw error;
      }

      return { success: true, data: result.data || result, message: result.message };
    } catch (error) {
      console.error('Get patient profile error:', error);
      throw error;
    }
  }

  // Get Patient Dashboard
  async getPatientDashboard(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await this.request('/api/patient/dashboard', {
        method: 'GET',
      });

      const result = await response.json();
      console.log('Get Patient Dashboard API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء جلب بيانات لوحة التحكم');
        error.status = response.status;
        throw error;
      }

      return { success: true, data: result.data || result, message: result.message };
    } catch (error) {
      console.error('Get patient dashboard error:', error);
      throw error;
    }
  }

  // Get Patient Consultations
  async getPatientConsultations(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await this.request('/api/patient/consultations', {
        method: 'GET',
      });

      const result = await response.json();
      console.log('Get Patient Consultations API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء جلب الاستشارات');
        error.status = response.status;
        throw error;
      }

      return { success: true, data: result.data || result, message: result.message };
    } catch (error) {
      console.error('Get patient consultations error:', error);
      throw error;
    }
  }

  // Get Doctor Profile
  async getDoctorProfile(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await this.request('/api/doctor/profile', {
        method: 'GET',
      });

      const result = await response.json();
      console.log('Get Doctor Profile API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء جلب الملف الشخصي');
        error.status = response.status;
        throw error;
      }

      return { success: true, data: result.data || result, message: result.message };
    } catch (error) {
      console.error('Get doctor profile error:', error);
      throw error;
    }
  }

  // Update Doctor Profile
  async updateDoctorProfile(data: any): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const response = await this.request('/api/doctor/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('Update Doctor Profile API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء تحديث الملف الشخصي');
        error.status = response.status;
        error.errors = result.errors;
        throw error;
      }

      return { success: true, message: result.message || 'تم تحديث الملف الشخصي بنجاح', data: result.data };
    } catch (error) {
      console.error('Update doctor profile error:', error);
      throw error;
    }
  }

  // Add Time Slot
  async addTimeSlot(data: { day_of_week: number; start_time: string; end_time: string }): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const response = await this.request('/api/doctor/time-slots', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('Add Time Slot API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء إضافة فترة العمل');
        error.status = response.status;
        error.errors = result.errors;
        throw error;
      }

      return { success: true, message: result.message || 'تم إضافة فترة العمل بنجاح', data: result.data };
    } catch (error) {
      console.error('Add time slot error:', error);
      throw error;
    }
  }

  // Get Doctor Time Slots
  async getDoctorTimeSlots(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await this.request('/api/doctor/time-slots', {
        method: 'GET',
      });

      const result = await response.json();
      console.log('Get Doctor Time Slots API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء جلب فترات العمل');
        error.status = response.status;
        throw error;
      }

      return { success: true, data: result.data || result, message: result.message };
    } catch (error) {
      console.error('Get doctor time slots error:', error);
      throw error;
    }
  }

  // Delete Time Slot
  async deleteTimeSlot(slotId: number): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.request(`/api/doctor/time-slots/${slotId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      console.log('Delete Time Slot API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء حذف فترة العمل');
        error.status = response.status;
        throw error;
      }

      return { success: true, message: result.message || 'تم حذف فترة العمل بنجاح' };
    } catch (error) {
      console.error('Delete time slot error:', error);
      throw error;
    }
  }

  // Get Specializations
  async getSpecializations(): Promise<{ success: boolean; data?: string[]; message?: string }> {
    try {
      const response = await this.request('/api/specializations', {
        method: 'GET',
      });

      const result = await response.json();
      console.log('Get Specializations API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء جلب التخصصات');
        error.status = response.status;
        throw error;
      }

      return { success: true, data: result.specializations || [], message: result.message };
    } catch (error) {
      console.error('Get specializations error:', error);
      throw error;
    }
  }

  // Get My Schedule (for doctor to view their own schedule)
  async getMySchedule(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      console.log('Fetching schedule from /api/doctor/schedule');
      const response = await this.request('/api/doctor/schedule', {
        method: 'GET',
      });

      const result = await response.json();
      console.log('Get My Schedule API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء جلب الجدول');
        error.status = response.status;
        throw error;
      }

      return { success: true, data: result.schedule || result, message: result.message };
    } catch (error) {
      console.error('Get my schedule error:', error);
      throw error;
    }
  }

  // Get Working Days
  async getWorkingDays(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await this.request('/api/doctor/working-days', {
        method: 'GET',
      });

      const result = await response.json();
      console.log('Get Working Days API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء جلب أيام العمل');
        error.status = response.status;
        throw error;
      }

      return { success: true, data: result.days || result, message: result.message };
    } catch (error) {
      console.error('Get working days error:', error);
      throw error;
    }
  }

  // Update Working Day
  async updateWorkingDay(dayId: number, isOpen: number): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.request(`/api/doctor/working-days/${dayId}`, {
        method: 'PUT',
        body: JSON.stringify({ is_open: isOpen }),
      });

      const result = await response.json();
      console.log('Update Working Day API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء تحديث يوم العمل');
        error.status = response.status;
        throw error;
      }

      return { success: true, message: result.message || 'تم تحديث يوم العمل بنجاح' };
    } catch (error) {
      console.error('Update working day error:', error);
      throw error;
    }
  }

  // Get Doctor Consultations
  async getDoctorConsultations(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await this.request('/api/doctor/consultations', {
        method: 'GET',
      });

      const result = await response.json();
      console.log('Get Doctor Consultations API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء جلب الاستشارات');
        error.status = response.status;
        throw error;
      }

      return { success: true, data: result.consultations || result, message: result.message };
    } catch (error) {
      console.error('Get doctor consultations error:', error);
      throw error;
    }
  }

  // Update Doctor Schedule
  async updateSchedule(data: { days: Array<{ id: number; is_open: boolean }>; slots: Array<any> }): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      console.log('Update Schedule Request Data:', data);
      console.log('Update Schedule Request URL:', `${this.getBaseUrl()}/api/doctor/schedule`);

      const response = await this.request('/api/doctor/schedule', {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      console.log('Update Schedule Response Status:', response.status);
      console.log('Update Schedule Response OK:', response.ok);

      const result = await response.json();
      console.log('Update Schedule API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء تحديث الجدول');
        error.status = response.status;
        error.errors = result.errors;
        throw error;
      }

      return { success: true, message: result.message || 'تم تحديث الجدول بنجاح', data: result.data };
    } catch (error) {
      console.error('Update schedule error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  // Get Doctor Patients
  async getDoctorPatients(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      console.log('Fetching patients from /api/doctor/patients');
      const response = await this.request('/api/doctor/patients', {
        method: 'GET',
      });

      const result = await response.json();
      console.log('Get Doctor Patients API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء جلب المرضى');
        error.status = response.status;
        throw error;
      }

      return { success: true, data: result.patients || result, message: result.message };
    } catch (error) {
      console.error('Get doctor patients error:', error);
      throw error;
    }
  }

  // Get Patient Details
  async getPatientDetails(patientId: number): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      console.log(`Fetching patient details for patient ${patientId}`);
      const response = await this.request(`/api/doctor/patients/${patientId}`, {
        method: 'GET',
      });

      const result = await response.json();
      console.log('Get Patient Details API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء جلب تفاصيل المريض');
        error.status = response.status;
        throw error;
      }

      return { success: true, data: result.patient || result, message: result.message };
    } catch (error) {
      console.error('Get patient details error:', error);
      throw error;
    }
  }

  // Complete Consultation
  async completeConsultation(consultationId: number, data: { symptoms: string; diagnosis: string; prescription: string; notes: string }): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      console.log(`Completing consultation ${consultationId} with data:`, data);
      const response = await this.request(`/api/doctor/consultations/${consultationId}/complete`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('Complete Consultation API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء إكمال الاستشارة');
        error.status = response.status;
        error.errors = result.errors;
        throw error;
      }

      return { success: true, message: result.message || 'تم إكمال الاستشارة بنجاح', data: result.data };
    } catch (error) {
      console.error('Complete consultation error:', error);
      throw error;
    }
  }

  // Get Doctor Dashboard Stats
  async getDoctorDashboard(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      console.log('Fetching doctor dashboard stats from /api/doctor/dashboard');
      const response = await this.request('/api/doctor/dashboard', {
        method: 'GET',
      });

      const result = await response.json();
      console.log('Get Doctor Dashboard API Response:', result);

      if (!response.ok) {
        const error: any = new Error(result.message || 'حدث خطأ أثناء جلب إحصائيات لوحة التحكم');
        error.status = response.status;
        throw error;
      }

      return { success: true, data: result.data || result, message: result.message };
    } catch (error) {
      console.error('Get doctor dashboard error:', error);
      throw error;
    }
  }

  private getBaseUrl(): string {
    return 'https://wolflike-merri-nugatory.ngrok-free.dev';
  }
}

export const apiService = new ApiService();