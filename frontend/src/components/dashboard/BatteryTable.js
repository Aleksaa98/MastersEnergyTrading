import React from "react";
import { Card, CardBody, Button, CardTitle, CardSubtitle, Table, Badge } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBatteryEmpty,
  faBatteryQuarter,
  faBatteryThreeQuarters,
  faBatteryFull,
  faPlus,
  faGear,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { BATTERY_STATES } from "../../constants";

const getBatteryIcon = (percentage) => {
  if (percentage < 25) {
    return <FontAwesomeIcon icon={faBatteryEmpty} className="text-danger" />;
  }
  if (percentage < 50) {
    return <FontAwesomeIcon icon={faBatteryQuarter} className="text-warning" />;
  }
  if (percentage <= 75) {
    return <FontAwesomeIcon icon={faBatteryThreeQuarters} className="text-info" />;
  }
  return <FontAwesomeIcon icon={faBatteryFull} className="text-success" />;
};

const getBadgeColor = (state) => {
  switch (state) {
    case BATTERY_STATES.CHARGING:
      return "success";
    case BATTERY_STATES.BLOCKED:
      return "danger";
    case BATTERY_STATES.IDLE:
      return "warning";
    default:
      return "secondary";
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
              {tableData.map(({ id, capacity, stateOfCharge, state, tradingStrat }) => {
                const percentage = capacity ? (stateOfCharge / capacity) * 100 : 0;
                return (
                  <tr key={id} className="border-top">
                    <td>
                      <div className="d-flex align-items-center p-2">
                        <div>{getBatteryIcon(percentage)}</div>
                        <div className="ms-2">
                          <h6 className="mb-0">{percentage.toFixed(1)} %</h6>
                        </div>
                      </div>
                    </td>
                    <td>{capacity}</td>
                    <td>{stateOfCharge}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Badge color={getBadgeColor(state)}>
                          {state.charAt(0).toUpperCase() + state.slice(1)}
                        </Badge>
                      </div>
                    </td>
                    <td>{tradingStrat}</td>
                    <td>
                      <Button
                        className="btn"
                        color="warning"
                        onClick={() => handleEdit({ id, capacity, stateOfCharge, state, tradingStrat })}
                      >
                        <FontAwesomeIcon icon={faGear} />
                      </Button>
                      <Button className="btn" color="danger" onClick={() => handleDelete(id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default BatteryTable;
