-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

return {
	type = 'UnitExists',
	parameters = {
		{ name = 'unitDefName', required = true,  type = ParameterTypes.UnitDefName },
		{ name = 'teamName',    required = false, type = ParameterTypes.TeamName },
	},
	callins = {
		MetaUnitAdded = function(trigger, triggerID, context, unitID, unitDefID, unitTeam)
			if trigger.parameters.unitDefName and trigger.parameters.unitDefName ~= UnitDefs[unitDefID].name then
				return
			end
			if trigger.parameters.teamName and unitTeam ~= trigger.parameters.teamName then
				return
			end
			context.ActivateTrigger(trigger)
		end,
	},
}
