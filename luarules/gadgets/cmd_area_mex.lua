-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local gadget = gadget ---@type Gadget

function gadget:GetInfo()
	return {
		name = "Area Mex",
		desc = ".",
		author = "",
		date = "",
		license = "GNU GPL, v2 or later",
		layer = 0,
		enabled = true,
	}
end

function gadget:Initialize()
	Spring.AssignMouseCursor("upgmex", "cursorupgmex", false)
	Spring.AssignMouseCursor("areamex", "cursorareamex", false)
end
