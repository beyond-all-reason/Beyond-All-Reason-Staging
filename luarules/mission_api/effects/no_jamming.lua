-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
---
--- No Jamming: a stub for an effect that removes every unit's radar jamming. It does nothing yet.
---

local function removeJamming() end

local function restoreJamming() end

return {
	type = "NoJamming",
	Create = removeJamming,
	Remove = restoreJamming,
}
