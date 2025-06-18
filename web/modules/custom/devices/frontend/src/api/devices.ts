import { z } from "zod";
import { API_URL } from "../constants/constants";
import { validateApiResponse } from "./validationResponse";

const deviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  created: z.string(),
});
export type Device = z.infer<typeof deviceSchema>;

const devicesResponseSchema = z.object({
  devices: z.array(deviceSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});

interface GetDevices {
  limit: number;
  offset: number;
}

export const getDevices = async ({ limit = 4, offset = 0 }: GetDevices) => {
  const url = new URL(`${API_URL}/api/devices`);
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("offset", offset.toString());

  return fetch(url.toString(), {
    method: "GET",
    credentials: "include",
  })
    .then(validateApiResponse)
    .then((res) => res.json())
    .then((data) => devicesResponseSchema.parse(data))
    .catch((err) => {
      console.log("getBooks function error", err);
      throw err;
    });
};
