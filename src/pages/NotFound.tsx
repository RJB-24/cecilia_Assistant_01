
import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-groqflow-lightgray">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-groqflow-navy">404</h1>
        <p className="text-xl mb-6 text-gray-600">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="mb-8 text-gray-500">
          The assistant couldn't find the requested resource.
        </p>
        <Button asChild className="bg-groqflow-navy hover:bg-groqflow-navy/80">
          <NavLink to="/">Return to Dashboard</NavLink>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
