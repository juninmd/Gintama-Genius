# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

To report a security vulnerability, please email the project maintainers at [security@juninmd.com](mailto:security@juninmd.com). You should receive a response within 48 hours. If the issue is confirmed, we will release a patch as soon as possible depending on complexity.

Please do not disclose security vulnerabilities publicly until they have been addressed by the maintainers.

## Security Best Practices

This project follows these security practices:

1. **Dependency Management**: We use Renovate and Dependabot for automated dependency updates
2. **Secret Scanning**: Gitleaks scans every commit via CI and pre-commit
3. **Dependency Review**: Pull requests are reviewed for dependency vulnerabilities
4. **Environment Variables**: All sensitive configuration is stored in environment variables
5. **Input Validation**: All user inputs are validated and sanitized
6. **Secure Headers**: Security headers (CSP, HSTS, X-Frame-Options) enforced via nginx and Netlify
7. **Container Security**: Docker containers run as non-root user
8. **Least Privilege**: CI tokens use minimal required permissions

## Security Features Implemented

- [x] Root .gitignore configured to exclude sensitive files and binaries
- [x] Automated dependency updates via Renovate and Dependabot
- [x] Gitleaks configuration for secret scanning (CI-integrated)
- [x] Dependency review on pull requests
- [x] Non-root user in Docker containers
- [x] Security headers via nginx and Netlify
- [x] Environment-based configuration
- [x] Regular security audits
- [x] Security scanning CI workflow

For more details, see our [Security Audit Report](./SECURITY_AUDIT_REPORT.md).
