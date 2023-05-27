import React from "react";
import { screen, render, fireEvent, within } from "@testing-library/react";

import Tables from "../ components/Table";

import "@testing-library/jest-dom";

import "./matchMedia.js";

// Mock fetchData function
import * as fetchData from "../utils/fetchData";

describe("Table", () => {
  //   beforeEach(() => {
  //     //@ts-ignore

  //   });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    render(<Tables />);
    expect(screen.getByText("...loading")).toBeInTheDocument();
  });

  test("renders table with data after loading", async () => {
    const mockData = [
      { key: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
      { key: "2", name: "Jane Smith", email: "jane@example.com", role: "User" },
    ];

    // Mock the fetchData function to return mock data

    //@ts-ignore
    jest.spyOn(fetchData, "default").mockResolvedValue({ data: mockData });

    // fetchData.default.mockResolvedValue({ data: mockData });

    render(<Tables />);

    // Wait for data to be loaded
    await screen.findByRole("row", { name: /John Doe/i });

    // Check if table rows are rendered with correct data
    expect(screen.getByRole("row", { name: /John Doe/i })).toBeInTheDocument();
    expect(
      screen.getByRole("row", { name: /Jane Smith/i })
    ).toBeInTheDocument();
  });

  test("selects rows and deletes selected rows", async () => {
    const mockData = [
      { key: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
      { key: "2", name: "Jane Smith", email: "jane@example.com", role: "User" },
    ];

    // Mock the fetchData function to return mock data
    //@ts-ignore
    jest.spyOn(fetchData, "default").mockResolvedValue({ data: mockData });

    render(<Tables />);

    // Wait for data to be loaded
    await screen.findByRole("row", { name: /John Doe/i });

    // Select rows

    const row1 = screen.getByRole("row", {
      name: /john doe john@example\.com admin/i,
    });

    const user_1 = within(row1).getByRole("checkbox");
    fireEvent.click(user_1);

    const row2 = screen.getByRole("row", {
      name: /jane smith jane@example\.com user/i,
    });

    const user_2 = within(row2).getByRole("checkbox");
    fireEvent.click(user_2);
    // fireEvent.click(screen.getByRole("checkbox", { name: /Jane Smith/i }));

    // Check if selected rows are marked
    expect(user_1).toBeChecked();
    expect(user_2).toBeChecked();

    // Click delete button
    fireEvent.click(screen.getByText("Delete Selected"));

    // Check if selected rows are deleted
    expect(row1).not.toBeInTheDocument();
    expect(row2).not.toBeInTheDocument();
  });

  test("opens edit modal and updates data", async () => {
    const mockData = [
      { key: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
    ];

    // Mock the fetchData function to return mock data
    //@ts-ignore
    jest.spyOn(fetchData, "default").mockResolvedValue({ data: mockData });

    render(<Tables />);

    // Wait for data to be loaded
    await screen.findByRole("row", { name: /John Doe/i });

    // Click edit button
    const editBtn = screen.getByTestId("editBtn");
    expect(editBtn).toBeInTheDocument();

    fireEvent.click(editBtn);

    // Check if edit modal is opened
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Update Name field
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Updated Name" },
    });

    // Update Email field
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "updated@example.com" },
    });

    const submitBtn = screen.getByRole("button", {
      name: /submit/i,
    });

    expect(submitBtn).toBeInTheDocument();

    fireEvent.click(submitBtn);
  });

  test("delete single user", async () => {
    const mockData = [
      { key: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
    ];

    // Mock the fetchData function to return mock data
    //@ts-ignore
    jest.spyOn(fetchData, "default").mockResolvedValue({ data: mockData });

    render(<Tables />);

    // Wait for data to be loaded
    await screen.findByRole("row", { name: /John Doe/i });

    const delteBtn = screen.getByTestId("delteBtn");
    expect(delteBtn).toBeInTheDocument();

    fireEvent.click(delteBtn);
  });
});
