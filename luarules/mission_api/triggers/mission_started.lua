-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
-- Immediately after the UI is present and usable and before any interactive gameplay.
-- PreGame happened already, so loadouts are spawned and the initial stage is active.
-- Some effects may take a single frame to occur; we may miss them here at frame 0.
return {
	type = 'MissionStarted',
	parameters = {},
	callins = {
		GameStart = function(trigger, triggerID, context)
			context.ActivateTrigger(trigger)
		end,
	},
}
