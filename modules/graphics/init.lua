-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
local function Init(gl)
	if gl then
		gl.InstanceVBOTable = require("modules/graphics/instancevbotable")
		gl.InstanceVBOIdTable = require("modules/graphics/instancevboidtable")
		gl.LuaShader = require("modules/graphics/LuaShader")
		gl.R2tHelper = require("modules/graphics/r2thelper")
	end
end

return {
	Init = Init,
}
