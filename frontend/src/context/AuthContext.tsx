import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  isUserLoggedIn: boolean;
  currentUser: any;
  users: any[];
  companyUsers: CompanyUsers | null;
  departments: any;
  signup: (user: FormData) => Promise<void>;
  addUser: (user: UserData) => Promise<void>;
  login: (user: any) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  getAllUsers: () => Promise<void>;
  getUsersByCompany: (page?: number, usersPerPage?: number) => void;
  updateUser: (updatedUser: UserData) => Promise<void>;
  addDepartment: (department: Department) => Promise<void>;
  getDepartments: () => Promise<void>;
  deleteDepartment: (id: number) => Promise<void>;
  updateDepartment: (id: number, updatedDepartment: any) => Promise<void>;
  getLineManagers: () => Promise<any[]>;
  getLineManagersByDepartment: (departmentId: string) => Promise<any[]>;
  updateProfilePicture: (profilePicture: string) => Promise<void>;
}

interface FormData {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  departmentId: string;
  lineManagerId: string;
  leaveBalance: number;
  password: string;
}

interface CompanyUsers {
  users: UserData[];
  totalRecords: number;
}

interface Department {
  name: string;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const nav = useNavigate();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [companyUsers, setCompanyUsers] = useState<CompanyUsers | null>(null);
  const [departments, setDepartments] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    if (token && userId) {
      setIsUserLoggedIn(true);
      // getCurrentUser();
    } else {
      setIsUserLoggedIn(false);
      // setCurrentUser(null);
    }
  }, []);

  /// Sign up
  const signup = (user: FormData): Promise<void> =>
    fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if (response.errors) {
          console.log(response.errors);
        } else if (response.message) {
          console.log(response.message);
          nav("/");
        } else {
          throw new Error("Network response was not OK");
        }
      })
      .catch((error) => {
        console.error("Error during signup:", error);
      });

  /// Add User
  const addUser = (user: UserData): Promise<void> =>
    fetch(`${import.meta.env.VITE_BASE_URL}/api/add-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify(user),
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        if (response.error) {
          console.log(response.error);
          throw new Error(response.error._message);
        } else {
          console.log(response.message);
          getAllUsers();
          return Promise.resolve();
        }
      })
      .catch((error) => {
        console.log("Error during addUser:", error);
        return Promise.reject(error);
      });

  /// Login
  const login = (user: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then((response) => {
          console.log(response);
          if (response.error) {
            console.log(response.errors);
            reject(new Error("Login failed"));
          } else if (response.token && response.userId) {
            console.log("Login successful");
            sessionStorage.setItem("token", response.token);
            sessionStorage.setItem("userId", response.userId);
            setIsUserLoggedIn(true);
            setCurrentUser(response.user);
            resolve();
          } else {
            reject(new Error("Login failed"));
          }
        })
        .catch((error) => {
          console.error("Error during login:", error);
          reject(error);
        });
    });
  };

  ///get current-user
  const getCurrentUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/current-user`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      const userData = await response.json();

      if (response.ok) {
        setCurrentUser(userData);
      } else {
        console.error("Error fetching current user:", userData.error);
      }
    } catch (error) {
      console.error("Error during getCurrentUser:", error);
    }
  };

  /// Get All Users
  const getAllUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      const usersData = await response.json();

      if (response.ok) {
        setUsers(usersData);
      } else {
        console.error("Error fetching all users:", usersData.error);
      }
    } catch (error) {
      console.error("Error during getAllUsers:", error);
    }
  };

  //Get Users By company
  const getUsersByCompany = async ( page = 0, usersPerPage = 10 ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/company/users?page=${page}&usersPerPage=${usersPerPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCompanyUsers({ users: data.users, totalRecords: data.totalRecords });

      } else {
        console.error("Error fetching Company users:", data.error);
      }
    } catch (error) {
      console.error("Error during getUsersByCompany:", error);
    }
  };

  //updateUser
  const updateUser = async (updatedUser: any): Promise<void> => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.log("Error", "Login to update User");
      return Promise.reject("Login required");
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/users`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUser),
        }
      );


      const usersData = await response.json();

      if (response.ok) {
        return Promise.resolve()
      } else {
        console.error("Error updating user:", usersData.error);

        throw new Error(usersData.error)
      }
    } catch (error) {

      console.log("Error during updateUser:", error);
      return Promise.reject(error)
    }

  };
  //add departments
  const addDepartment = (department: Department): Promise<void> =>
    fetch(`${import.meta.env.VITE_BASE_URL}/api/departments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify(department),
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        console.log(response);

        if (response.error) {
          console.log(response.error);
          throw new Error(response.error);
        } else {
          getDepartments();
          return Promise.resolve();
        }
      })
      .catch((error) => {
        console.log("Error during addDepartment:", error);
        return Promise.reject(error);
      });
  /// Get Departments
  const getDepartments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/departments`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      const departmentsData = await response.json();

      if (response.ok) {
        setDepartments(departmentsData);

      } else {
        console.error("Error fetching departments:", departmentsData.error);
      }
    } catch (error) {
      console.error("Error during getDepartments:", error);
    }
  };


  //Delete Department
  const deleteDepartment = (id: number): Promise<void> => {

    const token = sessionStorage.getItem('token');

    if (!token) {
      console.log("Error: Login required to delete leave");
      return Promise.reject("Login required");
    }

    return fetch(`${import.meta.env.VITE_BASE_URL}/api/departments/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        
        if (response.error) {
          console.log(response.error);
          throw new Error(response.error);
        } else {
          return Promise.resolve();
        }
      })
      .catch((error) => {
        console.log("Error during deleting:", error);
        return Promise.reject(error);
      });

  }

  //update department

  const updateDepartment = (id: any, department: any): Promise<void> => {
    console.log({ department })
    return fetch(`${import.meta.env.VITE_BASE_URL}/api/departments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify(department),
    }).then((res) => {
      return res.json();
    })
      .then((response) => {

        if (response.error) {
          console.log(response.error);
          throw new Error(response.error);
        } else {
          return Promise.resolve();
        }
      })
      .catch((error) => {
        console.log("Error during update Department:", error);
        return Promise.reject(error);
      });

  };

  /// Get Line-Managers
  const getLineManagers = (): Promise<any[]> => {
    return fetch(`${import.meta.env.VITE_BASE_URL}/api/line-managers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not OK");
        }
        return res.json();
      })
      .then((lineManagers) => {
        return lineManagers;
      })
      .catch((error) => {
        console.error("Error during getLineManagers:", error);
        return [];
      });
  };

  /// Get Line-Managers for a specific department
  const getLineManagersByDepartment = (
    departmentId: string
  ): Promise<any[]> => {
    return fetch(
      `${import.meta.env.VITE_BASE_URL}/api/line-managers/${departmentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not OK");
        }
        return res.json();
      })
      .then((lineManagers) => {
        return lineManagers;
      })
      .catch((error) => {
        console.error("Error during getLineManagersById", error);
        return [];
      });
  };

  /// Update profile-picture
  const updateProfilePicture = async (profilePicture: string): Promise<void> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/profile-picture`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ profilePicture }),
      });

      if (response.ok) {
        return Promise.resolve()
      } else {
        throw new Error("Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error during profile picture update:", error);
      throw error;
    }
  };

  /// Logout
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");

    setIsUserLoggedIn(false);
    console.log("logout successful");
    nav("/");
  };

  const contextData: AuthContextType = {
    isUserLoggedIn,
    currentUser,
    users,
    companyUsers,
    departments,
    signup,
    addUser,
    login,
    logout,
    getCurrentUser,
    getAllUsers,
    getUsersByCompany,
    updateUser,
    addDepartment,
    getDepartments,
    deleteDepartment,
    updateDepartment,
    getLineManagers,
    getLineManagersByDepartment,
    updateProfilePicture,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}
