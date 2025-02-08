# Basic Admin Panel

A work-in-progress administrative panel built with Next.js, Redis, and MongoDB.

## System Architecture

The system is built around a hierarchical structure:

- Clients can have multiple users
- Users have specific permissions
- Each client requires an initial user with "any" permission
- One initial client must have a user with `isSysAdmin` property
- All write actions are logged in the database

## Prerequisites

- Bun
- Docker
- OpenSSL
- Git

## Installation

1. Clone the repository:

```bash
git clone https://github.com/DvinAvanesian/basic-admin-panel
```

2. Install dependencies:

```bash
bun install
```

3. Create required directories:

```bash
mkdir logs media keys
```

4. Create `.env` file (see .env.example)

5. Start Docker services:

```bash
docker compose up
```

6. Load initial fixtures:

```bash
bun utils/fixtures.js
```

7. Generate authentication keys:

```bash
openssl genpkey -algorithm RSA -out keys/private.pem
openssl rsa -in keys/private.pem -pubout -out keys/public.pem
```

8. Build and start the application:

```bash
bun --bun build
bun --bun start
```

## Default Login

- Username: johndoe
- Password: securepassword123

## Known Issues

- First-time credential loading may throw an exception, requiring a page refresh
- User information only loads properly in development server, not in production

## Roadmap

- [ ] Client management page
- [ ] Logs viewing page
- [ ] Profile editing functionality
- [ ] User editing functionality

## Development Status

This project is currently in active development and may contain bugs or incomplete features.
