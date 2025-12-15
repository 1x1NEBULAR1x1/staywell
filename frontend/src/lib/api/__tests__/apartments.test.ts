/**
 * Example test for apartments API service
 * Place this in src/lib/api/__tests__/apartments.test.ts
 */

import axios from "axios";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// You would import your actual service here
// import { apartmentsService } from '../apartments'

describe("Apartments API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch apartments list successfully", async () => {
      const mockResponse = {
        data: {
          items: [
            {
              id: "1",
              name: "Luxury Suite",
              price: 150,
              type: "LUXURY",
            },
            {
              id: "2",
              name: "Standard Room",
              price: 80,
              type: "STANDARD",
            },
          ],
          total: 2,
          skip: 0,
          take: 10,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      // Uncomment when you have the actual service
      // const result = await apartmentsService.getAll({ skip: 0, take: 10 })

      // expect(result).toEqual(mockResponse.data)
      // expect(mockedAxios.get).toHaveBeenCalledWith('/apartments', {
      //   params: { skip: 0, take: 10 },
      // })
    });

    it("should handle network errors", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Network Error"));

      // Uncomment when you have the actual service
      // await expect(apartmentsService.getAll({})).rejects.toThrow('Network Error')
    });

    it("should pass filters correctly", async () => {
      const mockResponse = { data: { items: [], total: 0 } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const filters = {
        skip: 10,
        take: 20,
        min_price: 100,
        max_price: 500,
        is_pet_friendly: true,
      };

      // Uncomment when you have the actual service
      // await apartmentsService.getAll(filters)

      // expect(mockedAxios.get).toHaveBeenCalledWith('/apartments', {
      //   params: filters,
      // })
    });
  });

  describe("getById", () => {
    it("should fetch single apartment by id", async () => {
      const mockApartment = {
        id: "1",
        name: "Luxury Suite",
        price: 150,
        type: "LUXURY",
      };

      mockedAxios.get.mockResolvedValue({ data: mockApartment });

      // Uncomment when you have the actual service
      // const result = await apartmentsService.getById('1')

      // expect(result).toEqual(mockApartment)
      // expect(mockedAxios.get).toHaveBeenCalledWith('/apartments/1')
    });

    it("should handle 404 errors", async () => {
      mockedAxios.get.mockRejectedValue({
        response: { status: 404, data: { message: "Apartment not found" } },
      });

      // Uncomment when you have the actual service
      // await expect(apartmentsService.getById('999')).rejects.toThrow()
    });
  });
});
