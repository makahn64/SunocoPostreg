SUNOCO CELEBRATION CAM
======================

Setting up the environment:
1. Clone this repository
2. `cd` into root folder then `npm install`
3. `cd` into assets then `bower install`

If you plan on building a distribution package for the Microsoft Surface, make sure you are on Windows (sorry!) and
then follow the instructions here: `http://docs.nwjs.io/en/latest/For%20Users/Package%20and%20Distribute/`. You'll
want to use the optional `nw-builder` app: `https://github.com/nwjs/nw-builder`.

`nw-builder -p win64 .` should do it in the root folder. Don't forget to tidy up and not check-in the folders this
app creates to make the distributable.


Two Package.Jsons!
------------------

There are two `package.json` files in this app: `package-test.json` and `package-dist.json`.
 Pick which one you want and rename it `package.json`. The difference is 
in the window and toolbar settings.


Setup
-----

With the app running on site, enter a code of `0000123` on the code screen then tap the SKIP button (*not* the ENTER
button). This takes you to a screen where you can enter the IP address and port of the local Activ8or instance running.
The app also auto-detects Activ8ors on the network to help you out a bit.

Test server is at: 104.236.168.199:1337
