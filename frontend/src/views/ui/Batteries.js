import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserBatteries,
  createBattery,
  updateBattery,
  deleteBattery,
} from "../../store/batterySlice";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import BatteryTable from "../../components/dashboard/BatteryTable";
import {
  Card,
  Button,
  CardBody,
  CardTitle,
  CardSubtitle,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import PageHeader from "../../components/dashboard/PageHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { BATTERY_STATES } from "../../constants";
import axios from "axios";

const initialBatteryData = {
  capacity: "",
  stateOfCharge: "",
  state: BATTERY_STATES.IDLE,
  tradingStrat: "",
};

const Batteries = () => {
  const token = Cookies.get("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { userBatteries, loading } = useSelector((state) => state.battery);
  const [strategies, setStrategies] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBatteryId, setSelectedBatteryId] = useState("");
  const [batteryData, setBatteryData] = useState(initialBatteryData);

  const refreshBatteries = useCallback(() => {
    if (user) {
      dispatch(fetchUserBatteries({ userId: user._id, token }));
    } else {
      navigate("/login");
    }
  }, [dispatch, user, token, navigate]);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/tradingStrategies"
        );
        const fetchedStrategies = response.data;
        const noStrategy = fetchedStrategies.find(s => s.name === 'No-Strategy');
        const otherStrategies = fetchedStrategies.filter(s => s.name !== 'No-Strategy');
        const orderedStrategies = noStrategy ? [noStrategy, ...otherStrategies] : otherStrategies;
        setStrategies(orderedStrategies);
      } catch (error) {
        console.error("Error fetching strategies:", error);
      }
    };

    fetchStrategies();
    refreshBatteries();
  }, [refreshBatteries]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBatteryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleAdd = () => {
    setIsEditing(false);
    const noStrategy = strategies.find(s => s.name === 'No-Strategy');
    setBatteryData({
      ...initialBatteryData,
      tradingStrat: noStrategy ? noStrategy._id : ''
    });
    toggleModal();
  };

  const handleEdit = (battery) => {
    setIsEditing(true);
    setSelectedBatteryId(battery.id);
    setBatteryData({
      capacity: battery.capacity,
      stateOfCharge: battery.stateOfCharge,
      state: battery.state,
      tradingStrat: battery.tradingStrat,
    });
    toggleModal();
  };

  const handleDelete = (batteryId) => {
    dispatch(deleteBattery({ batteryId, token })).then(() => {
      refreshBatteries();
    });
  };

  const handleSubmit = () => {
    const action = isEditing
      ? updateBattery({
          batteryId: selectedBatteryId,
          updateData: batteryData,
          token,
        })
      : createBattery({
          batteryData: { ...batteryData, traderId: user._id },
          token,
        });

    dispatch(action).then(() => {
      refreshBatteries();
      toggleModal();
    });
  };

  if (loading) {
    return <p>Loading batteries...</p>;
  }

  const tableData = userBatteries.map((battery) => ({
    id: battery._id,
    capacity: battery.capacity,
    stateOfCharge: battery.stateOfCharge,
    state: battery.state,
    tradingStrat:
      strategies.find((s) => s._id === battery.tradingStrat)?.name ||
      "Not Set",
  }));

  return (
    <div className="custom-view-wrapper">
      <PageHeader
        title="Your Batteries"
        description="Here you can manage your batteries."
      />
      {userBatteries.length === 0 ? (
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <CardTitle tag="h5">Battery Listing</CardTitle>
                <CardSubtitle className="mb-2 text-muted" tag="h6">
                  There are no batteries enlisted to you
                </CardSubtitle>
              </div>
              <Button color="success" onClick={handleAdd}>
                <FontAwesomeIcon icon={faPlus} /> Add Battery
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <BatteryTable
          tableData={tableData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddBattery={handleAdd}
        />
      )}

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {isEditing ? "Edit Battery" : "Add New Battery"}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="capacity">Capacity</Label>
            <Input
              type="number"
              name="capacity"
              id="capacity"
              value={batteryData.capacity}
              onChange={handleInputChange}
              disabled={isEditing}
            />
          </FormGroup>
          <FormGroup>
            <Label for="stateOfCharge">State of Charge</Label>
            <Input
              type="number"
              name="stateOfCharge"
              id="stateOfCharge"
              value={batteryData.stateOfCharge}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="state">State</Label>
            <Input
              type="select"
              name="state"
              id="state"
              value={batteryData.state}
              onChange={handleInputChange}
            >
              {Object.values(BATTERY_STATES).map((state) => (
                <option key={state} value={state}>
                  {state.charAt(0).toUpperCase() + state.slice(1)}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="tradingStrat">Trading Strategy</Label>
            <Input
              type="select"
              name="tradingStrat"
              id="tradingStrat"
              value={batteryData.tradingStrat}
              onChange={handleInputChange}
            >
              {strategies.map((strategy) => (
                <option key={strategy._id} value={strategy._id}>
                  {strategy.name}
                </option>
              ))}
            </Input>
          </FormGroup>
          <Button color="primary" onClick={handleSubmit}>
            {isEditing ? "Update Battery" : "Add Battery"}
          </Button>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Batteries;
