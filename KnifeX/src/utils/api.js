const API_BASE_URL = import.meta.env.PROD 
  ? '/.netlify/functions'
  : 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    const response = await this.request('/auth', {
      method: 'POST',
      body: { action: 'register', ...userData },
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth', {
      method: 'POST',
      body: { action: 'login', ...credentials },
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  logout() {
    this.setToken(null);
  }

  // User methods
  async getProfile() {
    return this.request('/user');
  }

  // Inventory methods
  async getInventory() {
    return this.request('/inventory');
  }

  async addToInventory(knifeData) {
    return this.request('/inventory', {
      method: 'POST',
      body: knifeData,
    });
  }

  // Knife methods
  async getKnives(params = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/knives?${searchParams}`);
  }

  async createKnife(knifeData) {
    return this.request('/knives', {
      method: 'POST',
      body: knifeData,
    });
  }

  // Trade methods
  async getTrades() {
    return this.request('/trades');
  }

  // Utility methods
  isAuthenticated() {
    return !!this.token;
  }
}

export default new ApiClient();
