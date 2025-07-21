import Chart from 'react-apexcharts';
import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from "react";
import { fetchPricesData } from '../../store/pricesSlice';

const PriceChart = () => {

  const dispatch = useDispatch();
  const { actual = [], predicted = [] } = useSelector(state => state.prices ?? {});

  useEffect(() => {
      dispatch(fetchPricesData());
  }, [dispatch]);

  const actualDates = useMemo(() => [...actual].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)), [actual]);
  const predictedDates = useMemo(() => [...predicted].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)), [predicted]);

  const prices = useMemo(() => actualDates.map(item => item.price), [actualDates]);
  const shiftedPrices = useMemo(() => {
    const pricesPredicted = predictedDates.map(item => item.price);
    return Array(8).fill(null).concat(pricesPredicted);
  }, [predictedDates]);

  const todayFormatted = useMemo(() => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  const timeList = useMemo(() => actualDates.map(item => {
    const dateObj = new Date(item.timestamp);
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }), [actualDates]);

  const predictedTimeList = useMemo(() => predictedDates.map(item => {
    const dateObj = new Date(item.timestamp);
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }), [predictedDates]);

  const time = useMemo(() => timeList.concat(predictedTimeList), [timeList, predictedTimeList]);

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
