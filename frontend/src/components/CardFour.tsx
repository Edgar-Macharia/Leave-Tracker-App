import { useEffect, useState } from "react";
import { useLeave } from "../context/LeaveContext";
import { Chart } from "primereact/chart";

const CardFour = () => {
  const [chartData, setChartData] = useState<any>();
  const [noResults, setNoResults] = useState<any>();
  const [Data, setData] = useState<string[]>([]);
  const [chartOptions, setChartOptions] = useState({});
  const [barChartDatas, setBarChartData] = useState({});
  const [barChartOptions, setBarChartOptions] = useState({});

  const { getAllLeaves } = useLeave();
  useEffect(() => {
    getAllLeaves()
      .then((data) => {
        const labels = [
          "AnnualLeave",
          "SickLeave",
          "Paternity",
          "Maternity",
          "Marriage",
          "Leave Without Pay",
          "Excused Leave",
          "Beareavement",
          "Other",
        ];
        const approved = data.filter((d)=> d.status === 'Approved')
        const annualLeave = approved.filter((d) => d.leaveType === "Annual leave");
        const sickLeave = approved.filter(
          (d) =>
            d.leaveType === "Sick leave - Home Rest" ||
            d.leaveType === "Sick leave - Doctor's Recommendation"
        );
        const paternity = approved.filter((d) => d.leaveType === "Paternity");
        const maternity = approved.filter((d) => d.leaveType === "Maternity");
        const marriage = approved.filter((d) => d.leaveType === "Marriage");
        const leaveWithoutPay = approved.filter(
          (d) => d.leaveType === "Leave without pay"
        );
        const excusedLeave = approved.filter(
          (d) => d.leaveType === "Excused leave"
        );
        const bereavement = approved.filter((d) => d.leaveType === "Bereavement");
        const other = approved.filter((d) => d.leaveType === "other");
        const documentStyle = getComputedStyle(document.documentElement);

        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue(
          "--text-color-secondary"
        );
        const surfaceBorder =
          documentStyle.getPropertyValue("--surface-border");

        const chartData = {
          datasets: [
            {
              data: [
                annualLeave.length,
                sickLeave.length,
                paternity.length,
                maternity.length,
                marriage.length,
                leaveWithoutPay.length,
                excusedLeave.length,
                bereavement.length,
                other.length,
              ],
              backgroundColor: [
                documentStyle.getPropertyValue("--blue-500"),
                documentStyle.getPropertyValue("--yellow-500"),
                documentStyle.getPropertyValue("--green-500"),
                documentStyle.getPropertyValue("--gray-500"),
                "#000080",
                "#40E0D0",
                documentStyle.getPropertyValue("--purple-500"),
                "#800000",
                "#FF4500",
              ],
              hoverBackgroundColor: [
                documentStyle.getPropertyValue("--blue-400"),
                documentStyle.getPropertyValue("--yellow-400"),
                documentStyle.getPropertyValue("--green-400"),
                documentStyle.getPropertyValue("--gray-500"),
                "#000080",
                "#40E0D0",
                documentStyle.getPropertyValue("--purple-500"),
                "#800000",
                "#FF4500",
              ],
            },
          ],
        };
        const options = {
          cutout: "50%",
          scales: {
            x: {
              grid: {
                display: true,
              },
            },
          },
        };
        const noResults:any = chartData?.datasets[0]?.data.filter((f)=>  f > 0 )
        
        
        setNoResults(noResults)
        setChartData(chartData);
        setData(labels);

        setChartOptions(options);

        const barChartData = {
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
          datasets: [
            {
              label: "Total Monthly Leaves",
              backgroundColor: documentStyle.getPropertyValue("--blue-500"),
              borderColor: documentStyle.getPropertyValue("--blue-500"),
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
          ],
        };
        var total = data.filter((f) => f.status === "Approved");
        var jan: any = total.filter(
          (f) => Number(f.startDate.split("")[0]) === 0
        );
        var feb: any = total.filter(
          (f) => Number(f.startDate.split("")[0]) === 1
        );
        var m: any = total.filter(
          (f) => Number(f.startDate.split("")[0]) === 2
        );
        var ap: any = total.filter(
          (f) => Number(f?.startDate.split("")[0]) === 3
        );
        var may: any = total.filter(
          (f) => Number(f.startDate.split("")[0]) === 4
        );
        var j: any = total.filter(
          (f) => Number(f.startDate.split("")[0]) === 5
        );
        var ju: any = total.filter(
          (f) => Number(f.startDate.split("")[0]) === 6
        );
        var a: any = total.filter(
          (f) => Number(f.startDate.split("")[0]) === 7
        );
        var s: any = total.filter(
          (f) => Number(f.startDate.split("")[0]) === 8
        );
        var o: any = total.filter(
          (f) => Number(f.startDate.split("")[0]) === 9
        );
        var n: any = total.filter(
          (f) => Number(f.startDate.split("")[0]) === 10
        );
        var d: any = total.filter(
          (f) => Number(f.startDate.split("")[0]) === 11
        );

        total.map((f) => {
          const arr = f.startDate.split("");
          const i = Number(arr[0]);

          if (i === 0) {
            barChartData.datasets[0].data[i - 1] = jan.length;
          } else if (i === 1) {
            barChartData.datasets[0].data[i - 1] = feb.length;
          } else if (i === 2) {
            barChartData.datasets[0].data[i - 1] = m.length;
          } else if (i === 3) {
            barChartData.datasets[0].data[i - 1] = ap.length;
          } else if (i === 4) {
            barChartData.datasets[0].data[i - 1] = may.length;
          } else if (i === 5) {
            barChartData.datasets[0].data[i - 1] = j.length;
          } else if (i === 6) {
            barChartData.datasets[0].data[i - 1] = ju.length;
          } else if (i === 7) {
            barChartData.datasets[0].data[i - 1] = a.length;
          } else if (i === 8) {
            barChartData.datasets[0].data[i - 1] = s.length;
          } else if (i === 9) {
            barChartData.datasets[0].data[i - 1] = o.length;
          } else if (i === 10) {
            barChartData.datasets[0].data[i - 1] = n.length;
          } else if (i === 11) {
            barChartData.datasets[0].data[i - 1] = d.length;
          }
        });

        const barOptions = {
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
            legend: {
              labels: {
                fontColor: textColor,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: textColorSecondary,
                font: {
                  weight: 500,
                },
              },
              grid: {
                display: false,
                drawBorder: false,
              },
            },
            y: {
              ticks: {
                color: textColorSecondary,
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false,
              },
            },
          },
        };
        setBarChartData(barChartData);
        setBarChartOptions(barOptions);
      })
      .catch((error) => console.error("Error fetching leave data:", error));
  }, [getAllLeaves]);
  
  return (
    <div className="md:flex md:justify-between md:items-center p-10 my-5 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div>
        <h1 className="font-bold text-lg mb-5">Total Monthly Leaves</h1>

        <Chart
          type="bar"
          data={barChartDatas}
          options={barChartOptions}
          className="xl:h-80 xl:w-150 md:50 md:w-75 h-auto w-auto"
        />
      </div>

      <div>
        <h1 className="font-bold text-lg mb-5">Leave Types</h1>
          {noResults?.length ? 
        <div className="flex md:flex xl:flex justify-center items-center">
            <Chart
              type="doughnut"
              data={chartData}
              options={chartOptions}
              className="xl:h-80 xl:w-100 md:50 md:w-75 h-50 w-75"
            />
          
          <div>
            {Data.map((label: string, index): any => (
              <div
                key={index}
                className="flex gap-10 justify-start items-center "
              >
                <span
                  className="px-2 py-[.5px] rounded-xl"
                  style={{
                    backgroundColor:
                      chartData.datasets[0].backgroundColor[index],
                  }}
                ></span>
                <p className="text-[11px]">{label}</p>
              </div>
            ))}
          </div>
          
        </div>
        : (
          <div className="xl:h-80 xl:w-100 md:50 md:w-75 h-50 w-75 ">No results found!</div>
        )}
        
      </div>
      
    </div>
  );
};

export default CardFour;
