
if file.open("config.json", "r") then
	settings = sjson.decode(file.read(4096))
else
	print("PANIC! No config.json found!")
	settings = {}
end
