import { useEffect, useState, useRef } from "react";
import CardOne from "../components/CardOne";
import CardTwo from "../components/CardTwo";
import CardThree from "../components/CardThree";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import { useAuth } from "../context/AuthContext";
import { useLeave } from "../context/LeaveContext";
import EmployeeDashboard from "../components/EmployeeDashboard";
import RequestButton from "../components/RequestButton";
import LineManagerDashboard from "../components/LineManagerDashboard";
import CardFour from "../components/CardFour";
import { GrGroup } from "react-icons/gr";

interface LeaveData {
  _id?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
}

const Dashboard = () => {
  const { currentUser, companyUsers, getUsersByCompany } = useAuth();
  const { getAllLeaves, approveLeave, rejectLeave, cancelLeave } = useLeave();
  
  const [leaveData, setLeaveData] = useState<LeaveData[]>([]);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const toastCenter = useRef<Toast>(null);
 
  useEffect(() => {
    getAllLeaves()
      .then((data) => {
        const pendingLeaves = data.filter(
          (leave) => leave.status === "Waiting for Approval"
        );
        setLeaveData(pendingLeaves);
      })
      .catch((error) => console.error("Error fetching leave data:", error));
  }, [getAllLeaves]);

  useEffect(() => {
    setTotalEmployees(companyUsers?.length)
  }, [companyUsers]);

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
    <>
      <Toast ref={toastCenter} position="top-center" />
      {currentUser?.roles.includes("ADMIN") && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
          <CardOne />
          <CardTwo />
          <CardThree />
        </div>
      )}
      <div className="mt-4">
        <RequestButton />
      </div>
      {currentUser?.roles.includes("ADMIN") && (
        <div className="">
          <CardFour />
        </div>
      )}

      {currentUser?.roles.includes("ADMIN") && (
        <div className=" mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5 ">
          <div className="col-span-12 xl:col-span-8 px-2 py-2 rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
            <div className="card">
              <h4 className="mb-6 px-2 text-xl font-semibold text-black dark:text-white">
                All Pending Requests
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

          <div className="h-auto col-span-12 xl:col-span-4 px-2 py-2 xl:p-5 rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-2">
              <GrGroup />
            </div>
            <h4 className=" mt-5 text-xl font-semibold text-black dark:text-white">
              Number of Employees
            </h4>
            <h4 className=" mt-5 text-2xl font-semibold text-black dark:text-white ">
              {totalEmployees ? totalEmployees : "Employees Not Added Yet!"}
            </h4>
          </div>
        </div>
      )}

      {currentUser?.roles.includes("LINE_MANAGER") && (
        <div>
          <LineManagerDashboard />
        </div>
      )}

      <div>
        <EmployeeDashboard />
      </div>
    </>
  );
};

export default Dashboard;
