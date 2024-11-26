import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BalancesCard from "./BalancesCard.tsx";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useLeave } from "../context/LeaveContext.tsx";
import { useAuth } from "../context/AuthContext.tsx";

interface Leave {
  _id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
}

const EmployeeDashboard = () => {
  const { getAllLeavesForUser, deleteLeave } = useLeave();
  const { currentUser } = useAuth();

  const [leaveData, setLeaveData] = useState<Leave[]>([]);
  const toastCenter = useRef<Toast>(null);
  const nav = useNavigate();

  const notify = () => {
    toastCenter.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Leave request deleted successfully!",
      life: 2000,
    });
  };

  const confirmDelete = (_id: string) => {
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => {
        if (_id) {
          deleteLeave(_id);
          notify();
          setLeaveData((prevLeaves) =>
            prevLeaves.filter((leave) => leave._id !== _id)
          );
        }
      },
      reject: () => {},
    });
  };

  useEffect(() => {
    getAllLeavesForUser()
      .then((data) => setLeaveData(data))
      .catch((error) => console.error("Error fetching leave data:", error));
  }, [getAllLeavesForUser]);

  const handleEditLeave = (_id: string) => {
    nav(`/request-leave/${_id}`);
  };

  const handleDeleteLeave = (_id: string) => {
    confirmDelete(_id);
  };

  const getStatusBackground = (status: any) => {
    switch (status) {
      case "Approved":
        return "bg-[#14b8a6]";
      case "Rejected":
        return "bg-[#ef4444]";
      case "Cancelled":
        return "bg-[#374151]";
      default:
        return "bg-[#cbd5e1]";
    }
  };

  return (
    <>
      <Toast ref={toastCenter} position="top-center" />
      <ConfirmDialog />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8 px-2 py-2 border border-stroke">
          <div className="card">
            <h4 className="mb-6 px-2 text-xl font-semibold text-black dark:text-white">
              My Requests
            </h4>
            <DataTable value={leaveData} tableStyle={{ minWidth: "50rem" }}>
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
                field="status"
                header="Status"
                sortable
                style={{ width: "20%" }}
                body={(rowData) => (
                  <div
                    className={`status-container rounded-full text-center p-1 text-white ${getStatusBackground(
                      rowData.status
                    )}`}
                  >
                    {rowData.status}
                  </div>
                )}
              ></Column>
              <Column
                header=""
                style={{ width: "15%" }}
                body={(rowData) => (
                  <>
                    {rowData.status === "Waiting for Approval" && (
                      <>
                        <Tooltip
                          target=".edit"
                          position="bottom"
                          content="Edit"
                        />
                        <Button
                          icon="pi pi-file-edit"
                          className="edit rounded-full hover:bg-[#9ca3af]"
                          onClick={() => handleEditLeave(rowData._id)}
                        ></Button>
                      </>
                    )}
                    <Tooltip
                      target=".delete"
                      position="bottom"
                      content="Delete"
                    />
                    <Button
                      icon="pi pi-trash"
                      className="p-button-danger rounded-full hover:bg-[#ef4444] delete"
                      onClick={() => handleDeleteLeave(rowData._id)}
                    ></Button>
                  </>
                )}
              />
            </DataTable>
          </div>
        </div>
        {!currentUser?.roles.includes("LINE_MANAGER") && <BalancesCard />}
      </div>
    </>
  );
};

export default EmployeeDashboard;
