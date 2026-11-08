-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

local function disableTrigger(triggerID)
	GG['MissionAPI'].Triggers[triggerID].settings.active = false
end

return {
	{
		type = 'DisableTrigger',
		parameters = {
			{ name = 'triggerID', required = true, type = ParameterTypes.TriggerID },
		},
		actionFunction = disableTrigger,
	}
}
