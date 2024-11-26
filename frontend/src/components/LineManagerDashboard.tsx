import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import { useLeave } from "../context/LeaveContext";
import { useAuth } from "../context/AuthContext";
import { GrGroup } from "react-icons/gr";
import BalancesCard from "./BalancesCard";

interface LeaveData {
  _id?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
}

const LineManagerDashboard = () => {
  const { getLeavesForLineManager, approveLeave, rejectLeave, cancelLeave } =
    useLeave();

  const { currentUser, companyUsers } = useAuth();

  const [team, setTeam] = useState<any>();
  const [leaveData, setLeaveData] = useState<LeaveData[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<number>();
  const [approvedLeaves, setApprovedLeaves] = useState<number>();
  const [totalLeaves, setTotalLeaves] = useState<number>();
  const toastCenter = useRef<Toast>(null);

  const approve = () => {
    toastCenter.current?.show({
      severity: "success",
      summary: "Approved",
      detail: "Leave request approved!",
      life: 2000,
    });
  };
  const reject = () => {
    toastCenter.current?.show({
      severity: "error",
      summary: "Rejected",
      detail: "Leave request rejected!",
      life: 2000,
    });
  };
  const cancel = () => {
    toastCenter.current?.show({
      severity: "warn",
      summary: "Cancelled",
      detail: "Leave request cancelled!",
      life: 2000,
    });
  };

  useEffect(() => {
    const manager = companyUsers?.filter((d: any) =>
    
         d?.lineManagerId?.email === currentUser.email
       
    );
    setTeam(manager?.length);
  }, [companyUsers]);

  useEffect(() => {
    getLeavesForLineManager()
      .then((data) => {
        const pendingLeaves = data.filter(
          (leave) => leave.status === "Waiting for Approval"
        );
        const approvedLeaves = data.filter(
          (leave) => leave.status === "Approved"
        );
        setLeaveData(pendingLeaves);
        setPendingLeaves(pendingLeaves.length);
        setApprovedLeaves(approvedLeaves.length);
        setTotalLeaves(data.length);
      })
      .catch((error) => console.error("Error fetching leave data:", error));
  }, [getLeavesForLineManager]);

  const handleApproveLeave = (_id: string) => {
    approveLeave(_id);
    approve();
    setLeaveData((prevLeaves) =>
      prevLeaves.filter((leave) => leave._id !== _id)
    );
  };

  const handleRejectLeave = (_id: string) => {
    rejectLeave(_id);
    reject();
    setLeaveData((prevLeaves) =>
      prevLeaves.filter((leave) => leave._id !== _id)
    );
  };

  const handleCancelLeave = (_id: string) => {
    cancelLeave(_id);
    cancel();
    setLeaveData((prevLeaves) =>
      prevLeaves.filter((leave) => leave._id !== _id)
    );
  };

  return (
    <div>
      {!currentUser?.roles.includes("ADMIN") && (
        <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 mt-4">
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <GrGroup />
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {team}
                </h4>
                <span className="text-sm font-medium">Team Members</span>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#3b0764"
                  d="m17.275 20.25l3.475-3.45l-1.05-1.05l-2.425 2.375l-.975-.975l-1.05 1.075l2.025 2.025ZM6 9h12V7H6v2Zm12 14q-2.075 0-3.538-1.463T13 18q0-2.075 1.463-3.538T18 13q2.075 0 3.538 1.463T23 18q0 2.075-1.463 3.538T18 23ZM3 22V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v6.675q-.475-.225-.975-.375T19 11.075V5H5v14.05h6.075q.125.775.388 1.475t.687 1.325L12 22l-1.5-1.5L9 22l-1.5-1.5L6 22l-1.5-1.5L3 22Zm3-5h5.075q.075-.525.225-1.025t.375-.975H6v2Zm0-4h7.1q.95-.925 2.213-1.463T18 11H6v2Zm-1 6.05V5v14.05Z"
                />
              </svg>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {approvedLeaves}
                </h4>
                <span className="text-sm font-medium">Approved Requests</span>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#3b0764"
                  d="M17 12c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5zm1.65 7.35L16.5 17.2V14h1v2.79l1.85 1.85l-.7.71zM18 3h-3.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H6c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h6.11a6.743 6.743 0 0 1-1.42-2H6V5h2v3h8V5h2v5.08c.71.1 1.38.31 2 .6V5c0-1.1-.9-2-2-2zm-6 2c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1z"
                />
              </svg>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {pendingLeaves}
                </h4>
                <span className="text-sm font-medium">Pending Requests</span>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#3b0764"
                  d="m17.275 20.25l3.475-3.45l-1.05-1.05l-2.425 2.375l-.975-.975l-1.05 1.075l2.025 2.025ZM6 9h12V7H6v2Zm12 14q-2.075 0-3.538-1.463T13 18q0-2.075 1.463-3.538T18 13q2.075 0 3.538 1.463T23 18q0 2.075-1.463 3.538T18 23ZM3 22V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v6.675q-.475-.225-.975-.375T19 11.075V5H5v14.05h6.075q.125.775.388 1.475t.687 1.325L12 22l-1.5-1.5L9 22l-1.5-1.5L6 22l-1.5-1.5L3 22Zm3-5h5.075q.075-.525.225-1.025t.375-.975H6v2Zm0-4h7.1q.95-.925 2.213-1.463T18 11H6v2Zm-1 6.05V5v14.05Z"
                />
              </svg>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {totalLeaves}
                </h4>
                <span className="text-sm font-medium">Total Requests</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className=" mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5 ">
        <div className="col-span-12 xl:col-span-8 px-2 py-2 rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
          <div className="card">
            <h4 className="mb-6 px-2 text-xl font-semibold text-black dark:text-white">
              Pending Requests
            </h4>
            <DataTable value={leaveData} tableStyle={{ minWidth: "50rem" }}>
              <Column
                field="user"
                header="Employee"
                body={(rowData) =>
                  `${rowData.user.firstName} ${rowData.user.lastName}`
                }
                sortable
                style={{ width: "20%" }}
              ></Column>
              <Column
                field="leaveType"
                header="Leave type"
                sortable
                style={{ width: "20%" }}
              ></Column>
              <Column
                field="startDate"
                header="Start date"
                sortable
                style={{ width: "15%" }}
              ></Column>
              <Column
                field="endDate"
                header="End date"
                sortable
                style={{ width: "15%" }}
              ></Column>
              <Column
                header=""
                style={{ width: "20%" }}
                body={(rowData) => (
                  <>
                    <Tooltip
                      target=".approve"
                      position="bottom"
                      content="Approve"
                    />
                    <Button
                      icon="pi pi-check"
                      className="approve mr-1 rounded-full  shadow-2xl hover:bg-[#14b8a6] "
                      onClick={() => handleApproveLeave(rowData._id)}
                    ></Button>

                    <Tooltip
                      target=".button2"
                      position="bottom"
                      content="Reject"
                    />
                    <Button
                      icon="pi pi-ban"
                      className="button2 mr-1 rounded-full  shadow-2xl hover:bg-[#ef4444]"
                      onClick={() => handleRejectLeave(rowData._id)}
                    ></Button>

                    <Tooltip
                      target=".cancel"
                      position="bottom"
                      content="Cancel"
                    />
                    <Button
                      icon="pi pi-times"
                      className="cancel p-button-danger p-button-outlined rounded-full border shadow-2xl"
                      onClick={() => handleCancelLeave(rowData._id)}
                    ></Button>
                  </>
                )}
              />
            </DataTable>
          </div>
        </div>
        <BalancesCard />
      </div>
    </div>
  );
};

export default LineManagerDashboard;
