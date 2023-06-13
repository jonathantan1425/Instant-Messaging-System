import http from "k6/http";
import { check } from "k6";

// Test configuration
export const options = {
  thresholds: {
    // Assert that 99% of requests finish within 3000ms.
    http_req_duration: ["p(99) < 2000"],
  },
  // Ramp the number of virtual users up and down
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 200 },
    { duration: "20s", target: 0 },
  ],
};

// Simulated user behavior
export default function () {
  const url = "http://localhost:8080/api/pull";
  const headers = { "Content-Type": "application/json" };
  const payload = JSON.stringify({
    chat: "apple:banana",
    reverse: true,
  });

  let res = http.request("GET", url, payload, {headers});
  // Validate response status
  check(res, { "status was 200": (r) => r.status == 200 });
}
