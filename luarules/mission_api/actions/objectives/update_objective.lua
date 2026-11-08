-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

local function updateObjective(objectiveID)
	GG['MissionAPI'].Modules.Objectives.UpdateObjective(objectiveID)
end

return {
	{
		type = 'UpdateObjective',
		parameters = {
			{ name = 'objectiveID', required = true, type = ParameterTypes.ObjectiveID },
		},
		actionFunction = updateObjective,
	}
}
