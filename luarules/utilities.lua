-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
-------------------------------------------------------------------------------------
--
-- DO NOT LOAD ANY GLOBAL UTILITIES HERE!
--
-- Load utility files whose functionality is applicable to gadgets ONLY
-- Utility files with global functionality should go in /common/Utilities/
--
-------------------------------------------------------------------------------------

local utilitiesFiles = VFS.DirList("luarules/Utilities/", "*.lua")
for i = 1, #utilitiesFiles do
	VFS.Include(utilitiesFiles[i])
end
