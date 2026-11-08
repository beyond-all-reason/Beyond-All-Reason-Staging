-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
if select == nil then
	select = function(n, ...)
		local arg = arg
		if not arg then
			arg = { ... }
			arg.n = #arg
		end
		return arg[((n == "#") and "n") or n]
	end
end

VFS.Include(Script.GetName() .. "/gadgets.lua", nil, VFS.ZIP_ONLY)
