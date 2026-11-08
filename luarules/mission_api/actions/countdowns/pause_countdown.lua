-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

local function pauseCountdown(countdownID)
	GG['MissionAPI'].Modules.Countdowns.PauseCountdown(countdownID)
end

return {
	{
		type = 'PauseCountdown',
		parameters = {
			{ name = 'countdownID', required = true, type = ParameterTypes.CountdownID },
		},
		actionFunction = pauseCountdown,
	}
}
