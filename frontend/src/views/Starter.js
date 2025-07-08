import { Col, Row } from "reactstrap";
import { useSelector } from "react-redux";
import Feeds from "../components/dashboard/Feeds";
import PricesGraph from "../components/dashboard/PricesGraph";
import AveragePriceWidget from "../components/dashboard/AveragePriceWidget";

import Blog from "../components/dashboard/Blog";
import bg1 from "../assets/images/bg/bg1.jpg";
import bg2 from "../assets/images/bg/bg2.jpg";
import bg3 from "../assets/images/bg/bg3.jpg";
import bg4 from "../assets/images/bg/bg4.jpg";

const BlogData = [
  {
    image: bg1,
    title: "This is simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg2,
    title: "Lets be simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg3,
    title: "Don't Lamp blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg4,
    title: "Simple is beautiful",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
];

const Starter = () => {
  const { actual } = useSelector((state) => state.prices);
  const averagePrice = actual.length > 0 ? actual.reduce((acc, price) => acc + price, 0) / actual.length : 0;

  return (
    <div>
      {/***Top Cards***/}
      {/***Sales & Feed***/}
      <Row>
        <Col lg="9">
          <PricesGraph />
        </Col>
        <Col xl="3">
          <Feeds />
          <AveragePriceWidget averagePrice={averagePrice} />
        </Col>
      </Row>

      {/***Table ***/}
      {/***Blog Cards***/}
      <Row>
        {BlogData.map((blg, index) => (
          <Col sm="6" lg="6" xl="3" key={index}>
            <Blog
              image={blg.image}
              title={blg.title}
              subtitle={blg.subtitle}
              text={blg.description}
              color={blg.btnbg}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Starter;
