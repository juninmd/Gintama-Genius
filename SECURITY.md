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

1. **Dependency Management**: We use Renovate for automated dependency updates
2. **Secret Scanning**: We use Gitleaks to prevent accidental secret commits
3. **Environment Variables**: All sensitive configuration is stored in environment variables
4. **Input Validation**: All user inputs are validated and sanitized
5. **Secure Headers**: We implement security headers to protect against common web vulnerabilities

## Security Features Implemented

- [x] .gitignore configured to exclude sensitive files
- [x] Automated dependency updates via Renovate
- [x] Gitleaks configuration for secret scanning
- [x] Environment-based configuration
- [x] Regular security audits

For more details, see our [Security Audit Report](./SECURITY_AUDIT_REPORT.md).