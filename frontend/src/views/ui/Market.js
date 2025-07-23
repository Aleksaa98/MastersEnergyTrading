import { Row, Col } from "reactstrap";
import PredictedPricesGraph from "../../components/dashboard/PredictedPricesGraph";
import PageHeader from "../../components/dashboard/PageHeader";

const Market = () => {
  return (
    <div>
      <PageHeader
        title="Market"
        description="Here you can see the predicted prices for the next 24 hours."
      />
      <Row>
        <Col xs="12">
          <PredictedPricesGraph />
        </Col>
      </Row>
    </div>
  );
};

export default Market;
