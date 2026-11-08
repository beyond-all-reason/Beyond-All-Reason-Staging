-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

local function createFeatures(featureLoadout)
	GG['MissionAPI'].Modules.Loadout.SpawnFeatureLoadout(featureLoadout)
end

return {
	{
		type = 'CreateFeatures',
		parameters = {
			{ name = 'featureLoadout', required = true, type = ParameterTypes.FeatureLoadout },
		},
		actionFunction = createFeatures,
	}
}
