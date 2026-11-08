-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

local function clearStatusEffect(effectName)
	GG['MissionAPI'].Modules.Effects.ClearEffect(effectName)
end

return {
	{
		type = 'ClearStatusEffect',
		parameters = {
			{ name = 'effectName', required = true, type = ParameterTypes.String },
		},
		actionFunction = clearStatusEffect,
	}
}
