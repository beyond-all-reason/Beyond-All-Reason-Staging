-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local function test()
	mock_SpringGetModKeyState = Test.mock(Spring, "GetModKeyState", function()
		return true, false, true, false
	end)

	assertTablesEqual(pack(Spring.GetModKeyState()), { true, false, true, false })

	assert(#mock_SpringGetModKeyState.calls == 1)
end

return { test = test }
