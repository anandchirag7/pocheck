
export interface UserProfile {
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  department: string;
  last_login: string;
  location: string;
}

export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    // Note: In this environment, we assume the backend is reachable at relative path or localhost:8000
    const response = await fetch('http://localhost:8000/api/user-profile');
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  } catch (error) {
    console.warn("Backend not reachable, using fallback local profile.");
    return {
      user_id: "OFFLINE_USER",
      full_name: "Local User",
      email: "local@example.com",
      role: "Procurement Analyst",
      department: "Finance",
      last_login: new Date().toLocaleString(),
      location: "Remote"
    };
  }
};
