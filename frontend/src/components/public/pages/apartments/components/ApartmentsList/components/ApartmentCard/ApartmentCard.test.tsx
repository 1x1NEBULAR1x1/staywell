import "@testing-library/jest-dom";
import { ApartmentType } from "@shared/src/database";
import { render, screen } from "@testing-library/react";
import { ApartmentCard } from "./ApartmentCard";

describe("ApartmentCard", () => {
  const mockApartment = {
    id: "apartment-1",
    name: "Luxury Suite",
    description: "Beautiful luxury suite with amazing views",
    number: 101,
    type: ApartmentType.LUXURY,
    max_capacity: 4,
    floor: 3,
    rooms_count: 2,
    is_pet_friendly: true,
    is_smoking: false,
    is_available: true,
    is_excluded: false,
    image: "/uploads/apartments/luxury-suite.jpg",
    created: new Date("2025-01-01"),
    updated: new Date("2025-01-01"),
    images: [],
    apartment_beds: [],
    apartment_amenities: [],
    cheapest_variant: {
      id: "variant-1",
      price: 150,
      is_available: true,
      created: new Date("2025-01-01"),
      updated: new Date("2025-01-01"),
      is_excluded: false,
      apartment_id: "apartment-1",
      capacity: 4,
    },
    rules: "No smoking, no pets",
    deposit: 100,
    capacity: 4,
    price: 150,
    rating: 4.5,
    booking_variants: [],
    reviews: [],
    reservations: [],
    bookings: [],
  };

  it("should render apartment name", () => {
    render(<ApartmentCard apartment={mockApartment as any} />);
    expect(screen.getByText("Luxury Suite")).toBeInTheDocument();
  });

  it("should render apartment number", () => {
    render(<ApartmentCard apartment={mockApartment as any} />);
    expect(screen.getByText("#101")).toBeInTheDocument();
  });

  it("should display price per night", () => {
    render(<ApartmentCard apartment={mockApartment as any} />);
    expect(screen.getByText("$150")).toBeInTheDocument();
    expect(screen.getByText("per night")).toBeInTheDocument();
  });

  it("should render apartment image", () => {
    render(<ApartmentCard apartment={mockApartment as any} />);
    const image = screen.getByAltText("Luxury Suite");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "/uploads/apartments/luxury-suite.jpg",
    );
  });

  it("should display capacity", () => {
    render(<ApartmentCard apartment={mockApartment as any} />);
    expect(screen.getByText("Capacity:")).toBeInTheDocument();
    expect(screen.getByText("4 guests")).toBeInTheDocument();
  });

  it("should display floor number", () => {
    render(<ApartmentCard apartment={mockApartment as any} />);
    expect(screen.getByText("Floor:")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should display rooms count", () => {
    render(<ApartmentCard apartment={mockApartment as any} />);
    expect(screen.getByText("Rooms:")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should display truncated description when too long", () => {
    const longDescription = "A".repeat(150);
    const apartmentWithLongDesc = {
      ...mockApartment,
      description: longDescription,
    };

    render(<ApartmentCard apartment={apartmentWithLongDesc as any} />);
    const description = screen.getByText(/A{100}\.\.\./);
    expect(description).toBeInTheDocument();
    expect(description.textContent?.length).toBeLessThan(
      longDescription.length,
    );
  });

  it("should display full description when short", () => {
    render(<ApartmentCard apartment={mockApartment as any} />);
    expect(
      screen.getByText("Beautiful luxury suite with amazing views"),
    ).toBeInTheDocument();
  });

  it("should show Pet Friendly badge when is_pet_friendly is true", () => {
    render(<ApartmentCard apartment={mockApartment as any} />);
    expect(screen.getByText("Pet Friendly")).toBeInTheDocument();
  });

  it("should not show Pet Friendly badge when is_pet_friendly is false", () => {
    const apartmentNoPets = { ...mockApartment, is_pet_friendly: false };
    render(<ApartmentCard apartment={apartmentNoPets as any} />);
    expect(screen.queryByText("Pet Friendly")).not.toBeInTheDocument();
  });

  it("should show Smoking Allowed badge when is_smoking is true", () => {
    const apartmentWithSmoking = { ...mockApartment, is_smoking: true };
    render(<ApartmentCard apartment={apartmentWithSmoking as any} />);
    expect(screen.getByText("Smoking Allowed")).toBeInTheDocument();
  });

  it("should not show Smoking Allowed badge when is_smoking is false", () => {
    render(<ApartmentCard apartment={mockApartment as any} />);
    expect(screen.queryByText("Smoking Allowed")).not.toBeInTheDocument();
  });

  it("should show Available badge when apartment is available", () => {
    render(<ApartmentCard apartment={mockApartment as any} />);
    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("should not show Available badge when apartment is not available", () => {
    const unavailableApartment = {
      ...mockApartment,
      availability: { is_available: false, unavailable_dates: [] },
    };
    render(<ApartmentCard apartment={unavailableApartment as any} />);
    expect(screen.queryByText("Available")).not.toBeInTheDocument();
  });

  it("should render as a link to apartment details page", () => {
    render(<ApartmentCard apartment={mockApartment as any} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/apartments/apartment-1");
  });

  it("should use cheapest variant price when available", () => {
    const apartmentWithCheapestVariant = {
      ...mockApartment,
      cheapest_variant: { id: "variant-1", price: 120 },
      price: 150,
    };
    render(<ApartmentCard apartment={apartmentWithCheapestVariant as any} />);
    expect(screen.getByText("$120")).toBeInTheDocument();
  });

  it("should use apartment price when cheapest variant is not available", () => {
    const apartmentWithoutVariant = {
      ...mockApartment,
      cheapest_variant: undefined,
      price: 150,
    };
    render(<ApartmentCard apartment={apartmentWithoutVariant as any} />);
    expect(screen.getByText("$150")).toBeDefined();
  });

  it("should use max_capacity when capacity is not available", () => {
    const apartmentWithOnlyMaxCapacity = {
      ...mockApartment,
      capacity: undefined,
      max_capacity: 6,
    };
    render(<ApartmentCard apartment={apartmentWithOnlyMaxCapacity as any} />);
    expect(screen.getByText("6 guests")).toBeDefined();
  });

  it("should not render description section when description is missing", () => {
    const apartmentWithoutDescription = {
      ...mockApartment,
      description: undefined,
    };
    render(<ApartmentCard apartment={apartmentWithoutDescription as any} />);
    const description = screen.queryByText(/Beautiful/);
    expect(description).toBeNull();
  });
});
