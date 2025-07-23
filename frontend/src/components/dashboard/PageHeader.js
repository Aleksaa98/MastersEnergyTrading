import React from "react";

const PageHeader = ({ title, description }) => {
  return (
    <div className="text-center page-header">
      <h1 className="mb-3">{title}</h1>
      <p className="lead">{description}</p>
    </div>
  );
};

export default PageHeader;