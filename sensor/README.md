# esp8266 sensor module firmware

## Node MCU firmware modules

`ads1115 file gpio http i2c net node ow sjson tmr uart wifi`

## Features
+ recording soil moisture values with ADC
+ sending values to server
+ store unique id and send it along with data
+ provide setup page with wifi AP for some minutes after restart
+ save settings across restarts

## Settings
+ `dev` - unique id to identify data source
+ `uri` - uri for HTTP POST
+ `ssid` - target wifi ssid
+ `pwd` - target wifi password
