import { createContext, useContext, ReactNode } from 'react';

interface LeaveProviderProps {
    children: ReactNode;
  }

interface LeaveContextType {
    createLeave: (leave: LeaveData) => Promise<void>;
    getOneLeave: (id: string) => Promise<LeaveData | null>;
    getAllLeaves: () => Promise<LeaveData[]>;
    getAllLeavesForUser: () => Promise<LeaveData[]>;
    getLeavesForLineManager: () => Promise<LeaveData[]>;
    updateLeave: (id: string, updatedLeave: LeaveData) => Promise<void>;
    deleteLeave: (id: string) => Promise<void>;
    approveLeave: (id: string) => Promise<void>;
    rejectLeave: (id: string) => Promise<void>;
    cancelLeave: (id: string) => Promise<void>;
  }

interface LeaveData {
  _id: string;
  status: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  fileUpload?: string;
  reason?: string;
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error('useLeave must be used within a LeaveProvider')
  }
  return context;
}


export default function LeaveProvider({ children }: LeaveProviderProps) {


  /// Create Leave
  const createLeave = (leave: LeaveData): Promise<void> => {

    const token = sessionStorage.getItem("token");
    
    if (!token) {
      console.log("Error: Login to request leave");
      return Promise.reject("Login required");
    }

  fetch(`${import.meta.env.VITE_BASE_URL}/api/leave`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(leave),
  })
    .then((res) => res.json())
    .then((response) => {
      if (!response.ok) {
        console.log(response.errors);
      } else {
        console.log(response.message);
      } 
    })
    .catch((error) => {
      console.error('Error during create leave:', error);
    });
    return Promise.resolve(); 

}

 /// Get All Leaves
 const getAllLeaves = (): Promise<LeaveData[]> => {

  const token = sessionStorage.getItem("token");

  if (!token) {
    console.log('Error: Login required to get leaves');
    return Promise.reject('Login required');
  }
  
  return fetch(`${import.meta.env.VITE_BASE_URL}/api/leave`,{
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`
  },
  })
  .then((res) => res.json())
  .then((leaves) => {
    const leavesWithFormattedDates = leaves.map((leave: { startDate: string | number | Date; endDate: string | number | Date; }) => ({
      ...leave,
      startDate: new Date(leave.startDate).toLocaleDateString(),
      endDate: new Date(leave.endDate).toLocaleDateString()
    })) 
    return leavesWithFormattedDates;
  })
  .catch((error) => {
    console.error('Error during get all leaves', error);
    return Promise.reject(error.message);
  })
 }

 /// Get All Leaves For logged-in user
 const getAllLeavesForUser = (): Promise<LeaveData[]> => {

  const token = sessionStorage.getItem("token");

  if (!token) {
    console.log("Error: Login required to get leaves");
    return Promise.reject("Login required");
  }

  return fetch(`${import.meta.env.VITE_BASE_URL}/api/leave/user`,{
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
  .then((res) => res.json())
  .then((leaves) => {

    const leavesWithFormattedDates = leaves.map((leave: { startDate: string | number | Date; endDate: string | number | Date; }) => ({
      ...leave,
      startDate: new Date(leave.startDate).toLocaleDateString(),
      endDate: new Date(leave.endDate).toLocaleDateString()
    })) 
    return leavesWithFormattedDates;
  })
  .catch((error) => {
    console.error('Error during get all leaves for user:', error);
    return Promise.reject(error.message);
  })
 }

 /// Get Leave by Id
 const getOneLeave = (_id: string): Promise<LeaveData | null> => {

  const token = sessionStorage.getItem('token');
  if(!token) {
    console.log('Error', 'Login to get one leave')
    return Promise.reject('Login required');
  }

  return fetch(`${import.meta.env.VITE_BASE_URL}/api/leave/user/${_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
  })
  .then((res) => res.json())
  .then((leave) => {

    if (leave.startDate) {
      leave.startDate = formatDateToYYYYMMDD(leave.startDate);
    }
    if (leave.endDate) {
      leave.endDate = formatDateToYYYYMMDD(leave.endDate);
    }

    return leave;
  })
  .catch((error) => {
    console.error('Error during get one leave:', error);
    return Promise.reject(error.message);
  })
}

function formatDateToYYYYMMDD(inputString: string | number | Date) {
  const date = new Date(inputString);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/// Get Leaves associated to Line-Manager
const getLeavesForLineManager = (): Promise<LeaveData[]> => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.log('Error', 'Login to get leaves for line manager')
    return Promise.reject('Login required');
  }

  return fetch(`${import.meta.env.VITE_BASE_URL}/api/leave/line-manager`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  }})
  .then((res) => res.json())
  .then((leaves) => {

    const leavesWithFormattedDates = leaves.map((leave: { startDate: string | number | Date; endDate: string | number | Date; }) => ({
      ...leave,
      startDate: new Date(leave.startDate).toLocaleDateString(),
      endDate: new Date(leave.endDate).toLocaleDateString()
    })) 
    return leavesWithFormattedDates;
  })
  .catch((error) => {
    console.error('Error getting leaves for line-manager', error)
    return Promise.reject(error.message);
  })
} 

 /// Update Leave
 const updateLeave = (_id: string, updatedLeave: LeaveData): Promise<void> => {

  const token = sessionStorage.getItem('token');
  if (!token) {
    console.log('Error', 'Login to update leave');
    return Promise.reject('Login required');
  }

  return fetch(`${import.meta.env.VITE_BASE_URL}/api/leave/${_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedLeave),
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(response);
      if (response.errors) {
        console.log(response.errors);
        throw new Error('Failed to update leave');
      } else if (response.message) {
        console.log(response.message);
      } else {
        throw new Error('Network response was not OK');
      }
    })
    .catch((error) => {
      console.error('Error during update leave:', error);
      throw error;
    });
};

 /// Delete Leave
 const deleteLeave = (_id: string): Promise<void> => {

  const token = sessionStorage.getItem('token');

  if(!token) {
    console.log("Error: Login required to delete leave");
    return Promise.reject("Login required");
  }

  return fetch(`${import.meta.env.VITE_BASE_URL}/api/leave/${_id}`,{
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
  .then((res) => {
    if(!res.ok) {
      console.log('Leave not found')
    }
  })
  .catch((error) => {
    console.error('Error during delete leave:', error)
  })
 }

 /// Approve Leave
 const approveLeave = (_id: string): Promise<void> => {

    const token = sessionStorage.getItem('token')
      if(!token) {
        console.log("Error: Login required to approve leave")
        return Promise.reject("Login required")
      }

    return fetch(`${import.meta.env.VITE_BASE_URL}/api/leave/approve/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          console.log(response.error);
          throw new Error('Leave approval failed');
        }
      })
      .catch((error) => {
        console.error('Error during leave approval:', error);
      });
   }

   /// Reject Leave
   const rejectLeave = (_id: string): Promise<void> => {

    const token = sessionStorage.getItem('token')
      if(!token) {
        console.log("Error: Login required to reject leave")
        return Promise.reject("Login required")
      }

    return fetch(`${import.meta.env.VITE_BASE_URL}/api/leave/reject/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          console.log(response.error);
          throw new Error('Leave rejection failed');
        }
      })
      .catch((error) => {
        console.error('Error during leave rejection:', error);
      });
   }

   /// Cancel Leave
   const cancelLeave = (_id: string): Promise<void> => {

    const token = sessionStorage.getItem('token')
      if(!token) {
        console.log("Error: Login required to cancel leave")
        return Promise.reject("Login required")
      }

    return fetch(`${import.meta.env.VITE_BASE_URL}/api/leave/cancel/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if (response.error) {
          console.log(response.error);
          throw new Error('Leave cancellation failed');
        }
      })
      .catch((error) => {
        console.error('Error during leave cancellation:', error);
      });
   } 


    const contextData: LeaveContextType = {
        createLeave,
        getOneLeave,
        getAllLeaves,
        getAllLeavesForUser,
        getLeavesForLineManager,
        updateLeave,
        deleteLeave,
        approveLeave,
        rejectLeave,
        cancelLeave,
      };

      return (
        <LeaveContext.Provider value={contextData}>
          {children}
        </LeaveContext.Provider>
      );
  
}
