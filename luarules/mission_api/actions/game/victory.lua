-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

local function victory(winningAllyTeamIDs)
	Spring.GameOver({ unpack(winningAllyTeamIDs) })
end

return {
	{	
		type = 'Victory',
		parameters = {
			{ name = 'allianceNames', required = true, type = ParameterTypes.AllianceNames },
		},
		actionFunction = victory,
	}
}
