-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

local function startCutscene(cutsceneID, skippable)
	GG['MissionAPI'].Modules.Cutscenes.StartCutscene(cutsceneID, skippable)
end

return {
	{
		type = 'StartCutscene',
		parameters = {
			{ name = 'cutsceneID', required = true,  type = ParameterTypes.CutsceneID },
			{ name = 'skippable',  required = false, type = ParameterTypes.Boolean },
		},
		actionFunction = startCutscene,
	}
}
