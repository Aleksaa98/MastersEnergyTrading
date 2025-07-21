import { Row, Col } from "reactstrap";
import PredictedPricesGraph from "../../components/dashboard/PredictedPricesGraph";

const Market = () => {
  return (
    <Row>
      <Col xs="12">
        <PredictedPricesGraph />
      </Col>
    </Row>
  );
};

export default Market;
