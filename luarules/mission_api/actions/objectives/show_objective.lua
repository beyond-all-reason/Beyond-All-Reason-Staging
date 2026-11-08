-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

local function showObjective(objectiveID)
	GG['MissionAPI'].Modules.Objectives.ShowObjective(objectiveID)
end

return {
	{
		type = 'ShowObjective',
		parameters = {
			{ name = 'objectiveID', required = true, type = ParameterTypes.ObjectiveID },
		},
		actionFunction = showObjective,
	}
}
