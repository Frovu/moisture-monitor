if adc.force_init_mode(adc.INIT_ADC) then
	node.restart()
	return
end

dofile("settings.lua")

local measure = require("measure")
local ds18b20 = require("ds18b20")

local DS18B20_PIN = 3
local LED_PIN = 4

ds18b20.init(DS18B20_PIN)

gpio.mode(LED_PIN, gpio.OUTPUT)
gpio.write(LED_PIN, gpio.HIGH)

print("\nInit timer rate = "..settings.data_rate.." s")
tmr.create():alarm(tonumber(settings.data_rate) * 1000, tmr.ALARM_AUTO, function()
	gpio.write(LED_PIN, gpio.LOW)
	ds18b20.measure(DS18B20_PIN, measure.send)
	gpio.write(LED_PIN, gpio.HIGH)
end)
