-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

local function completeObjective(objectiveID)
	GG['MissionAPI'].Modules.Objectives.CompleteObjective(objectiveID)
end

return {
	{
		type = 'CompleteObjective',
		parameters = {
			{ name = 'objectiveID', required = true, type = ParameterTypes.ObjectiveID },
		},
		actionFunction = completeObjective,
	}
}
