for x in 72 96 120 128 144 152 167 180 192 384 512
do
	/mnt/c/belfry/inkscape/InkscapePortable.exe --export-png "icon-${x}x${x}.png" -w $x logo.svg 
done
convert -background none logo.svg -define icon:auto-resize icon.ico
