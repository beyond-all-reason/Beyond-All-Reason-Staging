-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
---@meta

---@class Addon
---@field [string] any
local Addon = {}

---Get info about an addon.
---@return AddonInfo
function Addon:GetInfo() end

---@class AddonInfo
---@field name string
---@field desc string?
---@field author string?
---@field date string?
---@field license string?
---@field layer number?
---@field enabled boolean?
---Keep drawing and receiving input while an open modal window hides the rest of the
---interface (LuaUI only, see the "Modal windows" block in barwidgets.lua).
---@field modalExempt boolean?

---@type Addon
---@diagnostic disable-next-line: lowercase-global
addon = nil
