import React from "react";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";

const AveragePriceWidget = ({ averagePrice }) => {
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Average Day Price</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          Today's average energy price
        </CardSubtitle>
        <div className="d-flex align-items-center mt-3">
          <h2 className="mb-0">${averagePrice.toFixed(2)}</h2>
        </div>
      </CardBody>
    </Card>
  );
};

export default AveragePriceWidget;
