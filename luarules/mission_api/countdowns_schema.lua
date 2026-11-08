-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local Types = VFS.Include("luarules/mission_api/parameter_types.lua").Types

local parameters = {
	id = Types.String,
	timeRemaining = Types.Quantity,
	paused = Types.Boolean,
	displayed = Types.Boolean,
}

return {
	Settings = parameters,
}
