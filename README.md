# Instant Messaging System

![Tests](https://github.com/TikTokTechImmersion/assignment_demo_2023/actions/workflows/test.yml/badge.svg)

This is an Instant Messaging System, built as a backend assignment of [2023 TikTok Tech Immersion](https://github.com/TikTokTechImmersion/assignment_demo_2023).

Users can:

1. Send a chat message to the server
2. Retrieve chat messages between users

## Prerequisites

- Recommended platform - MacOS Monterey 12.4 Interl
- Docker installed
- Docker Compose installed

### Verify Docker

Run `docker` in terminal to check if Docker is installed. An example of a positive response:

```bash
$ docker
Usage:  docker [OPTIONS] COMMAND

A self-sufficient runtime for containers

Options:
...
```

If `Command 'docker' not found...`, proceed with installing Docker

### Install Docker

Refer to https://docs.docker.com/desktop/install/mac-install/ for instructions.

## Installation and set-up

Begin with setting up the local directories.

### Set-up local directories

Clone this repository or download the files to a local directory.
Open a terminal session and navigate to the path of this repository/codebase.

> e.g. if working path is `/usr/lib/instant-messaging-system`

```bash
cd /usr/lib/instant-messaging-system
```

### Build and Run Docker images

Builds the Docker images as needed and runs them (using the `-d` flag to run in the background)

```bash
docker compose up --build -d
```

## Interacting with the API

This Instant Messaging System allows users to send and pull chat messages between users.

### Sending Chat Messages

This feature allows us to submit chat messages between two users.

Assuming that the API is hosted locally (via the Docker Compose deployment above), we can use the following command to send a chat message to the server.

```bash
# example request
curl --request POST \
  --url http://localhost:8080/api/send \
  --header 'Content-Type: application/json' \
  --data '{
	"chat": "apple:banana",
	"text": "Hello how are you?",
	"sender": "apple"
}'
```

As part of the `POST` data, we need to provide:

- `chat` - A pair of users that this chat message belongs to, separated by `:` (e.g. `apple:banana`)
- `text` - The chat message content
- `sender` - The user sending the message; this user must be one of the users in `chat`

### Pulling Chat Messages

This feature allows us to pull chat messages between two users

Assuming that the API is hosted locally (via the Docker Compose deployment above), we can use the following command to pull chat messages from the server.

```bash
# example request
curl --request GET \
  --url http://localhost:8080/api/pull \
  --header 'Content-Type: application/json' \
  --data '{
    "chat": "apple:banana",
		"reverse": true,
		"limit": 10,
		"cursor": 1
}'
```

```bash
# example response
{
    "messages": [
        {
            "chat": "apple:banana",
            "text": "Hello how are you?",
            "sender": "apple",
            "send_time": 1686404158
        }
    ]
}
```

As part of the `GET` request, we can provide the following queries:

- `chat` - A pair of users that this chat message belongs to, separated by `:` (e.g. `apple:banana`)
- `limit` - [OPTIONAL] The maximum number of chat messages to return, default of `10` if not provided
- `cursor` - [OPTIONAL] The cursor value used in pagination
- `reverse` - [OPTIONAL] Setting this value to `true` orders the chat messages by time descending (newest message first), default of `false` if not provided

#### Pagination

To handle large numbers of chat messages between users, pagination was implemented to keep data transmission within reasonable packet size and latency.

Pagination is only applied if `limit` specified is less than the number of available chat messages. In this case, the response will include additional fields to indicate the state of pagination.
```bash
# example response with pagination
{
    "messages": [
        {
            "chat": "apple:banana",
            "text": "Happy",
            "sender": "apple",
            "send_time": 1686662365
        }
    ],
    "has_more": true,
    "next_cursor": 1
}
```
* `has_more` - Boolean value indicating if there are more chat messages in the pagination
* `next_cursor` - Integer value containing the cursor for the next page

## Load Testing

Load test script can be found in [tests/load-test/k6_test.js](tests/load-test/k6_test.js) which uses the [k6](https://github.com/grafana/k6) library.

```bash
brew install k6
k6 run tests/load-test/k6_test.js
```

A sample of the load test report is as shown.

```bash
❯ k6 run tests/load-test/k6_test.js

          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: tests/load-test/k6_test.js
     output: -

  scenarios: (100.00%) 1 scenario, 200 max VUs, 2m20s max duration (incl. graceful stop):
           * default: Up to 200 looping VUs for 1m50s over 3 stages (gracefulRampDown: 30s, gracefulStop: 30s)


     ✗ status was 200
      ↳  99% — ✓ 131313 / ✗ 106

     checks.........................: 99.91% ✓ 131313      ✗ 106
     data_received..................: 41 MB  374 kB/s
     data_sent......................: 23 MB  213 kB/s
     http_req_blocked...............: avg=3.9µs   min=0s     med=3µs     max=2.12ms p(90)=4µs      p(95)=5µs
     http_req_connecting............: avg=564ns   min=0s     med=0s      max=2.06ms p(90)=0s       p(95)=0s
   ✓ http_req_duration..............: avg=77.83ms min=2.38ms med=43.75ms max=1.84s  p(90)=173.69ms p(95)=259.71ms
       { expected_response:true }...: avg=77.07ms min=2.38ms med=43.71ms max=1.84s  p(90)=172.84ms p(95)=257.55ms
     http_req_failed................: 0.08%  ✓ 106         ✗ 131313
     http_req_receiving.............: avg=52.75µs min=12µs   med=46µs    max=5.31ms p(90)=80µs     p(95)=102µs
     http_req_sending...............: avg=19.22µs min=5µs    med=16µs    max=1.92ms p(90)=28µs     p(95)=37µs
     http_req_tls_handshaking.......: avg=0s      min=0s     med=0s      max=0s     p(90)=0s       p(95)=0s
     http_req_waiting...............: avg=77.76ms min=2.32ms med=43.69ms max=1.84s  p(90)=173.61ms p(95)=259.66ms
     http_reqs......................: 131419 1194.641258/s
     iteration_duration.............: avg=77.97ms min=2.51ms med=43.89ms max=1.84s  p(90)=173.8ms  p(95)=259.86ms
     iterations.....................: 131419 1194.641258/s
     vus............................: 1      min=1         max=199
     vus_max........................: 200    min=200       max=200


running (1m50.0s), 000/200 VUs, 131419 complete and 0 interrupted iterations
default ✓ [======================================] 000/200 VUs  1m50s
```
