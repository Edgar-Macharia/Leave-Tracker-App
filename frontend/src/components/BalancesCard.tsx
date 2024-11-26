import { useEffect, useState } from "react";
import { Knob } from "primereact/knob";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useAuth } from "../context/AuthContext";

const BalancesCard = () => {
  const [remainingBalance, setRemainingBalance] = useState<any>();
  const [totalBalance, setTotalBalance] = useState<any>();

  const { currentUser } = useAuth();

  useEffect(() => {
    setRemainingBalance(currentUser?.leaveBalance);
    setTotalBalance(currentUser?.initialLeaveBalance);
  }, []);

  return (
    <div className="col-span-12 rounded-sm xl:col-span-4  border border-stroke bg-white p-5 dark:border-strokedark dark:bg-boxdark h-100">
      <Accordion activeIndex={0}>
        <AccordionTab
          header={
            <div className="flex justify-between items-center gap-15">
              <h1 className="text-xl font-bold ml-2 font-satoshi">
                BALANCE
              </h1>

              <Knob
                value={(remainingBalance * 100) / 20}
                size={100}
                valueTemplate={"{value}%"}
              />
            </div>
          }
        >
          <div>
            <div className="flex justify-between items-center mt-5">
              <h1 className="font-bold text-lg">Total Balance:</h1>
              <span className="font-bold text-lg">{totalBalance}</span>
            </div>
            <div className="flex justify-between items-center mt-5">
              <h1 className="font-bold text-lg">Used Balance:</h1>
              <span className="font-bold text-lg">
                {totalBalance - remainingBalance}
              </span>
            </div>
            <div className="flex justify-between items-center mt-5">
              <h1 className="font-bold text-lg">Remaining Balance:</h1>
              <span className="font-bold text-lg">{remainingBalance}</span>
            </div>
          </div>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default BalancesCard;
