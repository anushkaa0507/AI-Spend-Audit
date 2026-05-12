# Architecture

## Flow

1. User submits tools
2. Audit engine calculates savings
3. AI generates summary
4. Data stored in Supabase
5. Email sent via Resend
6. User views results page

## Modules

### Audit Engine
Calculates pricing optimization and savings

### AI Summary
Generates executive summary of audit results

### Lead System
Captures user email and sends report

### Database
Supabase stores audits and leads