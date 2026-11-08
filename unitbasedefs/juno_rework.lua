-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local function junoReworkTweaks(name, unitDef)
	if name == "armjuno" or name == "corjuno" then
		unitDef.metalcost = 500
		unitDef.energycost = 12000
		unitDef.buildtime = 15000
		unitDef.weapondefs.juno_pulse.energypershot = 7000
		unitDef.weapondefs.juno_pulse.metalpershot = 100
	end
end

return {
	Tweaks = junoReworkTweaks,
}
