-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

local function hideObjective(objectiveID)
	GG['MissionAPI'].Modules.Objectives.HideObjective(objectiveID)
end

return {
	{
		type = 'HideObjective',
		parameters = {
			{ name = 'objectiveID', required = true, type = ParameterTypes.ObjectiveID },
		},
		actionFunction = hideObjective,
	}
}
