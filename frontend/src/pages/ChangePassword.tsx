import Breadcrumb from '../components/Breadcrumb'

const ChangePassword = () => {
    return (
        <>
            <Breadcrumb pageName="ChangePassword" />
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">

                <div className="flex flex-col gap-9">

                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Reset Password
                            </h3>
                        </div>
                        <form action="#">
                            <div className="p-6.5">
                                <div>
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Enter password"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="my-2.5 block text-black dark:text-white">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Confirm password"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>

                                <button className="flex w-full justify-center rounded bg-primary p-3 my-5 font-medium text-gray">
                                    Reset Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </>

    )
}

export default ChangePassword