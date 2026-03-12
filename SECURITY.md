# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it
responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, email: **security@ansvar.eu**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge receipt within 48 hours and provide a detailed response
within 5 business days. We will work with you to understand and address the
issue before any public disclosure.

## Security Measures

This project uses:
- CodeQL static analysis (weekly + on PR)
- Semgrep SAST scanning (on push/PR)
- Trivy container scanning (weekly)
- Gitleaks secret detection (on push/PR)
- OSSF Scorecard (weekly)
- Dependabot automated dependency updates (weekly)
- Parameterized database queries only (no string interpolation in SQL)
- Read-only database access at runtime
