import React from 'react';
import { Card, CardBody, Button, CardTitle, CardSubtitle, Table,Badge  } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters,faBatteryFull, faPlus, faGear, faTrash, faBatteryEmpty, faBatteryQuarter } from "@fortawesome/free-solid-svg-icons";

const getBatteryIcon = (percentage) => {
  if (percentage < 25) {
    return <FontAwesomeIcon icon={faBatteryEmpty} className="text-danger" />;
  } else if (percentage >= 25 && percentage < 50) {
    return <FontAwesomeIcon icon={faBatteryQuarter} className="text-warning" />;
  } else if (percentage >= 50 && percentage <= 75) {
    return <FontAwesomeIcon icon={faBatteryThreeQuarters} className="text-info" />;
  } else {
    return <FontAwesomeIcon icon={faBatteryFull} className="text-success" />;
  }
};

const BatteryTable = ({ tableData, onEdit, onAddBattery, onDelete }) => { 

  const handleEdit = (battery) => {
    if (onEdit) {
      onEdit(battery);
    }
  };

  const handleDelete = (batteryId) => {
    if (onDelete) {
      onDelete(batteryId);
    }
  };

  return (
    <div>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <CardTitle tag="h5">Battery Listing</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                Overview of battery states
              </CardSubtitle>
            </div>
            <Button color="success" onClick={onAddBattery}>
              <FontAwesomeIcon icon={faPlus} /> Add Battery
            </Button>
          </div>
          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Percentage</th>
                <th>Capacity</th>
                <th>State Of Charge</th>
                <th>Status</th>
                <th>Trading Strategy</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>
                    <div className="d-flex align-items-center p-2">
                      <td>
                        <div>{getBatteryIcon(((tdata.stateOfCharge / tdata.capacity) * 100))}</div>
                      </td>
                      <div className="ms-2">
                        <h6 className="mb-0">{tdata.capacity ? ((tdata.stateOfCharge / tdata.capacity) * 100).toFixed(1) : 'N/A'} %</h6>
                      </div>
                    </div>
                  </td>
                  <td>{tdata.capacity}</td>
                  <td>{tdata.stateOfCharge}</td>
                  <td>
                  <div className="d-flex align-items-center">
                      <Badge color={
                        tdata.state === "charging" ? "success" :
                        tdata.state === "blocked" ? "danger" :
                        tdata.state === "idle" ? "warning" :
                        "secondary"
                      }>
                        {tdata.state.charAt(0).toUpperCase() + tdata.state.slice(1)}
                      </Badge>
                    </div>
                  </td>
                  <td>{tdata.tradingStrat}</td>
                  <td>
                    <Button 
                      className="btn" 
                      color="warning" 
                      onClick={() => handleEdit(tdata)} // Pass the whole battery object
                    >
                      <FontAwesomeIcon icon={faGear} /> 
                    </Button>
                    
                    <Button 
                      className="btn" 
                      color="danger" 
                      onClick={() => handleDelete(tdata.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> 
                    </Button>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default BatteryTable;
