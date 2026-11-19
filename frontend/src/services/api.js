/**
 * MediConnect Centralized API Client
 * Built with native Fetch API and token handling
 */

// Use relative path by default to leverage Vite proxy, or custom VITE_API_URL if configured
const API_BASE_URL = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== '')
  ? import.meta.env.VITE_API_URL
  : '';

let authToken = localStorage.getItem('mediconnect_token') || null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('mediconnect_token', token);
  } else {
    localStorage.removeItem('mediconnect_token');
  }
};

export const getAuthToken = () => authToken;

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', // sends HTTP-only cookie automatically
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// ============================================================================
// Auth Services
// ============================================================================
export const authService = {
  login: async (credentials) => {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  register: async (userData) => {
    const data = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  logout: async () => {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      setAuthToken(null);
    }
  },

  getMe: async () => {
    return request('/api/auth/me', { method: 'GET' });
  },

  updateProfile: async (profileData) => {
    return request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// ============================================================================
// Doctor Services
// ============================================================================
export const doctorService = {
  getDoctors: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/api/doctors${query ? `?${query}` : ''}`;
    return request(endpoint, { method: 'GET' });
  },

  getDoctorById: async (id) => {
    return request(`/api/doctors/${id}`, { method: 'GET' });
  },

  updateDoctor: async (id, doctorData) => {
    return request(`/api/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doctorData),
    });
  },

  createDoctor: async (doctorData) => {
    return request('/api/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  },

  deleteDoctor: async (id) => {
    return request(`/api/doctors/${id}`, { method: 'DELETE' });
  },
};

// ============================================================================
// Appointment Services
// ============================================================================
export const appointmentService = {
  bookAppointment: async (appointmentData) => {
    return request('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  getMyAppointments: async () => {
    return request('/api/appointments/my', { method: 'GET' });
  },

  getDoctorAppointments: async () => {
    return request('/api/appointments/doctor', { method: 'GET' });
  },

  getAllAppointments: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/api/appointments${query ? `?${query}` : ''}`;
    return request(endpoint, { method: 'GET' });
  },

  updateStatus: async (id, status) => {
    return request(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  cancelAppointment: async (id) => {
    return request(`/api/appointments/${id}/cancel`, {
      method: 'PATCH',
    });
  },
};

// ============================================================================
// Medical Record Services
// ============================================================================
export const medicalRecordService = {
  createRecord: async (recordData) => {
    return request('/api/medical-records', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  },

  getMyRecords: async () => {
    return request('/api/medical-records/my', { method: 'GET' });
  },

  getRecordByAppointment: async (appointmentId) => {
    return request(`/api/medical-records/appointment/${appointmentId}`, { method: 'GET' });
  },
};

// ============================================================================
// Notification Services
// ============================================================================
export const notificationService = {
  getMyNotifications: async () => {
    return request('/api/notifications', { method: 'GET' });
  },

  markAsRead: async (id) => {
    return request(`/api/notifications/${id}/read`, { method: 'PATCH' });
  },

  markAllAsRead: async () => {
    return request('/api/notifications/read-all', { method: 'PATCH' });
  },
};

// ============================================================================
// Admin Services
// ============================================================================
export const adminService = {
  getStats: async () => {
    return request('/api/admin/stats', { method: 'GET' });
  },

  getUsers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/api/admin/users${query ? `?${query}` : ''}`;
    return request(endpoint, { method: 'GET' });
  },

  updateUserStatus: async (userId, isActive) => {
    return request(`/api/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  },
};

// ============================================================================
// Health Check Services
// ============================================================================
export async function checkApiHealth() {
  try {
    const data = await request('/api/health', { method: 'GET' });
    return { isConnected: data.success === true, message: data.message };
  } catch (error) {
    return { isConnected: false, message: error.message };
  }
}

export async function checkDatabaseHealth() {
  try {
    const data = await request('/api/health/db', { method: 'GET' });
    return { isConnected: data.database === 'connected', status: data.database };
  } catch {
    return { isConnected: false, status: 'disconnected' };
  }
}

export default {
  auth: authService,
  doctors: doctorService,
  appointments: appointmentService,
  medicalRecords: medicalRecordService,
  notifications: notificationService,
  admin: adminService,
  checkApiHealth,
  checkDatabaseHealth,
};
