Remove-Item .\doc -recurse -ea SilentlyContinue
New-Item .\doc -type directory -force
jsdoc --recurse --destination .\doc .\src