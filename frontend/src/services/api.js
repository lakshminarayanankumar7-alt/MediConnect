/**
 * MediConnect Frontend API Service
 * Centralized API client using native fetch
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Check backend health status
 * @returns {Promise<{ isConnected: boolean, message: string }>}
 */
export async function checkApiHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { isConnected: false, message: `Server error: ${response.status}` };
    }

    const data = await response.json();
    return {
      isConnected: data.success === true,
      message: data.message || 'API is online',
    };
  } catch (error) {
    return {
      isConnected: false,
      message: error.name === 'AbortError' ? 'Connection timed out' : 'Backend is unreachable',
    };
  }
}

/**
 * Check MongoDB database health status
 * @returns {Promise<{ isConnected: boolean, status: string }>}
 */
export async function checkDatabaseHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/api/health/db`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { isConnected: false, status: 'disconnected' };
    }

    const data = await response.json();
    return {
      isConnected: data.database === 'connected',
      status: data.database || 'unknown',
    };
  } catch {
    return { isConnected: false, status: 'disconnected' };
  }
}

export default {
  checkApiHealth,
  checkDatabaseHealth,
};
