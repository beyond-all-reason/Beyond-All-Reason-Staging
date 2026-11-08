-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
-- Ends a pause started by the Pause action. Does nothing for a player pause.
local function unpause()
	GG.GamePause.Unpause("mission")
end

return {
	{
		type = 'Unpause',
		parameters = {},
		actionFunction = unpause,
	}
}
