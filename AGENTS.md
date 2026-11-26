# Working in this repo

## Branches and commits

- Name branches in Conventional Commit style, with a contextual description: `<type>/<description>`,
  for example `docs/memory-storage`, `fix/memory-gaps`, `feat/work-request-access`. The type is a
  Conventional Commit type (`feat`, `fix`, `docs`, `refactor`, `chore`, `ci`, ...). Never name a branch
  after a session or a random word.
- Commit messages follow Conventional Commits too.
- Work lands by pull request into `main`. Don't push to `main` directly.

## Copy

- Always write "Pratt Institute" and "Tulane University", never "Pratt" or "Tulane". The build's
  content check (`scripts/check-content.ts`) fails on the short forms.
