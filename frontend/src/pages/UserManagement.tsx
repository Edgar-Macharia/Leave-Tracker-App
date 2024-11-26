import Breadcrumb from "../components/Breadcrumb"

const UserManagement = () => {
  return (
    <>
      <Breadcrumb pageName="User Management" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-5 pb-1 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div>
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white flex justify-between">
            Employees Overview
            <button className="flex items-center gap-2 rounded bg-primary py-1 px-4.5 text-base text-white hover:bg-opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1024 1024">
              <path fill="white" d="M892 772h-80v-80c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v80h-80c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h80v80c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-80h80c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM373.5 498.4c-.9-8.7-1.4-17.5-1.4-26.4c0-15.9 1.5-31.4 4.3-46.5c.7-3.6-1.2-7.3-4.5-8.8c-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 0 1-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6c24.7-25.3 57.9-39.1 93.2-38.7c31.9.3 62.7 12.6 86 34.4c7.9 7.4 14.7 15.6 20.4 24.4c2 3.1 5.9 4.4 9.3 3.2c17.6-6.1 36.2-10.4 55.3-12.4c5.6-.6 8.8-6.6 6.3-11.6c-32.5-64.3-98.9-108.7-175.7-109.9c-110.8-1.7-203.2 89.2-203.2 200c0 62.8 28.9 118.8 74.2 155.5c-31.8 14.7-61.1 35-86.5 60.4c-54.8 54.7-85.8 126.9-87.8 204a8 8 0 0 0 8 8.2h56.1c4.3 0 7.9-3.4 8-7.7c1.9-58 25.4-112.3 66.7-153.5c29.4-29.4 65.4-49.8 104.7-59.7c3.8-1.1 6.4-4.8 5.9-8.8zM824 472c0-109.4-87.9-198.3-196.9-200C516.3 270.3 424 361.2 424 472c0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 0 0-86.4 60.4C357 742.6 326 814.8 324 891.8a8 8 0 0 0 8 8.2h56c4.3 0 7.9-3.4 8-7.7c1.9-58 25.4-112.3 66.7-153.5C505.8 695.7 563 672 624 672c110.4 0 200-89.5 200-200zm-109.5 90.5C690.3 586.7 658.2 600 624 600s-66.3-13.3-90.5-37.5a127.26 127.26 0 0 1-37.5-91.8c.3-32.8 13.4-64.5 36.3-88c24-24.6 56.1-38.3 90.4-38.7c33.9-.3 66.8 12.9 91 36.6c24.8 24.3 38.4 56.8 38.4 91.4c-.1 34.2-13.4 66.3-37.6 90.5z"/>
            </svg>
              Add employees
            </button>
          </h4>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
            <div className="p-2 xl:p-2">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Name
              </h5>
            </div>
            <div className="p-1 text-center xl:p-2">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Approvers
              </h5>
            </div>
            <div className="p-2 text-center xl:p-2">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Admin
              </h5>
            </div>
            <div className="hidden p-2 text-center sm:block xl:p-2">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Line manager
              </h5>
            </div>
          </div>

          <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
            <div className="flex items-center gap-3 p-2 xl:p-5">
              <p className="hidden text-black dark:text-white sm:block">John Doe</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">Alex Smith</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
            <select className="">
              <option value="Yes" className="text-green-500 dark:text-white">Yes</option>
              <option value="No" className="text-red-500 dark:text-white">No</option>
            </select>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <select >
                <option value="Yes" className="text-meta-3 dark:text-white">Yes</option>
                <option value="No" className="text-danger dark:text-white">No</option>
              </select>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <button className="p-2 rounded-full hover:bg-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="gray" d="M8 9h8v10H8z" opacity=".3" /><path fill="gray" d="m15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z" /></svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
            <div className="flex items-center gap-3 p-2 xl:p-5">
              <p className="hidden text-black dark:text-white sm:block">Alex Smith</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">James Burn</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
            <select className="">
              <option value="Yes" className="text-green-500 dark:text-white">Yes</option>
              <option value="No" className="text-red-500 dark:text-white">No</option>
            </select>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <select >
                <option value="Yes" className="text-meta-3 dark:text-white">Yes</option>
                <option value="No" className="text-danger dark:text-white">No</option>
              </select>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <button className="p-2 rounded-full hover:bg-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="gray" d="M8 9h8v10H8z" opacity=".3" /><path fill="gray" d="m15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default UserManagement