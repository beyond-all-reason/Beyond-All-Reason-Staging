-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

local function failObjective(objectiveID)
	GG['MissionAPI'].Modules.Objectives.FailObjective(objectiveID)
end

return {
	{
		type = 'FailObjective',
		parameters = {
			{ name = 'objectiveID', required = true, type = ParameterTypes.ObjectiveID },
		},
		actionFunction = failObjective,
	}
}
