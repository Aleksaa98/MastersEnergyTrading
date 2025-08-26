import { Col, Row } from "reactstrap";
import { useSelector } from "react-redux";
import Feeds from "../components/dashboard/Feeds";
import PricesGraph from "../components/dashboard/PricesGraph";
import MarketNews from "../components/dashboard/MarketNews";
import bg1 from "../assets/images/energy/8res.jpg";
import bg2 from "../assets/images/energy/wind_turbine.jpg";
import bg3 from "../assets/images/bg/bg3.jpg";
import bg4 from "../assets/images/bg/bg4.jpg";

const MarketNewsData = [
  {
    image: bg1,
    title: "Enhancing Grid Stability",
    subtitle: "Energy Today, 1h ago",
    description:
      "The data helps grid operators calculate power demand in their networks.",
    btnbg: "primary",
    link: "https://www.innovations-report.com/engineering/power-and-electrical-engineering/grid-stability-precise-forecasts-196893/",
  },
  {
    image: bg2,
    title: "New Wind Farm Opens",
    subtitle: "CNBC, 3h ago",
    description:
      "The new offshore wind farm 'SeaBreeze' is now operational, adding 500 MW to the national grid.",
    btnbg: "primary",
    link: "https://www.cnbc.com/2023/08/23/the-worlds-largest-floating-wind-farm-is-officially-open.html",
  },
  {
    image: bg3,
    title: "Energy Prices Drop",
    subtitle: "TechInvest, 1d ago",
    description:
      "A breakthrough in battery technology has caused a significant drop in energy prices.",
    btnbg: "primary",
    link: "https://www.energy-storage.news/behind-the-numbers-bnef-finds-40-year-on-year-drop-in-bess-costs/",
  },
  {
    image: "https://images.pexels.com/photos/3044470/pexels-photo-3044470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Government Announces Rebates",
    subtitle: "National News, 2d ago",
    description:
      "New government rebates for homes with solar panels and battery storage.",
    btnbg: "primary",
    link: "https://www.canada.ca/en/department-finance/news/2025/06/government-confirms-non-taxability-of-canada-carbon-rebates-for-small-businesses.html",
  },
];

const Starter = () => {
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
        </Col>
      </Row>

      {/***Table ***/}
      {/***Blog Cards***/}
      <Row>
        {MarketNewsData.map((news, index) => (
          <Col sm="6" lg="6" xl="3" key={index}>
            <MarketNews
              image={news.image}
              title={news.title}
              subtitle={news.subtitle}
              text={news.description}
              color={news.btnbg}
              link={news.link}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Starter;
