import { SetStateAction, useState, useEffect, useRef, JSXElementConstructor, ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb.tsx'
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useAuth } from "../context/AuthContext.tsx"
import { useLeave } from '../context/LeaveContext.tsx'

import { storage } from '../firebase.tsx';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";



const RequestLeave: any = () => {

  const { currentUser } = useAuth();
  const { createLeave, getOneLeave, updateLeave } = useLeave();

  const toastCenter = useRef<Toast>(null);
  const nav = useNavigate()
  const { id } = useParams();

  const [selectedLeave, setSelectedLeave] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [dateError, setDateError] = useState('');
  const [balanceError, setBalanceError] = useState('');
  const [fileUpload, setFileUpload] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);


  const updateNotification = () => {
    toastCenter.current?.show({
      severity: 'success',
      summary: 'Updated',
      detail: 'Leave request updated successfully!',
      life: 2000,
    });
  };

  const notify = () => {
    toastCenter.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Leave request created successfully!',
      life: 2000,
    });
  };

  const showErrors = (errorMessage: string) => {
    toastCenter.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 2000,
    });
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileUploadRef = useRef<FileUpload>(null);


  const leaves = [
    'Annual leave',
    'Sick leave - Doctor\'s Recommendation',
    'Sick leave - Home Rest',
    'Maternity',
    'Paternity',
    'Marriage',
    'Bereavement',
    'Leave without pay',
    'Excused leave',
    'Other'
  ];


  const handleSelectedLeaveChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedLeave(e.target.value);
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, isStartDate: boolean) => {
    const selectedDate = e.target.value;
    console.log(selectedDate);
    
    const currentDate = new Date().toISOString().split('T')[0];

    if (isStartDate && selectedDate < currentDate) {
      // If it's the start date and it's a past date, don't update the state
      return;
    }

    if (isStartDate) {
      setStartDate(selectedDate);
    } else {
      setEndDate(selectedDate);
    }

    setDateError('');
  };
  console.log(currentUser?.leaveBalance);

  const calculateTotalDays = () => {
    
    if (startDate && endDate) {
      const startTimestamp = new Date(startDate).getTime();
      const endTimestamp = new Date(endDate).getTime();

      if (endTimestamp < startTimestamp) {
        setDateError('End date must be the same or after the start date.');
        setTotalDays(0);
      } else {
        const differenceInDays = Math.ceil((endTimestamp - startTimestamp) / (1000 * 3600 * 24) + 1);
        if (differenceInDays <= currentUser?.leaveBalance) {
          setIsSubmitDisabled(false);
          setBalanceError('');
        } else {
          setIsSubmitDisabled(true);
          setBalanceError('Number of days requested exceeds current balance');
        }
        setTotalDays(differenceInDays);
        setDateError('');
      }
    } else {
      setTotalDays(0);
    }
  };
  useEffect(() => {

    calculateTotalDays();
  }, [startDate, endDate]);


  const handleFileSelect = (e: { files: File[] }) => {
    setSelectedFile(e.files[0]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedLeave === "Sick leave - Doctor's Recommendation" && selectedFile) {
      const storageRef = ref(storage, `files/user/${currentUser._id}/${selectedFile.name}`);

      uploadBytes(storageRef, selectedFile).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setFileUpload(downloadURL);
        });
      });
    }

    if (id) {
      updateLeave(id, {
        leaveType: selectedLeave,
        startDate,
        endDate,
        fileUpload,
        reason,
        status: '',
        _id: '',
      })
        .then(() => {
          updateNotification();
          setTimeout(() => {
            nav('/dashboard');
          }, 2000);
        })
        .catch((error) => {
          console.error('Error updating leave:', error.message);
          showErrors('Failed to update leave request');
        });
    } else {
      createLeave({
        leaveType: selectedLeave,
        startDate,
        endDate,
        fileUpload,
        reason,
        status: '',
        _id: '',
      })
        .then(() => {
          notify();
          setTimeout(() => {
            nav('/dashboard');
          }, 2000);
        })
        .catch((error) => {
          console.error('Error creating leave:', error.message);
          showErrors('Not enough balance to submit leave request');
        });
    }
  };

  useEffect(() => {
    if (id) {
      getOneLeave(id).then((leave) => {
        if (leave && leave.leaveType) {
          setSelectedLeave(leave.leaveType);
          setStartDate(leave.startDate);
          setEndDate(leave.endDate);
          setFileUpload(leave.fileUpload || '');
          setReason(leave.reason || '');
        }
      });
    }
  }, [id, getOneLeave]);

  return (
    <>
      <Toast ref={toastCenter} position="top-center" />
      <Breadcrumb pageName="Request Leave" />

      <div className="grid grid-cols-1  sm:grid-cols-2 bg-white">
        <div className="flex flex-col gap-3 px-5 mt-30 h-60">

          <img src="https://dashboard.day-off.app/assets/app/media/img/custom/3steps.png" alt="form-img" className='place-self-center' />

        </div>
        <div className="flex flex-col gap-9 pl-2 border-l border-stroke">

          {/* <!-- Request Form --> */}
          <div className="rounded-sm">

            <form onSubmit={handleSubmit}>
              <div className="p-5">
                <div className="mb-1">
                  <label className="mb-1 block text-black dark:text-white">
                    Select leave type
                  </label>
                  <div className="card flex justify-content-center">
                    <Dropdown id="dropdown" options={leaves} value={selectedLeave} onChange={handleSelectedLeaveChange} optionLabel=""
                      showClear placeholder="Select leave" required className='w-full md:w-14rem'></Dropdown>
                  </div>
                </div>

                <div className="flex flex-col gap-3 py-2">
                  <div>
                    <label className="mb-1 block text-black dark:text-white">
                      Start date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        data-testid = 'startDateInput'
                        value={startDate}
                        onChange={(e) => handleDateChange(e, true)}
                        className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparentz py-3 px-5 font-medium outline-none transition focus:border-[#7dd3fc] active:border-[#7dd3fc] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-black dark:text-white">
                      End date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={endDate}
                        data-testid = 'endDateInput'
                        onChange={(e) => handleDateChange(e, false)}
                        className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparentz py-3 px-5 font-medium outline-none transition focus:border-[#7dd3fc] active:border-[#7dd3fc] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  </div>

                  {dateError ? <p className="text-danger" data-testid='date-error'>{dateError}</p> : <div className='flex justify-between'><h2 data-testid ='total-days'>Total days: {totalDays}</h2> <h2 data-testid='leaveBalance'>{currentUser?.leaveBalance}</h2> </div>}
                  <p className="text-danger" data-testid='balance-error'>{balanceError}</p>
                </div>

                {selectedLeave === 'Sick leave - Doctor\'s Recommendation' && (
                  <div className="mb-6">
                    <label className="mb-1 block text-black dark:text-white">
                      Please attach your medical certificate
                    </label>
                    <div className="card">
                      <FileUpload
                        ref={fileUploadRef}
                        mode="basic"
                        name="demo[]"
                        accept="*/*"
                        maxFileSize={1000000}
                        onSelect={handleFileSelect}
                      />
                    </div>
                  </div>
                )}

                {selectedLeave === "Other" &&
                  <div className='mb-6'>
                    <label className="mb-1 block text-black dark:text-white">
                      Reason
                    </label>
                    <InputTextarea id="description" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} cols={30}
                      placeholder=' Specify your reason' className='w-full' />
                  </div>
                }

                <hr className='opacity-40' />
                <div className='flex justify-end items-center my-2'>
                  <Link to='/dashboard' className='w-20 rounded mr-3 p-2.5 font-medium border-[1.5px] border-stroke hover:bg-gray'>
                    Cancel
                  </Link>
                  <span>
                    <button data-testid='submit-button' type="submit" disabled={isSubmitDisabled}
                      className="w-50 justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-80">
                      Submit Request
                    </button>
                  </span>
                </div>

              </div>
            </form>

          </div>
          {/* <!-- Request Form --> */}
        </div>

      </div>
    </>
  )
}

export default RequestLeave