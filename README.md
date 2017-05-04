# Arena

This project is a way to test the battle results of different monsters in D&D 5th Edition.
The UI let's you select two creatures from the loaded creature list, then you can press the "Fight!" button.
During a fight, the two monsters engage in a randomized battle as per the rules of the game.
After 100 combat simulations are run, some statistics are output:
- Win/loss ratio
- Ratio of critical hits per fight
- Average hit ratio
- Average margin of defeat

### Tech
Built using JavaScript and jQuery, with data being pulled from a JSON object.


### TODO
- add ability to read different die rolls in attacks
- modify simulation function to fix repeated code
- add 'add creature' functionality
	- [X] Name
	- [X] AC
	- [X] HP
	- [X] ASI
	- [ ] actions
	- [ ] storing information in js
	- [ ] adding info to json 
- add spells (game mechanic)
- randomize or different action options
  - intelligent action selection (i.e. use a healing spell when low on health)
- allow for advantage or disadvantage (game mechanic)
- incorporate saving rolls (game mechanic)
- incorporate more monsters
  - https://dl.dropboxusercontent.com/s/iwz112i0bxp2n4a/5e-SRD-Monsters.json



