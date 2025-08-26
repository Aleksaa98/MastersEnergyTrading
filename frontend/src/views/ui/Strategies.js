import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Col,
  Row,
  Button,
  Alert,
} from "reactstrap";
import axios from "axios";
import PageHeader from "../../components/dashboard/PageHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faClock,
  faBatteryHalf,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBatteries, updateBattery } from "../../store/batterySlice";
import Cookies from "js-cookie";

const strategyIcons = {
  "Price-Based": faChartLine,
  "Time-Based": faClock,
  "Protective": faBatteryHalf,
};

const Strategies = () => {
  const [strategies, setStrategies] = useState([]);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
  });
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userBatteries } = useSelector((state) => state.battery);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/tradingStrategies"
        );
        const filteredStrategies = response.data.filter(
          (s) => s.name !== "No-Strategy"
        );
        setStrategies(filteredStrategies);
      } catch (error) {
        console.error("Error fetching strategies:", error);
      }
    };

    fetchStrategies();
    if (user) {
      dispatch(fetchUserBatteries({ userId: user._id, token }));
    }
  }, [dispatch, user, token]);

  const handleSelectStrategy = async (strategyId, strategyName) => {
    const updatePromises = userBatteries.map((battery) =>
      dispatch(
        updateBattery({
          batteryId: battery._id,
          updateData: { tradingStrat: strategyId },
          token,
        })
      )
    );

    try {
      await Promise.all(updatePromises);
      setNotification({
        visible: true,
        message: `Successfully set all batteries to the "${strategyName}" strategy.`,
      });
      setTimeout(() => {
        setNotification({ visible: false, message: "" });
      }, 3000);
    } catch (error) {
      console.error("Failed to update one or more batteries:", error);
    }
  };

  return (
    <div className="custom-view-wrapper">
      <PageHeader
        title="Our Trading Strategies"
        description="Choose a strategy that aligns with your risk tolerance and energy goals."
      />
      {notification.visible && (
        <Alert color="success">{notification.message}</Alert>
      )}
      <Row>
        {strategies.map((strategy) => (
          <Col md="4" key={strategy._id}>
            <Card className="h-100 text-center shadow-sm strategy-card">
              <CardBody className="d-flex flex-column">
                <div className="mb-4">
                  <FontAwesomeIcon
                    icon={strategyIcons[strategy.type]}
                    size="3x"
                    className="text-primary"
                  />
                </div>
                <CardTitle tag="h4" className="mb-3">
                  {strategy.name}
                </CardTitle>
                <CardText className="text-muted flex-grow-1">
                  {strategy.description}
                </CardText>
                {user && (
                  <Button
                    color="primary"
                    outline
                    className="mt-4"
                    onClick={() =>
                      handleSelectStrategy(strategy._id, strategy.name)
                    }
                  >
                    Select Strategy
                  </Button>
                )}
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
      <Alert color="info" className="mt-4">
        <strong>Note:</strong> You can also set a specific trading strategy for
        each battery individually on the "Battery" page.
      </Alert>
    </div>
  );
};

export default Strategies;