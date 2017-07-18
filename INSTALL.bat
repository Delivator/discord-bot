@echo off

if exist config/settings.json (
	echo settings.json file aready exists
	echo exiting now
	DEL "%~f0"
) else (
	echo "doesn't exist"
)

pause