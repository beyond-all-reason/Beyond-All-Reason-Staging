-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local function removeAllMapMarkers()
	for _, position in pairs(GG['MissionAPI'].markerNames) do
		Spring.MarkerErasePosition(position.x, position.y, position.z, nil, false, nil, true)
	end
	GG['MissionAPI'].markerNames = {}
end

return {
	{
		type = 'RemoveAllMapMarkers',
		parameters = {},
		actionFunction = removeAllMapMarkers,
	}
}
