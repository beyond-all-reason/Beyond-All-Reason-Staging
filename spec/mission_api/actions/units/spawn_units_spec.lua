-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local MissionApiBuilder = VFS.Include("spec/builders/mission_api_builder.lua")

MissionApiBuilder.new():Install()

local actions = VFS.Include("luarules/mission_api/actions/units/spawn_units.lua")
local action = actions[1]
local summarizeSchema = require("mission_api.schema_spec_helper")

local missionApi = GG["MissionAPI"]

describe("mission_api.actions.spawn_units", function()

	before_each(function()
		MissionApiBuilder.new():Install()
	end)

	it("declares its type and parameters", function()
		assert.are.same({
			type = "SpawnUnits",
			unitLoadout = "UnitLoadout!",
		}, summarizeSchema(action))
	end)

	describe("actionFunction", function()
		it("calls Loadout.SpawnUnitLoadout with the given loadout", function()
			local loadout = { { unitDefName = "armcom", x = 0, z = 0, teamName = "alpha" } }
			action.actionFunction(loadout)
			assert.are.equal(1, #missionApi.calls.spawnUnitLoadout)
			assert.are.same(loadout, missionApi.calls.spawnUnitLoadout[1].loadout)
		end)
	end)

end)
