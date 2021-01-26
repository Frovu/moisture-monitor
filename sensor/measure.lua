
local function send(temperature)
	local body = sjson.encode({
		dev = settings.dev,
		t = temperature,
		m = adc.read(0)
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

return {send = send}
