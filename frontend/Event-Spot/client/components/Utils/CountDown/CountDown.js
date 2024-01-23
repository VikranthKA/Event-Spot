import React from 'react';
import CountdownClock from 'react-countdown-clock';

const CountDown = ({ ticketSaleStartTime }) => {
  const calculateRemainingTime = () => {
    const targetTime = new Date(ticketSaleStartTime).getTime();
    const currentTime = new Date().getTime();
    return Math.max(0, targetTime - currentTime);
  };

  return (
    <div className='countDown'>
      <CountdownClock
        seconds={calculateRemainingTime() / 1000}
        color="#004777"
        alpha={0.9}
        size={50} // Adjust the size as needed
        onComplete={() => console.log('Countdown completed')}
      />
    </div>
  );
};

export default CountDown;
