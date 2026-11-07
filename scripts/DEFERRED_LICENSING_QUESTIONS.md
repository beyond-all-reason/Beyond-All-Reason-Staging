<!-- REUSE-IgnoreStart -->
# scripts/ — Deferred Licensing Questions

This document records licensing questions in `scripts/` that are **intentionally excluded**
from the current cleanup pass and require a later policy or repo-maintenance decision.

Full tracking with options and decision fields is in the
[Admin Questions tab of the classification spreadsheet](https://docs.google.com/spreadsheets/d/1WBOOQZZHCXItwr786pFHmoOaYuN7tY6ZlHuGn53gIPs/edit?gid=820035467#gid=820035467) (rows 3a–3c).

---

## 3a. TA / Spring Heritage Shared Headers

**Status:** In progress — Beherith is consolidating and rewriting these headers (November 2026).

Classic BOS-era shared header files originating from the TA / Spring modding community
(pre-BAR). No per-file author or license. Duplicated across 4–5 subdirectories.

Files (root-level copies in `scripts/`):
- `constants.h` / `exptype.h` (identical — engine constants and explosion types)
- `hitweap.h` (rock unit on hit)
- `rockunit.h` / `rockwater.h` (rock unit on fire)
- `smokeunit.h` (damaged smoke processing)
- `statechg.h` (activate/deactivate state machine)
- `sfxtype.h` (empty)
- `idlehover.h` (empty or minimal)
- `weapon1control.h` (turret aiming control)
- `unitDefsTurretSpeeds.h` (turret speed via unitDefs)
- `recoil_common_includes.h` (aggregate of the above)

Duplicated in `Units/`, `scavs/`, `Units/scavboss/`, `Units/scavbuildings/`.
Additional scavs-only: `water2.h`, `water3.h`, `yard.h`.

Options: (A) delete duplicates and consolidate, (B) rewrite from engine docs with
explicit GPL headers, (C) retain with heritage notice. Recommendation: A or B.

---

## 3b. `.lua_old` Files — Historical Residue

**Status:** Deferred — recommend deletion.

4 dead `.lua_old` files in `Units/`: `coraak.lua_old`, `corjugg.lua_old` (attributed
to FireStorm, no license), `cormadsam.lua_old`, `corsumo.lua_old`. Not loaded by engine.
History preserved in git. Recommendation: delete.

---

## ~~3c. `smoothanim.py`~~ — RESOLVED (Delete)

**Status:** Resolved — confirmed authored by Beherith, to be deleted.

Python BOS optimizer. Authorship confirmed by Beherith directly. Decision: delete.

---

---

## SPDX Implications for Deferred Items

The deferred items above also affect SPDX adoption:

- **3a (Heritage headers):** Cannot receive `SPDX-License-Identifier` lines until
  provenance is resolved. If rewritten (option B), they get `GPL-2.0-or-later`.
  If deleted (option A), no SPDX action needed.
- **3b (.lua_old files):** Candidates for deletion. If retained, they would need
  `SPDX-License-Identifier` but authorship is unclear for some (FireStorm files).
- **~~3c (smoothanim.py):~~** Resolved — authored by Beherith, to be deleted. No SPDX action needed.

---

None of these items block the current `scripts/` licensing cleanup. The directory-level
`LICENSE_SCRIPTS.txt` (with `SPDX-License-Identifier: GPL-2.0-or-later`) and project-level
GPL default provide adequate coverage while these decisions are pending.
<!-- REUSE-IgnoreEnd -->
