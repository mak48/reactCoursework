import React from "react";
import { render, screen } from "@testing-library/react";
import ReviewCard from "./ReviewCard";
import ProfilePage from "./ProfilePage";
import { BrowserRouter } from "react-router";

describe("ReviewCard Component", () => {
  it("renders without crashing", () => {
    <BrowserRouter>
      render(
      <ProfilePage />
      );
    </BrowserRouter>;
  });
});
