-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

local function spawnUnits(unitLoadout)
	GG['MissionAPI'].Modules.Loadout.SpawnUnitLoadout(unitLoadout)
end

return {
	{
		type = 'SpawnUnits',
		parameters = {
			{ name = 'unitLoadout', required = true, type = ParameterTypes.UnitLoadout },
		},
		actionFunction = spawnUnits,
	}
}
