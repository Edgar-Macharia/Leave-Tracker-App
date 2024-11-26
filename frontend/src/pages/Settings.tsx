import Breadcrumb from '../components/Breadcrumb';
import { FaRegBuilding } from "react-icons/fa";
import { FaExchangeAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';



const Settings = () => {


  return (
    <>
      <div className="mx-auto max-w-270">

        <Breadcrumb pageName="Settings" />

        <Link to={'/settings/changepassword'}>
          <div className="border border-stroke py-10 px-5 w-[600px] mb-10" >
            <div className="flex justify-start items-center gap-5">
              <span className='flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-2'><FaExchangeAlt />
              </span>
              <div className="">

                <h2 className='font-bold text-lg mb-2'>Change Password</h2>
                <p>Change your account password</p>
              </div>
            </div>
          </div>
        </Link>

        <Link to={'/settings/departmentchange'}>
        <div className="border border-stroke py-10 px-5 w-[600px] mb-10">
          <div className="flex justify-start items-center gap-5">
            <span className='flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-2'><FaRegBuilding />
            </span>
            <div className="">

              <h2 className='font-bold text-lg mb-2'>Manage Departments</h2>
              <p>Add manage and delete departments within the organization</p>
            </div>
          </div>
        </div>
        </Link>





      </div>
    </>
  );
};

export default Settings;
