import Chart from 'react-apexcharts';
import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from "react";
import { fetchPredictedPrices } from '../../store/pricesSlice';

const PredictedPricesGraph = () => {
  const dispatch = useDispatch();
  const { predicted24 = [] } = useSelector(state => state.prices ?? {});

  useEffect(() => {
    dispatch(fetchPredictedPrices());
  }, [dispatch]);

  const predictedDates = useMemo(() => [...predicted24].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)), [predicted24]);
  const predictedPrices = useMemo(() => predictedDates.map(item => item.price), [predictedDates]);

  const todayFormatted = useMemo(() => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  const predictedTimeList = useMemo(() => predictedDates.map(item => {
    const dateObj = new Date(item.timestamp);
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }), [predictedDates]);

  const options = {
    chart: {
      type: 'area',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    xaxis: {
      categories: predictedTimeList,
      tickPlacement: 'on',
      labels: {
        rotate: -45,
        rotateAlways: true,
        style: {
          fontSize: '10px',
        }
      }
    },
    yaxis: {
      title: {
        text: 'Price (€)',
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    legend: {
      show: true,
    },
    grid: {
      show: true,
      borderColor: '#e0e0e0',
      strokeDashArray: 5,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#009efb'],
        inverseColors: true,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    colors: ["#009efb"],
  };

  const series = [
    {
      name: "Predicted prices",
      data: predictedPrices,
    },
  ];

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Predicted Prices</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          Next 24 hours
        </CardSubtitle>
        <Chart options={options} series={series} type="area" height="500" />
      </CardBody>
    </Card>
  );
};

export default PredictedPricesGraph;
