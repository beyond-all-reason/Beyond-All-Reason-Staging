-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local lootboxesDefs = {}
local nanoDefCreator = VFS.Include("unitbasedefs/lootboxes/lootboxnano.lua")
for t = 1, 4 do
	for i = 1, 9 do
		lootboxesDefs["lootboxnano_t" .. t .. "_var" .. i] =
			nanoDefCreator.CreateNanoUnitDef(nanoDefCreator.Tiers["T" .. t])
	end
end
return lootboxesDefs
