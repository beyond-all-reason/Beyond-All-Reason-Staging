-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

local function cancelCountdown(countdownID)
	GG['MissionAPI'].Modules.Countdowns.CancelCountdown(countdownID)
end

return {
	{
		type = 'CancelCountdown',
		parameters = {
			{ name = 'countdownID', required = true, type = ParameterTypes.CountdownID },
		},
		actionFunction = cancelCountdown,
	}
}
