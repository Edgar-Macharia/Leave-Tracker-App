import { useEffect, useState } from "react";
import { useLeave } from "../context/LeaveContext";


const CardOne = () => {

const { getAllLeaves } = useLeave();
const [numPendingRequests, setNumPendingRequests] = useState<number>();

  useEffect(() => {
    getAllLeaves()
      .then((data) => {
        const pendingRequests = data.filter((leave) => leave.status === 'Waiting for Approval');
        setNumPendingRequests(pendingRequests.length);
      })
      .catch((error) => console.error("Error fetching leave data:", error));
  }, [getAllLeaves]);

  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
        <path fill="#3b0764" d="M17 12c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5zm1.65 7.35L16.5 17.2V14h1v2.79l1.85 1.85l-.7.71zM18 3h-3.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H6c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h6.11a6.743 6.743 0 0 1-1.42-2H6V5h2v3h8V5h2v5.08c.71.1 1.38.31 2 .6V5c0-1.1-.9-2-2-2zm-6 2c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1z"/>
      </svg>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {numPendingRequests}
          </h4>
          <span className="text-sm font-medium">Pending Requests</span>
        </div>  
      </div>
    </div>
  );
};

export default CardOne;
