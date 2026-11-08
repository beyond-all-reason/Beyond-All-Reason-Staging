-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
--[[
	Stages structure:
	stages = {
		stageID1 = { objectives = { 'objectiveID1', 'objectiveID2' } },
		stageID2 = { objectives = { 'objectiveID2', 'objectiveID3' } },
	}
]]

local function processRawStages(rawStages)
	return rawStages
end

return {
	ProcessRawStages = processRawStages,
}
