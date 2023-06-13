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
  --url 'http://localhost:8080/api/pull?chat=apple%3Abanana&cursor=1&limit=1&reverse=true' \
  --header 'Content-Type: application/json'
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
      ↳  99% — ✓ 144994 / ✗ 411

     checks.........................: 99.71% ✓ 144994      ✗ 411
     data_received..................: 20 MB  184 kB/s
     data_sent......................: 20 MB  182 kB/s
     http_req_blocked...............: avg=3.85µs  min=0s     med=3µs     max=2.89ms p(90)=4µs      p(95)=5µs
     http_req_connecting............: avg=531ns   min=0s     med=0s      max=1.91ms p(90)=0s       p(95)=0s
   ✓ http_req_duration..............: avg=70.31ms min=2.22ms med=35.14ms max=1.23s  p(90)=154.09ms p(95)=239.69ms
       { expected_response:true }...: avg=68.08ms min=2.22ms med=34.98ms max=1.23s  p(90)=151.62ms p(95)=232.28ms
     http_req_failed................: 0.28%  ✓ 411         ✗ 144994
     http_req_receiving.............: avg=51.17µs min=12µs   med=45µs    max=5.89ms p(90)=79µs     p(95)=100µs
     http_req_sending...............: avg=16.08µs min=4µs    med=13µs    max=3.48ms p(90)=23µs     p(95)=32µs
     http_req_tls_handshaking.......: avg=0s      min=0s     med=0s      max=0s     p(90)=0s       p(95)=0s
     http_req_waiting...............: avg=70.24ms min=2.16ms med=35.07ms max=1.23s  p(90)=154.02ms p(95)=239.63ms
     http_reqs......................: 145405 1321.829053/s
     iteration_duration.............: avg=70.43ms min=2.33ms med=35.26ms max=1.23s  p(90)=154.22ms p(95)=239.8ms
     iterations.....................: 145405 1321.829053/s
     vus............................: 1      min=1         max=199
     vus_max........................: 200    min=200       max=200


running (1m50.0s), 000/200 VUs, 145405 complete and 0 interrupted iterations
default ✓ [======================================] 000/200 VUs  1m50s
```
