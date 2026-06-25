# Instagram admin safe operations checklist

Date: 2026-06-19
Project: Minha Infancia Protegida

## Current safe state

The Instagram admin module is deployed and safe to access from the admin panel.

Enabled:
- Admin route for Instagram planning.
- Supabase tables for social accounts, Instagram posts and publish logs.
- OAuth state table for signed one-time Instagram connection state.
- RLS enabled on all Instagram tables.
- Admin + MFA policies on all Instagram tables.
- Draft/review/scheduled workflow in code.
- Safe logging structure.
- Cron endpoint shell protected by CRON_SECRET.
- Server-side OAuth callback and token encryption flow prepared.

Blocked by design:
- Real Instagram OAuth until Meta envs are configured.
- Meta App secret usage until it is stored server-side in Vercel.
- Token encryption/decryption vault until INSTAGRAM_TOKEN_ENCRYPTION_KEY is set.
- Real publish calls to Meta.
- Automatic scheduled publishing.
- Stories publishing.

## Safety rules

Do not enable real publishing until all items below are complete:
- Meta App exists and is configured with Instagram Login.
- Redirect URI is confirmed in Meta Developers.
- Required permissions are approved or available for the app user.
- App Review requirements are understood.
- Token encryption key is generated and stored only server-side.
- No secret uses VITE_ prefix.
- Admin account has MFA enabled.
- A test post is published only from a controlled test account first.
- Vercel runtime logs are checked after the first real test.

## Required future environment variables

Server-side only:
- INSTAGRAM_APP_ID
- INSTAGRAM_APP_SECRET
- INSTAGRAM_REDIRECT_URI
- INSTAGRAM_TOKEN_ENCRYPTION_KEY
- CRON_SECRET

Keep disabled until final approval:
- INSTAGRAM_AUTO_PUBLISH_ENABLED=false

## Production checks completed

Supabase:
- Migration instagram_admin_module applied.
- social_accounts RLS enabled.
- instagram_posts RLS enabled.
- instagram_publish_logs RLS enabled.
- instagram_oauth_states RLS enabled.
- Admin MFA policies confirmed.

Vercel:
- Production deployment completed.
- Main domain returned HTTP 200.
- Recent production warning/error/fatal logs checked with no findings.

## Next safe phase

Phase OAuth can start only after the owner provides or creates the Meta App configuration.

Needed from Meta Developers:
- App ID.
- App Secret.
- Instagram Login product enabled.
- Redirect URI configured.
- Instagram Creator account added/testable.
- Permission status for instagram_business_basic and instagram_business_content_publish.

## Emergency rollback notes

If the Instagram admin module causes issues:
- Disable navigation link in AdminLayout.
- Keep database tables in place; do not drop tables unless explicitly approved.
- Do not delete logs unless explicitly approved.
- Vercel can roll back to the previous deployment from the Vercel dashboard if needed.

## Operator reminder

This integration is intentionally staged.
Being deployed does not mean real Instagram publishing is enabled.
Real publishing requires a separate security gate and explicit approval.
