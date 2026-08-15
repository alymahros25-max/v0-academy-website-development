---
title: "fix: point route types to non-dev path"
---

This PR updates the route type import in `next-env.d.ts` to reference the non-dev `.next` types path so type checking works during CI and production builds.
