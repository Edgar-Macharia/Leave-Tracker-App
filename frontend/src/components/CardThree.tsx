import { useEffect,useState } from "react";
import { useLeave } from "../context/LeaveContext";


const CardThree = () => {

  const { getAllLeaves } = useLeave();
  const [totalRequests, setTotalRequests] = useState<number>();
  
  useEffect(() => {
    getAllLeaves()
    .then((data) => {
      setTotalRequests(data.length);
    })
    .catch((error) => console.error("Error fetching leave data:", error));
  },[getAllLeaves]);

  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 36 36">
        <path fill="#3b0764" d="M15 8h9v2h-9z" className="clr-i-outline clr-i-outline-path-1"/>
        <path fill="#3b0764" d="M15 12h9v2h-9z" className="clr-i-outline clr-i-outline-path-2"/>
        <path fill="#3b0764" d="M15 16h9v2h-9z" className="clr-i-outline clr-i-outline-path-3"/>
        <path fill="#3b0764" d="M15 20h9v2h-9z" className="clr-i-outline clr-i-outline-path-4"/>
        <path fill="#3b0764" d="M15 24h9v2h-9z" className="clr-i-outline clr-i-outline-path-5"/>
        <path fill="#3b0764" d="M11 8h2v2h-2z" className="clr-i-outline clr-i-outline-path-6"/>
        <path fill="#3b0764" d="M11 12h2v2h-2z" className="clr-i-outline clr-i-outline-path-7"/>
        <path fill="#3b0764" d="M11 16h2v2h-2z" className="clr-i-outline clr-i-outline-path-8"/>
        <path fill="#3b0764" d="M11 20h2v2h-2z" className="clr-i-outline clr-i-outline-path-9"/>
        <path fill="#3b0764" d="M11 24h2v2h-2z" className="clr-i-outline clr-i-outline-path-10"/>
        <path fill="#3b0764" d="M28 2H8a2 2 0 0 0-2 2v28a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm0 30H8V4h20Z" className="clr-i-outline clr-i-outline-path-11"/>
        <path fill="none" d="M0 0h36v36H0z"/>
        </svg>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {totalRequests}
          </h4>
          <span className="text-sm font-medium">Total Requests</span>
        </div>
      </div>
    </div>
  );
};

export default CardThree;
