import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBatteries, createBattery,updateBattery,deleteBattery } from '../../store/batterySlice';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import BatteryTable from '../../components/dashboard/BatteryTable';
import { Card, Button, CardBody, CardTitle, CardSubtitle, Modal, ModalHeader, ModalBody, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Batteries = () => {
  const token = Cookies.get('token');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { userBatteries, loading } = useSelector((state) => state.battery);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBatteryId, setSelectedBatteryId] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [batteryData, setBatteryData] = useState({
    capacity: '',
    stateOfCharge: '',
    traderId: user ? user._id : '',
    state: 'idle',
    tradingStrat: ''
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchUserBatteries({ userId: user._id, token }));
    } else {
      navigate('/login');
    }
  }, [dispatch, user, token, navigate,refresh]);

  const handleInputChange = (e) => {
    setBatteryData({
      ...batteryData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateBattery = async () => {
    toggleModal();
    dispatch(updateBattery({ batteryId: selectedBatteryId, updateData: batteryData,token: token }));
    dispatch(fetchUserBatteries({ userId: user._id, token }));
    setIsEditing(false);
    setSelectedBatteryId("");
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleAddBattery = async () => {
    // Perform the add action
    dispatch(createBattery({ batteryData: { ...batteryData, ownerId: user._id }, token }));
    dispatch(fetchUserBatteries({ userId: user._id, token }));
    toggleModal(); // Close the modal after adding
    setRefresh(!refresh);
  };

  const handleEdit = (battery) => {
    setBatteryData({
      capacity: battery.capacity,
      stateOfCharge: battery.stateOfCharge,
      traderId: user ? user._id : '',
      state: battery.state,
      tradingStrat: battery.tradingStrat,
    });
    setSelectedBatteryId(battery.id);
    setIsEditing(true); // Set editing mode
    toggleModal(); // Open modal after setting the state
  };

  const handleAdd = () => {
    setBatteryData({
      capacity: '',
      stateOfCharge: '',
      traderId: user ? user._id : '',
      state: 'idle',
      tradingStrat: ''
    });
    setIsEditing(false);
    toggleModal();
  }
  
  // Handle delete (for future implementation)
  const handleDelete = (batteryId) => {
    dispatch(deleteBattery({ batteryId: batteryId, token: token }));
    dispatch(fetchUserBatteries({ userId: user._id, token: token }));
    setRefresh(!refresh);
  };

  if (loading) {
    return <p>Loading batteries...</p>;
  }

  if (userBatteries.length === 0) {
    return (
      <div>
        <h1>Your Batteries</h1>
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

        <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add New Battery</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="capacity">Capacity</Label>
            <Input
              type="number"
              name="capacity"
              id="capacity"
              value={batteryData.capacity}
              onChange={handleInputChange}
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
            <Label for="tradingStrat">Trading Strategy</Label>
            <Input
              type="text"
              name="tradingStrat"
              id="tradingStrat"
              value={batteryData.tradingStrat}
              onChange={handleInputChange}
            />
          </FormGroup>
          <Button color="primary" onClick={handleAddBattery}>
            Add Battery
          </Button>
        </ModalBody>
      </Modal>
      </div>
    );
  }

  // Prepare table data for display
  const tableData = userBatteries.map(battery => ({
    id: battery._id,
    capacity: battery.capacity,
    stateOfCharge: battery.stateOfCharge,
    state: battery.state,
    tradingStrat: battery.tradingStrat
  }));

  return (
    <div>
      <h1>Your Batteries</h1>
      <BatteryTable 
        tableData={tableData} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onAddBattery={handleAdd}  // Open modal for adding battery
      />
              <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>{isEditing ? 'Edit Battery' : 'Add New Battery'}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="capacity">Capacity</Label>
            <Input
              type="number"
              name="capacity"
              id="capacity"
              value={batteryData.capacity}
              onChange={handleInputChange}
              disabled={isEditing} // Disable capacity field during edit
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
              <option value="idle">Idle</option>
              <option value="charging">Charging</option>
              <option value="discharging">Discharging</option>
              <option value="blocked">Blocked</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="tradingStrat">Trading Strategy</Label>
            <Input
              type="text"
              name="tradingStrat"
              id="tradingStrat"
              value={batteryData.tradingStrat}
              onChange={handleInputChange}
            />
          </FormGroup>
          <Button color="primary" onClick={isEditing ? handleUpdateBattery : handleAddBattery}>
            {isEditing ? 'Update Battery' : 'Add Battery'}
          </Button>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Batteries;
