import { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useAuth } from "../context/AuthContext";

const List = () => {
  const [rows, setRows] = useState<Employee[]>();
  const [first, setFirst] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const { companyUsers, getUsersByCompany } = useAuth();
  interface Employee {
    firstName: string;
    lastName: string;
    email: string;
    leaveBalance: number;
    lineManager: string;
    department: string;
  }

  interface Columns {
    field: string;
    header: string;
  }

  const columns: Columns[] = [
    { field: "firstName", header: "FIRST NAME" },
    { field: "lastName", header: "LAST NAME" },
    { field: "email", header: "EMAIL" },
    { field: "leaveBalance", header: "LEAVE BALANCE" },
    { field: "lineManager", header: "LINE MANAGER" },
    { field: "department", header: "DEPARTMENT" },
  ];

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setRowsPerPage(event.rows);
    getUsersByCompany(event.page, event.rows);
  };

  useEffect(() => {
    getUsersByCompany(0, rowsPerPage);
    
  }, [rowsPerPage]);

  useEffect(() => {
    const arr: Employee[] = companyUsers?.users?.map((d: any) => ({
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      leaveBalance: d.leaveBalance,
      lineManager: `${d.lineManagerId?.firstName ?? 'not'} ${d.lineManagerId?.lastName ?? 'assigned'}`,
      department: d.departmentId?.name,
    })) || [];

    setRows(arr);
  }, [companyUsers]);

  return (
    <div>
      {rows && (
        <DataTable
          showGridlines
          value={rows}
          tableStyle={{ minWidth: "50rem" }}
        >
          {columns.map((col) => (
            <Column key={col.field} header={col.header} field={col.field} />
          ))}
        </DataTable>
      )}
      <div className="card">
            <Paginator first={first} rows={rowsPerPage} totalRecords={companyUsers ? companyUsers.totalRecords : 0} rowsPerPageOptions={[20, 40, 60]} onPageChange={onPageChange} />
        </div>
    </div>
  );
};

export default List;
