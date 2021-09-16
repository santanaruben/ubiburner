import React, { useState, useEffect } from "react";

const TApp = ({ speed, msg }) => {
  const Typer = ({ speed = 250, children = "Hello" }) => {
    const [idx, setidx] = useState(0);
    useEffect(() => {
      const timer = window.setInterval(() => setidx((v) => v + 1), speed);
      return () => window.clearInterval(timer);
    });

    return <>{children.substr(0, idx)}</>;
  };
  return (
    <>
      <Typer speed={speed} children={msg}></Typer>
    </>
  );
};

export default TApp;
