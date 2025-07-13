import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';

const Feeds = () => {

   const { actual = []} = useSelector(state => state.prices ?? {});
   
   const mostRecent = actual.length > 0 ? actual[actual.length-1].price : 'N/A';

     const getCardConfig = (price) => {
    if (price < 6) {
      return {
        className: 'bg-success text-white',
        message: 'Perfect time to charge your batteries.'
      };
    }
    if (price < 8) {
      return {
        className: 'bg-warning text-dark',
        message: 'Price is mid-range — better to stay passive or sell and turn off charging.'
      };
    }
    return {
      className: 'bg-danger text-white',
      message: 'High price! Consider selling energy or pausing battery activity.'
    };
  };

  const config = mostRecent !== null ? getCardConfig(mostRecent) : {};
     return (
    <Card className={`mb-3 ${config.className ?? ''}`}>
      <CardBody>
        <CardTitle tag="h1" className="text-center">{mostRecent}$</CardTitle>
        <CardText className="text-center">
          per kWh
        </CardText>
                <CardText className="text-center">
          {mostRecent !== null ? config.message : 'Fetching price...'}
        </CardText>
      </CardBody>
    </Card>
  );
};

export default Feeds;
