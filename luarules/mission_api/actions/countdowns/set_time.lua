-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

local function setTime(countdownID, seconds)
	GG['MissionAPI'].Modules.Countdowns.SetTime(countdownID, seconds)
end

return {
	{
		type = 'SetTime',
		parameters = {
			{ name = 'countdownID', required = true, type = ParameterTypes.CountdownID },
			{ name = 'seconds', required = true, type = ParameterTypes.Quantity },
		},
		actionFunction = setTime,
	}
}
