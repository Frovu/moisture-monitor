if adc.force_init_mode(adc.INIT_ADC) then
	node.restart()
	return
end

dofile("settings.lua")

local measure = require("measure")
local ds18b20 = require("ds18b20")

local LED_PIN = 4

gpio.mode(LED_PIN, gpio.OUTPUT)
gpio.write(LED_PIN, gpio.HIGH)

print("\nInit timer rate = "..settings.data_rate.." s")
tmr.create():alarm(settings.data_rate * 1000, tmr.ALARM_AUTO, function()
	ds18b20.measure(measure.send)
end)
