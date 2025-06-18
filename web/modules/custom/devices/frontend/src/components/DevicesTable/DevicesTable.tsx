import { useEffect, useState } from "react";
import { Device, getDevices } from "../../api/devices";
import { queryClient } from "../../api/queryClient";
import { useQuery } from "@tanstack/react-query";
import { CustomError } from "../../api/validationResponse";

const limit = 4;
export const DevicesTable = () => {
  const [offset, setOffset] = useState<number>(0);
  const [devices, setDevices] = useState<Device[]>([]);

  const getDevicesQuery = useQuery(
    {
      queryFn: () => getDevices({ limit, offset }),
      queryKey: ["devices", offset],
      retry: false,
    },
    queryClient
  );

  const handleNext = () => {
    if (getDevicesQuery.data && offset + limit < getDevicesQuery.data.total) {
      setOffset(offset + limit);
    }
  };

  const handlePrevious = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
    }
  };

  useEffect(() => {
    const data = getDevicesQuery.data;
    if (data) {
      setDevices(data.devices);
    }
  }, [getDevicesQuery.data]);

  if (getDevicesQuery.status === "pending") {
    return <div>Loading...</div>;
  }

  if (getDevicesQuery.status === "error") {
    if (getDevicesQuery.error instanceof CustomError) {
      const error = getDevicesQuery.error;
      if (error.code === "401") {
        return (
          <div>
            <div>Unauthorized</div>
            {/* <button onClick={() => navigate("/auth")}>Log in</button> */}
          </div>
        );
      }

      if (error.code === "500") {
        return <div>Server error, try later.</div>;
      }
    }

    return <div>Unknown error, try later</div>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>created</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.created}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={handlePrevious} disabled={offset === 0}>
          Previous
        </button>
        <span>
          Page {Math.floor(offset / limit) + 1} of{" "}
          {Math.ceil(getDevicesQuery.data.total / limit)}
        </span>
        <button
          onClick={handleNext}
          disabled={offset + limit >= getDevicesQuery.data.total}
        >
          Next
        </button>
      </div>
    </div>
  );
};
