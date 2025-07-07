import Chart from 'react-apexcharts';
import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { fetchPricesData } from '../../store/pricesSlice';

const PriceChart = () => {

  const dispatch = useDispatch();
  const { actual = [], predicted = [] } = useSelector(state => state.prices ?? {});

  const actualDates = [...actual].sort((a, b) => new Date(a.date) - new Date(b.date));

  const predictedDates = [...predicted].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  useEffect(() => {
      dispatch(fetchPricesData());
  }, [dispatch]);

  const pricesPredicted = predictedDates.map(item => item.price);
  const shiftedPrices = Array(8).fill(null).concat(pricesPredicted);
  const prices = actualDates.map(item => item.price);
  const today = new Date();
  const todayFormatted = today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

const timeList = actualDates.map(item => {
  const dateObj = new Date(item.date);

  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
});

const predictedTimeList = predictedDates.map(item => {
  const dateObj = new Date(item.date);

  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
});

var time = timeList.concat(predictedTimeList);

  useEffect(() => {
    dispatch(fetchPricesData());
  }, [dispatch]);

    const options = {
    chart: {
      toolbar: {
        show: false,
      },
      stacked: true,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    legend: {
      show: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
        borderRadius: 2,
      },
    },
    colors: ["#0d6efd", "#009efb", "#6771dc"],
    xaxis: {
      categories: time,
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "60%",
              borderRadius: 7,
            },
          },
        },
      },
    ],
  };
  const series = [
    {
      name: "Noted prices",
      data: prices,
    },
    {
      name: "Predicted prices",
      data: shiftedPrices,
    },
  ];

    return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Sales Summary</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          {todayFormatted} 
        </CardSubtitle>
        <Chart options={options} series={series} type="bar" height="379" />
      </CardBody>
    </Card>
  );

};

export default PriceChart;
