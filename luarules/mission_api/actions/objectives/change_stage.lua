-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

local function changeStage(stageID)
	GG['MissionAPI'].Modules.Objectives.ChangeStage(stageID)
end

return {
	{
		type = 'ChangeStage',
		parameters = {
			{ name = 'stageID', required = true, type = ParameterTypes.StageID },
		},
		actionFunction = changeStage,
	}
}
