import { Link } from "react-router-dom"

const RequestButton = () => {
    return (
        <div>
            <div className="flex justify-end">
                
                <div className="flex flex-col gap-4 2xsm:flex-row 2xsm:items-center">
                    <div className="flex -space-x-2">
                        <Link to="/request-leave"
                            className="flex items-center gap-2 rounded bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-80"
                        >
                            <svg
                                className="fill-current"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z"
                                    fill=""
                                />
                            </svg>
                            Request Leave
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RequestButton