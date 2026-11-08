-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local RealUnitDefs = require("spec/support/real_unit_defs")

describe("scavenger mode defs", function()
	it("load", function()
		local defs = RealUnitDefs.allDefs({}, { scavengers = true })

		assert.is_table(defs.unitdefs.armcom_scav)
		assert.is_table(defs.weapondefs.armcom_scav_disintegrator)
	end)
end)
