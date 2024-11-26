import { useEffect, useState } from "react";
import { useLeave } from "../context/LeaveContext";


const CardTwo = () => {

const { getAllLeaves } = useLeave();
const [numApprovedRequests, setNumApprovedRequests] = useState<number>();

useEffect(() => {
  getAllLeaves()
  .then((data) => {
    const approvedRequests = data.filter((leave) => leave.status === 'Approved');
    setNumApprovedRequests(approvedRequests.length);
  })
  .catch((error) => console.error("Error fetching leave data:", error));
},[getAllLeaves]);

  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
        <path fill="#3b0764" d="m17.275 20.25l3.475-3.45l-1.05-1.05l-2.425 2.375l-.975-.975l-1.05 1.075l2.025 2.025ZM6 9h12V7H6v2Zm12 14q-2.075 0-3.538-1.463T13 18q0-2.075 1.463-3.538T18 13q2.075 0 3.538 1.463T23 18q0 2.075-1.463 3.538T18 23ZM3 22V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v6.675q-.475-.225-.975-.375T19 11.075V5H5v14.05h6.075q.125.775.388 1.475t.687 1.325L12 22l-1.5-1.5L9 22l-1.5-1.5L6 22l-1.5-1.5L3 22Zm3-5h5.075q.075-.525.225-1.025t.375-.975H6v2Zm0-4h7.1q.95-.925 2.213-1.463T18 11H6v2Zm-1 6.05V5v14.05Z"/>
      </svg>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {numApprovedRequests}
          </h4>
          <span className="text-sm font-medium">Approved Requests</span>
        </div>
      </div>
    </div>
  );
};

export default CardTwo;
