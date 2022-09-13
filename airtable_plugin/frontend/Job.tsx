import React, { useEffect, useState } from "react";

export const JobItem = ({ record }) => {
  const [hydrated, setHydrated] = useState(false);

  //on first hit
  useEffect(() => {
    console.log("hydated");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      alert("Changed Record");
    }
  }, [record.getCellValue("stateString")]);

  return <div>{record.name}</div>;
};
