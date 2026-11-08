-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local ParameterTypes = GG['MissionAPI'].Modules.ParameterTypes.Types

local function custom(func)
	func()
end

return {
	{
		type = 'Custom',
		parameters = {
			{ name = 'function', required = true, type = ParameterTypes.Function },
		},
		actionFunction = custom,
	}
}
