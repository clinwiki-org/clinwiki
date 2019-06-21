import json

i = 0
with open('wordList.txt', 'r') as f:

	x = f.read().splitlines()
	with open('words.json', 'wb') as outfile:
		json.dump(x, outfile)
