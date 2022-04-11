local ds18b20 = require("ds18b20")
local LED_PIN = 4
local DS18B20_PIN = 5

gpio.mode(LED_PIN, gpio.OUTPUT)
gpio.write(LED_PIN, gpio.HIGH)
ds18b20.init(DS18B20_PIN)

local ads_channels = {
	vcc = ads1115.SINGLE_1,
	ch1 = ads1115.SINGLE_2,
	ch2 = ads1115.SINGLE_3,
	sol = ads1115.SINGLE_0
}
local id, sda, scl = 0, 1, 2
i2c.setup(id, sda, scl, i2c.SLOW)
ads1115.reset()
adc1 = ads1115.ads1115(id, ads1115.ADDR_GND)

local voltages = {
	vcc = .0,
	ch1 = .0,
	ch2 = .0,
	sol = .0
}

local function measure_adc(channel, cb)
	adc1:setting(ads1115.GAIN_6_144V, ads1115.DR_8SPS, ads_channels[channel], ads1115.SINGLE_SHOT)
	adc1:startread(function(volt)
		voltages[channel] = volt
		cb()
	end)
end

local function send(temperature)
	local body = sjson.encode({
		dev = settings.dev,
		t = temperature,
		m = voltages["ch1"],
		m2 = voltages["ch2"],
		sol = voltages["sol"],
		v = voltages["vcc"]
	})
	print("Heap = "..node.heap())
	print("Sending data: "..body)
	http.post(settings.uri, "Content-Type: application/json\r\n", body, function(code, data)
		if (code ~= 200) then
			print("Failed: "..code)
		else
			print("Success.")
		end
	end)
end

local function measure_and_send()
	gpio.write(LED_PIN, gpio.LOW)
	measure_adc("vcc", function()
		measure_adc("ch1", function()
			measure_adc("ch2", function()
				measure_adc("sol", function()
					gpio.write(LED_PIN, gpio.HIGH)
					ds18b20.measure(DS18B20_PIN, send)
				end)
			end)
		end)
	end)
end

return {
	measure_and_send = measure_and_send
}
