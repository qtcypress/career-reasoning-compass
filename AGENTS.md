<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- MCP tools are OAuth-protected, read-only, and query scores with the verified caller token and existing owner RLS; browser-local tools register only in their owning pages with privacy-safe telemetry.
- Grade assessments with a deterministic shared answer key and report every topic containing missed answers; PDF resumes embed a Unicode font and wrap/paginate text without inventing credentials.
- Share the career track catalog across the home page, interviews, and resumes so all nine paths stay aligned.
- Store interview results in Cloud with owner-only row policies; scoring uses authenticated Groq server functions and session state has one root subscriber.
- Keep the curated problem catalog in a shared browser-safe module; problem pages and coach prompts use the same statements, examples, and constraints to prevent evaluation drift.
- AI calls go through `src/lib/ai.server.ts`; Groq is the default and uses the linked custom connector gateway server-side, while other providers require explicit `AI_PROVIDER` selection, so the coach never silently falls back to built-in AI when Groq is unavailable.
