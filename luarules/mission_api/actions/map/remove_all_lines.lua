-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local function removeAllLines()
	GG['MissionAPI'].Modules.MapLines.RemoveAllLines()
end

return {
	{
		type = 'RemoveAllLines',
		parameters = {},
		actionFunction = removeAllLines,
	}
}
