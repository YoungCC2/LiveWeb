# Security notes

## Required credential response

Credentials and session material were previously committed to this public repository. Treat every historical value as compromised even though the current source now reads configuration from environment variables.

1. Rotate the MongoDB, MySQL, SMTP, Redis, and WeChat credentials at their providers.
2. Revoke any reusable API tokens, cookies, and active sessions.
3. Restrict database network access to required IP ranges and review provider audit logs.
4. After rotation, coordinate a Git history rewrite with every contributor if the historical values must be removed from GitHub. Rotation must happen first because rewriting history does not revoke a secret.
5. Enable GitHub secret scanning and push protection for future changes.

Never put real values in `.env.example`. Local `.env` files are ignored by Git.

## Dependency maintenance

Each npm project now has a lock file. Keep the manifest and lock file together, run `npm audit`, and rebuild the `table` project before merging dependency updates.
