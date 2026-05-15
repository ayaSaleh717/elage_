// API Configuration
const API_BASE_URL = 'https://wolflike-merri-nugatory.ngrok-free.dev';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: "patient" | "doctor";
  specialization?: string;
  degree_file?: File;
  latitude?: number;
  longitude?: number;
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

      // Add optional fields for doctors
      if (userData.role === 'doctor') {
        if (userData.specialization) {
          formData.append('specialization', userData.specialization);
        }
        if (userData.degree_file) {
          formData.append('degree_file', userData.degree_file);
        }
      }

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
      const response = await this.request('/api/reset-password', {
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
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
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
}

export const apiService = new ApiService();