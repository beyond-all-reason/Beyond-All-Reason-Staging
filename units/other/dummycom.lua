-- SPDX-FileCopyrightText: Beyond All Reason contributors
-- SPDX-License-Identifier: GPL-2.0-or-later
-- implemented as an actual unit partially because stuff assumes choice is always a real unit
-- and partially because the dice model is still drawn pregame so allies get visual feedback "for free"
local def = VFS.Include("units/armcom.lua").armcom
def.buildpic = "other/dice.dds"
def.customparams = { i18nfromunit = "random" }
def.objectname = "cordice.s3o"
def.script = "dice.lua"
def.weapondefs = nil
def.weapons = nil
return { dummycom = def }
