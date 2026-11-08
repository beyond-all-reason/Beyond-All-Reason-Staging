-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

return {
	type = 'TeamDestroyed',
	parameters = {
		{ name = 'teamName', required = true, type = ParameterTypes.TeamName },
	},
	callins = {
		TeamDied = function(trigger, triggerID, context, teamID)
			if teamID == trigger.parameters.teamName then
				context.ActivateTrigger(trigger)
			end
		end,
	},
}
